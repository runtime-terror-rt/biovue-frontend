"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { poppins } from "@/app/font";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { logout, selectCurrentUser } from "@/redux/features/slice/authSlice";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";
import { useGetExternalApiQuery } from "@/redux/features/api/externalApi";

// Components
import Header from "@/components/api-user/Header";
import TopBanner from "@/components/api-user/TopBanner";
import ApiKeyPanel from "@/components/api-user/ApiKeyPanel";
import ApiTabs, { ApiTab } from "@/components/api-user/ApiTabs";
import ApiForm, { getActiveFieldsForTab } from "@/components/api-user/ApiForm";
import ApiResults from "@/components/api-user/ApiResults";

export default function ApiUserDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { data: profileResponse } = useGetProfileQuery(currentUser?.id, {
    skip: !currentUser?.id,
  });
  const { data: externalApiResponse } = useGetExternalApiQuery();

  const apiKey = externalApiResponse?.data?.api_key || "bv_live_key_9938172645";
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  
  const [activeApiTab, setActiveApiTab] = useState<ApiTab>("combined");

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
    (currentUser?.email ? currentUser.email.split("@")[0] : "Demo Customer");

  const planName = currentUser?.plan_name || "User API Plan";

  // Form State
  const [formData, setFormData] = useState<Record<string, any>>({
    full_name: displayName,
    email: currentUser?.email || "demo.customer@example.com",
    age: "30",
    gender: "Male",
    height_cm: "175",
    weight_lbs: "160",
    body_fat_percent: "15",
    activity_level: "Moderate",
    weekly_workout_sessions: "3",
    weekly_avg_daily_steps: "8000",
    weekly_avg_sleep_hours: "7.5",
    weekly_avg_water_litres: "2.5",
    nutrition_quality: "7",
    alcohol_consumption: "None",
    fast_food_frequency: "Rarely",
    stress_level: "Low",
    smoking: "No",
    goal_type: "Toned",
    goal_description: "Build muscle and improve physical stamina",
    goal_timeframe: "6 months",
    timeframe: "5 years",
    diabetes: false,
    thyroid_issue: false,
    high_blood_pressure: false,
    high_cholesterol: false,
    depression: false,
    anxiety: false,
    sleep_apnea: false,
    medications: "None",
    resolution: "1K",
  });

  useEffect(() => {
    if (displayName) {
      setFormData((prev) => ({ ...prev, full_name: displayName }));
    }
  }, [displayName]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testedPayload, setTestedPayload] = useState<any>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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

  // Generate Demo JSON without calling external backend ("ekhan theke kono kisu generate hbe na")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const activeFields = getActiveFieldsForTab(activeApiTab);
      const formattedJsonPayload: Record<string, any> = {};

      activeFields.forEach((field) => {
        const rawVal = formData[field.key];
        if (field.type === "integer") {
          formattedJsonPayload[field.key] = parseInt(rawVal || "0", 10);
        } else if (field.type === "number") {
          formattedJsonPayload[field.key] = parseFloat(rawVal || "0");
        } else if (field.type === "boolean") {
          formattedJsonPayload[field.key] = Boolean(rawVal);
        } else {
          formattedJsonPayload[field.key] = String(rawVal || "");
        }
      });

      if (activeApiTab === "combined") {
        formattedJsonPayload.image = imagePreview
          ? "[base64_encoded_image_data_string]"
          : "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      }

      // Simulated Response JSON for developer testing
      const endpointName =
        activeApiTab === "combined"
          ? "/api/v1/api_service/projection/combined/"
          : activeApiTab === "current"
          ? "/api/v1/api_service/insights/current/"
          : "/api/v1/api_service/insights/future/";

      const simulatedDemoResponse = {
        status: "success",
        code: 200,
        message: `API Payload validated successfully. Demo ${activeApiTab} payload generated.`,
        request_summary: {
          total_fields_received: Object.keys(formattedJsonPayload).length,
          endpoint: endpointName,
        },
        data: {
          reference_id: "ref_demo_98231847",
          created_at: new Date().toISOString(),
          user: {
            name: formattedJsonPayload.full_name || displayName,
          },
        },
      };

      setTestedPayload({
        json_payload: formattedJsonPayload,
        demo_response: simulatedDemoResponse,
      });

      setIsSubmitting(false);
      toast.success("Payload tested successfully!");
    }, 400);
  };

  const handleClear = () => {
    setFormData({
      full_name: displayName,
      email: currentUser?.email || "demo.customer@example.com",
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
      timeframe: "",
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
    setTestedPayload(null);
  };

  const getTabTitle = () => {
    switch (activeApiTab) {
      case "combined":
        return "Combined Projection API Tester";
      case "current":
        return "Current Insights API Tester";
      case "future":
        return "Future Insights API Tester";
      default:
        return "API Endpoint Payload Tester";
    }
  };

  const formConfig = {
    title: getTabTitle(),
    submitFn: handleSubmit,
    isSubmitting: isSubmitting,
    btnText: "Test & Preview Payload (Key=Value Format)",
  };

  return (
    <ProtectedRoute
      allowedRoles={["api-user", "individual", "professional"]}
      allowedProfessions={[null]}
    >
      <div className={`min-h-screen bg-[#F8FAFC] text-gray-900 pb-16 sm:pb-20 ${poppins.className}`}>
        <Header
          displayName={displayName}
          currentUser={currentUser}
          handleLogout={handleLogout}
        />

        <main className="px-4 sm:px-6 mt-6 sm:mt-8 w-full">
          <TopBanner
            displayName={displayName}
            planName={planName}
            externalApiResponse={externalApiResponse}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-4 space-y-6 sm:space-y-8">
              <ApiKeyPanel
                apiKey={apiKey}
                isKeyVisible={isKeyVisible}
                setIsKeyVisible={setIsKeyVisible}
                handleCopyKey={handleCopyKey}
                copiedToken={copiedToken}
              />
            </div>

            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              <ApiTabs
                activeApiTab={activeApiTab}
                setActiveApiTab={(tab) => {
                  setActiveApiTab(tab);
                  setTestedPayload(null);
                }}
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
                testedPayload={testedPayload}
                activeApiTab={activeApiTab}
              />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
