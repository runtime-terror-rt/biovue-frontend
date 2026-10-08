"use client";

import React, { useMemo, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Plan,
  useGetSubscriptionPlansQuery,
  useProcessPaymentMutation,
} from "@/redux/features/api/paymentApi";
import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "@/redux/features/slice/authSlice";
import { useRouter } from "next/navigation";
import { getUserPlanType, PlanAudience, hasPaidPlan } from "@/lib/planType";
import { startTrialCheckout } from "@/lib/trialPayment";
import { toast } from "sonner";

interface FreeTrialPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  trialPlan: any;
  defaultBilling?: "monthly" | "annual";
  planTypeOverride?: any;
}

const FreeTrialPlanModal = ({
  isOpen,
  onClose,
  trialPlan,
  defaultBilling = "monthly",
  planTypeOverride,
}: FreeTrialPlanModalProps) => {
  const router = useRouter();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [billing, setBilling] = useState<"monthly" | "annual">(defaultBilling);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [processPayment, { isLoading: isProcessing }] =
    useProcessPaymentMutation();

  const planType = getUserPlanType(
    user,
    planTypeOverride || (trialPlan.plan_type as PlanAudience) || "individual",
  );

  const { data: plansResp, isLoading } = useGetSubscriptionPlansQuery(
    { billing, type: planType },
    { skip: !isOpen },
  );

  const paidPlans = useMemo(() => {
    return (plansResp?.data || [])
      .filter((plan) => plan.status)
      .filter((plan) => {
        const name = (plan.name || "").toLowerCase();
        const isPlusOrPremium = name.includes("plus") || name.includes("premium");
        const isFree =
          name.includes("free trial") ||
          name.includes("free plan") ||
          plan.price === "0.00" ||
          plan.price === 0;
        const isEnterprise = name.includes("enterprise");
        return isPlusOrPremium && !isFree && !isEnterprise;
      })
      .sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
  }, [plansResp]);

  const audienceLabel =
    planType === "api"
      ? "API"
      : planType === "professional"
        ? "Professional"
        : "Individual";

  React.useEffect(() => {
    if (isOpen && hasPaidPlan(user)) {
      toast.error(
        "You already have an active paid plan (Plus/Premium) and cannot take the free trial.",
      );
      onClose();
    }
  }, [isOpen, user, onClose]);

  const handleConfirm = async () => {
    if (hasPaidPlan(user)) {
      toast.error(
        "You already have an active paid plan (Plus/Premium) and cannot take the free trial.",
      );
      onClose();
      return;
    }

    if (!selectedPlanId) {
      toast.error("Please choose which plan to subscribe to after your 7-day trial: Plus Plan or Premium Plan.");
      return;
    }

    await startTrialCheckout({
      processPayment,
      payload: {
        plan_id: Number(trialPlan.id),
        billing,
        target_plan_id: Number(selectedPlanId),
        is_trial: true,
      },
      token,
      user,
      router,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="p-6 md:p-8 border-b border-[#E5E9EA]">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#3A86FF] mb-2">
                7-day free trial
              </p>
              <h2 className="text-2xl font-bold text-[#1F2D2E]">
                Choose your plan after the 7-day trial
              </h2>
              <p className="text-[#5F6F73] text-sm mt-2 max-w-xl">
                Start free for 7 days. Please choose which plan you want to subscribe to after the trial: <strong>Plus Plan</strong> or <strong>Premium Plan</strong>. Checkout shows a $0 balance today.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={22} className="text-gray-400" />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <span
              className={cn(
                "text-sm font-semibold",
                billing === "monthly" ? "text-[#1F2D2E]" : "text-[#94A3B8]",
              )}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBilling((prev) => (prev === "monthly" ? "annual" : "monthly"))
              }
              className={cn(
                "relative w-14 h-7 rounded-full transition-colors focus:outline-none p-1 cursor-pointer",
                billing === "annual" ? "bg-[#3A86FF]" : "bg-[#E2E8F0]",
              )}
              aria-label="Toggle billing cycle"
            >
              <div
                className={cn(
                  "w-5 h-5 bg-white rounded-full transition-transform shadow-md",
                  billing === "annual" ? "translate-x-7" : "translate-x-0",
                )}
              />
            </button>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-semibold",
                  billing === "annual" ? "text-[#1F2D2E]" : "text-[#94A3B8]",
                )}
              >
                Annual
              </span>
              <span className="bg-[#E4EFFF] text-[#3A86FF] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Save 10%
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#0FA4A9]" />
            </div>
          ) : paidPlans.length === 0 ? (
            <div className="text-center py-12 text-[#5F6F73]">
              No {audienceLabel.toLowerCase()} plans are available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paidPlans.map((plan) => {
                const selected = selectedPlanId === Number(plan.id);
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(Number(plan.id))}
                    className={cn(
                      "text-left bg-white rounded-xl p-5 border transition-all cursor-pointer",
                      selected
                        ? "border-[#3A86FF] ring-2 ring-[#3A86FF]/15 shadow-md"
                        : "border-[#E5E9EA] hover:border-[#3A86FF]/40 hover:shadow-sm",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-[#3A86FF]">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-[#94A3B8] font-medium mt-1">
                          Billed after 7 days
                        </p>
                      </div>
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border flex items-center justify-center shrink-0",
                          selected
                            ? "bg-[#3A86FF] border-[#3A86FF]"
                            : "border-[#94A3B8]",
                        )}
                      >
                        {selected && (
                          <Check size={14} className="text-white" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-3xl font-bold text-[#1F2D2E]">
                        ${Number(plan.price).toString()}
                      </span>
                      <span className="text-[#94A3B8] text-sm font-medium">
                        {billing === "monthly" ? "/Month" : "/Year"}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {(plan.features || []).slice(0, 3).map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-[13px] text-[#1F2D2E] font-medium"
                        >
                          <span className="w-[16px] h-[16px] rounded-full bg-[#E4EFFF] flex items-center justify-center mt-0.5 shrink-0">
                            <Check
                              size={10}
                              strokeWidth={3}
                              className="text-[#3A86FF]"
                            />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 md:px-8 md:pb-8 pt-0 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl font-bold text-sm border border-[#E5E9EA] text-[#5F6F73] hover:bg-gray-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedPlanId || isProcessing}
            className="flex-1 bg-[#0FA4A9] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md shadow-[#0FA4A9]/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Redirecting...
              </>
            ) : (
              "Confirm & continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeTrialPlanModal;
