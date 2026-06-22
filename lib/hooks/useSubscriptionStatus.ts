import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { useGetProjectionLimitQuery } from "@/redux/features/api/userDashboard/Projection/ProjectionLimitAPI";

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

// export const useSubscriptionStatus = (): SubscriptionStatus => {
//   const user = useSelector(selectCurrentUser);
//   const userId = user?.id || user?.user_id;
//   const { data: limitData, isLoading } = useGetProjectionLimitQuery(userId, {
//     skip: !userId,
//   });

//   const restrictionState = (() => {
//     if (!user?.created_at)
//       return { restricted: false, reason: "", isLoading: true };
//     if (isLoading) return { restricted: false, reason: "", isLoading: true };

//     if (limitData) {
//       const expiryDate = new Date(limitData.expired_at);
//       const today = new Date();
//       const diffDays = Math.ceil(
//         (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
//       );

//       const isBlocked = limitData.projection_limit <= 0 || diffDays <= 0;
//       const isSafe = limitData.projection_limit >= 2 && diffDays > 3;
//       const isWarning = !isBlocked && !isSafe;

//       return {
//         restricted: isBlocked,
//         isSafe,
//         isWarning,
//         reason: isBlocked
//           ? "subscription_expired_or_no_credits"
//           : isWarning
//             ? "low_credits_or_expiring_soon"
//             : "",
//         isLoading: false,
//         projection_limit: limitData.projection_limit,
//         member_limit: limitData.member_limit,
//         diffDays,
//       };
//     }

//     const createdDate = new Date(user.created_at);
//     const today = new Date();
//     const diffInDays =
//       (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

//     const isTrialEnded = !user.plan_id && diffInDays > 7;
//     return {
//       restricted: isTrialEnded,
//       isSafe: !isTrialEnded,
//       isWarning: false,
//       reason: isTrialEnded ? "trial_ended" : "",
//       isLoading: false,
//       projection_limit: 0,
//       member_limit: 0,
//       diffDays: 0,
//     };
//   })();

//   return restrictionState;
// };
export const useSubscriptionStatus = (): SubscriptionStatus => {
  const user = useSelector(selectCurrentUser);
  const userId = user?.id || user?.user_id;

  const { data: limitData, isLoading } =
    useGetProjectionLimitQuery(userId, {
      skip: !userId,
    });

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
      isLoading: true,
    };
  }

  if (limitData) {
    const expiryDate = new Date(limitData.expired_at);
    const today = new Date();

    const diffDays = Math.ceil(
      (expiryDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const projectionZero = limitData.projection_limit <= 0;
    const expiryOver = diffDays <= 0;

    const isSafe =
      limitData.projection_limit >= 2 && diffDays > 3;

    const isWarning = !projectionZero && !expiryOver && !isSafe;

    return {
      // keep `restricted` reserved for full account restriction (e.g., trial ended)
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
      projection_limit: limitData.projection_limit,
      member_limit: limitData.member_limit,
      diffDays,
      hasExpiry: !!limitData.expired_at,
      expiryOver,
      projectionZero,
    };
  }

  const createdDate = new Date(user.created_at);
  const today = new Date();

  const diffInDays =
    (today.getTime() - createdDate.getTime()) /
    (1000 * 60 * 60 * 24);

  const isTrialEnded = !user.plan_id && diffInDays > 7;

  return {
    restricted: isTrialEnded,
    isSafe: !isTrialEnded,
    isWarning: false,
    reason: isTrialEnded ? "trial_ended" : "",
    isLoading: false,
    projection_limit: 0,
    member_limit: 0,
    diffDays: 0,
    hasExpiry: false,
    expiryOver: false,
    projectionZero: false,
  };
};