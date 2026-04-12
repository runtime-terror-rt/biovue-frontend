"use client";


import React, { useState } from "react";
import { X, Copy, Check, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiName: string;
  apiKey: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiName,
  apiKey,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API Key copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-teal-500 via-blue-500 to-indigo-500"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-teal-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
              <ShieldCheck className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
              Secure API Key
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Authorized access for{" "}
              <span className="font-bold text-teal-600">{apiName}</span> has
              been granted.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Your Secret Token
              </label>
              <div className="relative group">
                <input
                  readOnly
                  value={apiKey}
                  className="w-full h-16 px-6 pr-16 bg-gray-50 border-2 border-gray-100 rounded-2xl font-mono text-gray-800 focus:outline-none focus:border-teal-500 transition-all text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-3 top-3 bottom-3 px-4 flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 hover:border-teal-500 hover:text-teal-600 transition-all group/btn"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400 group-hover/btn:text-teal-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-[1.5rem] p-5 flex gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <AlertCircle className="w-5 h-5 text-rose-500" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-rose-900 uppercase tracking-wider">
                  Security Warning
                </p>
                <p className="text-[11px] text-rose-700/80 leading-relaxed font-medium">
                  This key provides full access to your subscription. Never
                  share it or store it in plain text.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={onClose}
              className="w-full cursor-pointer h-14 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-xl hover:shadow-gray-900/20 active:scale-[0.98]"
            >
              Close and Secure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
