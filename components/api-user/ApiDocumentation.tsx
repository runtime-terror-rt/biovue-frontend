"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Code2,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Zap,
  Globe,
  Server,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface ApiDocumentationProps {
  apiKey: string;
  onSwitchToTester?: () => void;
}

type LangOption = "curl" | "javascript" | "python" | "php";
type EndpointOption = "projection_combined" | "insights_current" | "insights_future" | "balance";

export default function ApiDocumentation({
  apiKey,
  onSwitchToTester,
}: ApiDocumentationProps) {
  const [activeLang, setActiveLang] = useState<LangOption>("curl");
  const [activeEndpoint, setActiveEndpoint] = useState<EndpointOption>("projection_combined");
  const [copiedCode, setCopiedCode] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>("projection");

  const effectiveKey = apiKey || "bv_live_your_api_key_here";
  const baseUrl = "https://biovuedigitalwellness.com/api/v1";
  const aiDirectUrl = "https://ai.biovuedigitalwellness.com/api/v1";

  const handleCopy = (text: string, label: string = "Code") => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getCodeSnippet = (): string => {
    switch (activeEndpoint) {
      case "projection_combined":
        if (activeLang === "curl") {
          return `# 1. Generate Combined AI Body Projection (Current + Future Goal)
curl -X POST "${baseUrl}/external/projection/combined" \\
  -H "X-API-KEY: ${effectiveKey}" \\
  -F "image=@/path/to/client_photo.jpg" \\
  -F "full_name=Alex Smith" \\
  -F "email=alex.smith@example.com" \\
  -F "age=30" \\
  -F "gender=Male" \\
  -F "height_cm=178" \\
  -F "weight_lbs=175" \\
  -F "body_fat_percent=16" \\
  -F "activity_level=Moderate" \\
  -F "weekly_workout_sessions=4" \\
  -F "weekly_avg_daily_steps=8500" \\
  -F "weekly_avg_sleep_hours=7.5" \\
  -F "weekly_avg_water_litres=3.0" \\
  -F "nutrition_quality=8" \\
  -F "alcohol_consumption=Light" \\
  -F "fast_food_frequency=Rarely" \\
  -F "stress_level=Low" \\
  -F "smoking=No" \\
  -F "goal_type=Toned" \\
  -F "goal_description=Build lean athletic physique and core strength" \\
  -F "goal_timeframe=1 year" \\
  -F "resolution=2K"`;
        }
        if (activeLang === "javascript") {
          return `// Node.js / Browser (FormData fetch)
const formData = new FormData();
formData.append("image", fileInput.files[0]); // File or Blob
formData.append("full_name", "Alex Smith");
formData.append("email", "alex.smith@example.com");
formData.append("age", "30");
formData.append("gender", "Male");
formData.append("height_cm", "178");
formData.append("weight_lbs", "175");
formData.append("goal_type", "Toned");
formData.append("goal_description", "Build lean athletic physique");
formData.append("goal_timeframe", "1 year");
formData.append("weekly_workout_sessions", "4");
formData.append("weekly_avg_daily_steps", "8500");
formData.append("weekly_avg_sleep_hours", "7.5");
formData.append("weekly_avg_water_litres", "3.0");
formData.append("nutrition_quality", "8");
formData.append("alcohol_consumption", "Light");
formData.append("fast_food_frequency", "Rarely");
formData.append("stress_level", "Low");
formData.append("smoking", "No");
formData.append("resolution", "2K");

const response = await fetch("${baseUrl}/external/projection/combined", {
  method: "POST",
  headers: {
    "X-API-KEY": "${effectiveKey}",
  },
  body: formData,
});

const result = await response.json();
console.log("Current Lifestyle:", result.current_lifestyle);
console.log("Future Goal Target:", result.future_goal);`;
        }
        if (activeLang === "python") {
          return `import requests

url = "${baseUrl}/external/projection/combined"
headers = {
    "X-API-KEY": "${effectiveKey}"
}

payload = {
    "full_name": "Alex Smith",
    "email": "alex.smith@example.com",
    "age": 30,
    "gender": "Male",
    "height_cm": 178,
    "weight_lbs": 175,
    "body_fat_percent": 16,
    "goal_type": "Toned",
    "goal_description": "Build lean athletic physique",
    "goal_timeframe": "1 year",
    "weekly_workout_sessions": 4,
    "weekly_avg_daily_steps": 8500,
    "weekly_avg_sleep_hours": 7.5,
    "weekly_avg_water_litres": 3.0,
    "nutrition_quality": 8,
    "alcohol_consumption": "Light",
    "fast_food_frequency": "Rarely",
    "stress_level": "Low",
    "smoking": "No",
    "resolution": "2K"
}

files = [
    ("image", ("photo.jpg", open("/path/to/client_photo.jpg", "rb"), "image/jpeg"))
]

response = requests.post(url, headers=headers, data=payload, files=files)
data = response.json()
print("Projections generated:", data.keys())`;
        }
        if (activeLang === "php") {
          return `<?php
// PHP cURL Example
$curl = curl_init();

$fields = [
    'image' => new CURLFile('/path/to/photo.jpg', 'image/jpeg', 'photo.jpg'),
    'full_name' => 'Alex Smith',
    'email' => 'alex.smith@example.com',
    'age' => 30,
    'gender' => 'Male',
    'height_cm' => 178,
    'weight_lbs' => 175,
    'goal_type' => 'Toned',
    'goal_description' => 'Build lean physique',
    'goal_timeframe' => '1 year',
    'weekly_workout_sessions' => 4,
    'weekly_avg_daily_steps' => 8500,
    'weekly_avg_sleep_hours' => 7.5,
    'weekly_avg_water_litres' => 3.0,
    'nutrition_quality' => 8,
    'alcohol_consumption' => 'Light',
    'fast_food_frequency' => 'Rarely',
    'stress_level' => 'Low',
    'smoking' => 'No',
    'resolution' => '2K'
];

curl_setopt_array($curl, [
    CURLOPT_URL => '${baseUrl}/external/projection/combined',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $fields,
    CURLOPT_HTTPHEADER => [
        'X-API-KEY: ${effectiveKey}'
    ],
]);

$response = curl_exec($curl);
curl_close($curl);
$data = json_decode($response, true);
print_r($data);`;
        }
        break;

      case "insights_current":
        if (activeLang === "curl") {
          return `curl -X POST "${baseUrl}/external/insights/current" \\
  -H "X-API-KEY: ${effectiveKey}" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "full_name=Alex Smith" \\
  -d "age=30" \\
  -d "gender=Male" \\
  -d "height_cm=178" \\
  -d "weight_lbs=175" \\
  -d "weekly_workout_sessions=4" \\
  -d "weekly_avg_daily_steps=8500" \\
  -d "weekly_avg_sleep_hours=7.5" \\
  -d "weekly_avg_water_litres=3.0" \\
  -d "nutrition_quality=8" \\
  -d "stress_level=Low" \\
  -d "goal_description=Build lean muscle"`;
        }
        if (activeLang === "javascript") {
          return `const params = new URLSearchParams({
  full_name: "Alex Smith",
  age: "30",
  gender: "Male",
  height_cm: "178",
  weight_lbs: "175",
  weekly_workout_sessions: "4",
  weekly_avg_daily_steps: "8500",
  weekly_avg_sleep_hours: "7.5",
  weekly_avg_water_litres: "3.0",
  nutrition_quality: "8",
  stress_level: "Low",
  goal_description: "Build lean muscle"
});

const res = await fetch("${baseUrl}/external/insights/current", {
  method: "POST",
  headers: {
    "X-API-KEY": "${effectiveKey}",
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: params
});
const insights = await res.json();
console.log(insights);`;
        }
        if (activeLang === "python") {
          return `import requests

res = requests.post(
    "${baseUrl}/external/insights/current",
    headers={"X-API-KEY": "${effectiveKey}"},
    data={
        "full_name": "Alex Smith",
        "age": 30,
        "gender": "Male",
        "height_cm": 178,
        "weight_lbs": 175,
        "weekly_workout_sessions": 4,
        "weekly_avg_daily_steps": 8500,
        "weekly_avg_sleep_hours": 7.5,
        "weekly_avg_water_litres": 3.0,
        "nutrition_quality": 8,
        "stress_level": "Low",
        "goal_description": "Build lean muscle"
    }
)
print(res.json())`;
        }
        if (activeLang === "php") {
          return `<?php
$curl = curl_init();

$fields = [
    'full_name' => 'Alex Smith',
    'age' => 30,
    'gender' => 'Male',
    'height_cm' => 178,
    'weight_lbs' => 175,
    'weekly_workout_sessions' => 4,
    'weekly_avg_daily_steps' => 8500,
    'weekly_avg_sleep_hours' => 7.5,
    'weekly_avg_water_litres' => 3.0,
    'nutrition_quality' => 8,
    'stress_level' => 'Low',
    'goal_description' => 'Build lean muscle'
];

curl_setopt_array($curl, [
    CURLOPT_URL => '${baseUrl}/external/insights/current',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($fields),
    CURLOPT_HTTPHEADER => [
        'X-API-KEY: ${effectiveKey}',
        'Content-Type: application/x-www-form-urlencoded'
    ],
]);

$response = curl_exec($curl);
curl_close($curl);
$data = json_decode($response, true);
print_r($data);`;
        }
        break;

      case "insights_future":
        if (activeLang === "curl") {
          return `curl -X POST "${baseUrl}/external/insights/future" \\
  -H "X-API-KEY: ${effectiveKey}" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "full_name=Alex Smith" \\
  -d "age=30" \\
  -d "gender=Male" \\
  -d "height_cm=178" \\
  -d "weight_lbs=175" \\
  -d "timeframe=5 years" \\
  -d "goal_description=Maintain metabolic flexibility"`;
        }
        if (activeLang === "javascript") {
          return `const params = new URLSearchParams({
  full_name: "Alex Smith",
  age: "30",
  gender: "Male",
  height_cm: "178",
  weight_lbs: "175",
  timeframe: "5 years",
  goal_description: "Maintain metabolic flexibility"
});

const res = await fetch("${baseUrl}/external/insights/future", {
  method: "POST",
  headers: {
    "X-API-KEY": "${effectiveKey}",
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: params
});
const futureInsights = await res.json();
console.log(futureInsights);`;
        }
        if (activeLang === "python") {
          return `import requests

res = requests.post(
    "${baseUrl}/external/insights/future",
    headers={"X-API-KEY": "${effectiveKey}"},
    data={
        "full_name": "Alex Smith",
        "age": 30,
        "gender": "Male",
        "height_cm": 178,
        "weight_lbs": 175,
        "timeframe": "5 years",
        "goal_description": "Maintain metabolic flexibility"
    }
)
print(res.json())`;
        }
        if (activeLang === "php") {
          return `<?php
$curl = curl_init();

$fields = [
    'full_name' => 'Alex Smith',
    'age' => 30,
    'gender' => 'Male',
    'height_cm' => 178,
    'weight_lbs' => 175,
    'timeframe' => '5 years',
    'goal_description' => 'Maintain metabolic flexibility'
];

curl_setopt_array($curl, [
    CURLOPT_URL => '${baseUrl}/external/insights/future',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($fields),
    CURLOPT_HTTPHEADER => [
        'X-API-KEY: ${effectiveKey}',
        'Content-Type: application/x-www-form-urlencoded'
    ],
]);

$response = curl_exec($curl);
curl_close($curl);
$data = json_decode($response, true);
print_r($data);`;
        }
        break;

      case "balance":
        if (activeLang === "curl") {
          return `curl -X GET "${baseUrl}/external/balance" \\
  -H "X-API-KEY: ${effectiveKey}"`;
        }
        if (activeLang === "javascript") {
          return `const res = await fetch("${baseUrl}/external/balance", {
  method: "GET",
  headers: {
    "X-API-KEY": "${effectiveKey}"
  }
});
const balance = await res.json();
console.log(balance);`;
        }
        if (activeLang === "python") {
          return `import requests

res = requests.get(
    "${baseUrl}/external/balance",
    headers={"X-API-KEY": "${effectiveKey}"}
)
print(res.json())`;
        }
        if (activeLang === "php") {
          return `<?php
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => '${baseUrl}/external/balance',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'X-API-KEY: ${effectiveKey}'
    ],
]);

$response = curl_exec($curl);
curl_close($curl);
$data = json_decode($response, true);
print_r($data);`;
        }
        break;
    }
    return "";
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-teal-800/30 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[11px] font-bold border border-teal-500/30">
                REST API v2.0
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>

            <a
              href="https://ai.biovuedigitalwellness.com/docs#/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-200 text-xs font-bold border border-white/15 transition-all"
            >
              Interactive Swagger API Docs
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              BioVue Developer API Reference
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Connect BioVue&apos;s AI generative body composition visualizer and health
              trajectory projections directly into your mobile apps, clinics, gym platforms,
              or member portals.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="text-xs bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-slate-400">Gateway URL:</span>
              <code className="text-teal-300 font-mono font-semibold">{baseUrl}</code>
            </div>
            {onSwitchToTester && (
              <button
                type="button"
                onClick={onSwitchToTester}
                className="text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                Open Interactive Tester
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Authentication Guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Authentication
            </h3>
            <p className="text-xs text-gray-500">
              Authenticate requests using your secret API Key
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Pass your API Key in the <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-teal-700 font-bold">X-API-KEY</code> HTTP request header with every API call. Alternatively, you can use the standard <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-teal-700 font-bold">Authorization: Bearer &lt;api_key&gt;</code> header.
        </p>

        <div className="bg-slate-900 rounded-2xl p-4 font-mono text-xs text-teal-300 flex items-center justify-between border border-slate-800">
          <div className="overflow-x-auto pr-4">
            <span className="text-slate-500">Header: </span>
            <span className="text-amber-300">X-API-KEY: </span>
            <span>{effectiveKey}</span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(`X-API-KEY: ${effectiveKey}`, "Header")}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0 cursor-pointer"
            title="Copy Header"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 3. Interactive Code Generator */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Code Snippets & Examples
              </h3>
              <p className="text-xs text-gray-500">
                Ready-to-run code with your API Key injected
              </p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
            {(["curl", "javascript", "python", "php"] as LangOption[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLang === lang
                    ? "bg-white text-teal-700 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {lang === "curl" ? "cURL" : lang === "javascript" ? "JavaScript" : lang === "python" ? "Python" : "PHP"}
              </button>
            ))}
          </div>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "projection_combined", label: "POST /external/projection/combined" },
            { id: "insights_current", label: "POST /external/insights/current" },
            { id: "insights_future", label: "POST /external/insights/future" },
            { id: "balance", label: "GET /external/balance" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveEndpoint(item.id as EndpointOption)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 border ${
                activeEndpoint === item.id
                  ? "bg-teal-50 text-teal-700 border-teal-300"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Code Box */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400">
            <span>{activeLang.toUpperCase()} Request</span>
            <button
              type="button"
              onClick={() => handleCopy(getCodeSnippet(), "Code")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-teal-300 font-sans font-bold text-xs transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? "Copied" : "Copy Code"}
            </button>
          </div>
          <pre className="p-4 sm:p-5 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto scrollbar-thin">
            {getCodeSnippet()}
          </pre>
        </div>
      </div>

      {/* 4. Complete Endpoints Reference */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              API Endpoints Specification
            </h3>
            <p className="text-xs text-gray-500">
              Complete parameter types, required fields, and response schemas
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Endpoint 1: Combined Projection */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden transition-all">
            <button
              type="button"
              onClick={() =>
                setExpandedSection(expandedSection === "projection" ? "" : "projection")
              }
              className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-50 hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold">
                  POST
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-gray-900">
                  /api/v1/external/projection/combined
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline">
                  Generate Current Lifestyle & Future Goal Projections
                </span>
              </div>
              {expandedSection === "projection" ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSection === "projection" && (
              <div className="p-4 sm:p-6 space-y-5 border-t border-gray-200">
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Request Content Type
                  </h4>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-teal-700 font-mono font-bold">
                    multipart/form-data
                  </code>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Form Parameters
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                          <th className="pb-2">Field</th>
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Required</th>
                          <th className="pb-2">Description / Options</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        <tr>
                          <td className="py-2.5 font-mono text-teal-700 font-bold">image</td>
                          <td>File (Binary)</td>
                          <td><span className="text-rose-600 font-bold">Yes</span></td>
                          <td>Full body client photo (JPG, PNG, WEBP, max 15MB)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-700 font-bold">full_name</td>
                          <td>string</td>
                          <td><span className="text-rose-600 font-bold">Yes</span></td>
                          <td>Client full name</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-700 font-bold">email</td>
                          <td>string (email)</td>
                          <td><span className="text-rose-600 font-bold">Yes</span></td>
                          <td>Client email address</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-700 font-bold">age</td>
                          <td>integer</td>
                          <td><span className="text-rose-600 font-bold">Yes</span></td>
                          <td>e.g. 30</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-700 font-bold">gender</td>
                          <td>string</td>
                          <td><span className="text-rose-600 font-bold">Yes</span></td>
                          <td>Male | Female | Other</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-700 font-bold">height_cm</td>
                          <td>number</td>
                          <td><span className="text-rose-600 font-bold">Yes</span></td>
                          <td>Height in centimeters (e.g. 175)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-700 font-bold">weight_lbs</td>
                          <td>number</td>
                          <td><span className="text-rose-600 font-bold">Yes</span></td>
                          <td>Current weight in lbs (e.g. 165)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-700 font-bold">body_fat_percent</td>
                          <td>number</td>
                          <td>Optional</td>
                          <td>Default: 0.0 (AI automatically estimates if omitted)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-700 font-bold">goal_type</td>
                          <td>string</td>
                          <td><span className="text-rose-600 font-bold">Yes</span></td>
                          <td>Lean | Toned | Athletic | Muscular | Curvy Fit</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-700 font-bold">goal_description</td>
                          <td>string</td>
                          <td><span className="text-rose-600 font-bold">Yes</span></td>
                          <td>Target body and fitness goals description</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-700 font-bold">goal_timeframe</td>
                          <td>string</td>
                          <td><span className="text-rose-600 font-bold">Yes</span></td>
                          <td>6 months | 1 year | 5 years</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-700 font-bold">resolution</td>
                          <td>string</td>
                          <td>Optional</td>
                          <td>1K | 2K | 4K (Default: 1K)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Sample Success Response (200 OK)
                  </h4>
                  <pre className="p-4 rounded-xl bg-slate-900 text-teal-300 font-mono text-xs overflow-x-auto leading-relaxed">
{`{
  "current_lifestyle": {
    "route": "current-lifestyle",
    "est_bmi": "25.4",
    "est_weight": "178 lbs",
    "expected_changes": [
      "Moderate increase in lower abdominal adiposity",
      "Slight loss in upper arm tone"
    ],
    "confidence_score": "0.92",
    "weight_change_note": "+3 lbs over 12 months",
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
  },
  "future_goal": {
    "route": "future-goal",
    "est_bmi": "22.8",
    "est_weight": "162 lbs",
    "expected_changes": [
      "Significant core definition and waist reduction",
      "Noticeable shoulder and deltoid muscularity"
    ],
    "confidence_score": "0.95",
    "weight_change_note": "-13 lbs target achieved",
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..."
  }
}`}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Endpoint 2: Current Insights */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden transition-all">
            <button
              type="button"
              onClick={() =>
                setExpandedSection(expandedSection === "insights" ? "" : "insights")
              }
              className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-50 hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-mono text-xs font-bold">
                  POST
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-gray-900">
                  /api/v1/external/insights/current
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline">
                  Current Lifestyle & Biometric Habit Insights
                </span>
              </div>
              {expandedSection === "insights" ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSection === "insights" && (
              <div className="p-4 sm:p-6 space-y-4 border-t border-gray-200 text-xs">
                <p className="text-gray-600">
                  Analyzes client biometrics and lifestyle trends to output personalized nutrition, activity, sleep, and recovery insights with actionable steps.
                </p>
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Sample Success Response (200 OK)
                  </h4>
                  <pre className="p-4 rounded-xl bg-slate-900 text-teal-300 font-mono text-xs overflow-x-auto leading-relaxed">
{`{
  "insights": [
    {
      "priority": "high",
      "category": "nutrition",
      "insight": "Optimize Daily Protein Intake",
      "why_this_matters": "Accelerates metabolic recovery and lean muscle synthesis.",
      "expected_impact": "15% faster recovery rate",
      "action_steps": [
        "Aim for 1.6g protein per kg bodyweight",
        "Distribute across 3-4 meals daily"
      ]
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Endpoint 3: Balance */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden transition-all">
            <button
              type="button"
              onClick={() =>
                setExpandedSection(expandedSection === "balance" ? "" : "balance")
              }
              className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-50 hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold">
                  GET
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-gray-900">
                  /api/v1/external/balance
                </span>
                <span className="text-xs text-gray-500 hidden sm:inline">
                  Check Remaining Quota & Active Status
                </span>
              </div>
              {expandedSection === "balance" ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSection === "balance" && (
              <div className="p-4 sm:p-6 space-y-4 border-t border-gray-200 text-xs">
                <p className="text-gray-600">
                  Returns the live projection limit, insight limit, active status, and days remaining for the provided API Key.
                </p>
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Sample Success Response (200 OK)
                  </h4>
                  <pre className="p-4 rounded-xl bg-slate-900 text-teal-300 font-mono text-xs overflow-x-auto leading-relaxed">
{`{
  "success": true,
  "data": {
    "api_key": "bv_live_...9421",
    "projection_limit": 50,
    "insite_limit": 50,
    "is_active": true,
    "expires_at": "2027-04-14T00:00:00.000000Z",
    "expires_in_days": 182
  }
}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. HTTP Error Handling */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">
          HTTP Response & Error Codes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                <th className="pb-2">Status Code</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">Meaning & Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr>
                <td className="py-2.5 font-mono text-emerald-600 font-bold">200 OK</td>
                <td className="font-bold">Success</td>
                <td>Request processed successfully. Projections / insights returned.</td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-amber-600 font-bold">400 Bad Request</td>
                <td className="font-bold">Invalid Parameters</td>
                <td>Missing mandatory parameters or unreadable photo file.</td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-rose-600 font-bold">401 Unauthorized</td>
                <td className="font-bold">Invalid API Key</td>
                <td>API key is invalid, missing, or inactive. Check your X-API-KEY header.</td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-purple-600 font-bold">403 Forbidden</td>
                <td className="font-bold">Quota / Plan Limit Exceeded</td>
                <td>Your projection balance is 0 or your subscription has expired. Please upgrade.</td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-rose-700 font-bold">422 Validation Error</td>
                <td className="font-bold">Type Mismatch</td>
                <td>Validation failed (e.g. invalid email format or image size &gt; 15MB).</td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-gray-600 font-bold">500 Server Error</td>
                <td className="font-bold">AI Processing Error</td>
                <td>Temporary issue communicating with the AI cluster. Retry with exponential backoff.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
