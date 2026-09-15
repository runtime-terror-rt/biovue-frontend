"use client";

import React from "react";

export type ApiTab = "combined" | "current" | "future";

interface ApiTabsProps {
  activeApiTab: ApiTab;
  setActiveApiTab: (tab: ApiTab) => void;
}

export default function ApiTabs({ activeApiTab, setActiveApiTab }: ApiTabsProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-6 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto scrollbar-none pb-0.5">
      <button
        onClick={() => setActiveApiTab("combined")}
        className={`text-xs sm:text-sm font-bold pb-3 sm:pb-4 -mb-[1px] border-b-2 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
          activeApiTab === "combined"
            ? "border-teal-500 text-teal-600"
            : "border-transparent text-gray-500 hover:text-gray-900"
        }`}
      >
        Combined Projection API
      </button>
      <button
        onClick={() => setActiveApiTab("current")}
        className={`text-xs sm:text-sm font-bold pb-3 sm:pb-4 -mb-[1px] border-b-2 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
          activeApiTab === "current"
            ? "border-teal-500 text-teal-600"
            : "border-transparent text-gray-500 hover:text-gray-900"
        }`}
      >
        Current Insights API
      </button>
      <button
        onClick={() => setActiveApiTab("future")}
        className={`text-xs sm:text-sm font-bold pb-3 sm:pb-4 -mb-[1px] border-b-2 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
          activeApiTab === "future"
            ? "border-teal-500 text-teal-600"
            : "border-transparent text-gray-500 hover:text-gray-900"
        }`}
      >
        Future Insights API
      </button>
    </div>
  );
}
