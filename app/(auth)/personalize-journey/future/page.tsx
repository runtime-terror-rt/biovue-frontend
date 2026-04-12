"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ArrowRight, Sparkles } from "lucide-react";

/**
 * Future Page - Visualize Your Future
 * Displays the 1-year later transformation image and the slider at the end.
 */
const FutureProjectionPage = () => {
  return (
    <div>
      <div className="absolute top-4 left-6 md:top-6 md:left-10">
        <Link
          href="/personalize-journey/today"
          className="w-10 h-10 border border-[rgba(58,134,255,0.2)] rounded-lg flex items-center justify-center hover:bg-white/50 transition-all bg-white shadow-sm"
        >
          <ChevronLeft size={24} className="text-[#041228]" />
        </Link>
      </div>

      <div className="relative bg-[#F8FAFB] flex flex-col">
        <div className="flex flex-col items-center py-6 px-4 md:py-10">
          {/* Header Navigation */}
          <div className="w-full max-w-5xl flex items-center justify-center mb-6">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/auth/Simplification.png"
                  alt="BioVue Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <h1 className="text-[#3A86FF] text-xl md:text-2xl font-bold">
                  Visualize Your Future
                </h1>
              </div>
              <p className="text-gray-400 text-sm">
                See what's possible with BioVue
              </p>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="w-full max-w-3xl flex flex-col items-center">
            {/* Image Container - Matching today's aspect ratio */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl mb-8">
              <Image
                src="/images/auth/body2.png"
                alt="Future Body Projection"
                fill
                className="object-cover"
                priority
              />
              {/* 1 Year Later Badge */}
              <div className="absolute top-4 right-4">
                <div className="bg-[#3A86FF] px-6 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                  <Sparkles size={16} className="text-white" />
                  <span className="text-white font-semibold text-sm">
                    1 year later
                  </span>
                </div>
              </div>
            </div>

            {/* Control Section */}
            <div className="w-full max-w-2xl px-4 flex flex-col items-center">
              {/* Slider Labels */}
              <div className="w-full flex justify-between mb-4">
                <Link
                  href="/personalize-journey/today"
                  className="text-gray-600 font-semibold text-sm hover:text-[#3A86FF] transition-colors"
                >
                  Today
                </Link>
                <span className="text-[#3A86FF] font-bold text-sm">
                  1 Year Later
                </span>
              </div>

              {/* Slider Track */}
              <div className="relative w-full h-1 bg-gray-200 rounded-full mb-8">
                {/* Highlighted portion of track */}
                <div className="absolute top-0 left-0 h-full bg-[#3A86FF] rounded-full w-full" />
                {/* Slider Handle (Future Position) */}
                <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-5 h-5 bg-white border-[3px] border-[#3A86FF] rounded-full shadow-md cursor-pointer" />
              </div>

              {/* Quote Text */}
              <p className="text-center text-gray-400 italic text-sm md:text-base max-w-md mb-10">
                "Your personalized projections will show how lifestyle choices
                affect your future self"
              </p>

              {/* Action Button */}
              <Link href="/personalize-journey/onboarding" className="w-full md:w-auto ">
                <button className="w-full md:w-auto min-w-[320px] bg-primary text-white py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 group cursor-pointer">
                  Create My Projection!
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
    </div>
  );
};

export default FutureProjectionPage;
