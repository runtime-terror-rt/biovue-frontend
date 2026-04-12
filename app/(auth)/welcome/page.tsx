"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

const WelcomeContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your-email@example.com";

  return (
    <div>
      {/* Back Button */}
      <div className="absolute top-4 left-6 md:top-6 md:left-10">
        <Link
          href="/login"
          className="w-10 h-10 border border-[rgba(58,134,255,0.2)] rounded-lg flex items-center justify-center hover:bg-white/50 transition-all bg-white shadow-sm"
        >
          <ChevronLeft size={24} className="text-[#041228]" />
        </Link>
      </div>

      <div className="bg-[#F8FAFB] flex flex-col items-center justify-center relative px-4 min-h-screen">
        <div className="w-full max-w-md flex flex-col items-center">
          
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/images/logo.png"
              alt="BioVue Logo"
              width={150}
              height={60}
              className="object-contain"
            />
          </div>

          {/* Main Card */}
          <div className="w-full bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center text-center">
            
            <h1 className="text-[#041228] text-xl md:text-2xl font-bold mb-4">
              Welcome to BioVue!
            </h1>

            <p className="text-gray-400 text-sm md:text-base mb-4 leading-relaxed font-medium">
              Your individual account has been successfully created. We've sent a verification link to
            </p>

            <p className="text-[#041228] font-bold mb-10">
              {email}
            </p>

            {/* Action Button */}
            <Link href="/personalize-journey/onboarding/steps" className="w-full">
              <button className="w-full bg-primary text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 group cursor-pointer">
                Start Onboarding
                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F8FAFB]">Loading...</div>}>
      <WelcomeContent />
    </Suspense>
  );
}