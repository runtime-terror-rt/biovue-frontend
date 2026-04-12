"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DashboardBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeDot, setActiveDot] = useState(0);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full mb-8 sm:mb-10"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            {/* Banner Image Background */}
            <div className="relative w-full h-[180px] sm:h-[240px] md:h-[280px] lg:h-[320px]">
              <Image
                src="/images/landing/banner.png"
                alt="Summer Wellness Sale 50% Off"
                fill
                className="object-cover object-center"
                priority
              />
              {/* Overlay with content */}
              <div className="absolute inset-0 flex items-center px-6 sm:px-10 md:px-12">
                <div className="flex items-center gap-4 sm:gap-10">
                  <h2
                    style={{
                      color: "#FFF",
                      fontFamily: "'Clash Display', sans-serif",
                      fontStyle: "normal",
                      fontWeight: 600,
                    }}
                    className="drop-shadow-lg text-left text-xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight lg:leading-[42px]"
                  >
                    Summer Wellness Sale: 50% Off
                  </h2>
                  <Link
                    href="/user-dashboard/upgrade"
                    className="inline-flex items-center justify-center bg-white text-[#1A1A1A] text-xs sm:text-sm font-bold px-5 sm:px-8 py-2.5 rounded-full hover:bg-gray-100 transition-all shadow-md whitespace-nowrap active:scale-95 border-none"
                  >
                    Shop Now
                    <ExternalLink size={14} className="ml-2 sm:w-[18px] sm:h-[18px]" />
                  </Link>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/30 cursor-pointer z-10"
                aria-label="Close banner"
              >
                <X size={16} className="sm:w-[20px] sm:h-[20px]" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
                {[0, 1, 2].map((dot) => (
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardBanner;
