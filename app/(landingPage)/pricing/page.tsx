"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Lock, ArrowUpRight, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetPlansQuery,
  Plan,
} from "@/redux/features/api/adminDashboard/plan";
import { useProcessPaymentMutation } from "@/redux/features/api/paymentApi";
import { useSendMessageMutation } from "@/redux/features/api/contactApi";
import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "@/redux/features/slice/authSlice";
import { toast } from "sonner";
import { X } from "lucide-react";

const PricingPage = () => {
  const router = useRouter();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [processPayment] = useProcessPaymentMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const { data: plans = [], isLoading } = useGetPlansQuery(billingCycle);

  // Filter Individual Plans
  const filteredIndividualPlans = plans
    .filter((plan) => plan.plan_type === "individual" && plan.status)
    .sort((a, b) => Number(a.price) - Number(b.price));

  // Filter Professional Plans
  const filteredProfessionalPlans = plans
    .filter((plan) => plan.plan_type === "professional" && plan.status)
    .sort((a, b) => {
      // Enterprise always last
      const aEnt = a.name.toLowerCase().includes("enterprise");
      const bEnt = b.name.toLowerCase().includes("enterprise");
      if (aEnt && !bEnt) return 1;
      if (!aEnt && bEnt) return -1;
      return Number(a.price) - Number(b.price);
    });

  const handlePlanSelection = async (plan: Plan) => {
    // Enterprise and Custom plan special handling
    if (
      plan.name.toLowerCase().includes("enterprise") ||
      (plan.plan_type === "professional" &&
        (plan.price === "0.00" || plan.price === 0))
    ) {
      setContactEmail(user?.email || "");
      setIsContactModalOpen(true);
      return;
    }

    // Free Trial / Zero Price handling
    if (
      plan.price === "0.00" ||
      plan.price === 0 ||
      plan.name.toLowerCase().includes("free trial")
    ) {
      if (token) {
        router.push("/user-dashboard");
      } else {
        router.push("/login");
      }
      return;
    }

    if (!token) {
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

        {/* Global Toggle */}
        <div className="flex items-center justify-center gap-4 mt-12">
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
          <section className="container mx-auto px-6 mb-24">
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
                className="mb-6"
              >
                For Individual
              </h2>
            </div>

            {/* Individual Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto">
              {filteredIndividualPlans.map((plan, idx) => (
                <PricingCard
                  key={plan.id}
                  title={plan.name}
                  price={
                    plan.price === "0.00" || plan.price === 0 ? "0" : plan.price
                  }
                  // period={
                  //   plan.name.toLowerCase().includes("free trial")
                  //     ? `for ${plan.duration} days`
                  //     : "/Month"
                  // }
                  period={
                    plan.name.toLowerCase().includes("free trial")
                      ? `for ${plan.duration} days`
                      : billingCycle === "monthly"
                        ? "/Month"
                        : "/Annual"
                  }
                  subtext={
                    plan.name.toLowerCase().includes("free trial")
                      ? "Then auto-bills based on selected plan"
                      : ""
                  }
                  description={
                    plan.name.toLowerCase().includes("free trial")
                      ? "Experience BioVue's core AI projections before committing."
                      : plan.name.toLowerCase().includes("plus")
                        ? "See your future and track how your lifestyle is improving."
                        : "Build a complete picture of your future health with our advanced AI, real-world data sync, and long-term forecasting."
                  }
                  features={plan.features.map((f) => {
                    const lockedFeatures = [
                      "ai improvement suggestions",
                      "health indicators",
                      "recommended coaches & clinics",
                      "achievement badges & progress reports",
                    ];
                    const isLocked =
                      plan.name.toLowerCase().includes("free trial") &&
                      lockedFeatures.some((lf) => f.toLowerCase().includes(lf));
                    return { text: f, included: !isLocked };
                  })}
                  cta={
                    plan.name.toLowerCase().includes("free trial")
                      ? `Start ${plan.duration}-Day Trial`
                      : `Upgrade To ${plan.name}`
                  }
                  active={false}
                  ctaColor="bg-[#0FA4A9]"
                  specialFeature={
                    plan.name.toLowerCase().includes("premium")
                      ? {
                          label: "EVERYTHING IN PLUS",
                          icon: <Zap size={14} fill="#3A86FF" />,
                        }
                      : undefined
                  }
                  onSelect={() => handlePlanSelection(plan)}
                  isLoading={loadingPlanId === plan.id}
                />
              ))}
            </div>
          </section>

          {/* Professional Plans Section */}
          <section className="container mx-auto px-6 mb-24">
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
              {filteredProfessionalPlans.map((plan, idx) => (
                <PricingCard
                  key={plan.id}
                  compact
                  title={plan.name}
                  capacity={
                    plan.member_limit
                      ? `Up to ${plan.member_limit} clients`
                      : "Unlimited clients"
                  }
                  price={
                    plan.price === "0.00" || plan.price === 0
                      ? "Custom"
                      : plan.price
                  }
                  // period={
                  //   plan.price === "0.00" || plan.price === 0 ? "" : "/Month"
                  // }
                  period={
                    plan.price === "0.00" || plan.price === 0
                      ? ""
                      : billingCycle === "monthly"
                        ? "/Month"
                        : "/Annual"
                  }
                  subtext=""
                  features={(() => {
                    const overrideTexts = [
                      "Dedicated account manager",
                      "Quarterly business reviews",
                    ];
                    const baseFeatures = plan.features
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
                      if (plan.name.toLowerCase().includes("enterprise")) {
                        return [
                          ...baseFeatures,
                          { text: "Dedicated account manager", included: true },
                          {
                            text: "Quarterly business reviews",
                            included: true,
                          },
                        ];
                      }
                    }

                    return baseFeatures;
                  })()}
                  // cta={
                  //   plan.name.toLowerCase().includes("enterprise") ||
                  //   plan.price === "0.00" ||
                  //   plan.price === 0
                  //     ? "Contact Via Mail"
                  //     : "Start 7-Day Free Trial"
                  // }
                  cta={
                    plan.name.toLowerCase().includes("enterprise")
                      ? "Contact Via Mail"
                      : plan.name.toLowerCase().includes("tier 1")
                        ? "Buy Now"
                        : `Update to ${plan.name}`
                  }
                  active={false}
                  ctaColor="bg-[#0FA4A9]"
                  onSelect={() => handlePlanSelection(plan)}
                  isLoading={loadingPlanId === plan.id}
                />
              ))}
            </div>
          </section>
        </>
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
              Integrate BioVue's AI projections into your app, platform, or
              website to deliver real-time health insights to your users.
            </p>
          </div>
          <a
            href="mailto:BioVueSupport@gmail.com?subject=API Pricing Inquiry&body=Hi BioVue team,%0D%0A%0D%0AI would like to know about API pricing.%0D%0A%0D%0AThanks."
            className="bg-[#8E53FF] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-md whitespace-nowrap inline-block"
          >
            Contact For API Pricing
          </a>
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
  isLoading,
  ...props
}: any) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-8 border border-[#E5E9EA] shadow-sm transition-all flex flex-col h-full hover:border-blue-100 hover:shadow-md",
        active && "border-[#3A86FF] ring-1 ring-[#3A86FF]/10 shadow-lg",
      )}
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#3A86FF] mb-2">{title}</h3>
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
        onClick={onSelect}
        disabled={isLoading}
        className={cn(
          "w-full text-center py-3.5 rounded-xl font-bold text-sm text-white hover:bg-opacity-90 transition-all shadow-md group flex items-center justify-center gap-2 cursor-pointer",
          ctaColor || "bg-[#3A86FF] shadow-[0_4px_14px_0_rgba(58,134,255,0.3)]",
          isLoading && "opacity-70 cursor-not-allowed",
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Processing...
          </>
        ) : (
          cta || props.cta
        )}
      </button>
    </div>
  );
};

export default PricingPage;
