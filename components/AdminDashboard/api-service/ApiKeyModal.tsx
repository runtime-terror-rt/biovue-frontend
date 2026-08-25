"use client";

import { useState } from "react";
import {
  X,
  Copy,
  Check,
  Activity,
  Zap,
  Calendar,
  Clock,
} from "lucide-react";
import { AdminExternalApiData } from "@/redux/features/api/externalApi";
import { avatarColor, formatDate, initials } from "./utils";

interface ApiKeyModalProps {
  api: AdminExternalApiData | null;
  onClose: () => void;
}

export default function ApiKeyModal({ api, onClose }: ApiKeyModalProps) {
  const [copied, setCopied] = useState(false);

  if (!api) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(api.api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const infoItems = [
    {
      label: "Projection Limit",
      value: api.projection_limit.toLocaleString(),
      icon: Activity,
      iconBg: "bg-blue-500",
      valueCls: "text-blue-600",
      cardBg: "bg-blue-50 border-blue-100",
    },
    {
      label: "Insite Limit",
      value: api.insite_limit.toLocaleString(),
      icon: Zap,
      iconBg: "bg-amber-500",
      valueCls: "text-amber-600",
      cardBg: "bg-amber-50 border-amber-100",
    },
    {
      label: "Start Date",
      value: formatDate(api.start_date),
      icon: Calendar,
      iconBg: "bg-violet-500",
      valueCls: "text-violet-600",
      cardBg: "bg-violet-50 border-violet-100",
    },
    {
      label: "Expires In",
      value: `${Math.ceil(api.expires_in_days)} days`,
      icon: Clock,
      iconBg: "bg-orange-500",
      valueCls: "text-orange-600",
      cardBg: "bg-orange-50 border-orange-100",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Modal — spring scale-in */}
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.92) translateY(12px); }
            to   { opacity: 1; transform: scale(1)   translateY(0); }
          }
        `}</style>

        {/* ── Header gradient ── */}
        <div className="relative bg-gradient-to-br from-[#0FA4A9] via-[#0d8f94] to-[#0b7a7e] px-8 pt-8 pb-14 text-white">
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-black/10 blur-xl" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl bg-white/15 border border-white/20 hover:bg-white/25 transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="relative z-10 flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColor(
                api.user.id
              )} flex items-center justify-center text-white font-extrabold text-lg shadow-xl ring-2 ring-white/30`}
            >
              {initials(api.user.name)}
            </div>
            <div>
              <p className="text-xs text-teal-100/80 font-medium tracking-wide uppercase">
                API Key for
              </p>
              <h3 className="text-xl font-extrabold mt-0.5">{api.user.name}</h3>
              <p className="text-xs text-teal-100/80 mt-0.5">{api.user.email}</p>
            </div>
          </div>
        </div>

        {/* ── Terminal key card ── */}
        <div className="px-7 -mt-7 relative z-10">
          <div className="bg-gray-950 rounded-2xl border border-gray-800/80 shadow-2xl overflow-hidden">
            {/* macOS traffic lights */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-800/60 bg-gray-900">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs text-gray-500 font-mono">API_KEY</span>
            </div>
            <div className="px-4 py-4 flex items-start gap-3">
              <code className="flex-1 text-xs text-emerald-400 font-mono break-all leading-relaxed tracking-wide">
                {api.api_key}
              </code>
              <button
                onClick={handleCopy}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:border-gray-600"
                }`}
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5" /> Copied!</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Info grid ── */}
        <div className="px-7 py-5 grid grid-cols-2 gap-3">
          {infoItems.map(({ label, value, icon: Icon, iconBg, valueCls, cardBg }) => (
            <div
              key={label}
              className={`${cardBg} border rounded-2xl px-4 py-3.5 flex items-center gap-3`}
            >
              <div
                className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0 shadow-sm`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className={`text-sm font-bold ${valueCls}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Divider + Footer ── */}
        <div className="mx-7 border-t border-gray-100" />
        <div className="px-7 py-4 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              api.is_active
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                api.is_active ? "bg-emerald-500 animate-pulse" : "bg-red-400"
              }`}
            />
            {api.is_active ? "Active" : "Inactive"}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
