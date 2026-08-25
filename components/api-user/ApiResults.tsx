"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Image as ImageIcon, Sparkles } from "lucide-react";

interface ApiResultsProps {
  activeApiTab: string;
  responseImages: { current: string; future: string } | null;
  insightsResponse: any;
  futureInsightsResponse: any;
}

export default function ApiResults({
  activeApiTab,
  responseImages,
  insightsResponse,
  futureInsightsResponse,
}: ApiResultsProps) {
  return (
    <>
      {/* Results Section for Combined API */}
      <AnimatePresence>
        {activeApiTab === "combined" && responseImages && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 40 }}
            className="border-t border-gray-100 pt-8"
          >
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon className="text-teal-500" />
              Projection Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="bg-slate-100 rounded-2xl aspect-[3/4] relative overflow-hidden shadow-inner border border-slate-200">
                  <Image src={responseImages.current} alt="Current Projection" fill className="object-cover" />
                </div>
                <p className="text-center font-bold text-gray-700">Current Lifestyle Projection</p>
              </div>
              <div className="space-y-3">
                <div className="bg-slate-100 rounded-2xl aspect-[3/4] relative overflow-hidden shadow-inner border border-slate-200">
                  <Image src={responseImages.future} alt="Future Goal Projection" fill className="object-cover" />
                  <div className="absolute top-4 right-4 bg-teal-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                      Goal Achieved
                  </div>
                </div>
                <p className="text-center font-bold text-gray-700">Future Goal Projection</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section for Insights APIs */}
      <AnimatePresence>
        {(activeApiTab === "insights" && insightsResponse) || (activeApiTab === "future_insights" && futureInsightsResponse) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 pt-12 border-t border-gray-100"
          >
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="text-teal-500" />
              {activeApiTab === "future_insights" ? "Future Insights Results" : "Current Insights Results"}
            </h3>
            <div className="bg-slate-900 rounded-2xl p-6 overflow-x-auto shadow-inner border border-slate-800">
              <pre className="text-teal-400 font-mono text-sm">
                {JSON.stringify(activeApiTab === "future_insights" ? futureInsightsResponse : insightsResponse, null, 2)}
              </pre>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
