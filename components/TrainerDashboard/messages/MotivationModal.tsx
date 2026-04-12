"use client";

import { X, Send, Sparkles } from "lucide-react";
import { useState } from "react";

interface MotivationModalProps {
  open: boolean;
  onClose: () => void;
  clientName: string;
  onSend: (message: string) => void;
}

const presets = [
  "Great progress this week - keep going!",
  "Consistency matters more than perfection.",
  "Small daily actions lead to big results.",
];

export default function MotivationModal({
  open,
  onClose,
  clientName,
  onSend,
}: MotivationModalProps) {
  const [selectedPreset, setSelectedPreset] = useState(presets[0]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer right-4 top-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-[#22C55E26] text-[#22C55E] p-3 rounded-lg">
            <Sparkles />
          </div>
          <div>
            <h2 className="text-lg font-medium text-[#111827]">
              Send Motivation
            </h2>
            <p className="text-sm text-[#6B7280]">
              Quickly inspire your active clients
            </p>
          </div>
        </div>

        <hr className="mb-6" />

        {/* Presets */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium text-[#374151] tracking-wide">
            SELECT A PRESET
          </h3>

          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => setSelectedPreset(preset)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                selectedPreset === preset
                  ? "border-[#0D9488] bg-[#0D948814]"
                  : "border-[#E5E7EB] bg-white hover:bg-gray-50"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Selected Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-[#374151] tracking-wide mb-2">
            SELECT A PRESET
          </h3>
          <div className="border border-[#E5E7EB] rounded-xl p-4 text-sm text-[#5F6F73]  min-h-20">
            {selectedPreset}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-5 py-2 cursor-pointer rounded-lg border border-[#E5E7EB] text-sm hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onSend(selectedPreset);
              onClose();
            }}
            className="flex cursor-pointer items-center gap-2 bg-[#0D9488] text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
          >
            <Send className="w-4 h-4 rotate-[-10deg]" />
            Send To {clientName}
          </button>
        </div>
      </div>
    </div>
  );
}
