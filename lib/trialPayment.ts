import { toast } from "sonner";
import { getDashboardPath, hasPaidPlan } from "@/lib/planType";

const PENDING_TRIAL_KEY = "biovue_pending_trial";

export type PendingTrial = {
  plan_id: number;
  billing: string;
  target_plan_id: number;
  is_trial: true;
};

type ProcessPaymentFn = (args: PendingTrial) => {
  unwrap: () => Promise<any>;
};

export function savePendingTrial(payload: PendingTrial) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_TRIAL_KEY, JSON.stringify(payload));
}

export function getPendingTrial(): PendingTrial | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_TRIAL_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingTrial;
  } catch {
    return null;
  }
}

export function clearPendingTrial() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_TRIAL_KEY);
}

export async function startTrialCheckout({
  processPayment,
  payload,
  token,
  user,
  router,
}: {
  processPayment: ProcessPaymentFn;
  payload: PendingTrial;
  token?: string | null;
  user?: any;
  router: any;
}): Promise<boolean> {
  if (hasPaidPlan(user)) {
    clearPendingTrial();
    toast.error(
      "You already have an active paid plan (Plus/Premium) and cannot take the free trial.",
    );
    return false;
  }

  if (!token) {
    savePendingTrial(payload);
    toast.info("Please log in to start your free trial.");
    router.push("/login");
    return false;
  }

  try {
    const response = await processPayment(payload).unwrap();

    if (response?.checkout_url) {
      if (response?.message) {
        toast.info(response.message);
      }
      window.location.href = response.checkout_url;
      return true;
    }

    if (response?.success) {
      clearPendingTrial();
      toast.success(
        response?.message || "Free trial activated successfully.",
      );
      if (typeof window !== "undefined") {
        window.location.href = getDashboardPath(user);
      } else {
        router.push(getDashboardPath(user));
      }
      return true;
    }

    toast.error(
      response?.message || "Failed to start free trial. Please try again.",
    );
    return false;
  } catch (error: any) {
    toast.error(
      error?.data?.message ||
        error?.message ||
        "An error occurred while starting your trial.",
    );
    return false;
  }
}

export async function resumePendingTrial({
  processPayment,
  token,
  user,
  router,
}: {
  processPayment: ProcessPaymentFn;
  token?: string | null;
  user?: any;
  router: any;
}): Promise<boolean> {
  const pending = getPendingTrial();
  if (!pending || !token) return false;
  clearPendingTrial();
  return startTrialCheckout({
    processPayment,
    payload: pending,
    token,
    user,
    router,
  });
}
