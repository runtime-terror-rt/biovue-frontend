"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetFaqsQuery } from "@/redux/features/api/adminDashboard/faqApi";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQItemComponent = ({ faq, isOpen, toggle }: { faq: FAQItem; isOpen: boolean; toggle: () => void }) => {
  return (
    <div className="border-b border-gray-100 last:border-0 overflow-hidden">
      <button
        onClick={toggle}
        className="w-full py-6 flex items-center justify-between text-left group gap-4 bg-transparent cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center transition-colors rounded-[4px] bg-[#0FA4A9]/25">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_1089_312" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <path d="M23.5205 0.202637H0.480469V23.2426H23.5205V0.202637Z" fill="white"/>
              </mask>
              <g mask="url(#mask0_1089_312)">
                <path d="M19.9945 10.2329C21.7554 11.4796 22.8809 13.5328 22.881 15.7951C22.881 17.0213 22.5547 18.2128 21.935 19.2591L21.7963 19.4936L21.8685 19.7551L22.5698 22.2919L20.0329 21.5907L19.7713 21.5185L19.537 21.6573C18.4906 22.2769 17.2991 22.6032 16.0729 22.6032C13.8106 22.6031 11.7574 21.4776 10.5107 19.7167C15.4764 19.1494 19.4271 15.1987 19.9945 10.2329Z" fill="#0FA4A9" stroke="#0FA4A9" strokeWidth="1.28"/>
                <path d="M9.27828 0.842773C13.7758 0.842773 17.4354 4.50239 17.4354 8.99996C17.4354 13.4976 13.7758 17.1572 9.27828 17.1572C7.90306 17.1572 6.56297 16.8146 5.36891 16.1616L5.13265 16.0265L4.89828 15.8878L4.63578 15.9609L1.43047 16.8468L2.31735 13.6424L2.39047 13.38L2.25172 13.1456C1.51126 11.8933 1.12109 10.4667 1.12109 8.99996C1.12109 4.50239 4.78071 0.842773 9.27828 0.842773ZM7.96297 14.3878H10.5936V11.7572H7.96297V14.3878ZM9.27828 3.61215C7.43595 3.61215 5.93797 5.11013 5.93797 6.95246V7.59277H8.56859V6.95246C8.56859 6.56149 8.88731 6.24277 9.27828 6.24277C9.66925 6.24277 9.98797 6.56149 9.98797 6.95246C9.98797 7.13049 9.92665 7.29261 9.80984 7.42308L9.75641 7.47653L8.17109 8.92777L7.96297 9.11809V11.6878H10.5936V10.2759L11.532 9.41715C12.2226 8.78547 12.6186 7.88783 12.6186 6.95246C12.6186 5.11013 11.1207 3.61215 9.27828 3.61215Z" fill="#0FA4A9" stroke="#0FA4A9" strokeWidth="1.28"/>
              </g>
            </svg>
          </div>
          <span 
            className="font-roboto transition-colors"
            style={{
              fontSize: "24px",
              fontWeight: 400,
              lineHeight: "28.8px",
              letterSpacing: "-1px",
              color: isOpen ? "#0FA4A9" : "#1F2D2E"
            }}
          >
            {faq.question}
          </span>
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#0FA4A9]' : 'text-[#1A1C1E]'}`}>
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="pb-8 pr-12">
              <p className="text-[#5F6F73] text-[15px] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const { data, isLoading } = useGetFaqsQuery();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = data?.data || [];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column - Header Content */}
          <div className="lg:col-span-5 pt-4">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-roboto font-medium text-4xl sm:text-5xl md:text-6xl lg:text-[64px] leading-tight md:leading-[72px] tracking-[-2px] mb-6"
              style={{
                background: "linear-gradient(270deg, #4F6BFF 0%, #7B3FE4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Your Questions,<br />Answered
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-roboto font-normal text-lg sm:text-xl md:text-2xl leading-relaxed md:leading-[34px] max-w-md"
              style={{
                color: "#5F6F73"
              }}
            >
              Real feedback from people who've used our platform to create, grow, and succeed.
            </motion.p>
          </div>

          {/* Right Column - FAQ List */}
          <div className="lg:col-span-7">
            <div className="flex flex-col">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0FA4A9]"></div>
                </div>
              ) : faqs.length > 0 ? (
                faqs.map((faq: any, index: number) => (
                  <FAQItemComponent 
                    key={index} 
                    faq={faq} 
                    isOpen={openIndex === index}
                    toggle={() => setOpenIndex(openIndex === index ? null : index)}
                  />
                ))
              ) : (
                <div className="py-12 text-center text-gray-500 italic">
                  More FAQs are on the way!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
