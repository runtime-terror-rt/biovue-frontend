"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { useGetSubscriptionPlansQuery, useProcessPaymentMutation } from "@/redux/features/api/paymentApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ApiChoosePlanPage() {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  
  // Hardcode billing to monthly as per screenshot (or we can add toggle if needed, but keeping it simple)
  const billing = "monthly";
  const { data: plansResp, isLoading } = useGetSubscriptionPlansQuery({ billing, type: "api" });
  
  // Filter API plans
  const plans = (plansResp?.data || [])
    .filter((p: any) => p.plan_type === "api" && p.status)
    .sort((a: any, b: any) => {
      const aEnt = a.name?.toLowerCase().includes("enterprise") || false;
      const bEnt = b.name?.toLowerCase().includes("enterprise") || false;
      if (aEnt && !bEnt) return 1;
      if (!aEnt && bEnt) return -1;
      return (Number(a.price) || 0) - (Number(b.price) || 0);
    });

  const [processPayment, { isLoading: isProcessing }] = useProcessPaymentMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

  const handleSelectPlan = async (plan: any) => {
    try {
      setLoadingPlanId(plan.id);
      const res = await processPayment({ plan_id: Number(plan.id), billing }).unwrap();
      if (res?.checkout_url) {
        toast.info("Redirecting to payment...");
        window.location.href = res.checkout_url;
        return;
      }
      toast.error("Failed to initiate payment. Please try again.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Payment initiation failed.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-20">
      {/* Header */}
      <header className="container mx-auto px-6 py-8 relative flex items-center justify-center">
        <button
          onClick={() => router.back()}
          className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[#94A3B8] hover:text-[#3A86FF] transition-colors font-medium text-sm"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="BioVue Logo"
            width={120}
            height={60}
            className="w-32 md:w-[150px] object-contain"
            priority
          />
        </Link>
      </header>

      {/* Hero Section */}
      <div className="text-center mt-6 mb-12 px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#3A86FF] mb-4">
          Plans for API Services
        </h1>
        <p className="text-[#5F6F73] max-w-2xl mx-auto text-lg leading-relaxed">
          Integrate BioVue AI into your platform with scalable API plans.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A86FF]"></div>
        </div>
      ) : (
        <section className="container mx-auto px-6 mb-24 max-w-[1240px]">
          <div className="flex flex-wrap justify-center items-stretch gap-8">
            {plans.length > 0 ? (
              plans.map((plan: any) => {
                const isCustom = plan.price === "0.00" || plan.price === 0;
                const priceDisplay = isCustom ? "Custom" : Number(plan.price).toString();
                const periodDisplay = isCustom ? "" : (billing === "monthly" ? "/Month" : "/Year");
                
                return (
                  <div key={plan.id} className="w-full md:w-[360px] lg:w-[360px] bg-white rounded-xl p-8 border border-[#E5E9EA] shadow-sm flex flex-col hover:border-[#3A86FF]/30 hover:shadow-lg transition-all duration-300">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-[#3A86FF] mb-4">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="font-bold text-[#1F2D2E] text-4xl">
                          {!isCustom && "$"}
                          {priceDisplay}
                        </span>
                        {periodDisplay && (
                          <span className="text-[#94A3B8] text-sm font-medium">{periodDisplay}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <ul className="space-y-4 mb-8">
                        {plan.projection_limit && (
                          <li className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0 flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#E4EFFF]">
                              <Check size={12} strokeWidth={3} className="text-[#3A86FF]" />
                            </div>
                            <span className="text-[14px] leading-tight font-medium text-[#1F2D2E]">
                              {plan.projection_limit.toLocaleString()} AI Projections
                            </span>
                          </li>
                        )}
                        {(plan.features || []).map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0 flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#E4EFFF]">
                              <Check size={12} strokeWidth={3} className="text-[#3A86FF]" />
                            </div>
                            <span className="text-[14px] leading-tight font-medium text-[#1F2D2E]">
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={loadingPlanId === plan.id || isProcessing}
                      className={cn(
                        "w-full text-center py-3.5 rounded-xl font-bold text-sm text-white hover:bg-opacity-90 transition-all shadow-md group flex items-center justify-center gap-2 cursor-pointer bg-[#0FA4A9] shadow-[0_4px_14px_0_rgba(15,164,169,0.3)]",
                        (loadingPlanId === plan.id || isProcessing) && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      {loadingPlanId === plan.id ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Processing...
                        </>
                      ) : (
                        "Buy Now"
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500 italic text-sm bg-white rounded-2xl border border-gray-100 shadow-sm">
                No API service plans available at this moment.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
