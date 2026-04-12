"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const DownloadSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="download-card relative w-full  bg-white p-8 md:p-16 rounded-xl shadow-[0_2px_40px_rgba(0,0,0,0.02)] border border-gray-100/30"
        >
          <div className="flex flex-col items-center text-center">
            {/* Title */}
            <h2 
              className="font-roboto font-medium tracking-[-2px] mb-12 max-w-6xl text-3xl sm:text-4xl md:text-5xl lg:text-[60px] leading-tight md:leading-[84px]"
              style={{
                textAlign: "center",
                background: "linear-gradient(270deg, #4F6BFF 0%, #7B3FE4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Download BioVue Digital Wellness and take control of your health.
            </h2>

            {/* QR Code */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 bg-white rounded-lg flex items-center justify-center p-2">
              <Image
                src="/images/landing/qr-code.png"
                alt="Scan to Download BioVue"
                width={200}
                height={200}
                priority
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <style>{`
            .download-card {
              position: relative;
            }
            .download-card::before {
              content: '';
              position: absolute;
              inset: 0;
              border-radius: 0.75rem; /* Matches rounded-xl (12px) */
              padding: 2px;
              background: linear-gradient(
                to bottom right,
                transparent 0%,
                transparent 50%,
                #3A86FF 100%
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
      </div>
    </section>
  );
};

export default DownloadSection;
