"use client";

import React from "react";

type ApiTab = "combined" | "insights" | "future_insights";

interface ApiTabsProps {
  activeApiTab: ApiTab;
  setActiveApiTab: (tab: ApiTab) => void;
}

export default function ApiTabs({ activeApiTab, setActiveApiTab }: ApiTabsProps) {
  return (
    <div className="flex items-center gap-6 mb-8 border-b border-gray-200">
      <button
        onClick={() => setActiveApiTab("combined")}
        className={`text-sm font-bold pb-4 -mb-[1px] border-b-2 transition-colors ${
          activeApiTab === "combined"
            ? "border-teal-500 text-teal-600"
            : "border-transparent text-gray-500 hover:text-gray-900"
        }`}
      >
        Combined Projection API
      </button>
      <button
        onClick={() => setActiveApiTab("insights")}
        className={`text-sm font-bold pb-4 -mb-[1px] border-b-2 transition-colors ${
          activeApiTab === "insights"
            ? "border-teal-500 text-teal-600"
            : "border-transparent text-gray-500 hover:text-gray-900"
        }`}
      >
        Current Insights API
      </button>
      <button
        onClick={() => setActiveApiTab("future_insights")}
        className={`text-sm font-bold pb-4 -mb-[1px] border-b-2 transition-colors ${
          activeApiTab === "future_insights"
            ? "border-teal-500 text-teal-600"
            : "border-transparent text-gray-500 hover:text-gray-900"
        }`}
      >
        Future Insights API
      </button>
    </div>
  );
}
