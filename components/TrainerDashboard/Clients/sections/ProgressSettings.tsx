"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Settings, Eye } from "lucide-react";
import { useState } from "react";

export default function VisibilityControls() {
  const [settings, setSettings] = useState({
    programGoals: true,
    macrosTargets: true,
    supplementRecommendations: true,
    progressGraphs: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const items = [
    {
      key: "programGoals",
      title: "Program goals",
      description: "Allows client to see set targets",
    },
    {
      key: "macrosTargets",
      title: "Macros & targets",
      description: "Shows granular nutritional goals",
    },
    {
      key: "supplementRecommendations",
      title: "Supplement recommendations",
      description: "Displays personalized stack lists",
    },
    {
      key: "progressGraphs",
      title: "Progress graphs",
      description: "Shows visual comparison lines",
    },
  ];

  return (
    <div className="space-y-4 py-6 rounded-lg bg-white">
      <div className="flex px-6 items-center gap-2 text-[#111827]">
        <Settings size={20} className="text-[#374151]" />
        <h2 className="text-xl font-medium text-[#111827]">Visibility Controls</h2>
      </div>

      <Card className="border-none">
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div 
                key={item.key}
                className="flex items-center justify-between p-4 bg-white border border-[#F3F4F6] rounded-xl"
              >
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#111827]">{item.title}</h4>
                  <p className="text-[10px] text-[#9CA3AF] font-medium leading-tight">{item.description}</p>
                </div>
                <button
                  onClick={() => toggle(item.key as keyof typeof settings)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    settings[item.key as keyof typeof settings] ? "bg-[#0D9488]" : "bg-[#D1D5DB]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings[item.key as keyof typeof settings] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[#0D9488] pt-2">
            <Eye size={16} />
            <span className="text-[11px] font-medium opacity-80 uppercase tracking-tight">Clients only see what you allow.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
