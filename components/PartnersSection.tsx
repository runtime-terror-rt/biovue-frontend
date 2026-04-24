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

  const displayPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-24 relative overflow-x-hidden overflow-y-visible bg-[#F4FBFA]">
      <div className="container mx-auto px-4 md:px-8 mb-16 md:mb-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          style={{
            background: "linear-gradient(270deg, #0fa4a9 0%, #0d9488 100%)",
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
          Collaborating with trusted leaders to provide premium wellness
          experiences.
        </motion.p>
      </div>

      <div className="relative w-full overflow-visible flex flex-col items-center justify-center py-12">
        {/* Superior Edge Fade Effects */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-landing to-transparent z-20 pointer-events-none" />

        <div className="w-full overflow-visible px-10">
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
                  scale: 1.06,
                  y: -4,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                className="
    relative flex flex-col items-center justify-center
    min-w-[200px] md:min-w-[240px]
    h-[140px] md:h-[160px]
    border border-[#0fa4a9]/40
    rounded-2xl bg-white/50
    overflow-hidden
    transition-transform duration-100
    shadow-sm group-hover:shadow-lg
    group cursor-pointer
  "
              >
                {/* Logo */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center z-10">
                  <Image
                    src={partner.image_url}
                    alt={partner.company}
                    fill
                    className="
        object-contain p-2
        grayscale-[30%] opacity-80
        group-hover:grayscale-0 group-hover:opacity-100
        transition-all duration-500
      "
                  />
                </div>

                {/* Company Name (hidden → slide up) */}
                <p
                  className="
      absolute bottom-2 left-0 w-full
      text-xs md:text-sm font-medium
      text-center text-primary
      opacity-0 translate-y-4
      group-hover:opacity-100 group-hover:translate-y-0
      transition-all duration-500
    "
                >
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
