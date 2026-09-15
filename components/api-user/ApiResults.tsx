"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Code, Copy, Check, FileText, Sparkles, Terminal } from "lucide-react";
import { toast } from "sonner";
import { getActiveFieldsForTab } from "./ApiForm";
import { ApiTab } from "./ApiTabs";

interface ApiResultsProps {
  testedPayload: any | null;
  activeApiTab: ApiTab;
}

export default function ApiResults({ testedPayload, activeApiTab }: ApiResultsProps) {
  const [copiedKV, setCopiedKV] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"keyvalue" | "json" | "schema" | "response">("keyvalue");

  if (!testedPayload) {
    return (
      <div className="mt-6 sm:mt-8 p-6 sm:p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
        <Code className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 mx-auto mb-3" />
        <h4 className="text-xs sm:text-sm font-bold text-slate-700">Key=Value Payload Inspector Ready</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Input your field values above and click <span className="font-semibold text-teal-600">"Test & Preview Payload (Key=Value Format)"</span> to inspect the formatted output.
        </p>
      </div>
    );
  }

  const activeFields = getActiveFieldsForTab(activeApiTab);

  // Construct unquoted Key=Value formatted output string matching active tab fields
  const kvLines = activeFields.map((field) => {
    const rawVal = testedPayload.json_payload[field.key];
    const displayVal = rawVal !== undefined && rawVal !== null ? String(rawVal) : "";
    return `${field.label}=${displayVal}`;
  });
  const formattedKVString = kvLines.join("\n");

  const handleCopyKV = () => {
    navigator.clipboard.writeText(formattedKVString);
    setCopiedKV(true);
    toast.success("Key=Value payload copied to clipboard!");
    setTimeout(() => setCopiedKV(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(testedPayload.json_payload, null, 2));
    setCopiedJson(true);
    toast.success("JSON Payload copied!");
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(testedPayload.demo_response, null, 2));
    setCopiedResponse(true);
    toast.success("Demo Response JSON copied!");
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 sm:mt-8 border-t border-gray-100 pt-6 sm:pt-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-teal-500 w-5 h-5 shrink-0" />
            Tested Output Preview ({activeFields.length} Fields)
          </h3>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveSubTab("keyvalue")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono whitespace-nowrap shrink-0 ${
                activeSubTab === "keyvalue"
                  ? "bg-white text-teal-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Key=Value Format
            </button>
            <button
              onClick={() => setActiveSubTab("json")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono whitespace-nowrap shrink-0 ${
                activeSubTab === "json"
                  ? "bg-white text-teal-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              JSON Format
            </button>
            <button
              onClick={() => setActiveSubTab("schema")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === "schema"
                  ? "bg-white text-teal-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Field Schema ({activeFields.length})
            </button>
            <button
              onClick={() => setActiveSubTab("response")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === "response"
                  ? "bg-white text-teal-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Demo API Response
            </button>
          </div>
        </div>

        {/* Sub-tab 1: Key=Value Format */}
        {activeSubTab === "keyvalue" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-900 text-slate-300 px-4 sm:px-5 py-3 rounded-t-2xl border-b border-slate-800">
              <span className="text-xs font-mono font-bold flex items-center gap-2 text-teal-400">
                <Terminal className="w-4 h-4 shrink-0" />
                Key=Value Test Output ({activeFields.length} Fields)
              </span>
              <button
                onClick={handleCopyKV}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer self-end sm:self-auto"
              >
                {copiedKV ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKV ? "Copied!" : "Copy Key=Value Payload"}
              </button>
            </div>
            <div className="bg-slate-950 rounded-b-2xl p-4 sm:p-6 overflow-x-auto border border-slate-900 shadow-2xl">
              <pre className="text-teal-300 font-mono text-xs leading-relaxed whitespace-pre">
                {formattedKVString}
              </pre>
            </div>
          </div>
        )}

        {/* Sub-tab 2: JSON Format */}
        {activeSubTab === "json" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-900 text-slate-300 px-4 sm:px-5 py-3 rounded-t-2xl border-b border-slate-800">
              <span className="text-xs font-mono font-bold flex items-center gap-2 text-teal-400">
                <Code className="w-4 h-4 shrink-0" />
                JSON Payload Structure
              </span>
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer self-end sm:self-auto"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedJson ? "Copied!" : "Copy JSON"}
              </button>
            </div>
            <div className="bg-slate-950 rounded-b-2xl p-4 sm:p-6 overflow-x-auto border border-slate-900 shadow-2xl">
              <pre className="text-teal-400 font-mono text-xs leading-relaxed whitespace-pre">
                {JSON.stringify(testedPayload.json_payload, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Sub-tab 3: Field Schema */}
        {activeSubTab === "schema" && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Active Specification Schema ({activeFields.length} Fields)
              </h4>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Data Types & Requirements
              </span>
            </div>
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {activeFields.map((field: any, idx: number) => (
                <div key={idx} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="font-mono text-xs font-bold text-slate-900">{field.label}=</span>
                    {field.required ? (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                        Required *
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                        Optional
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-semibold">
                      {field.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-tab 4: Demo API Response */}
        {activeSubTab === "response" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-900 text-slate-300 px-4 sm:px-5 py-3 rounded-t-2xl border-b border-slate-800">
              <span className="text-xs font-mono font-bold flex items-center gap-2 text-emerald-400">
                <FileText className="w-4 h-4 shrink-0" />
                HTTP 200 OK — Demo Response Body
              </span>
              <button
                onClick={handleCopyResponse}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer self-end sm:self-auto"
              >
                {copiedResponse ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedResponse ? "Copied!" : "Copy Response"}
              </button>
            </div>
            <div className="bg-slate-950 rounded-b-2xl p-4 sm:p-6 overflow-x-auto border border-slate-900 shadow-2xl">
              <pre className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre">
                {JSON.stringify(testedPayload.demo_response, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
