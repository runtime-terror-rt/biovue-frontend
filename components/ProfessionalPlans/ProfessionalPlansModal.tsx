"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "@/redux/features/slice/authSlice";
import {
  useGetActivePlansQuery,
  useProcessPaymentMutation,
} from "@/redux/features/api/paymentApi";
import handlePlanSelection from "@/lib/planSelection";
import { isFreeTrialPlan } from "@/lib/planType";
import { Loader2, Crown, Check, X } from "lucide-react";

export default function ProfessionalPlansModal({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const token = useSelector(selectCurrentToken);
  const currentUser = useSelector(selectCurrentUser);
  const [processPayment] = useProcessPaymentMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

  const { data: plansData, isLoading } = useGetActivePlansQuery({ type: "professional" });

  const plans = (plansData?.data || [])
    .filter((plan: any) => plan.status === true)
    .filter((plan: any) => {
      // Only professional plans, strictly NO free trial / free plans
      if (plan.plan_type && plan.plan_type !== "professional") return false;
      if (isFreeTrialPlan(plan)) return false;
      const name = (plan.name || "").toLowerCase();
      if (name.includes("trial") || name.includes("free trial") || name === "free") return false;
      return true;
    });

  const handleSelect = async (plan: any) => {
    const isEnterprise =
      plan.name?.toLowerCase().includes("enterprise") ||
      plan.billing_cycle === "custom" ||
      plan.price === "0.00" ||
      Number(plan.price) === 0;

    if (isEnterprise) {
      window.location.href = `mailto:BioVueSupport@gmail.com?subject=Professional%20Plan%20Inquiry%20-%20${encodeURIComponent(
        plan.name || "",
      )}`;
      return;
    }

    await handlePlanSelection({
      plan,
      token,
      user: currentUser,
      router,
      processPayment,
      setLoadingPlanId,
      billing: plan.billing_cycle || "monthly",
    });
  };

  const formatCycle = (cycle: string) => {
    if (cycle === "half_annual") return "6 Months";
    if (cycle === "monthly") return "Monthly";
    if (cycle === "custom") return "Custom";
    if (cycle === "annual") return "Annual";
    return cycle;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAFBF7] flex items-center justify-center text-[#0FA4A9]">
              <Crown size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1F2D2E]">Professional Plans</h3>
              <p className="text-xs text-[#5F6F73]">Select the plan that fits your professional business needs</p>
            </div>
          </div>
          <button
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            onClick={onClose}
            aria-label="Close plans modal"
          >
            <X size={18} />
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#0FA4A9]" />
            <span className="text-sm font-medium">Loading professional plans...</span>
          </div>
        ) : plans.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-medium">
            No professional plans available at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map((plan: any) => {
              const isEnterprise =
                plan.name?.toLowerCase().includes("enterprise") ||
                plan.billing_cycle === "custom" ||
                plan.price === "0.00" ||
                Number(plan.price) === 0;

              return (
                <div
                  key={plan.id}
                  className="border border-[#E2E8F0] hover:border-[#0FA4A9]/40 rounded-xl p-5 flex flex-col justify-between transition-all bg-white hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-bold text-[#1F2D2E] text-base leading-tight">
                        {plan.name}
                      </h4>
                      {plan.billing_cycle && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                          {formatCycle(plan.billing_cycle)}
                        </span>
                      )}
                    </div>

                    <div className="text-2xl font-black text-[#1F2D2E] mb-3">
                      {isEnterprise ? (
                        "Custom"
                      ) : (
                        <>
                          ${plan.price}
                          <span className="text-xs font-medium text-[#94A3B8]">
                            /{plan.billing_cycle === "half_annual" ? "6 mos" : "mo"}
                          </span>
                        </>
                      )}
                    </div>

                    {plan.member_limit !== null && plan.member_limit !== undefined && plan.member_limit > 0 && (
                      <div className="text-xs font-semibold text-[#3A86FF] bg-[#F0F7FF] px-2.5 py-1 rounded-md mb-3 inline-block">
                        Up to {plan.member_limit} clients
                      </div>
                    )}

                    <ul className="text-xs text-[#5F6F73] space-y-2 mb-5">
                      {(plan.features || []).slice(0, 5).map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={14} className="text-[#0FA4A9] shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                      {(plan.features || []).length > 5 && (
                        <li className="text-[11px] font-semibold text-[#0FA4A9] pl-5">
                          +{(plan.features || []).length - 5} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleSelect(plan)}
                      disabled={loadingPlanId === plan.id}
                      className="w-full bg-[#0FA4A9] hover:bg-[#0d8e92] text-white py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loadingPlanId === plan.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Processing...
                        </>
                      ) : isEnterprise ? (
                        "Contact Us"
                      ) : (
                        "Select Plan"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
