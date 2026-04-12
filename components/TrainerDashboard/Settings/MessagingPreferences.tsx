"use client";

import { useState } from "react";
import SettingsSection from "./SettingsSection";
import Toggle from "./Toggle";

export default function MessagingPreferences() {
  const [enableQuickAction, setEnableQuickAction] = useState(true);
  const [allowScheduled, setAllowScheduled] = useState(true);

  return (
    <SettingsSection title="Messaging Preferences">
      <div className="space-y-6 p-3 md:p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[15px] font-bold text-[#1E293B]">Enable &apos;Send Motivation&apos; quick action</h4>
          <Toggle enabled={enableQuickAction} onChange={setEnableQuickAction} />
        </div>

        <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-6">
          <h4 className="text-[15px] font-bold text-[#1E293B]">Allow scheduled messages</h4>
          <Toggle enabled={allowScheduled} onChange={setAllowScheduled} />
        </div>

        <div className="pt-8 border-t border-[#F1F5F9]">
          <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide block mb-4">Delivery Method</label>
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-5 h-5 border-2 border-[#E2E8F0] rounded flex items-center justify-center bg-[#F0FDFD] transition-colors group-hover:border-[#0D9488]">
                <div className="w-2.5 h-2.5 bg-[#0D9488] rounded-sm" />
              </div>
              <span className="text-[13px] font-medium text-[#1E293B]">In-app Message</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-5 h-5 border-2 border-[#E2E8F0] rounded flex items-center justify-center bg-[#F1F5F9] transition-colors group-hover:border-[#0D9488]">
                {/* Unchecked */}
              </div>
              <span className="text-[13px] font-medium text-[#1E293B]">Push Notification</span>
            </label>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
