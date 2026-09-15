"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Crown,
  Diamond,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const UpgradePage = () => {
  const router = useRouter();
  const [view, setView] = useState<"prompt" | "checkout">("prompt");
  const [selectedPlan, setSelectedPlan] = useState<"Plus" | "Premium">("Plus");
  const [billingCycle, setBillingCycle] = useState<"Monthly" | "Annual">(
    "Monthly",
  );

  const handleUpgrade = (plan: "Plus" | "Premium") => {
    // Navigate to settings instead of internal checkout
    router.push("/user-dashboard/settings?tab=subscription");
  };

  if (view === "prompt") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[96vh] p-6">
        <div className="bg-white rounded-[16px] p-10 max-w-lg w-full shadow-sm border border-[#3A86FF]/25 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#0FA4A9]/10 rounded-xl flex items-center justify-center mb-6">
            <Crown size={32} className="text-[#0FA4A9]" />
          </div>

          <h2 className="text-2xl font-bold text-[#1F2D2E] mb-4">
            Upgrade to connect
          </h2>

          <p className="text-[#5F6F73] mb-10 leading-relaxed">
            Connecting with a coach requires a Plus or Premium plan. Get
            personalized guidance tailored to your data.
          </p>

          <div className="flex flex-col gap-4 w-full">
            <button
              onClick={() => handleUpgrade("Plus")}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0d8d91] transition-all group cursor-pointer"
            >
              Upgrade to Plus
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={() => handleUpgrade("Premium")}
              className="w-full bg-white text-[#1F2D2E] py-4 rounded-xl font-bold border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <Diamond size={18} className="text-primary" />
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 container mx-auto pb-20">
      {/* Back Button */}
      <div className="flex items-center">
        <Link
          href="/user-dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#3A86FF]/30 rounded-lg text-[#3A86FF] text-sm font-medium hover:bg-[#3A86FF]/5 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-extrabold text-[#041228] uppercase">
          YOU&apos;RE UPGRADING TO: {selectedPlan}
        </h1>
        <span className="bg-[#3A86FF] text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
          PRO TIER
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Checkout Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[16px] p-8 border border-[#3A86FF]/25 shadow-sm space-y-8">
            {/* Billing Cycle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#041228]">
                  Choose billing cycle
                </h3>
                <p className="text-[#5F6F73] text-sm md:text-base">
                  Select the plan that works for your long-term goals.
                </p>
              </div>

              <div className="flex p-1 bg-[#F8FAFF] border border-gray-200 rounded-xl w-fit">
                <button
                  onClick={() => setBillingCycle("Monthly")}
                  className={cn(
                    "px-6 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer",
                    billingCycle === "Monthly"
                      ? "bg-[#3A86FF] text-white shadow-md shadow-[#3A86FF]/20"
                      : "text-gray-500 hover:text-[#041228]",
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("Annual")}
                  className={cn(
                    "px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer",
                    billingCycle === "Annual"
                      ? "bg-[#3A86FF] text-white shadow-md shadow-[#3A86FF]/20"
                      : "text-gray-500 hover:text-[#041228]",
                  )}
                >
                  Annual
                  <span className="bg-[#FFF8E6] text-[#D97706] text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                    SAVE 10%
                  </span>
                </button>
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            <div className="space-y-6">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                BILLING DETAILS
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#041228]">
                    Name of card
                  </label>
                  <input
                    type="text"
                    placeholder="Name of card"
                    className="w-full bg-[#F8FAFF] border border-gray-200 rounded-xl py-4 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-[#3A86FF]/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#041228]">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-[#F8FAFF] border border-gray-200 rounded-xl py-4 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-[#3A86FF]/50"
                    />
                    <CreditCard
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#041228]">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-[#F8FAFF] border border-gray-200 rounded-xl py-4 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-[#3A86FF]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#041228]">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full bg-[#F8FAFF] border border-gray-200 rounded-xl py-4 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-[#3A86FF]/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
              <div>
                <p className="text-xs font-extrabold text-[#041228] uppercase tracking-widest mb-1">
                  TOTAL DUE TODAY
                </p>
                <h2 className="text-4xl font-extrabold text-[#041228]">
                  $19.99
                  <span className="text-lg font-medium text-gray-400">
                    /month
                  </span>
                </h2>
              </div>

              <button className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0d8d91] transition-all cursor-pointer">
                <ShieldCheck size={24} />
                Complete Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Features */}
        <div className="bg-white rounded-[16px] p-8 border border-[#3A86FF]/25 shadow-sm flex flex-col h-fit">
          <p className="text-[#3A86FF] font-bold text-sm mb-2">
            Included in {selectedPlan.toLowerCase()}
          </p>
          <h3 className="text-2xl font-bold text-[#041228] mb-6">
            Plan Features
          </h3>

          <div className="space-y-5 flex-1">
            {[
              { label: "Up to 2 AI body projections", included: true },
              {
                label: "AI-generated health suggestions (Limited)",
                included: true,
              },
              { label: "Recommended Business", included: true },
              { label: "Achievement badges", included: true },
              { label: "Progress tracking", included: true },
              { label: '"x"% Improved vs baseline', included: true },
              { label: "Recalculated after every photo", included: true },
              { label: "No device sync", included: false },
              { label: "No downloadable reports", included: false },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {feature.included ? (
                  <div className="w-5 h-5 bg-[#E4EFFF] rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} className="text-[#3A86FF]" />
                  </div>
                ) : (
                  <XCircle size={20} className="text-gray-300 shrink-0" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    feature.included ? "text-[#5F6F73]" : "text-gray-300",
                  )}
                >
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex items-start gap-4">
            <ShieldCheck className="text-[#3A86FF] shrink-0" size={20} />
            <p className="text-[10px] text-gray-400 font-bold leading-tight uppercase tracking-wider">
              SECURE 256-BIT ENCRYPTION. YOUR PAYMENT DATA IS PROTECTED.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
