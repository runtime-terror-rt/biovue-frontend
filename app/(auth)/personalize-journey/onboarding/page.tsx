"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";

/**
 * Onboarding Intro Page - Complete Your Profile
 * Final step after visualization before actual onboarding flow starts.
 */
const OnboardingIntroPage = () => {
  return (
   
    <div>

       <div className="absolute top-4 left-6 md:top-6 md:left-10">
        <Link
          href="/personalize-journey/onboarding/steps"
          className="w-10 h-10 border border-[rgba(58,134,255,0.2)] rounded-lg flex items-center justify-center hover:bg-white/50 transition-all bg-white shadow-sm"
        >
          <ChevronLeft size={24} className="text-[#041228]" />
        </Link>
      </div>
         <div className=" bg-[#F8FAFB] flex flex-col items-center justify-center relative px-4">
      {/* Back Button - Top Left */}
     

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo Container */}
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
            Complete Your Profile
          </h1>
          <p className="text-gray-400 text-sm md:text-base mb-10 leading-relaxed font-medium">
            Please complete your health profile to access your personalized dashboard
          </p>

          {/* Action Button */}
          <Link href="/user-dashboard" className="w-full">
            <button className="w-full bg-primary text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 group cursor-pointer">
                Go to Dashboard
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
    </div>
    
   
  );
};

export default OnboardingIntroPage;
