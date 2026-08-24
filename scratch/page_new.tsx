"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  LogOut,
  User,
  ChevronDown,
  HelpCircle,
  Sparkles,
  UploadCloud,
  Check,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { logout, selectCurrentUser } from "@/redux/features/slice/authSlice";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";
import { useGetExternalApiQuery } from "@/redux/features/api/externalApi";
import { poppins } from "@/app/font";

export default function ApiUserDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { data: profileResponse } = useGetProfileQuery(currentUser?.id, {
    skip: !currentUser?.id,
  });
  const { data: externalApiResponse } = useGetExternalApiQuery(undefined, {
    skip: !currentUser?.id,
  });

  const [apiKey, setApiKey] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeApiTab, setActiveApiTab] = useState("combined");

  // Retrieve API Key
  useEffect(() => {
    if (externalApiResponse?.success && externalApiResponse?.data?.api_key) {
      setApiKey(externalApiResponse.data.api_key);
    }
  }, [externalApiResponse]);

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

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const displayName =
    profileResponse?.data?.name ||
    currentUser?.name ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "API Partner");

  // Form State
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    height_cm: "",
    weight_lbs: "",
    body_fat_percent: "",
    activity_level: "moderate",
    weekly_workout_sessions: "",
    weekly_avg_daily_steps: "",
    weekly_avg_sleep_hours: "",
    weekly_avg_water_litres: "",
    nutrition_quality: "",
    alcohol_consumption: "none",
    fast_food_frequency: "rarely",
    stress_level: "low",
    smoking: "no",
    goal_type: "Toned",
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
    resolution: "1K",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseImages, setResponseImages] = useState<{ current: string; future: string } | null>(null);

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
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "") {
          form.append(key, value.toString());
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
      
      const currentImg = data.current_projection_base64 || data.current_image || data.current;
      const futureImg = data.future_projection_base64 || data.future_image || data.future || data.projected;

      if (currentImg && futureImg) {
        setResponseImages({
            current: currentImg.startsWith("data:image") ? currentImg : `data:image/png;base64,${currentImg}`,
            future: futureImg.startsWith("data:image") ? futureImg : `data:image/png;base64,${futureImg}`
        });
        toast.success("Projection generated successfully!");
      } else if (data.data) {
          const currentImg = data.data.current_projection_base64 || data.data.current_image || data.data.current;
          const futureImg = data.data.future_projection_base64 || data.data.future_image || data.data.future || data.data.projected;
          
          if (currentImg && futureImg) {
            setResponseImages({
                current: currentImg.startsWith("data:image") ? currentImg : `data:image/png;base64,${currentImg}`,
                future: futureImg.startsWith("data:image") ? futureImg : `data:image/png;base64,${futureImg}`
            });
            toast.success("Projection generated successfully!");
          } else {
            console.log(data);
            toast.success("Success! Check console for data structure.");
          }
      } else {
        console.log(data);
        toast.success("Success! Check console for data structure.");
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to generate projection.");
    } finally {
      setIsSubmitting(false);
    }
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
              API Interface
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
        <main className="max-w-6xl mx-auto px-6 mt-8">
          {/* Top Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-2xl mb-8 border border-slate-800/50">
             <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-widest backdrop-blur-sm mb-4">
                  <Sparkles className="w-4 h-4" />
                  Premium API Access
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                  API Tools Suite
                </h1>
                <p className="text-slate-300 text-sm max-w-xl">
                  Leverage BioVue's Neural Engine to project future wellness and outcomes based on your inputs.
                </p>
             </div>
             {/* Backdrop Glow Effects */}
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
          </div>

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
              onClick={() => setActiveApiTab("api2")}
              className={`text-sm font-bold pb-4 -mb-[1px] border-b-2 transition-colors ${
                activeApiTab === "api2"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Future API 2
            </button>
            <button
              onClick={() => setActiveApiTab("api3")}
              className={`text-sm font-bold pb-4 -mb-[1px] border-b-2 transition-colors ${
                activeApiTab === "api3"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Future API 3
            </button>
          </div>

          {activeApiTab === "combined" && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
               <h2 className="text-xl font-extrabold text-gray-900 mb-6">Generate Projection</h2>
               
               <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Section 1: Vitals */}
                  <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">1. Vitals & Personal Info</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-gray-700 mb-1">Age *</label>
                           <input required type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 30" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-700 mb-1">Gender *</label>
                           <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white">
                             <option value="male">Male</option>
                             <option value="female">Female</option>
                             <option value="other">Other</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-700 mb-1">Height (cm) *</label>
                           <input required type="number" name="height_cm" value={formData.height_cm} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 175" />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-700 mb-1">Weight (lbs) *</label>
                           <input required type="number" name="weight_lbs" value={formData.weight_lbs} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 160" />
                        </div>
                     </div>
                  </div>

                  {/* Section 2: Lifestyle */}
                  <div className="space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">2. Lifestyle & Habits</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-gray-700 mb-1">Activity Level</label>
                           <select name="activity_level" value={formData.activity_level} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white">
                             <option value="sedentary">Sedentary</option>
                             <option value="moderate">Moderate</option>
                             <option value="active">Active</option>
                             <option value="very active">Very Active</option>
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
                           <select required name="alcohol_consumption" value={formData.alcohol_consumption} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white">
                             <option value="none">None</option>
                             <option value="light">Light</option>
                             <option value="moderate">Moderate</option>
                             <option value="heavy">Heavy</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-700 mb-1">Fast Food Freq *</label>
                           <select required name="fast_food_frequency" value={formData.fast_food_frequency} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white">
                             <option value="never">Never</option>
                             <option value="rarely">Rarely</option>
                             <option value="sometimes">Sometimes</option>
                             <option value="often">Often</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-700 mb-1">Stress Level *</label>
                           <select required name="stress_level" value={formData.stress_level} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white">
                             <option value="low">Low</option>
                             <option value="moderate">Moderate</option>
                             <option value="high">High</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-700 mb-1">Smoking *</label>
                           <select required name="smoking" value={formData.smoking} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white">
                             <option value="no">No</option>
                             <option value="yes">Yes</option>
                             <option value="occasionally">Occasionally</option>
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
                           <select name="goal_type" value={formData.goal_type} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white">
                             <option value="Lean">Lean</option>
                             <option value="Toned">Toned</option>
                             <option value="Athletic">Athletic</option>
                             <option value="Muscular">Muscular</option>
                             <option value="Curvy Fit">Curvy Fit</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-700 mb-1">Timeframe *</label>
                           <input required type="text" name="goal_timeframe" value={formData.goal_timeframe} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 3 months" />
                        </div>
                        <div className="sm:col-span-3">
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

                  {/* Section 5: Image Upload */}
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
                        <div className="sm:w-64 space-y-4 w-full">
                           <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1">Resolution</label>
                              <select name="resolution" value={formData.resolution} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white">
                                <option value="1K">1K</option>
                                <option value="2K">2K</option>
                                <option value="4K">4K</option>
                              </select>
                           </div>
                           <button 
                             disabled={isSubmitting}
                             type="submit" 
                             className="w-full h-12 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
                           >
                              {isSubmitting ? (
                                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                 <>
                                    <Sparkles className="w-4 h-4" />
                                    Generate Projection
                                 </>
                              )}
                           </button>
                        </div>
                     </div>
                  </div>
               </form>

               {/* Results Section */}
               <AnimatePresence>
                 {responseImages && (
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
            </div>
          )}

          {activeApiTab === "api2" && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center h-64">
               <Sparkles className="w-12 h-12 text-teal-200 mb-4" />
               <h2 className="text-xl font-bold text-gray-800">Future API 2 (Coming Soon)</h2>
               <p className="text-gray-500 text-sm mt-2">This endpoint is reserved for future integration.</p>
            </div>
          )}

          {activeApiTab === "api3" && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center h-64">
               <Sparkles className="w-12 h-12 text-teal-200 mb-4" />
               <h2 className="text-xl font-bold text-gray-800">Future API 3 (Coming Soon)</h2>
               <p className="text-gray-500 text-sm mt-2">This endpoint is reserved for future integration.</p>
            </div>
          )}

        </main>
      </div>
    </ProtectedRoute>
  );
}
