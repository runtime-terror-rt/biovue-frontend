"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ArrowRight,
  Camera,
  Image as ImageIcon,
  Check,
  User,
} from "lucide-react";

const PersonalizeJourneyPage = () => {
  return (
    <div>
      {/* Back Button - Top Left */}
      <div className="absolute top-4 left-6 md:top-6 md:left-10">
        <Link
          href="/verify-otp"
          className="w-10 h-10 border border-[rgba(58,134,255,0.2)] rounded-lg flex items-center justify-center hover:bg-white/50 transition-all bg-white shadow-sm"
        >
          <ChevronLeft size={24} className="text-[#041228]" />
        </Link>
      </div>

      <div className="  relative flex flex-col items-center justify-center   overflow-hidden">
        <div className="w-full max-w-xl flex flex-col items-center">
          {/* Logo Container */}

          {/* Main Card */}
          <div className="w-full bg-white rounded-xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.03)] flex flex-col items-center text-center">
            <div className="mb-3 md:mb-5">
              <Image
                src="/images/logo.png"
                alt="BioVue Logo"
                width={120}
                height={50}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-[#98A2B3] text-base md:text-lg font-medium mb-3">
              Let's personalize your journey
            </h1>

            {/* Profile Avatar Placeholder */}
            <div className="relative mb-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#F3F8FF] flex items-center justify-center p-3">
                <div className="w-full h-full rounded-full bg-[#3A86FF] flex items-center justify-center shadow-lg">
                  <User size={50} className="text-white" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Permission Card */}
            <div className="w-full border border-[rgba(58,134,255,0.5)] rounded-xl p-6 md:p-8 mb-10 bg-white">
              <div className="space-y-4">
                {/* Camera Access Item */}
                <div className="flex items-center gap-4 bg-[#F8FAFF] p-4 rounded-xl">
                  <div className="w-14 h-14 rounded-xl bg-[#E8F1FF] flex items-center justify-center text-[#3A86FF]">
                    <Camera size={26} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-[#041228] font-bold text-[15px]">
                      Camera access
                    </h3>
                    <p className="text-[#98A2B3] text-[13px] font-medium">
                      For taking real-time progress photos
                    </p>
                  </div>
                  <div className="text-[#0FA4A9]">
                    <Check size={20} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Photo Gallery Access Item */}
                <div className="flex items-center gap-4 bg-[#F2FAF7] p-4 rounded-xl text-left">
                  <div className="w-14 h-14 rounded-xl bg-[#E6F4F1] flex items-center justify-center text-[#0FA4A9]">
                    <ImageIcon size={26} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#041228] font-bold text-[15px]">
                      Photo gallery access
                    </h3>
                    <p className="text-[#98A2B3] text-[13px] font-medium">
                      For uploading your favorite existing photos
                    </p>
                  </div>
                  <div className="text-[#0FA4A9]">
                    <Check size={20} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[#8C9094] text-[16px] italic font-normal text-center">
                Don't have a photo now? You can skip and add later.
              </p>
            </div>

            {/* Continue Button */}
            <Link href="/personalize-journey/today" className="w-full">
            <button className="w-full bg-[#0FA4A9] text-white py-3  rounded-xl font-bold text-lg hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#0FA4A9]/10 cursor-pointer mb-6">
             
              Continue
              <ArrowRight
                size={22}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            </Link>
            {/* Skip Link */}
            <button className="text-[#98A2B3] text-sm md:text-base font-semibold hover:text-[#041228] transition-colors cursor-pointer">
              Skip All Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizeJourneyPage;
