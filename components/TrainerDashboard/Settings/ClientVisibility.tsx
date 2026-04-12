"use client";

import { useState } from "react";
import SettingsSection from "./SettingsSection";
import Toggle from "./Toggle";
import { visibilityOptions } from "./SettingsData";



export default function ClientVisibility() {
  const [options, setOptions] = useState(visibilityOptions);

  const handleToggle = (id: string) => {
    setOptions(prev => prev.map(opt => opt.id === id ? { ...opt, enabled: !opt.enabled } : opt));
  };

  return (
    <SettingsSection title="Default Client Visibility">
      <div className="space-y-6 p-3 md:p-6">
        {options.map((option, index) => (
          <div key={option.id} className={`flex items-center justify-between ${index !== 0 ? "border-t border-[#F1F5F9] pt-6" : ""}`}>
            <h4 className="text-[15px] font-bold text-[#1E293B]">{option.label}</h4>
            <Toggle enabled={option.enabled} onChange={() => handleToggle(option.id)} />
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}
