"use client";

import React, { useState } from "react";
import { useGetPartnersQuery } from "@/redux/features/api/partnersApi";
import Image from "next/image";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

interface PartnerItem {
  id?: string | number;
  _id?: string | number;
  name?: string;
  company?: string;
  image_url?: string;
  email?: string;
}

const PartnerLogo = ({ partner }: { partner: PartnerItem }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = partner?.image_url?.trim();

  if (!imageUrl || imageError) {
    const fallbackText = partner?.company
      ? partner.company
          .split(" ")
          .filter(Boolean)
          .map((w: string) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : partner?.name
      ? partner.name.slice(0, 2).toUpperCase()
      : null;

    return (
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-[#0fa4a9]/10 text-[#0fa4a9] font-bold text-lg md:text-xl flex items-center justify-center select-none shadow-xs group-hover:bg-[#0fa4a9]/20 transition-colors">
        {fallbackText ? fallbackText : <Building2 className="w-6 h-6 text-[#0fa4a9]" />}
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={partner?.company || partner?.name || "Partner logo"}
      fill
      onError={() => setImageError(true)}
      className="
        object-contain p-2
        grayscale-30 opacity-80
        group-hover:grayscale-0 group-hover:opacity-100
        transition-all duration-500
      "
    />
  );
};

const PartnersSection = () => {
  const { data, isLoading } = useGetPartnersQuery({});
  const [isPaused, setIsPaused] = useState(false);

  const partners = data?.data || [];

  // if (isLoading || !Array.isArray(partners) || partners.length === 0) {
  //   return null;
  // }

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
        
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-linear-to-r from-landing to-transparent z-20 pointer-events-none" />

        <div className="w-full overflow-visible px-10">
          {isLoading ? (
            <div className="text-center text-[#5F6F73] text-lg">
              Loading partners...
            </div>
          ) : !Array.isArray(partners) || partners.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-xl md:text-2xl font-medium text-[#5F6F73]">
                No partners available yet
              </p>
              <p className="text-sm text-[#8aa0a4] mt-2">
                We are currently onboarding new collaborators
              </p>
            </div>
          ) : (
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
                  key={`${partner.id || partner._id || index}-${index}`}
                  whileHover={{
                    scale: 1.06,
                    y: -4,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                  className="
    relative flex flex-col items-center justify-center
    min-w-50 md:min-w-60
    h-35 md:h-40
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
                    <PartnerLogo partner={partner} />
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
                    {partner.company || partner.name}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
