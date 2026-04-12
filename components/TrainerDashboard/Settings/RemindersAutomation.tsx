"use client";

import { useState } from "react";
import SettingsSection from "./SettingsSection";
import Toggle from "./Toggle";
import { ChevronDown } from "lucide-react";

export default function RemindersAutomation() {
  const [remindMissed, setRemindMissed] = useState(true);
  const [bulkReminders, setBulkReminders] = useState(true);

  return (
    <SettingsSection title="Reminders & Automation">
      <div className="space-y-6 p-3 md:p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[15px] font-bold text-[#1E293B]">Auto-remind clients on missed check-ins</h4>
          <Toggle enabled={remindMissed} onChange={setRemindMissed} />
        </div>
        
        <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-6">
          <h4 className="text-[15px] font-bold text-[#1E293B]">Allow bulk reminders to multiple clients</h4>
          <Toggle enabled={bulkReminders} onChange={setBulkReminders} />
        </div>

        <div className="pt-6 border-t border-[#F1F5F9]">
          <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide block mb-3">Default Reminder Time</label>
          <div className="relative group">
            <div className="w-full bg-[#F0FDFD] border border-[#CCFBF1] text-[#0D9488] px-5 py-4 rounded-xl text-sm font-medium flex items-center justify-between cursor-pointer group-hover:border-[#0D9488]/50 transition-all">
              <span>Morning (09:00 AM)</span>
              <ChevronDown className="text-[#1E293B]" size={20} />
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
