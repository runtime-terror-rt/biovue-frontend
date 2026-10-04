import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
  updateUser,
} from "@/redux/features/slice/authSlice";
import { useGetProjectionLimitQuery } from "@/redux/features/api/userDashboard/Projection/ProjectionLimitAPI";
import { useGetPaymentSummaryQuery } from "@/redux/features/api/paymentApi";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";
import { hasPaidPlan, isTrialFlag, isFreeTrialPlan } from "@/lib/planType";

const TRIAL_DAYS = 7;

export function useTrialCountdown() {
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const userId = user?.id || user?.user_id;

  const { data: profileResponse, isLoading: isProfileLoading } =
    useGetProfileQuery(userId as string | number, { skip: !userId });

  // Query projection limit without skipping on userId since it takes void endpoint
  const { data: limitData, isLoading: isLimitLoading } =
    useGetProjectionLimitQuery(undefined, { skip: !token });

  const { data: summaryData, isLoading: isSummaryLoading } =
    useGetPaymentSummaryQuery(undefined, { skip: !token });

  const latestPayment = summaryData?.latest_payment;
  const profileData = profileResponse?.data || profileResponse;

  const rawPlanId =
    profileData?.plan_id ??
    profileData?.profile?.plan_id ??
    user?.plan_id ??
    null;
  const planId =
    rawPlanId !== null && rawPlanId !== undefined && rawPlanId !== ""
      ? Number(rawPlanId)
      : null;

  const summaryPlanName = String(
    latestPayment?.plan?.name ||
      summaryData?.user?.plan_name ||
      "",
  ).toLowerCase();
  const userPlanName = String(
    user?.plan_name || user?.plan?.name || "",
  ).toLowerCase();
  const planName = summaryPlanName || userPlanName;

  // 1. If user has an active paid plan (and not a trial), they are NOT on trial
  const isPaid = hasPaidPlan(user, summaryData, profileData);

  // If user has a confirmed paid plan, automatically sanitize Redux state so stale trial flags are cleared
  useEffect(() => {
    if (
      isPaid &&
      (isTrialFlag(user?.is_trial) ||
        user?.target_plan_id != null ||
        user?.target_plan != null ||
        user?.trial_days != null)
    ) {
      dispatch(
        updateUser({
          is_trial: 0,
          target_plan: null,
          target_plan_id: null,
          trial_days: null,
        }),
      );
    }
  }, [isPaid, user, dispatch]);

  if (isPaid) {
    const activePaidPlanName =
      (planId === 3 ? "Premium" : planId === 2 ? "Plus" : null) ||
      latestPayment?.plan?.name ||
      summaryData?.user?.plan_name ||
      user?.plan_name ||
      "Paid Plan";

    return {
      isTrial: false,
      remainingDays: null,
      totalDays: TRIAL_DAYS,
      isLoading: isLimitLoading || isSummaryLoading || isProfileLoading,
      planName: activePaidPlanName,
      targetPlan: null,
    };
  }

  // 2. Filter out non-individual dashboards (e.g., admin or api)
  const userRole = String(user?.role || user?.user_type || "").toLowerCase();
  const isExcludedRole =
    userRole === "admin" ||
    userRole === "api" ||
    user?.plan_type === "api" ||
    planName.includes("api");

  if (isExcludedRole) {
    return {
      isTrial: false,
      remainingDays: null,
      totalDays: TRIAL_DAYS,
      isLoading: isLimitLoading || isSummaryLoading,
      planName: "Active Plan",
      targetPlan: null,
    };
  }

  // 3. Identify if user is on Free Trial:
  const isIndividualUser =
    !userRole ||
    userRole === "individual" ||
    userRole === "user" ||
    userRole === "member";

  const hasExplicitTrialSignal =
    !isPaid &&
    (isTrialFlag(user?.is_trial) ||
      isTrialFlag(latestPayment?.is_trial) ||
      isTrialFlag(summaryData?.user?.is_trial) ||
      (latestPayment?.target_plan_id != null && Number(latestPayment?.amount || 0) === 0) ||
      (user?.target_plan_id != null && (!user?.plan_id || isFreeTrialPlan(user?.plan))) ||
      planName.includes("trial") ||
      planName.includes("free"));

  // On individual dashboard, any non-paid user with a trial signal or free plan is on the Free Trial
  const isTrial =
    !isPaid &&
    (hasExplicitTrialSignal ||
      (isIndividualUser &&
        (!planName || planName.includes("free") || planName.includes("trial"))));

  if (!isTrial) {
    return {
      isTrial: false,
      remainingDays: null,
      totalDays: TRIAL_DAYS,
      isLoading: isLimitLoading || isSummaryLoading,
      planName: latestPayment?.plan?.name || user?.plan_name || "Active Plan",
      targetPlan: null,
    };
  }

  // 4. Compute remaining days:
  let remainingDays: number | null = null;

  // Priority 1: Explicit trial_days from payment or user
  if (
    typeof latestPayment?.trial_days === "number" &&
    !isNaN(latestPayment.trial_days)
  ) {
    remainingDays = Math.max(0, latestPayment.trial_days);
  } else if (
    typeof user?.trial_days === "number" &&
    !isNaN(user.trial_days)
  ) {
    remainingDays = Math.max(0, user.trial_days);
  }

  // Priority 2: Plan duration
  else if (
    typeof user?.plan_duration === "number" &&
    user.plan_duration > 0 &&
    !isNaN(user.plan_duration)
  ) {
    remainingDays = Math.max(0, user.plan_duration);
  } else if (
    typeof summaryData?.user?.plan_duration === "number" &&
    summaryData.user.plan_duration > 0 &&
    !isNaN(summaryData.user.plan_duration)
  ) {
    remainingDays = Math.max(0, summaryData.user.plan_duration);
  }

  // Priority 3: When Stripe trial checkout occurred (latest_payment created_at)
  else if (latestPayment?.created_at) {
    const paymentTime = new Date(latestPayment.created_at).getTime();
    if (!isNaN(paymentTime)) {
      const trialEndTime = paymentTime + TRIAL_DAYS * 24 * 60 * 60 * 1000;
      const diff = Math.ceil((trialEndTime - Date.now()) / (24 * 60 * 60 * 1000));
      remainingDays = Math.max(0, Math.min(TRIAL_DAYS, diff));
    }
  }

  // Priority 4: Projection limit expired_at
  if (remainingDays === null && limitData?.expired_at) {
    const expTime = new Date(limitData.expired_at).getTime();
    if (!isNaN(expTime)) {
      const diff = Math.ceil((expTime - Date.now()) / (24 * 60 * 60 * 1000));
      if (diff >= 0 && diff <= TRIAL_DAYS) {
        remainingDays = diff;
      } else if (diff < 0) {
        remainingDays = 0;
      }
    }
  }

  // Priority 5: Account registration date
  if (remainingDays === null && user?.created_at) {
    const userCreatedAt = new Date(user.created_at).getTime();
    if (!isNaN(userCreatedAt)) {
      const trialEndTime = userCreatedAt + TRIAL_DAYS * 24 * 60 * 60 * 1000;
      const diff = Math.ceil((trialEndTime - Date.now()) / (24 * 60 * 60 * 1000));
      remainingDays = Math.max(0, Math.min(TRIAL_DAYS, diff));
    }
  }

  // Priority 6: Default fallback for any active trial user is 7 days
  if (remainingDays === null || isNaN(remainingDays)) {
    remainingDays = TRIAL_DAYS;
  }

  // Free trial remaining days can NEVER exceed TRIAL_DAYS (7 days)
  if (remainingDays !== null) {
    remainingDays = Math.max(0, Math.min(TRIAL_DAYS, remainingDays));
  }

  // 5. Resolve Target Plan (post-trial plan to be activated)
  const rawTargetPlan =
    latestPayment?.target_plan ||
    user?.target_plan ||
    null;

  let targetPlan: string | null = null;
  if (typeof rawTargetPlan === "string") {
    targetPlan = rawTargetPlan;
  } else if (rawTargetPlan && typeof rawTargetPlan === "object") {
    targetPlan =
      (rawTargetPlan as any).name ||
      (rawTargetPlan as any).plan_name ||
      null;
  }

  if (!targetPlan) {
    const rawTargetPlanId =
      latestPayment?.target_plan_id ||
      user?.target_plan_id ||
      (rawTargetPlan && typeof rawTargetPlan === "object"
        ? (rawTargetPlan as any)?.id
        : null);

    const targetPlanId = Number(rawTargetPlanId);
    if (targetPlanId === 2) {
      targetPlan = "Plus";
    } else if (targetPlanId === 3) {
      targetPlan = "Premium";
    }
  }

  const rawPlanName =
    latestPayment?.plan?.name ||
    user?.plan_name ||
    "Free Trial";
  const displayPlanName =
    typeof rawPlanName === "string"
      ? rawPlanName
      : (rawPlanName as any)?.name || "Free Trial";

  return {
    isTrial: true,
    remainingDays,
    totalDays: TRIAL_DAYS,
    isLoading: isLimitLoading || isSummaryLoading,
    planName: displayPlanName,
    targetPlan: typeof targetPlan === "string" ? targetPlan : null,
  };
}


