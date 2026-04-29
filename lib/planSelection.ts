import { toast } from "sonner";

type ProcessPaymentFn = (args: any) => Promise<any>;

export async function handlePlanSelection({
  plan,
  token,
  router,
  processPayment,
  setLoadingPlanId,
  billing = "monthly",
}: {
  plan: any;
  token: string | null | undefined;
  router: any;
  processPayment: ProcessPaymentFn;
  setLoadingPlanId?: (id: number | null) => void;
  billing?: string;
}) {
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

  // Free trial / zero price
  if (
    plan.price === "0.00" ||
    plan.price === 0 ||
    (plan.name || "").toLowerCase().includes("free trial")
  ) {
    if (token) {
      router.push("/user-dashboard");
    } else {
      router.push("/login");
    }
    return;
  }

  // Not authenticated -> register with plan
  if (!token) {
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
    const response = await processPayment({ plan_id: plan.id, billing: billingToSend }).unwrap?.() || await processPayment({ plan_id: plan.id, billing: billingToSend });

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
