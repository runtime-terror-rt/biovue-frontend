"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateUpdateProfileMutation } from "@/redux/features/api/profileApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";
import {
  useFetchInsightsMutation,
  useFetchFutureInsightsMutation,
} from "@/redux/features/api/userDashboard/insightsApi";
import {
  Loader2,
  ChevronLeft,
  ArrowRight,
  CheckCircle,
  Calendar,
  User,
  Ruler,
  Weight,
  Activity,
  MapPin,
  Cigarette,
  GlassWater,
  Footprints,
  Dumbbell,
  Timer,
  Moon,
  Utensils,
  Zap,
  Droplets,
  Target,
  FileText,
  BookOpen,
  Crown,
} from "lucide-react";

const OnboardingStepsPage = () => {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);

  // Form states (simplified for UI demonstration)
  const [formData, setFormData] = useState({
    age: "30",
    sex: "",
    height: "170",
    weight: "70",
    bodyFat: "",
    location: "Dublin",
    // Step 3
    smoking: "",
    alcohol: "",
    steps: "8000",
    workout: "3",
    strength: "2",
    sleep: "7.5",
    diet: "",
    fastFood: "",
    stress: "",
    water: "",
    // Step 4
    goals: [] as string[],
    notes: "",
    // Step 5
    medicalHistory: [] as string[],
    currentMedications: "",
  });

  const [createUpdateProfile, { isLoading: isSubmitting }] =
    useCreateUpdateProfileMutation();
  const [fetchInsights] = useFetchInsightsMutation();
  const [fetchFutureInsights] = useFetchFutureInsightsMutation();
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">(
    "imperial",
  );

  const handleUnitChange = (newUnit: "imperial" | "metric") => {
    if (newUnit === unitSystem) return;
    setUnitSystem(newUnit);
  };
  console.log(user, "user");

  const handleSubmit = async () => {
    try {
      const apiData = new FormData();

      // Basic Info
      apiData.append("user_id", user?.id?.toString() || "");
      apiData.append("age", formData.age);
      apiData.append(
        "sex",
        formData.sex.charAt(0).toUpperCase() + formData.sex.slice(1),
      ); // Normalize to "Male"/"Female"
      // apiData.append("height", formData.height);
      // apiData.append("weight", formData.weight);
      // Normalize to metric before sending
      let finalHeight = Number(formData.height);
      let finalWeight = Number(formData.weight);



      // Always send metric to backend
      // apiData.append("height", finalHeight.toFixed(1)); // cm
      apiData.append("height", Math.round(finalHeight).toString());
      // apiData.append("weight", finalWeight.toFixed(1)); // kg
      apiData.append("weight", Math.round(finalWeight).toString());
      apiData.append("body_fat", formData.bodyFat || "0");
      apiData.append("location", formData.location);
      apiData.append("agreed_terms", agreed ? "1" : "0");

      // Habits mapping
      apiData.append("stress_level", formData.stress || "5");
      apiData.append("daily_step", formData.steps || "8000");
      apiData.append("sleep_hour", formData.sleep || "7.5");
      apiData.append("water_consumption_week", formData.water || "14");
      apiData.append("overall_diet_quality", formData.diet || "Good");
      apiData.append("fast_food_frequency", formData.fastFood || "Once a week");
      apiData.append("strength_training_week", formData.strength || "2");
      apiData.append("workout_week", formData.workout || "3");

      // Goals Mapping (Ensure keys match screenshot and values are "1" or "0")
      apiData.append(
        "is_athletic",
        formData.goals.includes("Athletic") ? "1" : "0",
      );
      apiData.append("toned", formData.goals.includes("Toned") ? "1" : "0");
      apiData.append("lean", formData.goals.includes("Lean") ? "1" : "0");
      apiData.append(
        "muscular",
        formData.goals.includes("Muscular") ? "1" : "0",
      );
      apiData.append(
        "curvy_fit",
        formData.goals.includes("Curvy-Fit") ? "1" : "0",
      );

      apiData.append("notes", formData.notes || "N/A");
      apiData.append(
        "diabetes",
        formData.medicalHistory.includes("Diabetes") ? "1" : "0",
      );
      apiData.append(
        "high_blood_pressure",
        formData.medicalHistory.includes("High Blood Pressure") ? "1" : "0",
      );
      apiData.append(
        "high_cholesterol",
        formData.medicalHistory.includes("High Cholesterol") ? "1" : "0",
      );
      apiData.append(
        "heart_disease",
        formData.medicalHistory.includes("Heart Disease") ? "1" : "0",
      );
      apiData.append(
        "asthma",
        formData.medicalHistory.includes("Asthma") ? "1" : "0",
      );
      apiData.append(
        "athritis",
        formData.medicalHistory.includes("Arthritis") ? "1" : "0",
      );
      apiData.append(
        "depression",
        formData.medicalHistory.includes("Depression") ? "1" : "0",
      );
      apiData.append(
        "anxiety",
        formData.medicalHistory.includes("Anxiety") ? "1" : "0",
      );
      apiData.append(
        "sleep_apnea",
        formData.medicalHistory.includes("Sleep Apnea") ? "1" : "0",
      );
      apiData.append(
        "thyroid_issue",
        formData.medicalHistory.includes("Thyroid Issues") ? "1" : "0",
      );
      apiData.append("current_medication", formData.currentMedications || "0");
      apiData.append("user_type", "individual");

      // Log the data being sent for debugging
      console.log("Submitting Profile Data:");
      apiData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const res = await createUpdateProfile(apiData).unwrap();
      if (res.success) {
        toast.success("Profile updated successfully!");

        // Automated Insights Fetching
        try {
          fetchInsights({ user_id: Number(user?.id) });

          fetchFutureInsights({
            user_id: String(user?.id),
            timeframe: "5 years",
          });

          console.log(
            "Triggered automated insights fetching in the background",
          );
        } catch (error) {
          console.error("Failed to trigger automated insights:", error);
        }

        router.push("/personalize-journey/onboarding?completed=true");
      }
    } catch (error: any) {
      console.error("Profile submission error:", error);
      toast.error(
        error?.data?.message || "Failed to save profile. Please try again.",
      );
    }
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const progress =
    step === 1 ? 20 : step === 2 ? 40 : step === 3 ? 60 : step === 4 ? 80 : 100;

  return (
    <div className="bg-[#F8FAFB]  overflow-hidden">
      {/* Back Arrow - Absolute Top Left (matches other pages) */}
      <div className="absolute top-4  md:top-6 md:left-10 z-10">
        {step === 1 ? (
          <Link
            href="/welcome"
            className="w-10 h-10 border border-[rgba(58,134,255,0.2)] rounded-lg flex items-center justify-center hover:bg-white/50 transition-all bg-white shadow-sm"
          >
            <ChevronLeft size={24} className="text-[#041228]" />
          </Link>
        ) : (
          <button
            onClick={prevStep}
            className="w-10 h-10 border border-[rgba(58,134,255,0.2)] rounded-lg flex items-center justify-center hover:bg-white/50 transition-all bg-white shadow-sm cursor-pointer"
          >
            <ChevronLeft size={24} className="text-[#041228]" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center py-4 px-4 md:py-6">
        {/* Progress Header */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-6">
          <div className="w-10" /> {/* Spacer for back arrow */}
          <div className="flex-1 px-0">
            <div className="flex justify-between items-center mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <span>STEP {step} OF 5</span>
              <span>{progress}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3A86FF] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="w-10" />
        </div>

        {/* Content Area */}
        <div className="w-full max-w-4xl mt-4">
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[rgba(58,134,255,0.25)] shadow-sm flex flex-col items-center">
              <p className="text-gray-400 text-sm mb-8 text-center">
                Before we begin, please review and accept our terms
              </p>

              <div className="w-full space-y-4 bg-[#F8FAFF] rounded-2xl p-4 md:p-6 mb-8 max-h-[500px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <section>
                  <h2 className="text-[#041228] font-bold text-lg mb-2">
                    Educational Use Only
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    BioVue Digital Wellness provides educational visualizations
                    based on lifestyle data and medical research. Our
                    projections are illustrative and not medical advice. Always
                    consult qualified healthcare professionals for medical
                    decisions.
                  </p>
                </section>

                <section>
                  <h2 className="text-[#041228] font-bold text-lg mb-2">
                    Data Privacy & Security
                  </h2>
                  <ul className="space-y-3">
                    {[
                      "Your health data and photos are stored securely and encrypted",
                      "We comply with GDPR and CCPA privacy regulations",
                      "You can delete all your data at any time from your account settings",
                      "Your data is never shared with third parties without explicit consent",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 text-[#3A86FF] bg-[#E8F1FF] rounded-full p-0.5">
                          <CheckCircle size={16} />
                        </div>
                        <span className="text-gray-400 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-[#041228] font-bold text-lg mb-2">
                    AI-Generated Content
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Future body projections are generated using AI technology
                    based on your inputs. Results are estimates and individual
                    outcomes may vary significantly.
                  </p>
                </section>
              </div>

              <label className="w-full flex items-start gap-4 p-5 rounded-2xl border border-[#3A86FF]/10 bg-white cursor-pointer hover:bg-gray-50 transition-all mb-10 group">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-[#3A86FF] focus:ring-[#3A86FF]"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-[#041228] font-bold text-[15px] group-hover:text-[#3A86FF] transition-colors">
                    I understand and agree to the terms above.
                  </span>
                  <span className="text-gray-400 text-[13px]">
                    I acknowledge that BioVue provides educational insights only
                    and not medical advice.
                  </span>
                </div>
              </label>

              <button
                onClick={nextStep}
                disabled={!agreed}
                className="w-full md:w-auto min-w-[320px] bg-primary text-white py-4 px-10 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none cursor-pointer"
              >
                Continue
                <ArrowRight size={22} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[rgba(58,134,255,0.25)] shadow-sm">
              {/* <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#E8F1FF] rounded-xl flex items-center justify-center text-[#3A86FF]">
                  <BookOpen size={22} />
                </div>
                <h2 className="text-[#041228] text-2xl font-bold">
                  Tell Us a Bit About You
                </h2>
              </div>
              <p className="text-gray-400 text-[15px] mb-10 ml-12">
                We&apos;ll use this to personalize your experience
              </p> */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                {/* Left: Title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E8F1FF] rounded-xl flex items-center justify-center text-[#3A86FF]">
                    <BookOpen size={22} />
                  </div>
                  <div>
                    <h2 className="text-[#041228] text-2xl font-bold">
                      Tell Us a Bit About You
                    </h2>
                    <p className="text-gray-400 text-[14px]">
                      We’ll use this to personalize your experience
                    </p>
                  </div>
                </div>

                {/* Right: Toggle */}
                <div className="flex justify-start md:justify-end">
                  <div className="flex bg-[#F1F5F9] rounded-xl p-1 shadow-sm border border-gray-100">
                    <button
                      onClick={() => handleUnitChange("imperial")}
                      className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                        unitSystem === "imperial"
                          ? "bg-white shadow text-[#041228]"
                          : "text-gray-400 hover:text-[#041228]"
                      }`}
                    >
                      Imperial
                    </button>

                    <button
                      onClick={() => handleUnitChange("metric")}
                      className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                        unitSystem === "metric"
                          ? "bg-white shadow text-[#041228]"
                          : "text-gray-400 hover:text-[#041228]"
                      }`}
                    >
                      Metric
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
                {/* Age */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Calendar size={18} className="text-[#3A86FF]" />
                    Age <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-4 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 transition-all font-medium"
                    placeholder="30"
                  />
                </div>

                {/* Sex */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <User size={18} className="text-[#3A86FF]" />
                    Sex <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.sex}
                    onChange={(e) =>
                      setFormData({ ...formData, sex: e.target.value })
                    }
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-4 px-5 text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 transition-all font-medium appearance-none"
                  >
                    <option value="">Select.....</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Height */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Ruler size={18} className="text-[#3A86FF]" />
                    Height <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      className="flex-1 bg-[#F8FAFF] border border-gray-100 rounded-xl py-4 px-5 text-gray-700 font-medium"
                    />
                    <select className="w-32 bg-[#F8FAFB] border border-gray-100 rounded-xl py-4 px-5 text-gray-500 font-medium">
                      <option>{unitSystem === "metric" ? "cm" : "inch"}</option>
                    </select>
                  </div>
                </div>

                {/* Weight */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Weight size={18} className="text-[#3A86FF]" />
                    Weight <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className="flex-1 bg-[#F8FAFF] border border-gray-100 rounded-xl py-4 px-5 text-gray-700 font-medium"
                    />
                    <select className="w-32 bg-[#F8FAFB] border border-gray-100 rounded-xl py-4 px-5 text-gray-500 font-medium">
                      <option>{unitSystem === "metric" ? "kg" : "lbs"}</option>
                    </select>
                  </div>
                </div>

                {/* Body Fat */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Activity size={18} className="text-[#3A86FF]" />
                    Body Fat (Optional) (%)
                  </label>
                  <input
                    type="number"
                    value={formData.bodyFat}
                    onChange={(e) =>
                      setFormData({ ...formData, bodyFat: e.target.value })
                    }
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-4 px-5 text-gray-700 font-medium"
                  />
                  <p className="text-[11px] text-gray-400 italic">
                    If known, this improves metabolic calculations
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <MapPin size={18} className="text-[#3A86FF]" />
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-4 px-5 text-gray-700 font-medium"
                    placeholder="Dublin"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={nextStep}
                  className="w-full md:w-auto min-w-[320px] bg-primary text-white py-4 px-10 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Continue
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[rgba(58,134,255,0.25)] shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#E8F1FF] rounded-xl flex items-center justify-center text-[#3A86FF]">
                  <Crown size={22} />
                </div>
                <h2 className="text-[#041228] text-2xl font-bold">
                  Lifestyle Habits
                </h2>
              </div>
              <p className="text-gray-400 text-[15px] mb-10 ml-12">
                Your daily habits shape your future health
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 mb-8">
                {/* Smoking */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Cigarette size={18} className="text-[#3A86FF]" />
                    Smoking Status
                  </label>
                  <select
                    value={formData.smoking}
                    onChange={(e) =>
                      setFormData({ ...formData, smoking: e.target.value })
                    }
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-3 px-5 text-gray-400 font-medium appearance-none"
                  >
                    <option value="">Select.....</option>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                {/* Alcohol */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <GlassWater size={18} className="text-[#3A86FF]" />
                    Alcohol Consumption
                  </label>
                  <select
                    value={formData.alcohol}
                    onChange={(e) =>
                      setFormData({ ...formData, alcohol: e.target.value })
                    }
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-3 px-5 text-gray-400 font-medium appearance-none"
                  >
                    <option value="">Select.....</option>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Footprints size={18} className="text-[#3A86FF]" />
                    Daily Steps
                  </label>
                  <input
                    type="number"
                    value={formData.steps}
                    onChange={(e) =>
                      setFormData({ ...formData, steps: e.target.value })
                    }
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-3 px-5 text-gray-700 font-medium"
                  />
                </div>

                {/* Workout */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Dumbbell size={18} className="text-[#3A86FF]" />
                    Workout Per Week
                  </label>
                  <input
                    type="number"
                    value={formData.workout}
                    onChange={(e) =>
                      setFormData({ ...formData, workout: e.target.value })
                    }
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-3 px-5 text-gray-700 font-medium"
                  />
                </div>

                {/* Strength */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Zap size={18} className="text-[#3A86FF]" />
                    Strength Training Per Week
                  </label>
                  <input
                    type="number"
                    value={formData.strength}
                    onChange={(e) =>
                      setFormData({ ...formData, strength: e.target.value })
                    }
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-3 px-5 text-gray-700 font-medium"
                  />
                </div>

                {/* Sleep */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Moon size={18} className="text-[#3A86FF]" />
                    Sleep Hours Per Night
                  </label>
                  <input
                    type="number"
                    value={formData.sleep}
                    onChange={(e) =>
                      setFormData({ ...formData, sleep: e.target.value })
                    }
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-3 px-5 text-gray-700 font-medium"
                  />
                </div>

                {/* Diet */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Utensils size={18} className="text-[#3A86FF]" />
                    Overall Diet Quality
                  </label>
                  <input
                    type="text"
                    value={formData.diet}
                    onChange={(e) =>
                      setFormData({ ...formData, diet: e.target.value })
                    }
                    placeholder="e.g. Good, Excellent"
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-3 px-5 text-gray-700 font-medium"
                  />
                </div>

                {/* Fast Food */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Utensils size={18} className="text-[#3A86FF]" />
                    Fast Food Frequency
                  </label>
                  <input
                    type="text"
                    value={formData.fastFood}
                    onChange={(e) =>
                      setFormData({ ...formData, fastFood: e.target.value })
                    }
                    placeholder="e.g. Once a week"
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-3 px-5 text-gray-700 font-medium"
                  />
                </div>

                {/* Stress */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Activity size={18} className="text-[#3A86FF]" />
                    Stress Level (1 Low to 10 High)
                  </label>
                  <input
                    type="number"
                    value={formData.stress}
                    onChange={(e) =>
                      setFormData({ ...formData, stress: e.target.value })
                    }
                    placeholder="e.g. 5"
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-3 px-5 text-gray-700 font-medium"
                  />
                </div>

                {/* Water */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[#041228] font-bold text-sm">
                    <Droplets size={18} className="text-[#3A86FF]" />
                    Water Consumption Per Day (Ounces)
                  </label>
                  <input
                    type="number"
                    value={formData.water}
                    onChange={(e) =>
                      setFormData({ ...formData, water: e.target.value })
                    }
                    placeholder="e.g. 14"
                    className="w-full bg-[#F8FAFF] border border-gray-100 rounded-xl py-3 px-5 text-gray-700 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={nextStep}
                  className="w-full md:w-auto min-w-[320px] bg-primary text-white py-4 px-10 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Continue
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[rgba(58,134,255,0.25)] shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#E8F1FF] rounded-xl flex items-center justify-center text-[#3A86FF]">
                  <Activity size={22} />
                </div>
                <h2 className="text-[#041228] text-2xl font-bold">
                  Your Health Goals
                </h2>
              </div>
              <p className="text-gray-400 text-[15px] mb-6 ml-12">
                Define your ideal future to shape your healthy trajectory
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {[
                  {
                    title: "Athletic",
                    desc: "Well-rounded fitness, moderate muscle",
                  },
                  {
                    title: "Toned",
                    desc: "Lean with visible muscle definition",
                  },
                  { title: "Lean", desc: "Slim build, low body fat" },
                  { title: "Muscular", desc: "High muscle mass, strong build" },
                  { title: "Curvy-Fit", desc: "Curves with muscle tone" },
                ].map((goal, i) => (
                  <label
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#F8FAFF] cursor-pointer hover:border-[#3A86FF]/30 hover:bg-white transition-all group"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[#041228] font-bold text-[15px] group-hover:text-[#3A86FF] transition-colors">
                        {goal.title}
                      </span>
                      <span className="text-gray-400 text-[12px]">
                        {goal.desc}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="healthGoal"
                      className="w-5 h-5 border-gray-300 text-[#3A86FF] focus:ring-[#3A86FF]"
                      checked={formData.goals.includes(goal.title)}
                      onChange={() => {
                        setFormData({ ...formData, goals: [goal.title] });
                      }}
                    />
                  </label>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="text-[#041228] font-bold text-[15px]">
                  Additional Goals & Notes
                </h3>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full bg-[#F8FAFF] border border-gray-100 rounded-2xl p-5 text-gray-700 font-medium min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 transition-all placeholder:text-gray-300"
                  placeholder="Describe how you want to look and feel in the future... (e.g., 'I want to feel energetic, run a 5K, and have visible abs')"
                />
              </div>

              <div className="bg-[#F2F4F7] rounded-2xl p-6 mb-8">
                <p className="text-[#475467] text-sm leading-relaxed font-medium">
                  <span className="font-bold">Next Step:</span> Provide your
                  medical history to ensure safety and accuracy in our
                  recommendations.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={nextStep}
                  className="w-full md:w-auto min-w-[320px] bg-[#0FA4A9] text-white py-4 px-10 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-[#0FA4A9]/20 cursor-pointer"
                >
                  Continue
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[rgba(58,134,255,0.25)] shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#E8F1FF] rounded-xl flex items-center justify-center text-[#3A86FF]">
                  <FileText size={22} />
                </div>
                <h2 className="text-[#041228] text-2xl font-bold">
                  Medical History
                </h2>
              </div>
              <p className="text-gray-400 text-[15px] mb-6 ml-12">
                Help us understand your health background for a safer and more
                accurate experience.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {[
                  { title: "Diabetes", desc: "Metabolic" },
                  { title: "Heart Disease", desc: "Chronic" },
                  { title: "High Blood Pressure", desc: "Metabolic" },
                  { title: "High Cholesterol", desc: "Metabolic" },
                  { title: "Asthma", desc: "Chronic" },
                  { title: "Arthritis", desc: "Chronic" },
                  { title: "Depression", desc: "Mental Health" },
                  { title: "Anxiety", desc: "Mental Health" },
                  { title: "Sleep Apnea", desc: "General" },
                  { title: "Thyroid Issues", desc: "Metabolic" },
                ].map((condition, i) => (
                  <label
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#E5E9EA] bg-white cursor-pointer hover:border-[#3A86FF]/30 hover:bg-[#F8FAFF] transition-all group"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[#041228] font-bold text-[15px] group-hover:text-[#3A86FF] transition-colors">
                        {condition.title}
                      </span>
                      <span className="text-gray-400 text-[12px]">
                        {condition.desc}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-[#3A86FF] focus:ring-[#3A86FF]"
                      checked={formData.medicalHistory.includes(
                        condition.title,
                      )}
                      onChange={(e) => {
                        const newHistory = e.target.checked
                          ? [...formData.medicalHistory, condition.title]
                          : formData.medicalHistory.filter(
                              (c) => c !== condition.title,
                            );
                        setFormData({
                          ...formData,
                          medicalHistory: newHistory,
                        });
                      }}
                    />
                  </label>
                ))}
              </div>

              <div className="mb-8">
                <button
                  onClick={() =>
                    setFormData({ ...formData, medicalHistory: [] })
                  }
                  className="bg-[#2C3A4B] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all cursor-pointer"
                >
                  None of the above
                </button>
              </div>

              <div className="space-y-2 mb-6">
                <h3 className="text-[#041228] font-bold text-[16px]">
                  Current Medications (Optional)
                </h3>
                <p className="text-gray-400 text-[14px] mb-2">
                  List any prescriptions or supplements you&apos;re currently
                  taking.
                </p>
                <textarea
                  value={formData.currentMedications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentMedications: e.target.value,
                    })
                  }
                  className="w-full bg-[#F8FAFF] border border-[#E5E9EA] rounded-xl p-4 text-gray-700 font-medium min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 transition-all placeholder:text-gray-300 mt-2"
                  placeholder="E.g. Metformin 500mg daily, Omega-3 supplement..."
                />
              </div>

              <div className="mb-8">
                <p className="text-[#3A86FF] text-[13px] font-medium">
                  This information is private & encrypted
                </p>
              </div>

              <div className="flex justify-center flex-col md:flex-row items-center">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full md:w-auto min-w-[320px] bg-[#0FA4A9] text-white py-4 px-10 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-[#0FA4A9]/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={22} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight size={22} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepsPage;
