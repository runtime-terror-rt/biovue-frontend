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
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  UploadCloud,
  Send,
  RefreshCw,
  LogOut,
  User,
  ChevronDown,
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
import { useGetExternalApiQuery } from "@/redux/features/api/externalApi";
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
  const { data: externalApiResponse } = useGetExternalApiQuery();

  // Component States
  const apiKey = externalApiResponse?.data?.api_key || "";
  console.log("External API Response:", externalApiResponse);
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
  const [activeApiTab, setActiveApiTab] = useState<"combined" | "insights" | "future_insights">("combined");



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
  const planLimit = externalApiResponse?.data?.projection_limit || currentUser?.projection_limit || 500;

// Form State
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height_cm: "",
    weight_lbs: "",
    body_fat_percent: "",
    activity_level: "",
    weekly_workout_sessions: "",
    weekly_avg_daily_steps: "",
    weekly_avg_sleep_hours: "",
    weekly_avg_water_litres: "",
    nutrition_quality: "",
    alcohol_consumption: "",
    fast_food_frequency: "",
    stress_level: "",
    smoking: "",
    goal_type: "",
    goal_description: "",
    goal_timeframe: "",
    diabetes: false,
    thyroid_issue: false,
    high_blood_pressure: false,
    high_cholesterol: false,
    depression: false,
    anxiety: false,
    sleep_apnea: false,
    medications: "None",
    resolution: "",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseImages, setResponseImages] = useState<{ current: string; future: string } | null>(null);

  const [isInsightsSubmitting, setIsInsightsSubmitting] = useState(false);
  const [insightsResponse, setInsightsResponse] = useState<any>(null);

  const [isFutureInsightsSubmitting, setIsFutureInsightsSubmitting] = useState(false);
  const [futureInsightsResponse, setFutureInsightsResponse] = useState<any>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      toast.error("API Key is missing. Please ensure you have an active subscription.");
      return;
    }
    if (!imageFile) {
      toast.error("Please upload an image.");
      return;
    }

    setIsSubmitting(true);
    setResponseImages(null);
    try {
      const form = new FormData();
      form.append("api_key", apiKey);
      form.append("full_name", displayName);
      form.append("email", currentUser?.email || "api@example.com");
      
      const integerFields = ["age", "weekly_workout_sessions", "weekly_avg_daily_steps", "nutrition_quality"];
      const floatFields = ["height_cm", "weight_lbs", "body_fat_percent", "weekly_avg_sleep_hours", "weekly_avg_water_litres"];

      const validEnums = {
        gender: ["male", "female"],
        activity_level: ["sedentary", "moderate", "active"],
        alcohol_consumption: ["none", "light", "moderate", "heavy"],
        fast_food_frequency: ["rarely", "occasionally", "often"],
        stress_level: ["low", "moderate", "high"],
        smoking: ["no", "yes", "occasionally"],
        goal_type: ["lean", "toned", "athletic", "muscular", "curvy fit"],
        resolution: ["1k", "2k", "4k"]
      };

      const defaults = {
        gender: "Male",
        activity_level: "Moderate",
        alcohol_consumption: "None",
        fast_food_frequency: "Rarely",
        stress_level: "Low",
        smoking: "No",
        goal_type: "Toned",
        resolution: "1K"
      };

      Object.entries(formData).forEach(([key, value]) => {
        if (value === false) {
          // Explicitly send "false" to prevent 500 errors on the backend
          form.append(key, "false");
        } else if (value !== "") {
          let strValue = value.toString().trim();
          
          if (integerFields.includes(key)) {
            let parsed = parseInt(strValue, 10);
            if (isNaN(parsed) || parsed <= 0) {
              if (key === "age") parsed = 30;
              else if (key === "weekly_workout_sessions") parsed = 3;
              else if (key === "weekly_avg_daily_steps") parsed = 5000;
              else if (key === "nutrition_quality") parsed = 5;
              else parsed = 1;
            }
            
            // Cap FakeFiller's excessive random numbers to prevent backend DB/AI crashes
            if (key === "age") parsed = Math.min(parsed, 100);
            if (key === "weekly_workout_sessions") parsed = Math.min(parsed, 14);
            if (key === "weekly_avg_daily_steps") parsed = Math.min(parsed, 30000);
            if (key === "nutrition_quality") parsed = Math.min(Math.max(parsed, 1), 10);

            strValue = parsed.toString();
          } else if (floatFields.includes(key)) {
            let parsed = parseFloat(strValue);
            if (isNaN(parsed) || parsed <= 0) {
              if (key === "height_cm") parsed = 170;
              else if (key === "weight_lbs") parsed = 150;
              else if (key === "weekly_avg_sleep_hours") parsed = 7;
              else if (key === "weekly_avg_water_litres") parsed = 2;
              else parsed = 0; // body_fat_percent can be 0 or omitted
            }
            
            // Cap FakeFiller's excessive random floats
            if (key === "height_cm") parsed = Math.min(parsed, 250);
            if (key === "weight_lbs") parsed = Math.min(parsed, 400);
            if (key === "body_fat_percent") parsed = Math.min(parsed, 50);
            if (key === "weekly_avg_sleep_hours") parsed = Math.min(parsed, 24);
            if (key === "weekly_avg_water_litres") parsed = Math.min(parsed, 10);

            if (key === "body_fat_percent" && parsed === 0) {
               strValue = "NaN"; // Setting to NaN ensures it gets skipped and not appended
            } else {
               strValue = parsed.toString();
            }
          } else if (validEnums[key as keyof typeof validEnums]) {
            const validOptions = validEnums[key as keyof typeof validEnums];
            if (!validOptions.includes(strValue.toLowerCase())) {
              strValue = defaults[key as keyof typeof defaults]; // sanitize FakeFiller garbage
            }
            if (key === "resolution") {
              strValue = strValue.toUpperCase();
            }
          }

          if (strValue !== "NaN") {
            form.append(key, strValue);
          }
        }
      });
      form.append("image", imageFile);

      const response = await fetch("https://ai.biovuedigitalwellness.com/api/v1/api_service/projection/combined/", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      let currentImg = data.current_projection_base64 || data.current_image || data.current;
      let futureImg = data.future_projection_base64 || data.future_image || data.future || data.projected;

      if (!currentImg && !futureImg && data.projections) {
        const keys = Object.keys(data.projections);
        if (keys.length > 0) {
          const currentKey = keys.find(k => k.toLowerCase().includes('current')) || keys[0];
          const futureKey = keys.find(k => k.toLowerCase().includes('future') || k.toLowerCase().includes('project')) || (keys.length > 1 ? keys[1] : keys[0]);
          
          currentImg = data.projections[currentKey]?.image_base64;
          futureImg = data.projections[futureKey]?.image_base64;
        }
      }

      if (currentImg && futureImg) {
        setResponseImages({
            current: currentImg.startsWith("data:image") ? currentImg : `data:image/png;base64,${currentImg}`,
            future: futureImg.startsWith("data:image") ? futureImg : `data:image/png;base64,${futureImg}`
        });
        toast.success("Projection generated successfully!");
      } else {
        console.log("Unhandled API Response:", data);
        toast.success("Success! Check console for data structure.");
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to generate projection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInsightsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      toast.error("API Key is missing. Please ensure you have an active subscription.");
      return;
    }

    setIsInsightsSubmitting(true);
    setInsightsResponse(null);

    try {
      const params = new URLSearchParams();
      params.append("api_key", apiKey);

      const integerFields = ["age", "weekly_workout_sessions", "weekly_avg_daily_steps", "nutrition_quality"];
      const floatFields = ["height_cm", "weight_lbs", "body_fat_percent", "weekly_avg_sleep_hours", "weekly_avg_water_litres"];
      const validEnums = {
        gender: ["male", "female"],
        activity_level: ["sedentary", "moderate", "active"],
        alcohol_consumption: ["none", "light", "moderate", "heavy"],
        fast_food_frequency: ["rarely", "occasionally", "often"],
        stress_level: ["low", "moderate", "high"],
        smoking: ["no", "yes", "occasionally"],
        goal_type: ["lean", "toned", "athletic", "muscular", "curvy fit"]
      };

      const defaults = {
        gender: "Male",
        activity_level: "Moderate",
        alcohol_consumption: "None",
        fast_food_frequency: "Rarely",
        stress_level: "Low",
        smoking: "No",
        goal_type: "Toned"
      };

      Object.entries(formData).forEach(([key, value]) => {
        // Exclude fields not needed for Insights
        if (key === "resolution" || key === "goal_timeframe") return;

        if (value === false) {
          params.append(key, "false");
        } else if (value !== "") {
          let strValue = value.toString().trim();
          
          if (integerFields.includes(key)) {
            let parsed = parseInt(strValue, 10);
            if (isNaN(parsed) || parsed <= 0) {
              if (key === "age") parsed = 30;
              else if (key === "weekly_workout_sessions") parsed = 3;
              else if (key === "weekly_avg_daily_steps") parsed = 5000;
              else if (key === "nutrition_quality") parsed = 5;
              else parsed = 1;
            }
            if (key === "age") parsed = Math.min(parsed, 100);
            if (key === "weekly_workout_sessions") parsed = Math.min(parsed, 14);
            if (key === "weekly_avg_daily_steps") parsed = Math.min(parsed, 30000);
            if (key === "nutrition_quality") parsed = Math.min(Math.max(parsed, 1), 10);
            strValue = parsed.toString();
          } else if (floatFields.includes(key)) {
            let parsed = parseFloat(strValue);
            if (isNaN(parsed) || parsed <= 0) {
              if (key === "height_cm") parsed = 170;
              else if (key === "weight_lbs") parsed = 150;
              else if (key === "weekly_avg_sleep_hours") parsed = 7;
              else if (key === "weekly_avg_water_litres") parsed = 2;
              else parsed = 0;
            }
            if (key === "height_cm") parsed = Math.min(parsed, 250);
            if (key === "weight_lbs") parsed = Math.min(parsed, 400);
            if (key === "body_fat_percent") parsed = Math.min(parsed, 50);
            if (key === "weekly_avg_sleep_hours") parsed = Math.min(parsed, 24);
            if (key === "weekly_avg_water_litres") parsed = Math.min(parsed, 10);

            if (key === "body_fat_percent" && parsed === 0) {
               strValue = "NaN"; 
            } else {
               strValue = parsed.toString();
            }
          } else if (validEnums[key as keyof typeof validEnums]) {
            const validOptions = validEnums[key as keyof typeof validEnums];
            if (!validOptions.includes(strValue.toLowerCase())) {
              strValue = defaults[key as keyof typeof defaults]; 
            }
          }

          if (strValue !== "NaN") {
            params.append(key, strValue);
          }
        }
      });

      const response = await fetch("https://ai.biovuedigitalwellness.com/api/v1/api_service/insights/current/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setInsightsResponse(data);
      toast.success("Insights generated successfully!");
      
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate insights. Check console for details.");
    } finally {
      setIsInsightsSubmitting(false);
    }
  };

  const handleFutureInsightsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      toast.error("API Key is missing. Please ensure you have an active subscription.");
      return;
    }

    setIsFutureInsightsSubmitting(true);
    setFutureInsightsResponse(null);

    try {
      const params = new URLSearchParams();
      params.append("api_key", apiKey);

      const integerFields = ["age", "weekly_workout_sessions", "weekly_avg_daily_steps", "nutrition_quality"];
      const floatFields = ["height_cm", "weight_lbs", "body_fat_percent", "weekly_avg_sleep_hours", "weekly_avg_water_litres"];
      const validEnums = {
        gender: ["male", "female"],
        activity_level: ["sedentary", "moderate", "active"],
        alcohol_consumption: ["none", "light", "moderate", "heavy"],
        fast_food_frequency: ["rarely", "occasionally", "often"],
        stress_level: ["low", "moderate", "high"],
        smoking: ["no", "yes", "occasionally"],
        goal_type: ["lean", "toned", "athletic", "muscular", "curvy fit"]
      };

      const defaults = {
        gender: "Male",
        activity_level: "Moderate",
        alcohol_consumption: "None",
        fast_food_frequency: "Rarely",
        stress_level: "Low",
        smoking: "No",
        goal_type: "Toned"
      };

      Object.entries(formData).forEach(([key, value]) => {
        // Exclude resolution as Future Insights doesn't need it
        if (key === "resolution") return;

        if (value === false) {
          params.append(key, "false");
        } else if (value !== "") {
          let strValue = value.toString().trim();
          
          if (integerFields.includes(key)) {
            let parsed = parseInt(strValue, 10);
            if (isNaN(parsed) || parsed <= 0) {
              if (key === "age") parsed = 30;
              else if (key === "weekly_workout_sessions") parsed = 3;
              else if (key === "weekly_avg_daily_steps") parsed = 5000;
              else if (key === "nutrition_quality") parsed = 5;
              else parsed = 1;
            }
            if (key === "age") parsed = Math.min(parsed, 100);
            if (key === "weekly_workout_sessions") parsed = Math.min(parsed, 14);
            if (key === "weekly_avg_daily_steps") parsed = Math.min(parsed, 30000);
            if (key === "nutrition_quality") parsed = Math.min(Math.max(parsed, 1), 10);
            strValue = parsed.toString();
          } else if (floatFields.includes(key)) {
            let parsed = parseFloat(strValue);
            if (isNaN(parsed) || parsed <= 0) {
              if (key === "height_cm") parsed = 170;
              else if (key === "weight_lbs") parsed = 150;
              else if (key === "weekly_avg_sleep_hours") parsed = 7;
              else if (key === "weekly_avg_water_litres") parsed = 2;
              else parsed = 0;
            }
            if (key === "height_cm") parsed = Math.min(parsed, 250);
            if (key === "weight_lbs") parsed = Math.min(parsed, 400);
            if (key === "body_fat_percent") parsed = Math.min(parsed, 50);
            if (key === "weekly_avg_sleep_hours") parsed = Math.min(parsed, 24);
            if (key === "weekly_avg_water_litres") parsed = Math.min(parsed, 10);

            if (key === "body_fat_percent" && parsed === 0) {
               strValue = "NaN"; 
            } else {
               strValue = parsed.toString();
            }
          } else if (validEnums[key as keyof typeof validEnums]) {
            const validOptions = validEnums[key as keyof typeof validEnums];
            if (!validOptions.includes(strValue.toLowerCase())) {
              strValue = defaults[key as keyof typeof defaults]; 
            }
          }

          if (strValue !== "NaN") {
            params.append(key, strValue);
          }
        }
      });

      const response = await fetch("https://ai.biovuedigitalwellness.com/api/v1/api_service/insights/future/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setFutureInsightsResponse(data);
      toast.success("Future Insights generated successfully!");
      
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate future insights. Check console for details.");
    } finally {
      setIsFutureInsightsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      age: "",
      gender: "",
      height_cm: "",
      weight_lbs: "",
      body_fat_percent: "",
      activity_level: "",
      weekly_workout_sessions: "",
      weekly_avg_daily_steps: "",
      weekly_avg_sleep_hours: "",
      weekly_avg_water_litres: "",
      nutrition_quality: "",
      alcohol_consumption: "",
      fast_food_frequency: "",
      stress_level: "",
      smoking: "",
      goal_type: "",
      goal_description: "",
      goal_timeframe: "",
      diabetes: false,
      thyroid_issue: false,
      high_blood_pressure: false,
      high_cholesterol: false,
      depression: false,
      anxiety: false,
      sleep_apnea: false,
      medications: "None",
      resolution: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setResponseImages(null);
    setInsightsResponse(null);
    setFutureInsightsResponse(null);
  };

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

  const getFormConfig = () => {
    switch (activeApiTab) {
      case "combined":
        return {
          title: "Generate Projection",
          submitFn: handleSubmit,
          isSubmitting: isSubmitting,
          btnText: "Generate Projection",
          showImage: true,
          showResolution: true,
          showTimeframe: true,
        };
      case "insights":
        return {
          title: "Generate Current Insights",
          submitFn: handleInsightsSubmit,
          isSubmitting: isInsightsSubmitting,
          btnText: "Generate Insights",
          showImage: false,
          showResolution: false,
          showTimeframe: false,
        };
      case "future_insights":
        return {
          title: "Generate Future Insights",
          submitFn: handleFutureInsightsSubmit,
          isSubmitting: isFutureInsightsSubmitting,
          btnText: "Generate Future Insights",
          showImage: false,
          showResolution: false,
          showTimeframe: true,
        };
      default:
        return {
          title: "Generate",
          submitFn: handleSubmit,
          isSubmitting: isSubmitting,
          btnText: "Generate",
          showImage: false,
          showResolution: false,
          showTimeframe: false,
        };
    }
  };

  const formConfig = getFormConfig();

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
                <div className="text-left hidden sm:block flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 leading-tight truncate">
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
                  {externalApiResponse?.data?.is_active ? (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-300 border-b border-white/10 pb-1.5">
                    <span>Projection Limit</span>
                    <span className="font-bold text-white">
                      {externalApiResponse?.data?.projection_limit || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 border-b border-white/10 pb-1.5">
                    <span>Insight Limit</span>
                    <span className="font-bold text-white">
                      {externalApiResponse?.data?.insite_limit || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>Expires in</span>
                    <span className="font-bold text-white">
                      {Math.round(externalApiResponse?.data?.expires_in_days || 0)} Days
                    </span>
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


            </div>

            <div className="lg:col-span-8 space-y-8">
          {/* Tabs */}
          <div className="flex items-center gap-6 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveApiTab("combined")}
              className={`text-sm font-bold pb-4 -mb-[1px] border-b-2 transition-colors ${
                activeApiTab === "combined"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Combined Projection API
            </button>
            <button
              onClick={() => setActiveApiTab("insights")}
              className={`text-sm font-bold pb-4 -mb-[1px] border-b-2 transition-colors ${
                activeApiTab === "insights"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Current Insights API
            </button>
            <button
              onClick={() => setActiveApiTab("future_insights")}
              className={`text-sm font-bold pb-4 -mb-[1px] border-b-2 transition-colors ${
                activeApiTab === "future_insights"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Future Insights API
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
             <h2 className="text-xl font-extrabold text-gray-900 mb-6">{formConfig.title}</h2>
             
             <form onSubmit={formConfig.submitFn} className="space-y-8">
                {/* Section 1: Vitals */}
                <div className="space-y-4">
                   <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">1. Vitals & Personal Info</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {activeApiTab === "insights" && (
                        <div>
                           <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                           <input required type="text" name="full_name" value={formData.full_name || ""} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white" placeholder="e.g. John Doe" />
                        </div>
                      )}
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Age *</label>
                         <input required type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 30" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Gender *</label>
                         <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                            <option value="" disabled>Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Height (cm) *</label>
                         <input required type="number" step="0.1" name="height_cm" value={formData.height_cm} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 175" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Weight (lbs) *</label>
                         <input required type="number" step="0.1" name="weight_lbs" value={formData.weight_lbs} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 160" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Body Fat (%)</label>
                         <input type="number" step="0.1" name="body_fat_percent" value={formData.body_fat_percent} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white" placeholder="e.g. 15" />
                      </div>
                   </div>
                </div>

                {/* Section 2: Lifestyle */}
                <div className="space-y-4">
                   <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">2. Lifestyle & Habits</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Activity Level</label>
                         <select name="activity_level" value={formData.activity_level} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                            <option value="" disabled>Select</option>
                            <option value="Sedentary">Sedentary</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Active">Active</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Weekly Workouts *</label>
                         <input required type="number" name="weekly_workout_sessions" value={formData.weekly_workout_sessions} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 3" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Avg Daily Steps *</label>
                         <input required type="number" name="weekly_avg_daily_steps" value={formData.weekly_avg_daily_steps} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 8000" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Avg Sleep (Hours) *</label>
                         <input required type="number" name="weekly_avg_sleep_hours" step="0.1" value={formData.weekly_avg_sleep_hours} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 7.5" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Water (Litres/Day) *</label>
                         <input required type="number" name="weekly_avg_water_litres" step="0.1" value={formData.weekly_avg_water_litres} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 2.5" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Nutrition Quality (1-10) *</label>
                         <input required type="number" name="nutrition_quality" min="1" max="10" value={formData.nutrition_quality} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 7" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Alcohol Consumption *</label>
                         <select required name="alcohol_consumption" value={formData.alcohol_consumption} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                            <option value="" disabled>Select</option>
                            <option value="None">None</option>
                            <option value="Light">Light</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Heavy">Heavy</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Fast Food Freq *</label>
                         <select required name="fast_food_frequency" value={formData.fast_food_frequency} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                            <option value="" disabled>Select</option>
                            <option value="Rarely">Rarely</option>
                            <option value="Occasionally">Occasionally</option>
                            <option value="Often">Often</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Stress Level *</label>
                         <select required name="stress_level" value={formData.stress_level} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                            <option value="" disabled>Select</option>
                            <option value="Low">Low</option>
                            <option value="Moderate">Moderate</option>
                            <option value="High">High</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Smoking *</label>
                         <select required name="smoking" value={formData.smoking} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                            <option value="" disabled>Select</option>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                            <option value="Occasionally">Occasionally</option>
                         </select>
                      </div>
                   </div>
                </div>

                {/* Section 3: Goals */}
                <div className="space-y-4">
                   <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">3. Goals</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Goal Type</label>
                         <select name="goal_type" value={formData.goal_type} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                            <option value="" disabled>Select</option>
                            <option value="Lean">Lean</option>
                            <option value="Toned">Toned</option>
                            <option value="Athletic">Athletic</option>
                            <option value="Muscular">Muscular</option>
                            <option value="Curvy Fit">Curvy Fit</option>
                         </select>
                      </div>
                      {formConfig.showTimeframe && (
                        <div>
                           <label className="block text-xs font-bold text-gray-700 mb-1">Timeframe *</label>
                           <select required name="goal_timeframe" value={formData.goal_timeframe} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                              <option value="" disabled>Select</option>
                              <option value="1 month">1 month</option>
                              <option value="3 months">3 months</option>
                              <option value="6 months">6 months</option>
                              <option value="1 year">1 year</option>
                           </select>
                        </div>
                      )}
                      <div className={formConfig.showTimeframe ? "sm:col-span-3" : "sm:col-span-2"}>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Goal Description *</label>
                         <textarea required name="goal_description" value={formData.goal_description} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm resize-none" rows={3} placeholder="Describe your target physique..."></textarea>
                      </div>
                   </div>
                </div>

                {/* Section 4: Medical */}
                <div className="space-y-4">
                   <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">4. Medical Conditions</h3>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { name: "diabetes", label: "Diabetes" },
                        { name: "thyroid_issue", label: "Thyroid Issue" },
                        { name: "high_blood_pressure", label: "High BP" },
                        { name: "high_cholesterol", label: "High Cholesterol" },
                        { name: "depression", label: "Depression" },
                        { name: "anxiety", label: "Anxiety" },
                        { name: "sleep_apnea", label: "Sleep Apnea" }
                      ].map((condition) => (
                        <label key={condition.name} className="flex items-center gap-2 cursor-pointer group">
                           <div className="relative flex items-center justify-center">
                              <input type="checkbox" name={condition.name} checked={formData[condition.name as keyof typeof formData] as boolean} onChange={handleInputChange} className="peer sr-only" />
                              <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-colors"></div>
                              <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                           </div>
                           <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">{condition.label}</span>
                        </label>
                      ))}
                      <div className="col-span-2 sm:col-span-4 mt-2">
                         <label className="block text-xs font-bold text-gray-700 mb-1">Medications</label>
                         <input type="text" name="medications" value={formData.medications} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="List any medications (optional)" />
                      </div>
                   </div>
                </div>

                {/* Conditionally Rendered Section 5: Image Upload & Submit OR Just Submit */}
                {formConfig.showImage ? (
                  <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">5. Photo Upload</h3>
                     <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="flex-1 w-full">
                           <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl hover:border-teal-500 bg-slate-50 hover:bg-teal-50/30 transition-colors cursor-pointer group overflow-hidden">
                              {imagePreview ? (
                                <Image src={imagePreview} alt="Preview" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                              ) : null}
                              <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                                 <UploadCloud className={`w-10 h-10 mb-3 ${imagePreview ? 'text-white' : 'text-gray-400 group-hover:text-teal-500'}`} />
                                 <p className={`mb-2 text-sm font-semibold ${imagePreview ? 'text-white drop-shadow-md' : 'text-gray-500'}`}>
                                    <span className="font-bold">Click to upload</span> or drag and drop
                                 </p>
                                 <p className={`text-xs ${imagePreview ? 'text-white drop-shadow-md' : 'text-gray-400'}`}>PNG, JPG up to 10MB</p>
                              </div>
                              <input required={!imagePreview} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                           </label>
                        </div>
                        <div className="sm:w-64 space-y-4 w-full flex flex-col justify-end">
                           {formConfig.showResolution && (
                             <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Resolution</label>
                                <select required name="resolution" value={formData.resolution} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                                   <option value="" disabled>Select</option>
                                   <option value="1K">1K</option>
                                   <option value="2K">2K</option>
                                   <option value="4K">4K</option>
                                </select>
                             </div>
                           )}
                           <button 
                             disabled={formConfig.isSubmitting}
                             type="submit" 
                             className="w-full h-12 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
                           >
                              {formConfig.isSubmitting ? (
                                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                 <>
                                    <Sparkles className="w-4 h-4" />
                                    {formConfig.btnText}
                                 </>
                              )}
                           </button>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-gray-100 flex gap-4">
                     <button
                        type="submit"
                        disabled={formConfig.isSubmitting}
                        className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        {formConfig.isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {formConfig.isSubmitting ? "Processing..." : formConfig.btnText}
                     </button>
                     <button
                        type="button"
                        onClick={handleClear}
                        className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                     >
                        Clear Form
                     </button>
                  </div>
                )}
             </form>

             {/* Results Section for Combined API */}
             <AnimatePresence>
               {activeApiTab === "combined" && responseImages && (
                  <motion.div 
                     initial={{ opacity: 0, height: 0, marginTop: 0 }}
                     animate={{ opacity: 1, height: "auto", marginTop: 40 }}
                     className="border-t border-gray-100 pt-8"
                  >
                     <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                        <ImageIcon className="text-teal-500" />
                        Projection Results
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <div className="bg-slate-100 rounded-2xl aspect-[3/4] relative overflow-hidden shadow-inner border border-slate-200">
                              <Image src={responseImages.current} alt="Current Projection" fill className="object-cover" />
                           </div>
                           <p className="text-center font-bold text-gray-700">Current Lifestyle Projection</p>
                        </div>
                        <div className="space-y-3">
                           <div className="bg-slate-100 rounded-2xl aspect-[3/4] relative overflow-hidden shadow-inner border border-slate-200">
                              <Image src={responseImages.future} alt="Future Goal Projection" fill className="object-cover" />
                              <div className="absolute top-4 right-4 bg-teal-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                                 Goal Achieved
                              </div>
                           </div>
                           <p className="text-center font-bold text-gray-700">Future Goal Projection</p>
                        </div>
                     </div>
                  </motion.div>
               )}
             </AnimatePresence>

             {/* Results Section for Insights APIs */}
             <AnimatePresence>
               {(activeApiTab === "insights" && insightsResponse) || (activeApiTab === "future_insights" && futureInsightsResponse) ? (
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="mt-12 pt-12 border-t border-gray-100"
                  >
                     <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                        <Sparkles className="text-teal-500" />
                        {activeApiTab === "future_insights" ? "Future Insights Results" : "Current Insights Results"}
                     </h3>
                     <div className="bg-slate-900 rounded-2xl p-6 overflow-x-auto shadow-inner border border-slate-800">
                        <pre className="text-teal-400 font-mono text-sm">
                           {JSON.stringify(activeApiTab === "future_insights" ? futureInsightsResponse : insightsResponse, null, 2)}
                        </pre>
                     </div>
                  </motion.div>
               ) : null}
             </AnimatePresence>
          </div>


            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
