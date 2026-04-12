"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
const ProfessionalsSection = () => {
  const router = useRouter();
  return (
    <section
      style={{ backgroundColor: "#F7FBFB" }}
      className="py-24 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* Main Content Box with Custom Corner Borders */}
        <div className="pros-container relative  rounded-xl py-16 px-10 md:py-24 md:px-20 shadow-[0_2px_40px_rgba(0,0,0,0.02)] border-none">
          <style>{`
            .pros-container {
              position: relative;
            }
            .pros-container::before {
              content: '';
              position: absolute;
              inset: 0;
              border-radius: 0.75rem; /* Matches rounded-xl */
              padding: 2px;
              background: linear-gradient(
                135deg,
                #0FA4A9 0%,
                transparent 25%,
                transparent 75%,
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

          <div className="mx-auto text-center">
            {/* Title - Forced to one line on larger screens */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
              style={{
                background: "linear-gradient(270deg, #4F6BFF 0%, #7B3FE4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              For Fitness & Nutrition Professionals
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl font-medium mb-12 text-[#5F6F73]"
            >
              Built for the Experts who drive real-world results
            </motion.p>

            {/* Description Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-[15px] leading-relaxed text-[#5F6F73] mb-12 max-w-4xl mx-auto"
            >
              Power your coaching with AI-driven insights that bring each
              client&apos;s health journey to life. Help clients clearly see
              their progress and connect data-backed insights to the training
              and nutrition strategies you recommend. Track performance and
              habits in real time, adjust programs effortlessly, and personalize
              plans to match individual goals. Strengthen client confidence,
              accountability, and retention with clear, measurable outcomes that
              show results, not guesswork.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <button
                onClick={() => router.push("/register")}
                className="bg-[#0FA4A9] hover:bg-[#0D8E92] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-500/10 group cursor-pointer hover:scale-105 active:scale-95"
              >
                Get Start for Free
                <ArrowRight
                  size={24}
                  className="group-hover:translate-x-1 transition-transform bg-white rounded-full p-1 text-black"
                />
              </button>

              <button
                onClick={() => router.push("/pricing")}
                className="bg-white hover:bg-gray-50 text-[#1A1C1E] px-8 py-4 rounded-xl font-bold border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.04)] transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                View Pricing
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalsSection;
