import { toast } from "sonner";
import { hasPaidPlan } from "@/lib/planType";

type ProcessPaymentFn = (args: any) => { unwrap: () => Promise<any> };

export async function handlePlanSelection({
  plan,
  token,
  user,
  router,
  processPayment,
  setLoadingPlanId,
  billing = "monthly",
  onFreeTrial,
}: {
  plan: any;
  token: string | null | undefined;
  user?: any;
  router: any;
  processPayment: ProcessPaymentFn;
  setLoadingPlanId?: (id: number | null) => void;
  billing?: string;
  onFreeTrial?: (plan: any) => void;
}) {
  const effectiveToken =
    token ||
    (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  let effectiveUser = user;
  if (!effectiveUser && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "null" && stored !== "undefined") {
        effectiveUser = JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  // Enterprise / Custom
  if (
    plan.name?.toLowerCase().includes("enterprise") ||
    (plan.plan_type === "professional" && (plan.price === "0.00" || plan.price === 0))
  ) {
    window.location.href = `mailto:BioVueSupport@gmail.com?subject=Plan%20Inquiry%20-%20${encodeURIComponent(
      plan.name || "",
    )}`;
    return;
  }

  // Free trial / zero price — pick the plan that bills after 7 days
  if (
    (plan.name || "").toLowerCase().includes("free trial") ||
    (plan.plan_type === "individual" &&
      (plan.price === "0.00" || plan.price === 0))
  ) {
    if (effectiveUser && hasPaidPlan(effectiveUser)) {
      toast.error(
        "You already have an active paid plan (Plus/Premium) and cannot take the free trial.",
      );
      return;
    }
    if (onFreeTrial) {
      onFreeTrial(plan);
      return;
    }
    router.push("/pricing");
    return;
  }

  // Not authenticated -> register with plan
  if (!effectiveToken) {
    router.push(`/register?plan_id=${plan.id}`);
    return;
  }

  // Normalize billing values to match backend expectations (monthly|annual)
  const normalizeBilling = (b: string | undefined | null) => {
    if (!b) return "monthly";
    const val = String(b).toLowerCase();
    if (val.includes("annual") || val.includes("year") || val.includes("yr")) return "annual";
    if (val.includes("half") && val.includes("annual")) return "annual";
    if (val.includes("month") || val.includes("monthly") || val.includes("mo")) return "monthly";
    // fallback to monthly to avoid DB enum truncation
    return "monthly";
  };

  const billingToSend = normalizeBilling(billing);

  // Otherwise initiate payment
  try {
    setLoadingPlanId?.(plan.id);
    const response = await processPayment({ plan_id: plan.id, billing: billingToSend }).unwrap();

    if (response?.success && response?.checkout_url) {
      window.location.href = response.checkout_url;
    } else {
      toast.error("Failed to initiate payment. Please try again.");
    }
  } catch (error: any) {
    console.error("Payment error:", error);
    toast.error(error?.data?.message || "An error occurred while processing payment.");
  } finally {
    setLoadingPlanId?.(null);
  }
}

export default handlePlanSelection;
