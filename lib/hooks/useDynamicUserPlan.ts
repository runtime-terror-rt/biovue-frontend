"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, updateUser } from "@/redux/features/slice/authSlice";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";
import { useGetPlansQuery, Plan } from "@/redux/features/api/adminDashboard/plan";

export interface DynamicUserPlanResult {
  userId: number | string | undefined;
  profileData: any;
  planId: number | null;
  currentPlan: Plan | null;
  planName: string;
  isFree: boolean;
  isPlus: boolean;
  isPremium: boolean;
  isPaid: boolean;
  isLoading: boolean;
  refetchProfile: () => void;
}

export function useDynamicUserPlan(): DynamicUserPlanResult {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || (currentUser as any)?.user_id;

  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useGetProfileQuery(userId as string | number, {
    skip: !userId,
  });

  const { data: plansData, isLoading: isPlansLoading } = useGetPlansQuery();

  const profileData = profileResponse?.data || profileResponse;

  // Primary source of truth is profile data GET /profile/{id}
  const rawPlanId =
    profileData?.plan_id !== undefined && profileData?.plan_id !== null
      ? profileData.plan_id
      : profileData?.profile?.plan_id !== undefined && profileData?.profile?.plan_id !== null
      ? profileData.profile.plan_id
      : (currentUser?.plan_id ?? null);

  const planId =
    rawPlanId !== null && rawPlanId !== undefined && rawPlanId !== ""
      ? Number(rawPlanId)
      : null;

  // Find plan in plans list
  const plansList: Plan[] = Array.isArray(plansData)
    ? plansData
    : (plansData as any)?.data || [];

  const matchedPlan =
    planId !== null
      ? plansList.find((p) => Number(p.id) === planId) || null
      : null;

  // Fallback plan definitions if plansList is still loading or doesn't include it
  const currentPlan: Plan | null =
    matchedPlan ||
    (planId === 2
      ? ({
          id: 2,
          name: "Plus",
          price: "29.00",
          billing_cycle: "monthly",
          features: [
            "AI Body Projections",
            "Personalized Insights",
            "Habits Tracking",
            "Dedicated Coach Access",
          ],
          status: true,
          plan_type: "individual",
          duration: 30,
          member_limit: null,
        } as unknown as Plan)
      : planId === 3
      ? ({
          id: 3,
          name: "Premium",
          price: "59.00",
          billing_cycle: "monthly",
          features: [
            "Everything in Plus",
            "2K High-Res Projections",
            "5-Year Future Insights",
            "Priority Support",
          ],
          status: true,
          plan_type: "individual",
          duration: 30,
          member_limit: null,
        } as unknown as Plan)
      : null);

  const resolvedName =
    currentPlan?.name ||
    (planId === 3
      ? "Premium"
      : planId === 2
      ? "Plus"
      : planId === 1
      ? "Free"
      : "");

  const nameLower = resolvedName.toLowerCase();

  const hasPlan = planId !== null && planId !== undefined && planId !== 0;

  const isPremium = hasPlan && (nameLower.includes("premium") || planId === 3);
  const isPlus = hasPlan && !isPremium && (nameLower.includes("plus") || planId === 2);
  const isFree =
    hasPlan &&
    !isPremium &&
    !isPlus &&
    (planId === 1 ||
      nameLower.includes("free") ||
      Number(currentPlan?.price || 0) === 0);

  const isPaid = isPlus || isPremium;

  const planName = isPremium
    ? "Premium"
    : isPlus
    ? "Plus"
    : isFree
    ? (resolvedName || "Free")
    : "";

  // Keep Redux currentUser synced with the latest plan from profile
  useEffect(() => {
    if (hasPlan && planId !== null && planId !== undefined) {
      if (
        currentUser?.plan_id !== planId ||
        (planName && currentUser?.plan_name !== planName)
      ) {
        dispatch(
          updateUser({
            plan_id: planId,
            plan_name: planName,
          })
        );
      }
    }
  }, [hasPlan, planId, planName, currentUser?.plan_id, currentUser?.plan_name, dispatch]);

  return {
    userId,
    profileData,
    planId,
    currentPlan,
    planName,
    isFree,
    isPlus,
    isPremium,
    isPaid,
    isLoading: isProfileLoading || isPlansLoading,
    refetchProfile,
  };
}

export default useDynamicUserPlan;
