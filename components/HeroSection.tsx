"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { X, ExternalLink } from "lucide-react";

const DecorationSVG = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="501"
    height="718"
    viewBox="0 0 501 718"
    fill="none"
    className={className}
  >
    <path
      d="M93.8025 -1V82.7579C93.8025 89.0838 98.9307 94.212 105.257 94.212H186.151C192.477 94.212 197.605 99.3401 197.605 105.666V186.56C197.605 192.886 202.733 198.014 209.059 198.014H289.954C296.279 198.014 301.408 203.143 301.408 209.469V290.363C301.408 296.689 306.536 301.817 312.862 301.817H393.756C400.082 301.817 405.21 306.945 405.21 313.271V394.165C405.21 400.491 410.338 405.619 416.664 405.619H500.422M-10 -1V82.7579C-10 89.0838 -4.87184 94.212 1.45407 94.212H82.3485C88.6744 94.212 93.8025 99.3401 93.8025 105.666V186.56C93.8025 192.886 98.9307 198.014 105.257 198.014H186.151C192.477 198.014 197.605 203.143 197.605 209.469V290.363C197.605 296.689 192.477 301.817 186.151 301.817H105.257C98.9307 301.817 93.8025 296.689 93.8025 290.363V208.037L93.7023 207.36C92.9337 202.172 88.5301 198.299 83.2865 198.198L73.7579 198.014H1.45407C-4.87184 198.014 -10 203.143 -10 209.469V290.363C-10 296.689 -4.87184 301.817 1.45407 301.817H83.0643L85.7834 301.998C90.296 302.299 93.8025 306.047 93.8025 310.57V319.356M93.8025 310.408V394.165C93.8025 400.491 98.9307 405.619 105.257 405.619H186.151C192.477 405.619 197.605 410.748 197.605 417.074V497.968C197.605 504.294 202.733 509.422 209.059 509.422H289.954C296.279 509.422 301.408 514.55 301.408 520.876V601.77C301.408 608.096 306.536 613.225 312.862 613.225H393.756C400.082 613.225 405.21 618.353 405.21 624.679V705.573C405.21 711.899 410.338 717.027 416.664 717.027H500.422"
      stroke="url(#paint0_linear_1089_118)"
      strokeOpacity="0.25"
      strokeWidth="1.07382"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1089_118"
        x1="-10"
        y1="-1"
        x2="488.968"
        y2="616.446"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.0819437" stopColor="#F7F7F7" />
        <stop offset="0.208333" stopColor="#12C2E9" />
        <stop offset="0.526042" stopColor="#C471ED" />
        <stop offset="0.9375" stopColor="#F64F59" />
      </linearGradient>
    </defs>
  </svg>
);

const HeroSection = () => {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [activeDot, setActiveDot] = useState(0);

  return (
    <section className="relative flex flex-col items-center justify-center text-center pt-28 sm:pt-32 pb-16 md:pb-24 overflow-hidden min-h-screen bg-white">

      {/* Left Decoration - Desktop Only */}
      <div className="hidden lg:block absolute left-0 top-1/4 -translate-y-1/2 pointer-events-none">
        <DecorationSVG className="opacity-40 xl:opacity-60 w-[350px] xl:w-[500px] h-auto" />
      </div>

      {/* Right Decoration - Desktop Only */}
      <div className="hidden lg:block absolute right-0 top-1/4 -translate-y-1/2 pointer-events-none scale-x-[-1]">
        <DecorationSVG className="opacity-40 xl:opacity-60 w-[350px] xl:w-[500px] h-auto" />
      </div>

      {/* Promotional Banner */}
      {bannerVisible && (
        <div className="container mx-auto px-4 w-full mb-8 sm:mb-10">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Banner Image Background */}
            <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] lg:h-[380px]">
              <Image
                src="/images/landing/banner.png"
                alt="Summer Wellness Sale 50% Off"
                fill
                className="object-cover object-center"
                priority
              />
              {/* Overlay with content */}
              <div className="absolute inset-0 flex items-center px-4 sm:px-8 md:px-10">
                <div className="flex items-center  gap-3 sm:gap-8">
                  <h2
                    style={{
                      color: "#FFF",
                      fontFamily: "'Clash Display', sans-serif",
                      fontStyle: "normal",
                      fontWeight: 600,
                    }}
                    className="drop-shadow-lg text-left text-xl sm:text-3xl md:text-4xl lg:text-[46px] leading-tight lg:leading-[46px]"
                  >
                    Summer Wellness Sale: 50% Off
                  </h2>
                  <Link
                    href="/pricing"
                    style={{ gap: "10px" }}
                    className="inline-flex items-center justify-center bg-white text-[#1A1A1A] text-xs sm:text-sm font-bold px-5 sm:px-6 py-2  rounded-full hover:bg-gray-100 transition-all shadow-md whitespace-nowrap "
                  >
                    Shop Now
                    <ExternalLink size={12} className="sm:w-[16px] sm:h-[16px]" />
                  </Link>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setBannerVisible(false)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/30 cursor-pointer"
                aria-label="Close banner"
              >
                <X size={14} className="sm:w-[16px] sm:h-[16px]" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {[0, 1, 2].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setActiveDot(dot)}
                    className={`transition-all rounded-full cursor-pointer ${
                      activeDot === dot
                        ? "w-5 h-1.5 sm:w-6 sm:h-2 bg-white"
                        : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50"
                    }`}
                    aria-label={`Slide ${dot + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badge */}
      <div className="mb-5 md:mb-8 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white border border-[#E5E9EA] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs md:text-sm font-medium text-main-text">
        <span className="text-[#D9F500]">✦</span>
        AI-Powered Health Transformation
      </div>

      {/* Heading */}
      <h1 className="max-w-5xl font-sans text-3xl sm:text-5xl md:text-7xl lg:text-[96px] leading-tight md:leading-[94px] font-medium text-main-text mb-4 sm:mb-6 tracking-tight px-4">
        See Your Future. <br className="hidden sm:block" />
        <span className="text-[#7C5CFF]">Change Your Path.</span>
      </h1>

      {/* Paragraph */}
      <p className="max-w-2xl md:max-w-5xl text-para-text text-sm sm:text-base md:text-[24px] leading-relaxed font-normal mb-8 md:mb-12 px-4">
        Transform your wellness journey with AI-powered body projections.
        See your future self and get personalized insights to achieve your health goals.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto px-6">
        <Link
          href="/register"
          className="w-full sm:w-auto bg-primary text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-lg hover:bg-opacity-90 transition-all shadow-[0_4px_14px_0_rgba(15,164,169,0.39)] text-center"
        >
          Start your journey
        </Link>
        <Link
          href="/pricing"
          className="w-full sm:w-auto bg-white text-main-text border border-[#E5E9EA] px-6 md:px-10 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
        >
          <span className="text-gray-400">$</span>
          View Pricing
        </Link>
      </div>

      {/* Features */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-8 text-main-text font-medium text-sm md:text-base px-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-[#041228] flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" className="md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          Credit Card Required
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-[#041228] flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" className="md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          Free to Start
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
