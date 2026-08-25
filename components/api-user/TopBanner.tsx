"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface TopBannerProps {
  displayName: string;
  planName: string;
  externalApiResponse: any;
}

export default function TopBanner({ displayName, planName, externalApiResponse }: TopBannerProps) {
  return (
    <div className="relative overflow-hidden bg-linear-to-r from-gray-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl mb-8">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Developer API Console
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {displayName}
          </h1>
          <p className="text-gray-300 max-w-2xl text-sm sm:text-base leading-relaxed">
            Seamlessly integrate BioVue's advanced body composition and lifestyle projections into your applications. Test endpoints, generate insights, and manage your API limits below.
          </p>
        </div>

        {/* Quick Billing Overview Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-w-[280px] space-y-4 shrink-0 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Current Plan
              </p>
              <h3 className="text-xl font-black text-white">
                {planName}
              </h3>
            </div>
            {externalApiResponse?.data?.is_active ? (
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Active
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Inactive
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300 border-b border-white/10 pb-1.5">
              <span>Projection Limit</span>
              <span className="font-bold text-white">
                {externalApiResponse?.data?.projection_limit || 0}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-300 border-b border-white/10 pb-1.5">
              <span>Insight Limit</span>
              <span className="font-bold text-white">
                {externalApiResponse?.data?.insite_limit || 0}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-300">
              <span>Expires in</span>
              <span className="font-bold text-white">
                {Math.round(externalApiResponse?.data?.expires_in_days || 0)} Days
              </span>
            </div>
          </div>

          <Link
            href="/pricing"
            className="block text-center text-xs font-black text-teal-400 hover:text-teal-300 transition-colors uppercase tracking-wider"
          >
            Upgrade Quota & limits &rarr;
          </Link>
        </div>
      </div>

      {/* Backdrop Glow Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl -ml-20 -mb-20"></div>
    </div>
  );
}
