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

  // 1. If latest_payment exists, evaluate its paid status directly.
  // An active payment with money (> 0) or paid plan price (> 0) for a non-trial plan
  // definitively means the user is on a paid plan, superseding any historical/stale trial flags.
  if (latestPayment) {
    const paymentStatus = String(latestPayment?.status || "").toLowerCase();
    const isActivePaidStatus = [
      "active",
      "succeeded",
      "paid",
      "complete",
      "completed",
    ].includes(paymentStatus);

    const paymentAmount = Number(latestPayment?.amount || 0);
    const planPrice = Number(latestPayment?.plan?.price || 0);
    const paymentPlanName = String(latestPayment?.plan?.name || "").toLowerCase();

    const isExplicitTrial =
      isTrialFlag(latestPayment?.is_trial) ||
      isFreeTrialPlan(latestPayment?.plan) ||
      paymentPlanName.includes("free trial") ||
      paymentPlanName.includes("free plan") ||
      paymentPlanName === "free" ||
      (latestPayment?.target_plan_id != null && paymentAmount === 0 && planPrice === 0);

    const isPaidPlanName =
      paymentPlanName.includes("plus") ||
      paymentPlanName.includes("premium") ||
      paymentPlanName.includes("pro") ||
      paymentPlanName.includes("enterprise") ||
      paymentPlanName.includes("standard") ||
      paymentPlanName.includes("business");

    if (
      isActivePaidStatus &&
      !isExplicitTrial &&
      (paymentAmount > 0 || planPrice > 0 || isPaidPlanName)
    ) {
      return true;
    }

    if (isExplicitTrial) {
      return false;
    }
  }

  // 2. Check payment_history if available
  if (
    Array.isArray(paymentSummary?.payment_history) &&
    paymentSummary.payment_history.length > 0
  ) {
    const hasSuccessfulPaidHistory = paymentSummary.payment_history.some((p: any) => {
      const pStatus = String(p.status || "").toLowerCase();
      const pIsActive = ["active", "succeeded", "paid", "complete", "completed"].includes(pStatus);
      const pAmount = Number(p.amount || 0);
      const pPrice = Number(p.plan?.price || 0);
      const pName = String(p.plan?.name || "").toLowerCase();
      const isTrial =
        isTrialFlag(p.is_trial) ||
        isFreeTrialPlan(p.plan) ||
        pName.includes("free trial") ||
        pName.includes("free plan") ||
        pName === "free";
      return pIsActive && !isTrial && (pAmount > 0 || pPrice > 0);
    });

    if (hasSuccessfulPaidHistory && !isTrialFlag(latestPayment?.is_trial)) {
      return true;
    }
  }

  // 3. Fallback to user and paymentSummary.user object (when no payment details or paymentSummary omitted)
  const summaryPlanName = String(
    paymentSummary?.user?.plan_name ||
    paymentSummary?.user?.plan_type ||
    "",
  ).toLowerCase();

  const userPlanName = String(
    user?.plan_name || user?.plan?.name || user?.plan_type || "",
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

  const isPaidPlanName =
    planName.includes("plus") ||
    planName.includes("premium") ||
    planName.includes("pro") ||
    planName.includes("enterprise") ||
    planName.includes("standard") ||
    planName.includes("business");

  // Check trial flags on user
  const userIsTrial =
    isTrialFlag(user?.is_trial) ||
    isTrialFlag(paymentSummary?.user?.is_trial);

  const hasTargetPlan =
    user?.target_plan_id != null ||
    user?.target_plan != null ||
    paymentSummary?.user?.target_plan_id != null;

  // If user has a paid plan name (e.g. Plus, Premium)
  if (isPaidPlanName) {
    // If plan duration > 7, this is a monthly/annual paid plan (trials are max 7 days)
    if (typeof user?.plan_duration === "number" && user.plan_duration > 7) {
      return true;
    }
    // If user's latest payment or history shows paid status
    if (latestPayment && !isTrialFlag(latestPayment.is_trial)) {
      return true;
    }
    // If not in active trial
    if (!userIsTrial || !hasTargetPlan) {
      return true;
    }
  }

  return false;
}



