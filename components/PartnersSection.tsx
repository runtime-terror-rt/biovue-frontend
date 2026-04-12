"use client";

import React, { useState } from "react";
import { useGetPartnersQuery } from "@/redux/features/api/partnersApi";
import Image from "next/image";
import { motion } from "framer-motion";

const PartnersSection = () => {
  const { data, isLoading } = useGetPartnersQuery({});
  const [isPaused, setIsPaused] = useState(false);

  const partners = data?.data || [];

  if (isLoading || !Array.isArray(partners) || partners.length === 0) {
    return null;
  }

  // Duplicate partners for a seamless loop
  const displayPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-24 relative overflow-hidden bg-[#F4FBFA]">
      <div className="container mx-auto px-4 md:px-8 mb-16 md:mb-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          style={{
            background: "linear-gradient(270deg, #4F6BFF 0%, #7B3FE4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Our Partners
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-normal max-w-5xl mx-auto text-[#5F6F73]"
        >
          Collaborating with trusted leaders to provide premium wellness experiences.
        </motion.p>
      </div>

      <div className="relative w-full overflow-hidden flex flex-col items-center justify-center py-4">
        {/* Superior Edge Fade Effects */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-landing to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-landing to-transparent z-20 pointer-events-none" />

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{
              x: isPaused ? undefined : [0, "-33.33%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ width: "max-content" }}
          >
            {displayPartners.map((partner: any, index: number) => (
              <motion.div
                key={`${partner.id}-${index}`}
                whileHover={{ 
                  scale: 1.03,
                  borderColor: "rgba(15, 164, 169, 0.4)",
                  backgroundColor: "#ffffff"
                }}
                className="flex flex-col items-center justify-center  backdrop-blur-sm border border-black/5 rounded-2xl p-4 min-w-[180px] md:min-w-[200px] h-[140px] md:h-[160px] shadow-sm transition-all duration-300 group cursor-pointer"
              >
                <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center">
                  <Image
                    src={partner.image_url}
                    alt={partner.company}
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500 p-2"
                  />
                </div>
                <p className="text-xs font-semibold text-para-text group-hover:text-primary mt-2 transition-colors">
                  {partner.company}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
