export type PlanAudience = "individual" | "professional" | "api";

export function getUserPlanType(
  user?: any,
  fallback: PlanAudience = "individual",
): PlanAudience {
  if (!user) return fallback;

  const userType = String(user.user_type || "").toLowerCase();
  const role = String(user.role || "").toLowerCase();
  const planType = String(user.plan_type || "").toLowerCase();
  const planName = String(user.plan_name || "").toLowerCase();
  const profession = String(user.profession_type || "").toLowerCase();

  if (
    userType === "api" ||
    role === "api" ||
    planType === "api" ||
    planName.includes("api")
  ) {
    return "api";
  }

  if (
    userType === "professional" ||
    role === "professional" ||
    planType === "professional" ||
    ["trainer_coach", "supplement_supplier", "nutritionist"].includes(
      profession,
    )
  ) {
    return "professional";
  }

  if (userType === "individual" || role === "individual") {
    return "individual";
  }

  return fallback;
}

export function getDashboardPath(user?: any): string {
  if (!user) return "/login";

  const planAudience = getUserPlanType(user);
  if (planAudience === "api") return "/api-user";

  if (user.role === "admin") return "/admin-dashboard/overview";

  if (planAudience === "professional") {
    if (user.profession_type === "trainer_coach") {
      return "/trainer-dashboard/overview";
    }
    if (user.profession_type === "supplement_supplier") {
      return "/supplier-dashboard";
    }
    if (user.profession_type === "nutritionist") {
      return "/nutritionist-dashboard/overview";
    }
  }

  return "/user-dashboard";
}

export function isTrialFlag(val: any): boolean {
  return val === true || val === 1 || val === "1" || val === "true";
}

export function isFreeTrialPlan(plan?: any): boolean {
  if (!plan) return false;
  const name = String(plan.name || "").toLowerCase();
  if (name.includes("enterprise")) return false;
  if (name.includes("free trial") || name.includes("free plan")) return true;
  return (
    plan.plan_type === "individual" &&
    (plan.price === "0.00" || plan.price === 0)
  );
}

export function hasPaidPlan(user?: any, paymentSummary?: any): boolean {
  if (!user && !paymentSummary) return false;

  const latestPayment = paymentSummary?.latest_payment;
  const isTrial =
    isTrialFlag(user?.is_trial) ||
    isTrialFlag(latestPayment?.is_trial) ||
    isTrialFlag(paymentSummary?.user?.is_trial) ||
    latestPayment?.target_plan_id != null ||
    latestPayment?.target_plan != null ||
    user?.target_plan_id != null ||
    user?.target_plan != null;

  if (isTrial) return false;

  const summaryPlanName = String(
    latestPayment?.plan?.name ||
      paymentSummary?.user?.plan_name ||
      "",
  ).toLowerCase();

  const userPlanName = String(
    user?.plan_name || user?.plan?.name || "",
  ).toLowerCase();

  const planName = (summaryPlanName || userPlanName).toLowerCase();

  if (
    planName.includes("free trial") ||
    planName.includes("free plan") ||
    planName.includes("trial") ||
    planName === "free"
  ) {
    return false;
  }

  // If user has a free plan ID (e.g. 3) or price is 0
  const planId =
    latestPayment?.plan_id ||
    latestPayment?.plan?.id ||
    user?.plan_id;
  const planPrice = Number(latestPayment?.plan?.price || 0);
  const paymentAmount = Number(latestPayment?.amount || 0);

  if (planId === 3 || (!planId && !planName)) {
    return false;
  }

  // Check for explicit paid plan names
  const isPaidPlanName =
    planName.includes("plus") ||
    planName.includes("premium") ||
    planName.includes("pro") ||
    planName.includes("enterprise") ||
    planName.includes("standard") ||
    planName.includes("business");

  const paymentStatus = String(latestPayment?.status || "").toLowerCase();
  const isActivePaidStatus = [
    "active",
    "succeeded",
    "paid",
    "complete",
    "completed",
  ].includes(paymentStatus);

  if (
    isPaidPlanName &&
    isActivePaidStatus &&
    (paymentAmount > 0 || planPrice > 0)
  ) {
    return true;
  }

  if (isPaidPlanName && !latestPayment && user?.plan_id && user.plan_id !== 3) {
    return true;
  }

  return false;
}


