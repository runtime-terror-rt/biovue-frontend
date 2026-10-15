"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Lock, ArrowUpRight, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetPlansQuery,
  Plan,
} from "@/redux/features/api/adminDashboard/plan";
import {
  useProcessPaymentMutation,
} from "@/redux/features/api/paymentApi";
import { useSendMessageMutation } from "@/redux/features/api/contactApi";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
  updateUser,
} from "@/redux/features/slice/authSlice";
import { toast } from "sonner";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import FreeTrialPlanModal from "@/components/pricing/FreeTrialPlanModal";
import { isFreeTrialPlan, hasPaidPlan, getUserPlanType } from "@/lib/planType";

const PricingPage = () => {
  const router = useRouter();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [processPayment] = useProcessPaymentMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [trialPlan, setTrialPlan] = useState<Plan | null>(null);

  const [selectedAudience, setSelectedAudience] = useState<
    "individual" | "professional"
  >("individual");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get("type")?.toLowerCase();
      if (
        typeParam === "individual" ||
        typeParam === "professional"
      ) {
        setSelectedAudience(typeParam as "individual" | "professional");
      }
    }
  }, []);

  const effectiveToken =
    token ||
    (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  const effectiveUser = React.useMemo(() => {
    if (user) return user;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user");
        if (stored && stored !== "null" && stored !== "undefined") {
          return JSON.parse(stored);
        }
      } catch {
        // ignore
      }
    }
    return null;
  }, [user, mounted]);

  const isLoggedIn = mounted && Boolean(effectiveToken && effectiveUser);
  const isAdmin = isLoggedIn && effectiveUser?.role === "admin";
  const userPlanAudience =
    isLoggedIn && !isAdmin ? getUserPlanType(effectiveUser) : null;
  const isProfessionalUser = mounted && userPlanAudience === "professional";
  const isIndividualUser = mounted && userPlanAudience === "individual";

  // When logged in as individual/professional/api, strictly show only that plan type.
  // When guest or admin, show according to selectedAudience tab.
  const activeAudience: "individual" | "professional" | "api" =
    userPlanAudience || selectedAudience;

  const userHasPaid = mounted && hasPaidPlan(effectiveUser || user);

  const { data: plans = [], isLoading } = useGetPlansQuery(billingCycle);

  console.log("Plans:", plans);

  // Filter Individual Plans
  const filteredIndividualPlans = plans
    .filter((plan) => plan.plan_type === "individual" && plan.status)
    .sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));

  // Filter Professional Plans
  const filteredProfessionalPlans = plans
    .filter((plan) => plan.plan_type === "professional" && plan.status)
    .sort((a, b) => {
      // Enterprise always last
      const aEnt = a.name?.toLowerCase().includes("enterprise") || false;
      const bEnt = b.name?.toLowerCase().includes("enterprise") || false;
      if (aEnt && !bEnt) return 1;
      if (!aEnt && bEnt) return -1;
      return (Number(a.price) || 0) - (Number(b.price) || 0);
    });

  // Filter API Plans
  const filteredApiPlans = plans
    .filter((plan) => plan.plan_type === "api" && plan.status)
    .sort((a, b) => {
      const aEnt = a.name?.toLowerCase().includes("enterprise") || false;
      const bEnt = b.name?.toLowerCase().includes("enterprise") || false;
      if (aEnt && !bEnt) return 1;
      if (!aEnt && bEnt) return -1;
      return (Number(a.price) || 0) - (Number(b.price) || 0);
    });

    // handle plan selection
  const handlePlanSelection = async (plan: Plan) => {
    const effectiveToken =
      token ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    let effectiveUser = user;
    if (!effectiveUser && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user");
        if (stored && stored !== "null" && stored !== "undefined") {
          effectiveUser = JSON.parse(stored);
        }
      } catch {
        // ignore
      }
    }

    if (effectiveToken && effectiveUser) {
      const userAudience = getUserPlanType(effectiveUser);

      if (userAudience === "professional" && plan.plan_type === "individual") {
        toast.error(
          "You are logged in as a Professional account and cannot subscribe to Individual plans.",
        );
        return;
      }

      if (userAudience === "individual" && plan.plan_type === "professional") {
        toast.error(
          "You are logged in as an Individual account and cannot subscribe to Professional plans.",
        );
        return;
      }
    }

    if (isFreeTrialPlan(plan)) {
      if (hasPaidPlan(effectiveUser)) {
        toast.error(
          "You already have an active paid plan (Plus/Premium) and cannot take the free trial.",
        );
        return;
      }
      setTrialPlan(plan);
      return;
    }

    if (!effectiveToken) {
      // If not logged in, redirect to register with plan_id
      router.push(`/register?plan_id=${plan.id}`);
      return;
    }

    try {
      setLoadingPlanId(plan.id);
      const response = await processPayment({
        plan_id: plan.id,
        billing: billingCycle,
      }).unwrap();

      if (response.success && response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        toast.error("Failed to initiate payment. Please try again.");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(
        error?.data?.message || "An error occurred while processing payment.",
      );
    } finally {
      setLoadingPlanId(null);
    }
  };

  // handle contact form submission
  const handleContactSubmit = async () => {
    if (!contactMessage.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    if (!contactEmail.trim() || !contactEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await sendMessage({
        email: contactEmail,
        message: contactMessage,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Message sent successfully!");
        setIsContactModalOpen(false);
        setContactMessage("");
      } else {
        toast.error(response.message || "Failed to send message.");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "An error occurred while sending your message.",
      );
    }
  };

  const getDisplayPrice = (price: string | number) => {
    const numericPrice = Number(price);
    return numericPrice.toString();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-20">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="BioVue Logo"
            width={120}
            height={60}
            className="w-24 md:w-[120px] object-contain"
          />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 bg-[#0FA4A9] text-white px-5 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all text-sm group"
        >
          Back To Home
          <ArrowUpRight
            size={18}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </header>

      {/* Hero Section */}
      <div className="text-center mt-12 mb-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1F2D2E] mb-4">
          Choose your health journey.
        </h1>
        <p className="text-[#5F6F73] max-w-2xl mx-auto text-lg leading-relaxed">
          Start with a free AI trial, then unlock deeper insights, progress
          tracking, and personalized projections.
        </p>

        {/* Plan Type Selector (For Guests or Admins) */}
        {!userPlanAudience && (
          <div className="flex justify-center mt-8">
            <div className="inline-flex p-1.5 bg-gray-100/90 backdrop-blur-xs rounded-2xl border border-gray-200/60 shadow-inner gap-1">
              <button
                type="button"
                onClick={() => setSelectedAudience("individual")}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer",
                  activeAudience === "individual"
                    ? "bg-white text-[#3A86FF] shadow-sm"
                    : "text-[#5F6F73] hover:text-[#1F2D2E]",
                )}
              >
                Individual
              </button>
              <button
                type="button"
                onClick={() => setSelectedAudience("professional")}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer",
                  activeAudience === "professional"
                    ? "bg-white text-[#3A86FF] shadow-sm"
                    : "text-[#5F6F73] hover:text-[#1F2D2E]",
                )}
              >
                Professional
              </button>
            </div>
          </div>
        )}

        {/* Locked Type Indicator for Logged-In Users */}
        {userPlanAudience && (
          <div className="flex justify-center mt-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-[#3A86FF] border border-blue-200">
              Showing{" "}
              {userPlanAudience === "individual"
                ? "Individual"
                : userPlanAudience === "professional"
                  ? "Professional"
                  : "API"}{" "}
              Plans for your account
            </span>
          </div>
        )}

        {/* Global Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span
            className={cn(
              "text-base font-semibold transition-colors",
              billingCycle === "monthly" ? "text-[#1F2D2E]" : "text-[#94A3B8]",
            )}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle((prev) =>
                prev === "monthly" ? "annual" : "monthly",
              )
            }
            className={cn(
              "relative w-14 h-7 rounded-full transition-colors focus:outline-none p-1 cursor-pointer",
              billingCycle === "annual" ? "bg-[#3A86FF]" : "bg-[#E2E8F0]",
            )}
          >
            <div
              className={cn(
                "w-5 h-5 bg-white rounded-full transition-transform shadow-md",
                billingCycle === "annual" ? "translate-x-7" : "translate-x-0",
              )}
            />
          </button>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-base font-semibold transition-colors",
                billingCycle === "annual" ? "text-[#1F2D2E]" : "text-[#94A3B8]",
              )}
            >
              Annual
            </span>
            <span className="bg-[#E4EFFF] text-[#3A86FF] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              SAVE 10%
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A86FF]"></div>
        </div>
      ) : (
        <>
          {/* Individual Plans Section */}
          {activeAudience === "individual" && (
            <section className="container mx-auto px-6 mb-24 animate-in fade-in duration-300">
              <div className="text-center mb-10">
                <h2
                  style={{
                    color: "var(--Primary-color, #3A86FF)",
                    textAlign: "center",
                    fontFamily: "Roboto",
                    fontSize: "34px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "24px",
                  }}
                  className="mb-4"
                >
                  For Individual
                </h2>
              </div>

              {/* Individual Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto">
                {filteredIndividualPlans.map((plan, idx) => {
                  const isTrial = plan.name?.toLowerCase().includes("free trial");

                  let cta = `Upgrade To ${plan.name || ""}`;
                  let ctaColor = "bg-[#0FA4A9]";
                  let disabled = false;
                  let disabledMessage: string | undefined = undefined;

                  if (isTrial && userHasPaid) {
                    cta = "Not Eligible (Active Paid Plan)";
                    ctaColor =
                      "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200 shadow-none border border-gray-300";
                    disabled = true;
                    disabledMessage =
                      "You already have an active paid plan (Plus/Premium) and cannot take the free trial.";
                  } else if (isTrial) {
                    cta = `Start ${plan.duration || 7}-Day Trial`;
                  }

                  return (
                    <PricingCard
                      key={plan.id}
                      title={plan.name}
                      price={
                        plan.price === "0.00" || plan.price === 0
                          ? "0"
                          : getDisplayPrice(plan.price)
                      }
                      period={
                        isTrial
                          ? `for ${plan.duration} days`
                          : billingCycle === "monthly"
                            ? "/Month"
                            : "/Year"
                      }
                      subtext={
                        isTrial ? "Then auto-bills based on selected plan" : ""
                      }
                      description={
                        isTrial
                          ? "Experience BioVue's core AI projections before committing."
                          : plan.name?.toLowerCase().includes("plus")
                            ? "See your future and track how your lifestyle is improving."
                            : "Build a complete picture of your future health with our advanced AI, real-world data sync, and long-term forecasting."
                      }
                      features={(plan.features || []).map((f) => {
                        const lockedFeatures = [
                          "ai improvement suggestions",
                          "health indicators",
                          "recommended coaches & clinics",
                          "achievement badges & progress reports",
                        ];
                        const isLocked =
                          isTrial &&
                          lockedFeatures.some((lf) =>
                            f.toLowerCase().includes(lf),
                          );
                        return { text: f, included: !isLocked };
                      })}
                      cta={cta}
                      ctaColor={ctaColor}
                      disabled={disabled}
                      disabledMessage={disabledMessage}
                      specialFeature={
                        plan.name?.toLowerCase().includes("premium")
                          ? {
                              label: "EVERYTHING IN PLUS",
                              icon: <Zap size={14} fill="#3A86FF" />,
                            }
                          : undefined
                      }
                      onSelect={() => handlePlanSelection(plan)}
                      isLoading={loadingPlanId === plan.id}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* Professional Plans Section */}
          {activeAudience === "professional" && (
            <section className="container mx-auto px-6 mb-24 animate-in fade-in duration-300">
              <div className="text-center mb-12">
                <h2
                  style={{
                    color: "var(--Primary-color, #3A86FF)",
                    textAlign: "center",
                    fontFamily: "Roboto",
                    fontSize: "34px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "24px",
                  }}
                  className="mb-2"
                >
                  Professional Plan
                </h2>
                <p className="text-[#041228] text-center font-['Roboto'] text-[24px] font-normal leading-[24px] my-6">
                  6 month minimum commitment required.
                </p>
              </div>

              {/* Professional Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto">
                {filteredProfessionalPlans.map((plan, idx) => {
                  const isCustom =
                    plan.name?.toLowerCase().includes("custom") ||
                    plan.name?.toLowerCase().includes("enterprise");
                  const cta = isCustom ? "Contact Via Mail" : "Get Started";
                  const ctaColor = "bg-[#0FA4A9]";
                  const disabled = false;

                  return (
                    <PricingCard
                      key={plan.id}
                      compact
                      title={plan.name}
                      price={
                        plan.price === "0.00" || plan.price === 0
                          ? "Custom"
                          : getDisplayPrice(plan.price)
                      }
                      period={
                        plan.price === "0.00" || plan.price === 0
                          ? ""
                          : billingCycle === "monthly"
                            ? "/Month"
                            : "/Year"
                      }
                      subtext=""
                      features={(() => {
                        const overrideTexts = [
                          "Dedicated account manager",
                          "Quarterly business reviews",
                        ];
                        const baseFeatures = (plan.features || [])
                          .filter(
                            (f) =>
                              !overrideTexts.some((ot) =>
                                f.toLowerCase().includes(ot.toLowerCase()),
                              ),
                          )
                          .map((f) => ({ text: f, included: true }));

                        // Professional Plan specific card overrides
                        if (plan.plan_type === "professional") {
                          if (idx === 1) {
                            // 2nd Professional Card
                            return [
                              ...baseFeatures,
                              {
                                text: "Dedicated account manager",
                                included: false,
                                isNegative: true,
                              },
                            ];
                          }
                          if (idx === 2) {
                            // 3rd Professional Card
                            return [
                              ...baseFeatures,
                              {
                                text: "Quarterly business reviews",
                                included: false,
                                isNegative: true,
                              },
                              {
                                text: "Dedicated account manager",
                                included: false,
                                isNegative: true,
                              },
                            ];
                          }
                          if (plan.name?.toLowerCase().includes("enterprise")) {
                            return [
                              ...baseFeatures,
                              {
                                text: "Dedicated account manager",
                                included: true,
                              },
                              {
                                text: "Quarterly business reviews",
                                included: true,
                              },
                            ];
                          }
                        }

                        return baseFeatures;
                      })()}
                      cta={cta}
                      ctaColor={ctaColor}
                      disabled={disabled}
                      onSelect={() => handlePlanSelection(plan)}
                      isLoading={loadingPlanId === plan.id}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* API Plans Section - Always visible for everyone */}
          <section className="container mx-auto px-6 mb-24 animate-in fade-in duration-300">
            <div className="text-center mb-12">
              <h2
                style={{
                  color: "var(--Primary-color, #3A86FF)",
                  textAlign: "center",
                  fontFamily: "Roboto",
                  fontSize: "34px",
                  fontWeight: 400,
                  lineHeight: "24px",
                }}
                className="mb-2"
              >
                Plans for API Services
              </h2>

              <p className="text-[#5F6F73] text-center text-[18px] mt-4 max-w-2xl mx-auto">
                Integrate BioVue AI into your platform with scalable API plans.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto">
              {filteredApiPlans.length > 0 ? (
                filteredApiPlans.map((plan, idx) => (
                  <PricingCard
                    key={plan.id}
                    compact
                    title={plan.name}
                    price={
                      plan.price === "0.00" || plan.price === 0
                        ? "Custom"
                        : getDisplayPrice(plan.price)
                    }
                    period={
                      plan.price === "0.00" || plan.price === 0
                        ? ""
                        : billingCycle === "monthly"
                          ? "/Month"
                          : "/Year"
                    }
                    features={(() => {
                      const baseFeatures = (plan.features || []).map((f) => ({
                        text: f,
                        included: true,
                      }));
                      const limits = [];
                      if (plan.projection_limit) {
                        limits.push({
                          text: `${plan.projection_limit.toLocaleString()} AI Projections`,
                          included: true,
                        });
                      }
                      return [...limits, ...baseFeatures];
                    })()}
                    cta="Buy Now"
                    ctaColor="bg-[#0FA4A9]"
                    onSelect={() => router.push("/register")}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-500 italic text-sm bg-white rounded-2xl border border-gray-100 shadow-sm">
                  No API service plans available at this moment.
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {trialPlan && (
        <FreeTrialPlanModal
          isOpen={!!trialPlan}
          onClose={() => setTrialPlan(null)}
          trialPlan={trialPlan}
          defaultBilling={billingCycle}
          planTypeOverride={trialPlan.plan_type}
        />
      )}

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#041228] font-['Roboto']">
                  Contact a specialist
                </h2>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[#041228] font-bold text-sm font-['Roboto']">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-white border border-[#94A3B8] rounded-xl py-4 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/10 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[#041228] font-bold text-sm font-['Roboto']">
                    Message
                  </label>
                  <textarea
                    placeholder="text ............."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full h-32 bg-white border border-[#94A3B8] rounded-xl py-4 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/10 transition-all font-medium resize-none"
                  />
                </div>

                <button
                  onClick={handleContactSubmit}
                  disabled={isSending}
                  className="w-full bg-primary cursor-pointer text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-[#0FA4A9]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="animate-spin" size={22} />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Banner */}
      <section className="container mx-auto px-4">
        <div className="bg-[#D9EFEF] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto shadow-sm">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-3xl font-bold text-[#1F2D2E] mb-4">
              Already have an app or platform?
            </h2>
            <p className="text-[#5F6F73] text-lg">
              Integrate BioVue&apos;s AI projections into your app, platform, or
              website to deliver real-time health insights to your users.
            </p>
          </div>
          <div
            className="relative group overflow-hidden bg-gray-100 rounded-full"
          >
            <div
              className="bg-[#94A3B8] text-white px-10 py-4 rounded-full font-bold transition-all shadow-md whitespace-nowrap inline-block opacity-80 cursor-not-allowed border-2 border-white/50"
            >
              Not Live Yet
            </div>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center pointer-events-none">
               <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center mt-12 mb-8">
        <p className="text-[#5F6F73] text-xs">*Overage rates apply</p>
      </footer>
    </div>
  );
};

const PricingCard = ({
  title,
  capacity,
  price,
  period,
  subtext,
  description,
  features,
  cta,
  compact,
  specialFeature,
  active,
  ctaColor,
  priceSize = "text-5xl",
  onSelect,
  onCancel,
  isLoading,
  isCancelling,
  comingSoon,
  ...props
}: any) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-8 border border-[#E5E9EA] shadow-sm transition-all flex flex-col h-full hover:border-blue-100 hover:shadow-md relative overflow-hidden",
        active && "border-[#3A86FF] ring-1 ring-[#3A86FF]/10 shadow-lg",
        comingSoon && "border-gray-100",
        props.className,
      )}
    >
      {comingSoon && (
        <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white/90 border border-[#3A86FF]/20 shadow-xl rounded-2xl p-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="bg-[#E4EFFF] text-[#3A86FF] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-3 block w-fit mx-auto">
              Coming Soon
            </span>
            <p className="text-[#1F2D2E] font-bold text-lg leading-tight">
              API Integration <br /> Is Not Live Yet
            </p>
          </div>
        </div>
      )}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-[#3A86FF] mb-2">{title}</h3>
          {active && (
            <span className="bg-[#EAFBF7] text-[#0FA4A9] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Check size={10} /> Active
            </span>
          )}
        </div>
        {capacity && (
          <p className="text-sm font-bold text-[#1F2D2E] mb-4">{capacity}</p>
        )}
        <div className="flex items-baseline gap-1 mb-2">
          <span
            className={cn(
              "font-bold text-[#1F2D2E]",
              price === "Custom" ? "text-4xl" : priceSize,
            )}
          >
            {price !== "Custom" && "$"}
            {price}
          </span>
          {period && (
            <span className="text-[#94A3B8] text-sm font-medium">{period}</span>
          )}
        </div>
        {subtext && (
          <p className="text-xs text-[#5F6F73] font-medium">{subtext}</p>
        )}
      </div>

      {description && (
        <p className="text-[13px] text-[#5F6F73] mb-6 leading-relaxed min-h-[40px]">
          {description}
        </p>
      )}

      <div className="flex-1">
        {specialFeature && (
          <div className="flex items-center gap-2 mb-6">
            {specialFeature.icon}
            <span className="text-[10px] font-bold text-[#3A86FF] tracking-wider uppercase">
              {specialFeature.label}
            </span>
          </div>
        )}
        <ul className="space-y-4 mb-8">
          {features.map((f: any, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 flex items-center justify-center">
                {f.icon ? (
                  f.icon
                ) : f.isNegative ? (
                  <div className="w-[18px] h-[18px] flex items-center justify-center">
                    <X size={16} className="text-[#94A3B8]" />
                  </div>
                ) : f.included ? (
                  <div className="w-[18px] h-[18px] rounded-full bg-[#E4EFFF] flex items-center justify-center">
                    <Check
                      size={12}
                      strokeWidth={3}
                      className="text-[#3A86FF]"
                    />
                  </div>
                ) : (
                  <Lock size={16} className="text-[#94A3B8] opacity-60" />
                )}
              </div>
              <span
                className={cn(
                  "text-[13px] leading-tight font-medium",
                  f.included ? "text-[#1F2D2E]" : "text-[#94A3B8]",
                )}
              >
                {f.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => {
          if (props.disabled && props.disabledMessage) {
            toast.error(props.disabledMessage);
            return;
          }
          if (active) onCancel?.();
          else onSelect?.();
        }}
        disabled={isLoading || isCancelling}
        className={cn(
          "w-full text-center py-3.5 rounded-xl font-bold text-sm text-white hover:bg-opacity-90 transition-all shadow-md group flex items-center justify-center gap-2",
          active
            ? "bg-red-500 shadow-[0_4px_14px_0_rgba(239,68,68,0.3)] cursor-pointer"
            : props.disabled
            ? "cursor-not-allowed"
            : "cursor-pointer",
          ctaColor ||
            "bg-[#3A86FF] shadow-[0_4px_14px_0_rgba(58,134,255,0.3)]",
          (isLoading || isCancelling || props.disabled) && "opacity-75 cursor-not-allowed",
        )}
        title={props.disabledMessage}
      >
        {isLoading || isCancelling ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            {isCancelling ? "Cancelling..." : "Processing..."}
          </>
        ) : active ? (
          "Cancel Plan"
        ) : (
          cta || props.cta
        )}
      </button>
    </div>
  );
};

export default PricingPage;
