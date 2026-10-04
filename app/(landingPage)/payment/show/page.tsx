"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, LayoutDashboard, Loader2, Receipt } from "lucide-react";
import { useGetPaymentSummaryQuery } from "@/redux/features/api/paymentApi";
import { useGetCurrentUserQuery } from "@/redux/features/api/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { baseApi } from "@/redux/features/api/baseApi";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  selectCurrentToken,
  selectCurrentUser,
  updateUser,
} from "@/redux/features/slice/authSlice";
import { getDashboardPath, isTrialFlag } from "@/lib/planType";

const PaymentSuccessContent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  const {
    data,
    isLoading,
    isFetching: isFetchingSummary,
    isError,
  } = useGetPaymentSummaryQuery(undefined, { skip: !token });

  const {
    data: userData,
    isLoading: isUserLoading,
    isFetching: isFetchingUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !data?.success,
  });

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  // 1. Invalidate tags once payment is confirmed
  useEffect(() => {
    if (data?.success) {
      console.log("Payment successful, invalidating tags...");
      dispatch(baseApi.util.invalidateTags(["PaymentSummary", "Plans", "Profile", "Projection"]));
    }
  }, [data, dispatch]);

  // 2. Proactively update Redux state with plan info from the payment summary
  // This ensures that even if /user/me is slow or stale, the local state
  // has the plan_id needed to pass ProtectedRoute checks.
  useEffect(() => {
    if (data?.success && currentUser) {
      const planId = data.latest_payment?.plan?.id;
      const planName = data.latest_payment?.plan?.name;
      const planType = data.latest_payment?.plan?.plan_type;
      const paymentAmount = Number(data.latest_payment?.amount || 0);
      const planPrice = Number(data.latest_payment?.plan?.price || 0);
      const pNameLower = String(planName || "").toLowerCase();

      const isPaidPayment =
        !isTrialFlag(data.latest_payment?.is_trial) &&
        !pNameLower.includes("trial") &&
        !pNameLower.includes("free plan") &&
        (paymentAmount > 0 ||
          planPrice > 0 ||
          pNameLower.includes("plus") ||
          pNameLower.includes("premium"));

      const isTrial = isPaidPayment ? 0 : data.latest_payment?.is_trial;
      const targetPlan = isPaidPayment ? null : data.latest_payment?.target_plan;
      const targetPlanId = isPaidPayment ? null : data.latest_payment?.target_plan_id;
      const trialDays = isPaidPayment ? null : data.latest_payment?.trial_days;

      if (planId) {
        console.log("Enriching Redux user with plan info from payment summary:", planId, "isPaid:", isPaidPayment);
        dispatch(
          updateUser({
            plan_id: planId,
            plan_name: planName,
            plan_type: planType,
            is_trial: isTrial,
            target_plan: targetPlan,
            target_plan_id: targetPlanId,
            trial_days: trialDays,
          })
        );
      }
    }
  }, [data, currentUser, dispatch]);

  // 3. Sync full user data once /user/me re-fetches
  useEffect(() => {
    if (userData?.success && data?.success) {
      const freshUser = userData.data?.user || userData.data;
      if (freshUser) {
        const planId = data.latest_payment?.plan?.id || freshUser.plan_id;
        const planName = data.latest_payment?.plan?.name || freshUser.plan_name;
        const planType = data.latest_payment?.plan?.plan_type || freshUser.plan_type;
        const paymentAmount = Number(data.latest_payment?.amount || 0);
        const planPrice = Number(data.latest_payment?.plan?.price || 0);
        const pNameLower = String(planName || "").toLowerCase();

        const isPaidPayment =
          !isTrialFlag(data.latest_payment?.is_trial) &&
          !pNameLower.includes("trial") &&
          !pNameLower.includes("free plan") &&
          (paymentAmount > 0 ||
            planPrice > 0 ||
            pNameLower.includes("plus") ||
            pNameLower.includes("premium"));

        const enrichedUser = {
          ...freshUser,
          plan_id: planId,
          plan_name: planName,
          plan_type: planType,
          is_trial: isPaidPayment ? 0 : (data.latest_payment?.is_trial ?? freshUser.is_trial),
          target_plan: isPaidPayment ? null : (data.latest_payment?.target_plan ?? freshUser.target_plan),
          target_plan_id: isPaidPayment ? null : (data.latest_payment?.target_plan_id ?? freshUser.target_plan_id),
          trial_days: isPaidPayment ? null : (data.latest_payment?.trial_days ?? freshUser.trial_days),
        };

        console.log("Syncing user state with fresh data:", enrichedUser);
        dispatch(updateUser(enrichedUser));
      }
    }
  }, [userData, data, dispatch]);

  const getDashboardUrl = () => getDashboardPath(currentUser);

  const isCanceledParam =
    searchParams.get("canceled") === "true" ||
    searchParams.get("cancel") === "true" ||
    searchParams.get("status") === "cancel" ||
    searchParams.get("status") === "canceled" ||
    searchParams.get("redirect_status") === "failed" ||
    searchParams.get("redirect_status") === "canceled";

  const ACTIVE_STATUSES = ["active", "succeeded", "paid", "complete", "completed"];
  const paymentStatus = (data?.latest_payment?.status ?? "").toLowerCase();
  const isPaymentComplete = Boolean(data?.success && ACTIVE_STATUSES.includes(paymentStatus));

  // If user canceled Stripe checkout, redirect to upgrade page immediately
  useEffect(() => {
    if (isCanceledParam) {
      toast.info("Payment was cancelled. You can choose a plan to upgrade anytime.");
      router.replace("/user-dashboard/upgrade");
    }
  }, [isCanceledParam, router]);

  useEffect(() => {
    if (isCanceledParam) return;

    if (
      !token ||
      isLoading ||
      isUserLoading ||
      isFetchingSummary ||
      isFetchingUser
    ) {
      return;
    }

    if (isPaymentComplete) {
      router.replace(getDashboardPath(currentUser));
    } else if (data && !isPaymentComplete) {
      // Payment did not complete or was not active
      toast.error("Payment could not be completed.");
      router.replace("/user-dashboard/upgrade");
    }
  }, [
    token,
    data,
    currentUser,
    isLoading,
    isUserLoading,
    isFetchingSummary,
    isFetchingUser,
    isPaymentComplete,
    isCanceledParam,
    router,
  ]);

  // We check isFetching as well to ensure we don't show the dashboard button
  // while the state enrichment/syncing is still in progress.
  if (isLoading || isUserLoading || isFetchingSummary || isFetchingUser) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-[#0FA4A9] animate-spin mb-4" />
        <p className="text-[#5F6F73] font-medium animate-pulse">
          {isLoading || isFetchingSummary
            ? "Confirming your transaction..."
            : "Syncing your account..."}
        </p>
      </div>
    );
  }

  if (isError || !data?.success || !data?.latest_payment) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Receipt className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#1F2D2E] mb-2">
          Something went wrong
        </h1>
        <p className="text-[#5F6F73] max-w-md mb-8">
          We couldn&apos;t retrieve your payment details. If you&apos;ve just
          completed a payment, it might take a moment to reflect.
        </p>
        <Link
          href="/user-dashboard/upgrade"
          className="bg-[#0FA4A9] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-md"
        >
          Go to Upgrade
        </Link>
      </div>
    );
  }

  const { latest_payment, user: summaryUser } = data;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans py-10">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-center">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="BioVue Logo"
            width={120}
            height={60}
            className="w-24 md:w-[120px] object-contain"
          />
        </Link>
      </header>

      <main className="container mx-auto px-6  flex flex-col items-center">
        {/* Success Icon & Heading */}
        <div className="text-center mb-10 animate-in fade-in zoom-in duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2D2E] mb-3">
            Subscription Confirmed!
          </h1>
          <p className="text-[#5F6F73] text-lg">
            Thank you,{" "}
            <span className="text-[#1F2D2E] font-semibold">
              {summaryUser?.name || currentUser?.name || "Customer"}
            </span>
            . Your {latest_payment?.plan?.name || "Subscription"} plan is now
            active.
          </p>
        </div>

        {/* Transaction Details Card */}
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#E5E9EA] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 animate-in slide-in-from-bottom-8 duration-700 delay-150">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
            <div>
              <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-1">
                Transaction ID
              </p>
              <p className="text-[#1F2D2E] font-mono text-sm break-all">
                {latest_payment?.transaction_id || "N/A"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-1">
                Status
              </p>
              <span className="bg-[#E6F6F6] text-[#0FA4A9] text-xs font-bold px-3 py-1 rounded-full border border-[#B2E2E3]">
                {(latest_payment?.status || "Active").toUpperCase()}
              </span>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <div className="flex justify-between items-center px-4 py-5 bg-[#F9FAFB] rounded-2xl border border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
                  <div className="w-3 h-3 rounded-full bg-[#3A86FF]" />
                </div>
                <div>
                  <p className="font-bold text-[#1F2D2E]">
                    {latest_payment?.plan?.name || "Membership"} Plan
                  </p>
                  <p className="text-xs text-[#5F6F73] font-medium">
                    Billed {(latest_payment?.currency || "USD").toUpperCase()}
                  </p>
                </div>
              </div>
              <p className="text-xl font-bold text-[#1F2D2E]">
                ${latest_payment?.amount || "0.00"}
              </p>
            </div>

            <div className="flex justify-between items-center text-sm px-2">
              <span className="text-[#5F6F73] font-medium">Subtotal</span>
              <span className="text-[#1F2D2E] font-semibold">
                ${latest_payment?.amount || "0.00"}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-between items-center px-2">
              <span className="text-base font-bold text-[#1F2D2E]">
                Total Amount Paid
              </span>
              <span className="text-2xl font-black text-[#0FA4A9]">
                ${latest_payment?.amount || "0.00"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={getDashboardUrl()}
              className="flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold  transition-all group"
            >
              <LayoutDashboard
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              Go To Dashboard
            </Link>
            <Link
              href="/user-dashboard/settings"
              className="flex items-center justify-center gap-2 bg-[#E6F6F6] text-[#0FA4A9] py-4 rounded-2xl font-bold hover:bg-[#D9EFEF] transition-all border border-[#B2E2E3]"
            >
              <Home size={20} />
              Back 
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFB]">
          <Loader2 className="w-10 h-10 animate-spin text-[#0FA4A9]" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
