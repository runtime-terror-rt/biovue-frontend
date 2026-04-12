"use client";

import React from "react";
import { useGetPlanQuery } from "@/redux/features/api/adminDashboard/plan";
import {
  CheckCircle2,
  Crown,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Zap,
  Info,
  ArrowRight,
} from "lucide-react";

import Link from "next/link";
import { motion } from "framer-motion";

const MyCurrentPlanPage = () => {
  const { data: plan, isLoading, isError } = useGetPlanQuery(2);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-[#0FA4A9] animate-spin" />
        <p className="text-[#5F6F73] font-medium animate-pulse">
          Fetching your plan details...
        </p>
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-6">
          <Info size={40} />
        </div>
        <h2 className="text-2xl font-bold text-[#1F2D2E] mb-2">
          No Active Plan Found
        </h2>
        <p className="text-[#5F6F73] mb-8 max-w-md">
          It looks like you don&apos;t have an active subscription at the
          moment. Explore our plans to unlock premium features and AI insights.
        </p>
        <Link href="/user-dashboard/upgrade">
          <button className="bg-[#0FA4A9] text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-[#0FA4A9]/20 flex items-center gap-2">
            View Subscription Plans
            <ArrowRight size={18} />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <Link
          href="/user-dashboard/settings"
          className="flex items-center gap-2 text-[#5F6F73] hover:text-[#0FA4A9] transition-colors group"
        >
          <div className="p-2 rounded-lg bg-white border border-gray-100 group-hover:border-[#0FA4A9]/20 transition-all shadow-sm">
            <ArrowLeft size={18} />
          </div>
          <span className="font-semibold text-sm">Settings</span>
        </Link>
        <div className="bg-[#EAFBF7] px-4 py-1.5 rounded-full flex items-center gap-2 border border-[#0FA4A9]/10">
          <div className="w-2 h-2 rounded-full bg-[#0FA4A9] animate-pulse" />
          <span className="text-[10px] font-bold text-[#0FA4A9] uppercase tracking-widest">
            System Operational
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative overflow-hidden bg-white rounded-[24px] border border-[#3A86FF]/10 shadow-xl shadow-blue-500/5">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-[#0FA4A9]/5 to-transparent pointer-events-none" />

          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-linear-to-br from-[#0FA4A9] to-[#3A86FF] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Crown size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#1F2D2E]">
                      {plan.name}
                    </h1>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-emerald-50 border-emerald-200 text-emerald-600">
                      Active
                    </span>
                  </div>
                  <p className="text-[#5F6F73] font-medium">
                    Your current subscription plan
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-4xl font-black text-[#1F2D2E] flex items-baseline gap-1">
                  <span className="text-xl font-bold opacity-60">$</span>
                  {plan.price}
                  <span className="text-sm font-medium text-[#94A3B8]">
                    /{plan.billing_cycle === "yearly" ? "yr" : "mo"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-[#94A3B8] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Zap size={14} className="text-[#0FA4A9]" />
                  Included Features
                </h3>
                <ul className="space-y-4">
                  {plan.features?.map((feature: string, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex items-start gap-3 group"
                    >
                      <div className="mt-0.5 p-1 rounded-full bg-[#EAFBF7] text-[#0FA4A9] group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-sm font-semibold text-[#5F6F73] group-hover:text-[#1F2D2E] transition-colors">
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <div className="bg-[#F8FAFB] rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xs font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#3A86FF]" />
                    Security & Trust
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-bold text-[#5F6F73]">
                      <div className="w-1 h-1 rounded-full bg-blue-400" />
                      HIPAA Compliant Storage
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-[#5F6F73]">
                      <div className="w-1 h-1 rounded-full bg-blue-400" />
                      End-to-End Encryption
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 bg-[#F8FAFB] p-4 rounded-xl border border-gray-100">
          <Info size={16} className="text-[#0FA4A9] shrink-0" />
          <p className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-wider leading-relaxed">
            Subscription changes might take a few minutes to reflect in your
            dashboard. For billing issues, please contact our support team.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MyCurrentPlanPage;
