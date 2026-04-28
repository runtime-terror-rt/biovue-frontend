"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetActiveAdsQuery } from "@/redux/features/api/activeAds";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";

const DashboardBanner = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { data: adsData } = useGetActiveAdsQuery();
  const [isVisible, setIsVisible] = useState(true);
  const [activeDot, setActiveDot] = useState(0);

  // Only show banner for users on a free plan (no plan_id or plan name contains "free")
  const isFreePlan =
    !currentUser?.plan_id ||
    currentUser?.plan_name?.toLowerCase().includes("free");

  // Filter ads for Free Dashboard placement
  const ads = adsData?.filter(ad => ad.placement.includes("Home Screen Top") || ad.placement.includes("Free Dashboard")) || [];

  // Auto-cycle carousel - resets on manual interaction
  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length, activeDot]);

  const activeAd = ads[activeDot];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDot((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDot((prev) => (prev + 1) % ads.length);
  };

  return (
    <AnimatePresence>
      {isVisible && isFreePlan && (ads.length > 0 || !adsData) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full mb-8 sm:mb-10"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            {/* Banner Image Background */}
            <div className="relative w-full h-[180px] sm:h-[240px] md:h-[280px] lg:h-[320px] overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={activeDot}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeAd?.image || "/images/landing/banner.png"}
                    alt={activeAd?.ads_title || "Summer Wellness Sale 50% Off"}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  {/* Overlay with content - Centered without background */}
                  <div className="absolute inset-0 flex items-center justify-center text-center px-6 sm:px-12 bg-black/20">
                    <div className="flex flex-col items-center gap-5 sm:gap-8 max-w-2xl">
                      <h2
                        style={{
                          color: "#FFF",
                          fontFamily: "'Clash Display', sans-serif",
                          fontStyle: "normal",
                          fontWeight: 700,
                        }}
                        className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] text-center text-2xl sm:text-4xl md:text-5xl lg:text-[48px] leading-tight"
                      >
                        {activeAd?.ads_title || "Summer Wellness Sale: 50% Off"}
                      </h2>
                      <Link
                        href={activeAd?.redirect_url || "/user-dashboard/upgrade"}
                        className="inline-flex items-center justify-center bg-white text-[#1A1A1A] text-xs sm:text-base font-bold px-8 sm:px-10 py-2.5 sm:py-3.5 rounded-full hover:bg-[#F2F4F7] transition-all shadow-xl whitespace-nowrap active:scale-95 border-none"
                      >
                        Shop Now
                        <ExternalLink size={16} className="ml-2 sm:w-[20px] sm:h-[20px]" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/30 cursor-pointer z-10"
                aria-label="Close banner"
              >
                <X size={16} className="sm:w-[20px] sm:h-[20px]" />
              </button>

              {/* Navigation Arrows */}
              {ads.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/30 cursor-pointer z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/30 cursor-pointer z-10"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Dot Indicators */}
              {ads.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
                  {ads.map((_, dot) => (
                    <button
                      key={dot}
                      onClick={() => setActiveDot(dot)}
                      className={`transition-all rounded-full cursor-pointer ${
                        activeDot === dot
                          ? "w-6 h-1.5 sm:w-8 sm:h-2 bg-white"
                          : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50 hover:bg-white/70"
                      }`}
                      aria-label={`Slide ${dot + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardBanner;
