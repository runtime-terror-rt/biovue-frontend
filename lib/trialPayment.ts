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

  if (hasPaidPlan(effectiveUser)) {
    clearPendingTrial();
    toast.error(
      "You already have an active paid plan (Plus/Premium) and cannot take the free trial.",
    );
    return false;
  }

  if (!effectiveToken) {
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

      const targetPlanId = Number(payload.target_plan_id || payload.plan_id || 1);
      const updatedUser = {
        ...(effectiveUser || {}),
        plan_id: targetPlanId,
        is_trial: 1,
      };

      if (typeof window !== "undefined") {
        try {
          const currentStored = localStorage.getItem("user");
          const parsed = currentStored ? JSON.parse(currentStored) : {};
          localStorage.setItem(
            "user",
            JSON.stringify({ ...parsed, ...updatedUser }),
          );
        } catch {
          // ignore
        }
      }

      let dest = getDashboardPath(updatedUser);
      if (!dest || dest === "/login" || dest.startsWith("/personalize-journey")) {
        const uRole = String(updatedUser?.role || updatedUser?.user_type || "").toLowerCase();
        const pType = String(updatedUser?.profession_type || "").toLowerCase();
        if (uRole === "professional") {
          if (pType === "trainer_coach") dest = "/trainer-dashboard/overview";
          else if (pType === "supplement_supplier") dest = "/supplier-dashboard";
          else if (pType === "nutritionist") dest = "/nutritionist-dashboard/overview";
          else dest = "/trainer-dashboard/overview";
        } else if (uRole === "api") {
          dest = "/api-user";
        } else {
          dest = "/user-dashboard";
        }
      }

      if (typeof window !== "undefined") {
        window.location.href = dest;
      } else {
        router.push(dest);
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
