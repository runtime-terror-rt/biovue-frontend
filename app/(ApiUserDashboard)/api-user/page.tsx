"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Key,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Zap,
  Brain,
  Sparkles,
  Image as ImageIcon,
  Send,
  RefreshCw,
  LogOut,
  User,
  ChevronDown,
  CheckCircle,
  Terminal,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  logout,
  selectCurrentUser,
  updateUser,
} from "@/redux/features/slice/authSlice";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";
import { poppins } from "@/app/font";

// Available AI API Endpoint Details
const API_ENDPOINTS = [
  {
    id: "lifestyle",
    name: "Project Current Lifestyle",
    method: "POST",
    path: "/api/v1/projection-lifestyle",
    description:
      "Analyze manual and smart-device logs to calculate future body mass index, weight, and wellness projections over time.",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_API_KEY",
    },
    body: {
      weight: 180,
      body_fat: 18.5,
      daily_steps: 8000,
      sleep_hours: 7.5,
      water_ounces: 64,
      stress_level: 4,
      workout_duration: 45,
    },
    response: {
      success: true,
      status: "success",
      data: {
        current_bmi: 24.4,
        projected_bmi_30_days: 23.9,
        projected_weight_30_days: 176.3,
        wellness_score_trend: "improving",
        sugested_insights: [
          "Increasing workouts by 10 mins can boost fat loss by 12%",
          "Ensure hydration matches 80oz on training days",
        ],
      },
    },
  },
  {
    id: "future-goal",
    name: "Project Future Goal",
    method: "POST",
    path: "/api/v1/projection/future-goal",
    description:
      "Submit physique targets and image datasets to forecast milestones, body fat changes, and estimated muscular target achievements.",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_API_KEY",
    },
    body: {
      target_weight: 170,
      target_body_fat: 12.0,
      timeline_days: 90,
      activity_level: "active",
    },
    response: {
      success: true,
      status: "success",
      data: {
        achievability: "highly_feasible",
        estimated_weeks: 11,
        macro_recommendations: {
          protein_g: 175,
          carbs_g: 210,
          fats_g: 65,
          total_kcal: 2125,
        },
        milestones: [
          { day: 30, weight: 176.5, body_fat: 15.2 },
          { day: 60, weight: 173.0, body_fat: 13.5 },
          { day: 90, weight: 170.0, body_fat: 12.0 },
        ],
      },
    },
  },
  {
    id: "insights-current",
    name: "Get Current Insights",
    method: "GET",
    path: "/api/v1/insights/current",
    description:
      "Query real-time AI-curated insights, warnings, and priorities based on recent metrics recorded in the user workspace.",
    headers: {
      Authorization: "Bearer YOUR_API_KEY",
    },
    body: null,
    response: {
      success: true,
      status: "success",
      data: {
        insights: [
          {
            category: "nutrition",
            priority: "HIGH",
            insight: "Protein intake is 20g below daily goal.",
            why_this_matters:
              "Optimal protein accelerates muscular lean mass recovery and mitigates metabolic slow down.",
          },
          {
            category: "sleep",
            priority: "MEDIUM",
            insight: "Consistent sleep of 7.2 hours recorded.",
            why_this_matters:
              "Stable sleep stages protect central nervous system functions and hormonal baseline levels.",
          },
        ],
      },
    },
  },
  {
    id: "insights-future",
    name: "Get Future Insights",
    method: "GET",
    path: "/api/v1/insights/future",
    description:
      "Obtain predictive outcomes, habit forecasts, and advanced wellness trend recommendations for the next 90 days.",
    headers: {
      Authorization: "Bearer YOUR_API_KEY",
    },
    body: null,
    response: {
      success: true,
      status: "success",
      data: {
        insights: [
          {
            category: "weight_loss",
            priority: "MEDIUM",
            prediction: "On track to reach goal weight by week 8.",
            recommended_adjustment:
              "Transition to metabolic maintenance pricing plans once body fat reaches 10%.",
          },
        ],
      },
    },
  },
];

export default function ApiUserDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { data: profileResponse } = useGetProfileQuery(currentUser?.id, {
    skip: !currentUser?.id,
  });

  // Component States
  const [apiKey, setApiKey] = useState("");
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0]);
  const [activeTab, setActiveTab] = useState<"curl" | "node" | "python">(
    "curl",
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Playground Sandbox States
  const [sandboxBody, setSandboxBody] = useState("");
  const [sandboxResponse, setSandboxResponse] = useState<any>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  // Generate / Retrieve Mock API Key
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = localStorage.getItem(`bv_key_${currentUser?.id}`);
      if (storedKey) {
        setApiKey(storedKey);
      } else {
        const initialKey = `bv_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
        setApiKey(initialKey);
        localStorage.setItem(`bv_key_${currentUser?.id}`, initialKey);
      }
    }
  }, [currentUser]);

  // Set default body in sandbox on endpoint change
  useEffect(() => {
    if (selectedEndpoint.body) {
      setSandboxBody(JSON.stringify(selectedEndpoint.body, null, 2));
    } else {
      setSandboxBody("");
    }
    setSandboxResponse(null);
  }, [selectedEndpoint]);

  // Handle outside click for Profile Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedToken(true);
    toast.success("API Key copied to clipboard!");
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = `bv_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
    setApiKey(newKey);
    localStorage.setItem(`bv_key_${currentUser?.id}`, newKey);
    toast.success("New API Key generated successfully!");
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Run Sandbox Request simulation
  const handleSendTestRequest = () => {
    setIsRequesting(true);
    setSandboxResponse(null);

    // Simulate network delay
    setTimeout(() => {
      setIsRequesting(false);
      if (selectedEndpoint.method === "POST" && sandboxBody.trim()) {
        try {
          const parsed = JSON.parse(sandboxBody);
          // Return valid response combined with user modifications to make sandbox feel active and alive
          setSandboxResponse({
            ...selectedEndpoint.response,
            sandbox_received: parsed,
            simulated_latency_ms: Math.floor(Math.random() * 120) + 40,
          });
          toast.success("Test request completed successfully!");
        } catch (e) {
          setSandboxResponse({
            error: "Bad Request",
            message: "Invalid JSON body provided in payload.",
          });
          toast.error("Invalid JSON body payload.");
        }
      } else {
        setSandboxResponse({
          ...selectedEndpoint.response,
          simulated_latency_ms: Math.floor(Math.random() * 80) + 30,
        });
        toast.success("Test request completed successfully!");
      }
    }, 1200);
  };

  const displayName =
    profileResponse?.data?.name ||
    currentUser?.name ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "API Partner");

  const planName = currentUser?.plan_name || "API Access Plan";
  const planLimit = currentUser?.projection_limit || 500;

  // Custom interactive Code Snippet generator
  const getCodeSnippet = () => {
    const keyToDisplay = isKeyVisible ? apiKey : "bv_live_••••••••••••••••••••";

    if (activeTab === "curl") {
      if (selectedEndpoint.method === "POST") {
        return `curl -X POST https://api.biovue.ai${selectedEndpoint.path} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${keyToDisplay}" \\
  -d '${JSON.stringify(selectedEndpoint.body || {}, null, 2)}'`;
      }
      return `curl -X GET https://api.biovue.ai${selectedEndpoint.path} \\
  -H "Authorization: Bearer ${keyToDisplay}"`;
    }

    if (activeTab === "node") {
      if (selectedEndpoint.method === "POST") {
        return `const fetch = require('node-fetch');

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${keyToDisplay}'
  },
  body: JSON.stringify(${JSON.stringify(selectedEndpoint.body || {}, null, 2).replace(/\n/g, "\n  ")})
};

fetch('https://api.biovue.ai${selectedEndpoint.path}', options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));`;
      }
      return `const fetch = require('node-fetch');

const options = {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${keyToDisplay}'
  }
};

fetch('https://api.biovue.ai${selectedEndpoint.path}', options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));`;
    }

    if (activeTab === "python") {
      if (selectedEndpoint.method === "POST") {
        return `import requests

url = "https://api.biovue.ai${selectedEndpoint.path}"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${keyToDisplay}"
}

payload = ${JSON.stringify(selectedEndpoint.body || {}, null, 4)
          .replace(/true/g, "True")
          .replace(/false/g, "False")}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;
      }
      return `import requests

url = "https://api.biovue.ai${selectedEndpoint.path}"

headers = {
    "Authorization": "Bearer ${keyToDisplay}"
}

response = requests.get(url, headers=headers)
print(response.json())`;
    }

    return "";
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    toast.success("Code snippet copied to clipboard!");
  };

  return (
    <ProtectedRoute
      allowedRoles={["api-user", "individual", "professional"]}
      allowedProfessions={[null]}
    >
      <div
        className={`min-h-screen bg-[#F8FAFC] text-gray-900 pb-20 ${poppins.className}`}
      >
        {/* Custom Header Navigation */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="BioVue Logo"
              width={110}
              height={50}
              className="object-contain"
              priority
            />
            <span className="hidden sm:inline bg-teal-500/10 text-teal-600 text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border border-teal-500/20">
              Developer Ecosystem
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-950 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              View Pricing plans
            </Link>

            <div className="h-6 w-[1.5px] bg-gray-100 hidden md:block"></div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-full hover:bg-slate-50 border border-slate-100 bg-white transition-all cursor-pointer group shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                  <User size={16} className="text-teal-600" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-gray-800 leading-tight truncate max-w-[120px]">
                    {displayName}
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none">
                    API Owner
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-50 mb-1 bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                        Connected Credentials
                      </p>
                      <p className="text-xs font-bold text-gray-800 truncate">
                        {currentUser?.email}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all cursor-pointer text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className=" px-6 mt-8">
          {/* Top Banner and Overview */}
          <div className="relative overflow-hidden bg-linear-to-r from-gray-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl mb-8">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Active API Token
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Welcome to Your API Terminal
                </h1>
                <p className="text-gray-300 max-w-2xl text-sm sm:text-base leading-relaxed">
                  Query premium body type projections, current insights, and
                  habits milestones programmatically. Access raw model matrices
                  effortlessly.
                </p>
              </div>

              {/* Quick Billing Overview Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-w-[280px] space-y-4 shrink-0 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Current Plan
                    </p>
                    <h3 className="text-xl font-black text-white">
                      {planName}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Active
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>Usage limit (Monthly)</span>
                    <span className="font-bold text-white">
                      128 / {planLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-1000"
                      style={{ width: `${(128 / planLimit) * 100}%` }}
                    />
                  </div>
                </div>

                <Link
                  href="/pricing"
                  className="block text-center text-xs font-black text-teal-400 hover:text-teal-300 transition-colors uppercase tracking-wider"
                >
                  Upgrade Quota & limits &rarr;
                </Link>
              </div>
            </div>

            {/* Backdrop Glow Effects */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl -ml-20 -mb-20"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: API Key Manager & Security (4 Cols) */}
            <div className="lg:col-span-4 space-y-8">
              {/* API Token Panel */}
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
                        onClick={() => setIsKeyVisible(!isKeyVisible)}
                        className="px-2.5 flex items-center justify-center rounded-xl bg-white text-[10px] font-black text-gray-500 hover:text-gray-900 border border-slate-100 transition-all cursor-pointer"
                        title={isKeyVisible ? "Hide Key" : "Show Key"}
                      >
                        {isKeyVisible ? "Hide" : "Show"}
                      </button>
                      <button
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

                  <button
                    onClick={handleRegenerateKey}
                    className="w-full h-12 border-2 border-dashed border-slate-200 hover:border-teal-500 text-slate-500 hover:text-teal-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Regenerate API Token
                  </button>
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

              {/* Developer Links */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Ecosystem Resources
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Full API Reference Docs",
                      url: "#",
                      desc: "OpenAPI / Swagger specifications",
                    },
                    {
                      label: "SDK Client Libraries",
                      url: "#",
                      desc: "Supported clients for Node, Python & Go",
                    },
                    {
                      label: "Webhook Integration",
                      url: "#",
                      desc: "Receive real-time subscription status changes",
                    },
                    {
                      label: "Developer Community",
                      url: "#",
                      desc: "Get support on our Discord channel",
                    },
                  ].map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info("Resource is coming soon!");
                      }}
                      className="group block p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                    >
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-sm font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                          {link.label}
                        </span>
                        <span className="text-xs text-gray-400 group-hover:translate-x-1 transition-transform">
                          &rarr;
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {link.desc}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Endpoint Specifications & Interactive Playground (8 Cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Endpoint Selector Tabs */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    API Interface Explorer
                  </h2>
                  <p className="text-xs text-gray-400 font-semibold mt-1">
                    Select a core route below to inspect parameter structures
                    and documentation.
                  </p>
                </div>

                {/* Grid Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                  {API_ENDPOINTS.map((endpoint) => {
                    const isSelected = selectedEndpoint.id === endpoint.id;
                    const isPost = endpoint.method === "POST";
                    return (
                      <button
                        key={endpoint.id}
                        onClick={() => setSelectedEndpoint(endpoint)}
                        className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white text-gray-900 border border-slate-200/50 shadow-sm"
                            : "hover:bg-white/40 text-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                              isPost
                                ? "bg-blue-50 text-blue-600 border border-blue-100"
                                : "bg-teal-50 text-teal-600 border border-teal-100"
                            }`}
                          >
                            {endpoint.method}
                          </span>
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        </div>
                        <p className="text-xs font-extrabold line-clamp-1 leading-tight">
                          {endpoint.name}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Endpoint Documentation Details */}
                <div className="border-t border-slate-50 pt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 text-xs font-black rounded-lg uppercase border ${
                          selectedEndpoint.method === "POST"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-teal-50 text-teal-600 border-teal-100"
                        }`}
                      >
                        {selectedEndpoint.method}
                      </span>
                      <code className="font-mono text-sm font-extrabold text-slate-800 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                        {selectedEndpoint.path}
                      </code>
                    </div>

                    {/* Copy Route */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://api.biovue.ai${selectedEndpoint.path}`,
                        );
                        toast.success("Endpoint URL copied!");
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest cursor-pointer transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Route URL
                    </button>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {selectedEndpoint.description}
                  </p>
                </div>

                {/* Code Tabs & Snippets */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <div className="flex gap-2">
                      {(["curl", "node", "python"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                            activeTab === tab
                              ? "bg-slate-900 text-white"
                              : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          {tab === "curl"
                            ? "cURL"
                            : tab === "node"
                              ? "Node.js"
                              : "Python"}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleCopySnippet}
                      className="inline-flex items-center gap-1 text-[11px] font-black text-teal-600 hover:underline uppercase tracking-wider cursor-pointer"
                    >
                      Copy Snippet
                    </button>
                  </div>

                  <div className="bg-slate-950 text-slate-200 p-6 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-900 relative shadow-inner">
                    <pre className="whitespace-pre">{getCodeSnippet()}</pre>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE PLAYGROUND SANDBOX */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/5 rounded-xl flex items-center justify-center border border-blue-500/10">
                      <Terminal className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Sandbox Playground
                      </h3>
                      <p className="text-[11px] text-gray-400 font-semibold">
                        Test queries live in a risk-free simulator
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSendTestRequest}
                    disabled={isRequesting}
                    className="h-11 px-5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-600/15 cursor-pointer disabled:opacity-75 transition-all active:scale-95"
                  >
                    {isRequesting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Querying AI Engine...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Test Request
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Parameter Input Panel (only shown if POST) */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Request Body (JSON)
                      </span>
                      {selectedEndpoint.method === "GET" && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          No payload needed for GET
                        </span>
                      )}
                    </div>

                    <textarea
                      disabled={
                        selectedEndpoint.method === "GET" || isRequesting
                      }
                      value={sandboxBody}
                      onChange={(e) => setSandboxBody(e.target.value)}
                      className="w-full h-64 p-4 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-xs text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none disabled:opacity-70"
                    />
                  </div>

                  {/* Right Response Terminal Output Panel */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                      Response Payload (Live Terminal)
                    </span>

                    <div className="h-64 bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto p-5 font-mono text-[11px] leading-relaxed relative flex flex-col justify-between shadow-inner">
                      {/* Code Area */}
                      <div className="flex-1">
                        {isRequesting && (
                          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                            <RefreshCw className="w-8 h-8 animate-spin text-teal-500" />
                            <p className="text-xs font-semibold tracking-wider uppercase animate-pulse">
                              Connecting to BioVue Neural Engine...
                            </p>
                          </div>
                        )}

                        {!isRequesting && !sandboxResponse && (
                          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center px-4 space-y-2">
                            <Terminal className="w-8 h-8 opacity-45" />
                            <p className="font-bold">Terminal Idle</p>
                            <p className="text-[10px] opacity-80 max-w-xs">
                              Click "Send Test Request" above to dispatch the
                              API call and view output logs here.
                            </p>
                          </div>
                        )}

                        {!isRequesting && sandboxResponse && (
                          <pre className="text-teal-400 font-bold">
                            {JSON.stringify(sandboxResponse, null, 2)}
                          </pre>
                        )}
                      </div>

                      {/* Header and status bar inside terminal */}
                      {!isRequesting && sandboxResponse && (
                        <div className="border-t border-slate-800 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                          <span className="flex items-center gap-1.5 text-green-400">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                            HTTP 200 OK
                          </span>
                          <span>
                            {sandboxResponse.simulated_latency_ms || 42}ms
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
