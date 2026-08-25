"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { poppins } from "@/app/font";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  logout,
  selectCurrentUser,
} from "@/redux/features/slice/authSlice";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";
import { useGetExternalApiQuery } from "@/redux/features/api/externalApi";

// New Components
import Header from "@/components/api-user/Header";
import TopBanner from "@/components/api-user/TopBanner";
import ApiKeyPanel from "@/components/api-user/ApiKeyPanel";
import ApiTabs from "@/components/api-user/ApiTabs";
import ApiForm from "@/components/api-user/ApiForm";
import ApiResults from "@/components/api-user/ApiResults";

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
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  
  const [activeApiTab, setActiveApiTab] = useState<"combined" | "insights" | "future_insights">("combined");

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

  const displayName =
    profileResponse?.data?.name ||
    currentUser?.name ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "API Partner");

  const planName = currentUser?.plan_name || "API Access Plan";

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
      <div className={`min-h-screen bg-[#F8FAFC] text-gray-900 pb-20 ${poppins.className}`}>
        <Header 
          displayName={displayName}
          currentUser={currentUser}
          handleLogout={handleLogout}
        />

        <main className="px-6 mt-8">
          <TopBanner 
            displayName={displayName}
            planName={planName}
            externalApiResponse={externalApiResponse}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-8">
              <ApiKeyPanel 
                apiKey={apiKey}
                isKeyVisible={isKeyVisible}
                setIsKeyVisible={setIsKeyVisible}
                handleCopyKey={handleCopyKey}
                copiedToken={copiedToken}
              />
            </div>

            <div className="lg:col-span-8 space-y-8">
              <ApiTabs 
                activeApiTab={activeApiTab}
                setActiveApiTab={setActiveApiTab}
              />

              <ApiForm 
                formData={formData}
                handleInputChange={handleInputChange}
                handleImageChange={handleImageChange}
                imagePreview={imagePreview}
                formConfig={formConfig}
                handleClear={handleClear}
                activeApiTab={activeApiTab}
              />

              <ApiResults 
                activeApiTab={activeApiTab}
                responseImages={responseImages}
                insightsResponse={insightsResponse}
                futureInsightsResponse={futureInsightsResponse}
              />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
