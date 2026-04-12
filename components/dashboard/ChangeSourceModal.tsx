"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChangeSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSource: "device" | "manual";
  setDataSource: (source: "device" | "manual") => void;
}

const ChangeSourceModal = ({
  isOpen,
  onClose,
  dataSource,
  setDataSource
}: ChangeSourceModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] w-full max-w-sm shadow-2xl p-6 relative border border-[#3A86FF]/25">
        <h2 className="text-lg font-bold text-[#041228] mb-1">Change Data Source</h2>
        <p className="text-sm text-gray-400 mb-6">Choose how today&apos;s data should be filled</p>

        <div className="space-y-3">
          {/* Option 1: Connected Device */}
          <label className={cn(
            "flex items-start gap-4 p-4 rounded-[16px] border-2 cursor-pointer transition-all",
            dataSource === "device" ? "border-[#3A86FF] bg-[#F0F6FF]" : "border-gray-100 hover:bg-gray-50 bg-white"
          )}>
            <input 
              type="radio" 
              name="source" 
              value="device" 
              checked={dataSource === "device"} 
              onChange={() => setDataSource("device")} 
              className="mt-1 w-4 h-4 accent-[#3A86FF] cursor-pointer" 
            />
            <div>
              <p className="font-bold text-sm text-[#041228]">Use connected devices</p>
              <p className="text-xs text-gray-400 mt-0.5">Choose how today&apos;s data should be filled</p>
            </div>
          </label>

          {/* Option 2: Manual Entry */}
          <label className={cn(
            "flex items-start gap-4 p-4 rounded-[16px] border-2 cursor-pointer transition-all",
            dataSource === "manual" ? "border-[#3A86FF] bg-[#F0F6FF]" : "border-gray-100 hover:bg-gray-50 bg-white"
          )}>
            <input 
              type="radio" 
              name="source" 
              value="manual" 
              checked={dataSource === "manual"} 
              onChange={() => setDataSource("manual")} 
              className="mt-1 w-4 h-4 accent-[#3A86FF] cursor-pointer" 
            />
            <div>
              <p className="font-bold text-sm text-[#041228]">Enter data manually today</p>
              <p className="text-xs text-gray-400 mt-0.5">Manually input your health data for today.</p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          <button 
            onClick={onClose} 
            className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer px-3 py-2"
          >
            Cancel
          </button>
          <button 
            onClick={onClose} 
            className="bg-[#0FA4A9] hover:bg-[#0e9298] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Confirm source
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeSourceModal;
