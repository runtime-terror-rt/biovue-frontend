"use client";
import React from "react";
import { motion } from "framer-motion";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
}

const features: Feature[] = [
  {
    title: "AI Photo Analysis",
    description:
      "Upload your photo and let AI analyze your current body composition and health markers.",
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    iconBg: "bg-blue-100",
  },
  {
    title: "Future Projections",
    description:
      "See AI-generated images of your future body based on lifestyle choices.",
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    iconBg: "bg-purple-100",
  },
  {
    title: "Health Insights",
    description:
      "Get personalized recommendations based on your health profile, lifestyle, and goals.",
    icon: (
      <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    iconBg: "bg-teal-100",
  },
  {
    title: "Smart Analytics",
    description:
      "Track your progress with detailed charts and metrics that adapt to your journey.",
    icon: (
      <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    iconBg: "bg-pink-100",
  },
  {
    title: "Risk Assessment",
    description:
      "Understand potential health risks and get evidence-based guidance to mitigate them.",
    icon: (
      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    iconBg: "bg-orange-100",
  },
  {
    title: "Instant Results",
    description:
      "Get immediate feedback and projections powered by advanced AI technology.",
    icon: (
      <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    iconBg: "bg-cyan-100",
  },
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="feature-card bg-white p-8 rounded-xl  transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] space-y-10"
    >
      <div
        className={`${feature.iconBg} w-12 h-12 rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-300 `}
      >
        {feature.icon}
      </div>
      <h3 className="text-gray-800 text-xl font-bold mb-3">{feature.title}</h3>
      <p className="text-gray-500 text-[15px] leading-relaxed">{feature.description}</p>

      <style>{`
        .feature-card {
          border: none;
          position: relative;
        }
        .feature-card::before {
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

const FeaturesSection = () => {
  return (
    <section
      className="py-24 min-h-screen bg-[#F4FBFA]"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-5xl md:text-6xl font-semibold leading-tight mb-6"
            style={{
              background: "linear-gradient(270deg, #4F6BFF 0%, #7B3FE4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center text-xl md:text-2xl font-normal max-w-2xl mx-auto" 
            style={{ color: "#5F6F73" }}
          >
            Everything you need to transform your health journey
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
