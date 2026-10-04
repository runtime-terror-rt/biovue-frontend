import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "@/redux/features/slice/authSlice";
import { useGetProjectionLimitQuery } from "@/redux/features/api/userDashboard/Projection/ProjectionLimitAPI";
import { useGetPaymentSummaryQuery } from "@/redux/features/api/paymentApi";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";
import { hasPaidPlan } from "@/lib/planType";

type SubscriptionStatus = {
  restricted: boolean;
  isSafe: boolean;
  isWarning: boolean;
  reason: string;
  isLoading: boolean;
  projection_limit: number;
  member_limit: number;
  diffDays: number;
  hasExpiry: boolean;
  expiryOver: boolean;
  projectionZero: boolean;
};

export const useSubscriptionStatus = (): SubscriptionStatus => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const userId = user?.id || user?.user_id;

  const { data: profileResponse, isLoading: isProfileLoading } =
    useGetProfileQuery(userId as string | number, {
      skip: !userId,
    });

  const { data: limitData, isLoading: isLimitLoading } =
    useGetProjectionLimitQuery(undefined, {
      skip: !token,
    });

  const { data: paymentSummary, isLoading: isPaymentLoading } =
    useGetPaymentSummaryQuery(undefined, {
      skip: !token,
    });

  const isLoading = isLimitLoading || isPaymentLoading || isProfileLoading;

  // default safe object
  const base: SubscriptionStatus = {
    restricted: false,
    isSafe: false,
    isWarning: false,
    reason: "",
    isLoading: true,
    projection_limit: 0,
    member_limit: 0,
    diffDays: 0,
    hasExpiry: false,
    expiryOver: false,
    projectionZero: false,
  };

  if (!user?.created_at || isLoading) {
    return {
      ...base,
      isLoading,
    };
  }

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

  const latestPayment = paymentSummary?.latest_payment;
  const isPaid =
    planId === 2 ||
    planId === 3 ||
    hasPaidPlan(user, paymentSummary, profileData);

  const projectionLimit =
    typeof limitData?.projection_limit === "number"
      ? limitData.projection_limit
      : typeof latestPayment?.plan?.projection_limit === "number"
      ? latestPayment.plan.projection_limit
      : 0;

  const memberLimit =
    typeof limitData?.member_limit === "number"
      ? limitData.member_limit
      : typeof latestPayment?.plan?.member_limit === "number"
      ? latestPayment.plan.member_limit
      : 0;

  // Resolve best expiry date:
  // For paid users, prioritize latest_payment.end_date, or take the latest valid future date
  let effectiveExpiryTime: number | null = null;

  if (latestPayment?.end_date) {
    const t = new Date(latestPayment.end_date).getTime();
    if (!isNaN(t)) {
      effectiveExpiryTime = t;
    }
  }

  if (limitData?.expired_at) {
    const t = new Date(limitData.expired_at).getTime();
    if (!isNaN(t)) {
      if (effectiveExpiryTime === null || t > effectiveExpiryTime) {
        effectiveExpiryTime = t;
      }
    }
  }

  if (
    effectiveExpiryTime === null &&
    typeof user?.plan_duration === "number" &&
    user.plan_duration > 0
  ) {
    effectiveExpiryTime = Date.now() + user.plan_duration * 24 * 60 * 60 * 1000;
  }

  const now = Date.now();

  if (effectiveExpiryTime !== null) {
    const diffDays = Math.ceil(
      (effectiveExpiryTime - now) / (1000 * 60 * 60 * 24),
    );

    const projectionZero = projectionLimit <= 0;
    const expiryOver = diffDays <= 0;

    const isSafe = projectionLimit >= 2 && diffDays > 3;
    const isWarning = !projectionZero && !expiryOver && !isSafe;

    return {
      restricted: false,
      isSafe,
      isWarning,
      reason: projectionZero
        ? "no_credits"
        : expiryOver
        ? "subscription_expired"
        : isWarning
        ? "low_credits_or_expiring_soon"
        : "",
      isLoading: false,
      projection_limit: projectionLimit,
      member_limit: memberLimit,
      diffDays,
      hasExpiry: true,
      expiryOver,
      projectionZero,
    };
  }

  const createdDate = new Date(user.created_at);
  const diffInDays =
    (now - createdDate.getTime()) / (1000 * 60 * 60 * 24);

  const isTrialEnded = !isPaid && !planId && diffInDays > 7;

  return {
    restricted: isTrialEnded,
    isSafe: isPaid || !isTrialEnded,
    isWarning: false,
    reason: isTrialEnded ? "trial_ended" : "",
    isLoading: false,
    projection_limit: projectionLimit,
    member_limit: memberLimit,
    diffDays: isPaid ? 30 : Math.max(0, Math.ceil(7 - diffInDays)),
    hasExpiry: false,
    expiryOver: false,
    projectionZero: projectionLimit <= 0,
  };
};