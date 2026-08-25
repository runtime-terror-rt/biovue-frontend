"use client";

import React from "react";
import { Key, Check, Copy, AlertCircle } from "lucide-react";

interface ApiKeyPanelProps {
  apiKey: string;
  isKeyVisible: boolean;
  setIsKeyVisible: (val: boolean) => void;
  handleCopyKey: () => void;
  copiedToken: boolean;
}

export default function ApiKeyPanel({
  apiKey,
  isKeyVisible,
  setIsKeyVisible,
  handleCopyKey,
  copiedToken,
}: ApiKeyPanelProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-teal-500/5 rounded-2xl flex items-center justify-center border border-teal-500/15">
          <Key className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            API Key Credentials
          </h2>
          <p className="text-xs text-gray-400 font-semibold">
            Your secure auth token
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <input
            type={isKeyVisible ? "text" : "password"}
            readOnly
            value={apiKey}
            className="w-full h-14 px-4 pr-24 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono text-xs text-gray-700 tracking-wider focus:outline-none"
          />
          <div className="absolute right-2 top-2 bottom-2 flex gap-1">
            <button
              type="button"
              onClick={() => setIsKeyVisible(!isKeyVisible)}
              className="px-2.5 flex items-center justify-center rounded-xl bg-white text-[10px] font-black text-gray-500 hover:text-gray-900 border border-slate-100 transition-all cursor-pointer"
              title={isKeyVisible ? "Hide Key" : "Show Key"}
            >
              {isKeyVisible ? "Hide" : "Show"}
            </button>
            <button
              type="button"
              onClick={handleCopyKey}
              className="px-2.5 flex items-center justify-center rounded-xl bg-white hover:text-teal-600 border border-slate-100 transition-all cursor-pointer shadow-sm"
              title="Copy Key"
            >
              {copiedToken ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400 hover:text-teal-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide">
            Security Advisory
          </h4>
          <p className="text-[10px] text-amber-700 leading-relaxed font-semibold">
            This token authenticates database queries under your
            subscription metrics. Keep it protected. Do not expose it
            in public client-side applications.
          </p>
        </div>
      </div>
    </div>
  );
}
