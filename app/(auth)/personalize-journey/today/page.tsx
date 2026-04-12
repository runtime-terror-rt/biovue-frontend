"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";

/**
 * Today Page - Visualize Your Future
 * Displays the current state image and a slider at the start.
 */
const TodayProjectionPage = () => {
  return (

    <div>

       <div className="absolute top-4 left-6 md:top-6 md:left-10">
        <Link
          href="/personalize-journey"
          className="w-10 h-10 border border-[rgba(58,134,255,0.2)] rounded-lg flex items-center justify-center hover:bg-white/50 transition-all bg-white shadow-sm"
        >
          <ChevronLeft size={24} className="text-[#041228]" />
        </Link>
      </div>

      <div className="relative  bg-[#F8FAFB] flex flex-col">
      {/* Back Button - Top Left (matches PersonalizeJourneyPage) */}
     

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
            <p className="text-gray-400 text-sm">See what's possible with BioVue</p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="w-full max-w-3xl flex flex-col items-center">
          {/* Image Container - Reduced height */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl mb-6">
            <Image
              src="/images/auth/body1.png"
              alt="Current Body Projection"
              fill
              className="object-cover "
              priority
            />
            {/* Today Badge */}
            <div className="absolute top-4 left-4">
              <div className="bg-white/90 backdrop-blur-sm px-5 py-1.5 rounded-full shadow-sm">
                <span className="text-gray-700 font-semibold text-sm">Today</span>
              </div>
            </div>

            
          </div>

          {/* Control Section */}
          <div className="w-full max-w-2xl px-4 flex flex-col items-center">
            {/* Slider Labels */}
            <div className="w-full flex justify-between mb-3">
              <span className="text-[#3A86FF] font-bold text-sm">Today</span>
              <Link href="/personalize-journey/future" className="text-gray-600 font-semibold text-sm hover:text-[#3A86FF] transition-colors">
                1 Year Later
              </Link>
            </div>

            {/* Slider Track */}
            <div className="relative w-full h-1 bg-gray-200 rounded-full mb-6">
              {/* Slider Handle (Today Position) */}
              <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-5 h-5 bg-white border-[3px] border-[#3A86FF] rounded-full shadow-md cursor-pointer" />
            </div>

            {/* Quote Text */}
            <p className="text-center text-gray-400 italic text-sm md:text-base max-w-md mb-8">
              "Your personalized projections will show how lifestyle choices affect your future self"
            </p>

            {/* Action Button */}
            <Link
              href="/personalize-journey/future"
              className="w-full md:w-auto min-w-[320px] bg-primary text-white py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 group"
            >
              Create My Projection!
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default TodayProjectionPage;