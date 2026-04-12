"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    title: "Complete Your Profile",
    description:
      "Share your health information, lifestyle habits, and wellness goals with our secure platform",
    icon: (
      <svg className="w-6 h-6 text-[#0FA4A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: "Upload your Photo",
    description:
      "Take or upload and let our AI analyze your current body composition.",
    icon: (
      <svg className="w-6 h-6 text-[#0FA4A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12l2-2m0 0l2 2m-2-2v4" />
      </svg>
    ),
  },
  {
    title: "Get Your Projections",
    description:
      "Receive AI-generated future body projections and personalized health recommendations.",
    icon: (
      <svg className="w-6 h-6 text-[#0FA4A9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const FeatureCard = ({ step, index }: { step: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="feature-card-how relative bg-white p-5 md:p-6 rounded-xl border border-gray-500
      shadow-[0_2px_15px_rgba(0,0,0,0.02)]
      hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]
      transition-all duration-300
      cursor-pointer overflow-hidden h-full flex flex-col border-none"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-50 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-teal-50 transition-colors">
            <div className="scale-75">{step.icon}</div>
          </div>

          <h3 className="text-[#1A1C1E] text-xl font-bold group-hover:text-[#0FA4A9] transition-colors">
            {step.title}
          </h3>
        </div>

        <p className="text-[#5F6F73] text-[15px] leading-relaxed">
          {step.description}
        </p>
      </div>

      <style>{`
        .feature-card-how {
          position: relative;
        }
        .feature-card-how::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 0.75rem; /* Matches rounded-xl */
          padding: 2px;
          background: linear-gradient(
            to bottom right,
            transparent 0%,
            transparent 50%,
            #0FA4A9 100%
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </motion.div>
  );
};

const HowItWorks = () => {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-20 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            style={{
              background: "linear-gradient(270deg, #4F6BFF 0%, #7B3FE4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            How It Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto"
            style={{ color: "#5F6F73" }}
          >
            Three simple steps to transform your health
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          {/* Left Side */}
          <div className="lg:col-span-5 grid grid-cols-1 auto-rows-fr gap-6">
            {steps.map((step, index) => (
              <FeatureCard key={index} step={step} index={index} />
            ))}
          </div>

          {/* Right Side */}
          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-full min-h-[400px] flex items-center justify-center"
            >
              <div className="relative z-10 w-full h-full border border-[#E3ECEB] max-h-[500px] rounded-xl overflow-hidden">
                <Image
                  src="/images/landing/phone.png"
                  alt="Health analysis preview"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;