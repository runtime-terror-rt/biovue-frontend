"use client";

import React, { useEffect, useRef, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, Loader2, ArrowRight, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { useGetPaymentSummaryQuery } from "@/redux/features/api/paymentApi";
import { useGetCurrentUserQuery } from "@/redux/features/api/auth/authApi";
import { baseApi } from "@/redux/features/api/baseApi";
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
  const reduxToken = useSelector(selectCurrentToken);

  // Check token from Redux or localStorage directly for reliability after external redirect
  const effectiveToken = useMemo(() => {
    if (reduxToken) return reduxToken;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("token");
        if (stored && stored !== "null" && stored !== "undefined") return stored;
      } catch {
        return null;
      }
    }
    return null;
  }, [reduxToken]);

  // Target dashboard path
  const targetDashboardUrl = useMemo(() => {
    let user = currentUser;
    if (!user && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user");
        if (stored && stored !== "null" && stored !== "undefined") {
          user = JSON.parse(stored);
        }
      } catch {
        // fallback
      }
    }
    const path = getDashboardPath(user);
    return path === "/login" ? "/user-dashboard" : path;
  }, [currentUser]);

  const sessionId = searchParams.get("session_id") || undefined;

  const isCanceledParam =
    searchParams.get("canceled") === "true" ||
    searchParams.get("cancel") === "true" ||
    searchParams.get("status") === "cancel" ||
    searchParams.get("status") === "canceled" ||
    searchParams.get("redirect_status") === "failed" ||
    searchParams.get("redirect_status") === "canceled";

  const { data: paymentSummary, isSuccess: isSummarySuccess } =
    useGetPaymentSummaryQuery(sessionId, {
      skip: !effectiveToken || isCanceledParam,
    });

  const { data: userData } = useGetCurrentUserQuery(undefined, {
    skip: !effectiveToken || isCanceledParam,
  });

  const hasRedirectedRef = useRef(false);
  const hasEnrichedRef = useRef(false);

  // If user canceled Stripe checkout
  useEffect(() => {
    if (isCanceledParam && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      toast.info("Payment was cancelled. You can choose a plan to upgrade anytime.");
      router.replace("/user-dashboard/upgrade");
    }
  }, [isCanceledParam, router]);

  // Invalidate cached state so dashboard gets fresh plan info
  useEffect(() => {
    if (isSummarySuccess) {
      dispatch(
        baseApi.util.invalidateTags([
          "PaymentSummary",
          "Plans",
          "Profile",
          "Projection",
        ])
      );
    }
  }, [isSummarySuccess, dispatch]);

  // Safely enrich Redux user once without triggering re-render infinite loops
  useEffect(() => {
    if (hasEnrichedRef.current) return;

    const payment =
      paymentSummary?.latest_payment ||
      (paymentSummary as any)?.data?.latest_payment;

    if (payment?.plan?.id) {
      hasEnrichedRef.current = true;
      const planId = payment.plan.id;
      const planName = payment.plan.name;
      const planType = payment.plan.plan_type;
      const paymentAmount = Number(payment.amount || 0);
      const planPrice = Number(payment.plan.price || 0);
      const pNameLower = String(planName || "").toLowerCase();

      const isPaidPayment =
        !isTrialFlag(payment.is_trial) &&
        !pNameLower.includes("trial") &&
        !pNameLower.includes("free plan") &&
        (paymentAmount > 0 ||
          planPrice > 0 ||
          pNameLower.includes("plus") ||
          pNameLower.includes("premium"));

      dispatch(
        updateUser({
          plan_id: planId,
          plan_name: planName,
          plan_type: planType,
          is_trial: isPaidPayment ? 0 : payment.is_trial,
          target_plan: isPaidPayment ? null : payment.target_plan,
          target_plan_id: isPaidPayment ? null : payment.target_plan_id,
          trial_days: isPaidPayment ? null : payment.trial_days,
        })
      );
    }
  }, [paymentSummary, dispatch]);

  // Sync user profile once if returned
  useEffect(() => {
    if (userData?.success && userData?.data) {
      const freshUser = userData.data.user || userData.data;
      if (freshUser?.id) {
        dispatch(updateUser(freshUser));
      }
    }
  }, [userData, dispatch]);

  // Redirect to dashboard after brief display to give user a smooth confirmation
  useEffect(() => {
    if (isCanceledParam) return;

    const timer = setTimeout(() => {
      if (!hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        toast.success("Payment successful! Welcome to your updated plan.", {
          id: "payment-success-toast",
        });
        router.replace(targetDashboardUrl);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isCanceledParam, router, targetDashboardUrl]);

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Brand Logo */}
      <div className="mb-8">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="BioVue Logo"
            width={130}
            height={60}
            priority
            className="w-28 md:w-32 object-contain mx-auto"
          />
        </Link>
      </div>

      {/* Confirmation Card */}
      <div className="bg-white rounded-3xl border border-[#E5E9EA] shadow-[0_12px_40px_rgba(15,164,169,0.08)] p-8 md:p-12 max-w-md w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-18 h-18 bg-[#E6F6F6] text-[#0FA4A9] rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-[#0FA4A9] animate-bounce" />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1F2D2E] mb-2 tracking-tight">
          Payment Successful!
        </h1>

        <p className="text-sm md:text-base text-[#5F6F73] mb-8 leading-relaxed">
          Your transaction has been processed. We are redirecting you to your dashboard now...
        </p>

        {/* Loading Spinner & Manual Button */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#0FA4A9]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting...</span>
          </div>

          <Link
            href={targetDashboardUrl}
            onClick={() => {
              hasRedirectedRef.current = true;
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#0FA4A9] hover:bg-[#0c8d92] text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg group mt-2"
          >
            <LayoutDashboard size={16} />
            <span>Go to Dashboard Now</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-[#94A3B8]">
        BioVue Digital Wellness &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFB] gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#0FA4A9]" />
          <p className="text-xs font-semibold text-[#5F6F73]">Loading...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
