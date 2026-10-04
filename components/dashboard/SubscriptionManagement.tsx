"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
  updateUser,
} from "@/redux/features/slice/authSlice";
import {
  useGetSubscriptionPlansQuery,
  useGetPaymentSummaryQuery,
  useCancelSubscriptionMutation,
  useProcessPaymentMutation,
} from "@/redux/features/api/paymentApi";
import handlePlanSelection from "@/lib/planSelection";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Crown, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useGetProjectionLimitQuery } from "@/redux/features/api/userDashboard/Projection/ProjectionLimitAPI";
import FreeTrialPlanModal from "@/components/pricing/FreeTrialPlanModal";
import { isFreeTrialPlan, hasPaidPlan } from "@/lib/planType";
import { useTrialCountdown } from "@/lib/hooks/useTrialCountdown";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";

interface SubscriptionManagementProps {
  onBack?: () => void;
  backLabel?: string;
  role?: string;
}

const SubscriptionManagement = ({
  onBack,
  backLabel = "Back to Settings",
  role,
}: SubscriptionManagementProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const [processPayment] = useProcessPaymentMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const currentUser = useSelector(selectCurrentUser);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [trialPlan, setTrialPlan] = useState<any | null>(null);

  const { isTrial, remainingDays: trialRemainingDays, targetPlan } =
    useTrialCountdown();

  const { data: plansData, isLoading: isLoadingPlans } =
    useGetSubscriptionPlansQuery({
      billing: billingCycle,
      type: role || currentUser?.role || "individual",
    });

  const userId = currentUser?.id || (currentUser as any)?.user_id;
  const { data: profileResponse } = useGetProfileQuery(userId as string | number, {
    skip: !userId,
  });

  const { data: paymentSummary } = useGetPaymentSummaryQuery();
  const { data: projectionLimitData } = useGetProjectionLimitQuery();
  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();

  const paidEndDate =
    paymentSummary?.latest_payment?.end_date ||
    projectionLimitData?.expired_at ||
    null;

  const expiryDateString = paidEndDate
    ? new Date(paidEndDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const remainingDays =
    trialRemainingDays !== null
      ? trialRemainingDays
      : paidEndDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(paidEndDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : currentUser?.plan_duration
      ? currentUser.plan_duration
      : null;

  const plans = plansData?.data || [];

  const profileData = profileResponse?.data || profileResponse;
  const rawProfilePlanId =
    profileData?.plan_id !== undefined && profileData?.plan_id !== null
      ? profileData.plan_id
      : profileData?.profile?.plan_id !== undefined && profileData?.profile?.plan_id !== null
      ? profileData.profile.plan_id
      : currentUser?.plan_id;

  const ACTIVE_STATUSES = ["active", "succeeded", "paid", "complete", "completed"];
  const isSummaryPaymentPaid =
    paymentSummary?.latest_payment &&
    ACTIVE_STATUSES.includes(
      (paymentSummary.latest_payment.status ?? "").toLowerCase(),
    );

  const activePlanId =
    rawProfilePlanId !== null && rawProfilePlanId !== undefined
      ? Number(rawProfilePlanId)
      : (isSummaryPaymentPaid ? paymentSummary?.latest_payment?.plan?.id : null);

  const matchedPlan = plans.find((p: any) => Number(p.id) === Number(activePlanId));

  const isUserOnPaidPlan =
    activePlanId === 2 ||
    activePlanId === 3 ||
    (matchedPlan && !isFreeTrialPlan(matchedPlan) && Number(matchedPlan.price || 0) > 0);

  const effectiveIsTrial = isTrial && !isUserOnPaidPlan;

  const activePlanName = effectiveIsTrial
    ? "Free Trial"
    : matchedPlan?.name ||
      (activePlanId === 3
        ? "Premium"
        : activePlanId === 2
        ? "Plus"
        : activePlanId === 1
        ? "Free Trial"
        : currentUser?.plan_name || (activePlanId ? "Active Plan" : "Free Trial"));


  // Calculate if the subscription is more than 6 months old
  const canCancel = useMemo(() => {
    if (!paymentSummary?.latest_payment) return true;

    if (!paymentSummary.latest_payment.created_at) return false;
    const createdAt = new Date(paymentSummary.latest_payment.created_at);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return createdAt <= sixMonthsAgo;
  }, [paymentSummary]);

  const handleCancelSubscription = async () => {
    let expiryInfo = "";
    if (expiryDateString && remainingDays !== null && remainingDays > 0) {
      expiryInfo = `<p class="mt-2 text-sm text-gray-600">Your subscription will remain active until <strong class="text-[#0FA4A9]">${expiryDateString}</strong> (${remainingDays} days left).</p>`;
    } else if (expiryDateString) {
      expiryInfo = `<p class="mt-2 text-sm text-[#5F6F73]">Your subscription will remain active until <strong class="text-[#0FA4A9]">${expiryDateString}</strong>.</p>`;
    } else if (remainingDays !== null && remainingDays > 0) {
      expiryInfo = `<p class="mt-2 text-sm text-[#5F6F73]">Your subscription will remain active for <strong class="text-[#0FA4A9]">${remainingDays} days</strong>.</p>`;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      html: `<div class="text-[#1F2D2E]">Do you really want to cancel your subscription?</div>${expiryInfo}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0FA4A9",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await cancelSubscription().unwrap();
        dispatch(
          updateUser({ plan_id: null, plan_name: null, plan_duration: null }),
        );
        toast.success("Subscription cancelled successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to cancel subscription");
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[#3A86FF] text-xs font-bold hover:bg-gray-50 transition-all w-fit cursor-pointer mb-2"
      >
        <ArrowLeft size={14} />
        {backLabel}
      </button>

      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-extrabold text-[#1F2D2E]">
          Manage Subscription
        </h1>
        <p className="text-[#5F6F73] text-sm font-medium">
          Control your plan, billing, and access
        </p>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-[#0FA4A9] rounded-[16px] p-8 text-white relative overflow-hidden h-[180px] flex flex-col justify-between">
        <div className="flex justify-between items-start relative z-10 w-full">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
              CURRENT PLAN
            </span>
            <h2 className="text-4xl font-extrabold">{activePlanName}</h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">
              {remainingDays !== null
                ? isTrial
                  ? `${remainingDays} DAYS REMAINING (TRIAL)`
                  : `${remainingDays} DAYS REMAINING`
                : activePlanId
                  ? "ACTIVE PLAN"
                  : isTrial
                    ? "7 DAYS FREE TRIAL"
                    : "NO ACTIVE PLAN"}
            </span>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  activePlanId || isTrial ? "bg-[#4ADE80]" : "bg-gray-400",
                )}
              />
              <span className="text-[9px] font-extrabold uppercase tracking-widest">
                {activePlanId || isTrial ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end relative z-10 w-full">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold opacity-90">
              Plan: {typeof activePlanName === "string" ? activePlanName : "Active Plan"}
            </span>
            {targetPlan && isTrial && (
              <span className="text-[11px] font-medium text-white/90">
                Next plan:{" "}
                <strong className="font-bold underline decoration-white/40">
                  {typeof targetPlan === "string"
                    ? targetPlan
                    : (targetPlan as any)?.name || "Plus"}
                </strong>{" "}
                (auto-bills after 7 days)
              </span>
            )}
          </div>
          {(activePlanId || currentUser?.plan_id) && (
            <div className="flex flex-col items-end gap-1">
              {currentUser?.user_type === "individual" ? (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                  className={cn(
                    "text-[10px] font-extrabold uppercase tracking-widest border border-white/60 px-6 py-2 rounded-lg transition-all",
                    !isCancelling
                      ? "hover:bg-white/10 cursor-pointer"
                      : "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isCancelling ? "Cancelling..." : "CANCEL SUBSCRIPTION"}
                </button>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={handleCancelSubscription}
                    disabled={!canCancel || isCancelling}
                    className={cn(
                      "text-[10px] font-extrabold uppercase tracking-widest border border-white/60 px-6 py-2 rounded-lg transition-all",
                      !canCancel || isCancelling
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-white/10 cursor-pointer",
                    )}
                    title={
                      !canCancel
                        ? "You cannot disable within 6 months"
                        : "Cancel subscription"
                    }
                  >
                    {isCancelling ? "Cancelling..." : "CANCEL SUBSCRIPTION"}
                  </button>
                  {!canCancel && activePlanId && (
                    <span className="text-[8px] font-bold text-white/50 uppercase tracking-tighter mt-1">
                      6 MONTHS COMMITMENT REQUIRED
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Decorative Crown */}
        <Crown
          size={140}
          className="absolute -right-6 top-1/2 -translate-y-1/2 text-white opacity-[0.07] rotate-[15deg] pointer-events-none"
        />
      </div>

      {/* Billing Cycle */}
      <div className="bg-white rounded-[16px] p-8 border border-[#3A86FF]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-[#1F2D2E]">Billing Cycle</h3>
          <p className="text-[#5F6F73] text-sm font-medium">
            Save up to 10% with annual billing
          </p>
        </div>
        <div className="flex text-sm font-bold items-center gap-6">
          <span
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "cursor-pointer transition-all uppercase tracking-widest text-[11px]",
              billingCycle === "monthly"
                ? "text-[#0FA4A9] border-b-2 border-[#0FA4A9] pb-0.5"
                : "text-[#94A3B8]",
            )}
          >
            Monthly
          </span>
          <span
            onClick={() => setBillingCycle("annual")}
            className={cn(
              "cursor-pointer transition-all uppercase tracking-widest text-[11px]",
              billingCycle === "annual"
                ? "text-[#0FA4A9] border-b-2 border-[#0FA4A9] pb-0.5"
                : "text-[#94A3B8]",
            )}
          >
            Annual
          </span>
        </div>
      </div>

      {/* Plan Tiers */}
      <div className="flex flex-col gap-4">
        {isLoadingPlans ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#0FA4A9] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="py-12 bg-white rounded-2xl border border-gray-100 text-center text-gray-500 font-medium">
            No plans available for this cycle.
          </div>
        ) : (
          plans.map((plan: any) => {
            const isNameMatch =
              Boolean(activePlanName && plan.name) &&
              activePlanName.trim().toLowerCase() ===
                plan.name.trim().toLowerCase();
            const isIdMatch =
              Boolean(activePlanId && plan.id) &&
              Number(activePlanId) === Number(plan.id);

            // During free trial, paid plans are NOT yet active, so user can click to pay and activate immediately
            const isActive = effectiveIsTrial
              ? isFreeTrialPlan(plan)
              : isIdMatch || (isNameMatch && !effectiveIsTrial);
            const isTrialIneligible =
              isFreeTrialPlan(plan) && hasPaidPlan(currentUser, paymentSummary);

            return (
              <div
                key={plan.id}
                onClick={async () => {
                  if (isActive) return;
                  if (isTrialIneligible) {
                    toast.error(
                      "You already have an active paid plan (Plus/Premium) and cannot take the free trial.",
                    );
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
                    onFreeTrial: (trial) => setTrialPlan(trial),
                  });
                }}
                className={cn(
                  "rounded-[16px] p-6 border transition-all duration-300",
                  !isActive && !isTrialIneligible && "cursor-pointer",
                  isTrialIneligible && "opacity-60 cursor-not-allowed bg-gray-50",
                  isActive
                    ? "bg-[#F3FCFA] border-2 border-[#0FA4A9] shadow-sm"
                    : !isTrialIneligible
                      ? "bg-white border-[#E2E8F0] shadow-sm hover:border-[#0FA4A9]/30"
                      : "border-gray-200",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                        isActive
                          ? "bg-[#0FA4A9] text-white"
                          : "bg-[#F0F7FF] text-[#3A86FF]",
                      )}
                    >
                      {plan.name === "Premium" || plan.name === "Plus" ? (
                        <Crown size={28} />
                      ) : (
                        <User size={28} />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-xl font-bold text-[#1F2D2E]">
                        {plan.name}
                      </h4>
                      <div className="flex flex-col gap-1.5 mt-1">
                        {plan.features
                          ?.slice(0, 2)
                          .map((feature: string, i: number) => (
                            <span
                              key={i}
                              className={cn(
                                "text-[12px] font-medium flex items-center gap-2",
                                isActive ? "text-[#0FA4A9]" : "text-[#5F6F73]",
                              )}
                            >
                              <div
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full shrink-0",
                                  isActive ? "bg-[#0FA4A9]" : "bg-blue-200",
                                )}
                              />
                              {feature}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-2xl font-black text-[#1F2D2E]">
                      ${plan.price}
                      <span className="text-sm font-medium text-[#94A3B8]">
                        /{plan.billing_cycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </span>
                    {isActive && (
                      <div className="flex flex-col items-end gap-2 mt-2">
                        <span className="text-[10px] font-bold text-[#0FA4A9] uppercase tracking-widest flex items-center gap-1.5 bg-[#EAFBF7] px-3 py-1 rounded-full border border-[#0FA4A9]/20">
                          <Check size={12} strokeWidth={3} /> Active Plan
                        </span>
                        {/* Show cancel for individuals; for others disable within 6 months */}
                        {currentUser?.user_type === "individual" ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelSubscription();
                            }}
                            disabled={isCancelling}
                            className={cn(
                              "text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-50 transition-all",
                              isCancelling && "opacity-50 cursor-not-allowed",
                            )}
                          >
                            <Trash2 size={12} /> Cancel
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelSubscription();
                            }}
                            disabled={!canCancel || isCancelling}
                            title={
                              !canCancel
                                ? "You cannot disable within 6 months"
                                : "Cancel subscription"
                            }
                            className={cn(
                              "text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 transition-all",
                              (!canCancel || isCancelling) &&
                                "opacity-50 cursor-not-allowed",
                            )}
                          >
                            <Trash2 size={12} /> Cancel
                          </button>
                        )}
                      </div>
                    )}
                    {!isActive && isTrial && !isFreeTrialPlan(plan) && (
                      <span className="text-[10px] font-bold text-[#0FA4A9] uppercase tracking-widest flex items-center gap-1.5 bg-[#E6F6F6] px-2.5 py-1 rounded-full border border-[#0FA4A9]/30 mt-2">
                        {Number(currentUser?.target_plan_id) === Number(plan.id) ||
                        (typeof targetPlan === "string" &&
                          targetPlan.toLowerCase() === plan.name?.toLowerCase())
                          ? "Next Plan • Click to Pay Now"
                          : "Click to Pay & Activate"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* <div className="flex items-center gap-4">
        <button className="flex-[2] bg-[#0FA4A9] text-white py-4 rounded-[12px] font-bold text-base hover:bg-[#0d8e92] transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20">
          Confirm Changes
        </button>
        <button
          onClick={handleBack}
          className="flex-1 bg-white border border-gray-100 text-[#5F6F73] py-4 rounded-[12px] font-bold text-base hover:bg-gray-50 transition-all cursor-pointer"
        >
          {backLabel}
        </button>
      </div> */}

      {trialPlan && (
        <FreeTrialPlanModal
          isOpen={!!trialPlan}
          onClose={() => setTrialPlan(null)}
          trialPlan={trialPlan}
          defaultBilling={billingCycle}
        />
      )}
    </div>
  );
};

export default SubscriptionManagement;
