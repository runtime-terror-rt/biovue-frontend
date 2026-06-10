"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, selectCurrentToken, updateUser } from "@/redux/features/slice/authSlice";

import {
  useGetSubscriptionPlansQuery,
  useGetPaymentSummaryQuery,
  useCancelSubscriptionMutation,
  useProcessPaymentMutation,
} from "@/redux/features/api/paymentApi";
import Swal from "sweetalert2";
import {
  useGetNotificationsQuery,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/redux/features/api/userDashboard/notificationApi";
import {
  useFetchInsightsMutation,
  useFetchFutureInsightsMutation,
} from "@/redux/features/api/userDashboard/insightsApi";
import {
  useCreateUpdateProfileMutation,
  useGetProfileQuery,
} from "@/redux/features/api/profileApi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  ArrowLeft,
  User,
  CreditCard,
  Smartphone,
  Plus,
  Info,
  Bell,
  ShieldCheck,
  Download,
  Trash2,
  LogOut,
  Calendar,
  ChevronDown,
  Check,
  Crown,
} from "lucide-react";
import { cn, getFullImageUrl } from "@/lib/utils";

// --- Types ---
type ViewState = "overview" | "profile" | "subscription";

// --- Main Page ---
const SettingsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const [view, setView] = useState<ViewState>("overview");

  useEffect(() => {
    if (tab === "subscription") {
      setView("subscription");

      // Auto-scroll to billing cycle after a short delay to ensure component is rendered
      setTimeout(() => {
        const element = document.getElementById("billing-cycle");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, [tab]);

  const currentUser = useSelector(selectCurrentUser);

  // Notifications API
  const {
    data: notificationSettingsData,
    isLoading: isLoadingSettings,
    refetch: refetchNotifications,
  } = useGetNotificationSettingsQuery();
  const [updateNotificationSettings] = useUpdateNotificationSettingsMutation();

  // Default settings to use when API data is not yet available
  const DEFAULT_SETTINGS = {
    coach_messages: 1,
    goal_updates: 1,
    check_in_reminder_alerts: 1,
    ai_insights: 1,
    subscription_updates: 1,
    missed_checkin_alerts: 1,
    program_milestone_updates: 1,
    weekly_summary_email: 1,
    auto_remind_missed_checkins: 1,
    default_reminder_time: "08:00 AM",
  };

  // Local state for smooth toggles
  const [localSettings, setLocalSettings] = useState<any>(null);

  // Synchronize local state with remote data, but only on initial load
  // or when not actively toggling to prevent flickering.
  useEffect(() => {
    if (notificationSettingsData?.data) {
      setLocalSettings(notificationSettingsData.data);
    } else if (!isLoadingSettings && !notificationSettingsData?.data) {
      // If loading is finished and no data exists, use defaults
      setLocalSettings(DEFAULT_SETTINGS);
    }
  }, [notificationSettingsData, isLoadingSettings]);

  const handleNotificationToggle = async (key: string) => {
    // Use localSettings or fallback to DEFAULT_SETTINGS if localSettings is still null
    const currentSettings = localSettings || DEFAULT_SETTINGS;
    const currentValue =
      currentSettings[key] ??
      DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
    const newValue = currentValue === 1 ? 0 : 1;

    console.log(`Toggling ${key} from ${currentValue} to ${newValue}`);

    // Optimistically update local state
    setLocalSettings((prev: any) => {
      const base = prev || DEFAULT_SETTINGS;
      const updated = {
        ...base,
        [key]: newValue,
      };
      console.log("Updated localSettings:", updated);
      return updated;
    });

    try {
      // Use the original GET key and integer value (0/1) as expected by the backend
      const payload = {
        [key]: newValue,
      };

      const response = await updateNotificationSettings(payload).unwrap();
      console.log("API Response:", response);
      toast.success("Notification settings updated");

      // Manually refetch to ensure data is up to date
      await refetchNotifications();
    } catch (error: any) {
      console.error("Update failed:", error);
      // Revert if API fails
      setLocalSettings((prev: any) => ({
        ...(prev || DEFAULT_SETTINGS),
        [key]: currentValue,
      }));
      toast.error(
        error?.data?.message || "Failed to update notification settings",
      );
    }
  };

  const handleReminderTimeChange = async (newTime: string) => {
    if (!localSettings) return;

    const oldTime = localSettings.default_reminder_time;

    // Optimistically update local state
    setLocalSettings((prev: any) => ({
      ...prev,
      default_reminder_time: newTime,
    }));

    try {
      await updateNotificationSettings({
        reminder_time: newTime,
      }).unwrap();
      toast.success("Reminder time updated");
    } catch (error) {
      // Revert if API fails
      setLocalSettings((prev: any) => ({
        ...prev,
        default_reminder_time: oldTime,
      }));
      toast.error("Failed to update reminder time");
    }
  };

  const notificationItems = [
    {
      label: "Coach messages",
      sub: "Instant alerts when your coach writes to you",
      active: localSettings?.coach_messages === 1,
      key: "coach_messages",
    },
    {
      label: "Goal Updates",
      sub: "Alerts when a coach approves, edits, or comments on your goals.",
      active: localSettings?.goal_updates === 1,
      key: "goal_updates",
    },
    {
      label: "Check-in & Reminder Alerts",
      sub: "Reminders for scheduled check-ins, habits, or missed logs.",
      active: localSettings?.check_in_reminder_alerts === 1,
      key: "check_in_reminder_alerts",
    },
    {
      label: "AI Insights & Recommendations",
      sub: "Notifications when new AI-generated insights or suggestions are available.",
      active: localSettings?.ai_insights === 1,
      key: "ai_insights",
    },
    {
      label: "Subscription & Account Updates",
      sub: "Billing reminders, plan changes, and important account notices.",
      active: localSettings?.subscription_updates === 1,
      key: "subscription_updates",
    },
    {
      label: "Missed Check-in Alerts",
      sub: "Alerts when you miss your scheduled check-ins.",
      active: localSettings?.missed_checkin_alerts === 1,
      key: "missed_checkin_alerts",
    },
    {
      label: "Program Milestone Updates",
      sub: "Notifications about your program progress and milestones.",
      active: localSettings?.program_milestone_updates === 1,
      key: "program_milestone_updates",
    },
    {
      label: "Weekly Summary Email",
      sub: "Receive a weekly summary of your health and fitness progress.",
      active: localSettings?.weekly_summary_email === 1,
      key: "weekly_summary_email",
    },
    {
      label: "Auto Remind Missed Check-ins",
      sub: "Automatically send reminders when you miss a check-in.",
      active: localSettings?.auto_remind_missed_checkins === 1,
      key: "auto_remind_missed_checkins",
    },
  ];

  if (view === "profile")
    return (
      <ProfileEditView
        onBack={() => setView("overview")}
        currentUser={currentUser}
      />
    );
  if (view === "subscription")
    return (
      <SubscriptionView
        onBack={() => setView("overview")}
        currentUser={currentUser}
        router={router}
      />
    );

  return (
    <div className="flex flex-col gap-10 p-6 md:p-8 w-full min-h-screen pb-24">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1F2D2E]">Settings</h1>
        <p className="text-[#5F6F73] text-sm font-medium">
          Manage your account, data, and preferences
        </p>
      </div>

      {/* Account Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-[#1F2D2E]">Account</h2>
        <div className="bg-white rounded-[16px] border border-[#3A86FF]/25 shadow-sm overflow-hidden">
          {/* Profile Information */}
          <div className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFB] flex items-center justify-center text-[#94A3B8]">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1F2D2E]">
                  Profile Information
                </span>
                <span className="text-[11px] text-[#5F6F73] font-medium">
                  Name, age, height, and health markers
                </span>
              </div>
            </div>
            <button
              onClick={() => setView("profile")}
              className="text-[#3A86FF] text-xs font-bold hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>

          {/* Subscription & Billing */}
          <div className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFB] flex items-center justify-center text-[#94A3B8]">
                <CreditCard size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1F2D2E]">
                  Subscription & Billing
                </span>
                <span className="text-[11px] text-[#5F6F73] font-medium">
                  Premium Wellness Plan • Next billing Mar 15
                </span>
              </div>
            </div>
            <button
              onClick={() => setView("subscription")}
              className="text-[#3A86FF] text-xs font-bold hover:underline cursor-pointer"
            >
              Manage Plan
            </button>
          </div>
        </div>
      </section>

      {/* Data & Integrations */}
      {/* <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#1F2D2E]">Data & Integrations</h2>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-widest">DATA INPUT PREFERENCE</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#EAFBF7] rounded-[16px] p-4 border-2 border-[#0FA4A9] flex items-center gap-3 cursor-pointer">
                <div className="w-5 h-5 rounded-full border-2 border-[#0FA4A9] flex items-center justify-center">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#0FA4A9]" />
                </div>
                <span className="text-sm font-bold text-[#0FA4A9]">Automatic</span>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-all">
                <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                <span className="text-sm font-bold text-[#5F6F73]">Manual Entry</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-[#5F6F73] uppercase tracking-widest">CONNECTED DEVICES</h3>
            <div className="flex flex-col gap-3">
      
              <div className="bg-white rounded-[16px] p-6 border border-gray-50 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F8FAFB] flex items-center justify-center text-[#94A3B8]">
                    <Smartphone size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#1F2D2E]">Fitbit Charge 5</span>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-[#0FA4A9] font-bold flex items-center gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#0FA4A9]" />
                         Connected
                       </span>
                       <span className="text-[10px] text-[#94A3B8] font-medium">• Synced 2m ago</span>
                    </div>
                  </div>
                </div>
                <button className="text-[#94A3B8] text-xs font-bold hover:text-red-500 transition-colors">Disconnect</button>
              </div>

              {["Google Fit", "My FitnessPal", "Apple health"].map((device, idx) => (
                <div key={idx} className="bg-[#E4FBF7] rounded-[16px] p-6 border border-[#0FA4A9]/10 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#94A3B8]">
                      <Smartphone size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#1F2D2E]">{device}</span>
                      <span className="text-[10px] text-[#0FA4A9] font-medium">Connect your Android health metrics.</span>
                    </div>
                  </div>
                  <button className="text-[#0FA4A9] text-xs font-bold hover:underline">Connect</button>
                </div>
              ))}

          
              <button className="w-full py-6 border-2 border-dashed border-gray-100 rounded-[16px] flex items-center justify-center gap-2 text-[#94A3B8] hover:bg-gray-50/50 transition-all group">
                <Plus size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">Connect new device</span>
              </button>
            </div>
          </div>

          <div className="bg-[#F8FAFB] rounded-[12px] p-4 flex items-center gap-3">
             <Info size={16} className="text-[#94A3B8]" />
             <p className="text-[10px] text-[#94A3B8] font-medium italic">
               Automatically synced data will appear in your dashboard and habits to provide more accurate wellness insights.
             </p>
          </div>
        </div>
      </section> */}

      {/* Notifications Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-[#1F2D2E]">Notifications</h2>
        <div className="bg-white rounded-[16px] p-8 border border-[#3A86FF]/25 shadow-sm flex flex-col gap-8">
          {isLoadingSettings && !localSettings ? (
            <div className="flex flex-col gap-8 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                    <div className="h-3 w-64 bg-gray-50 rounded" />
                  </div>
                  <div className="w-12 h-6 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            notificationItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-[#1F2D2E]">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-[#5F6F73] font-medium leading-relaxed max-w-sm">
                    {item.sub}
                  </span>
                </div>
                {/* Toggle */}
                <div
                  onClick={() => handleNotificationToggle(item.key)}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 cursor-pointer transition-all",
                    item.active ? "bg-[#0FA4A9]" : "bg-gray-200",
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 bg-white rounded-full transition-all",
                      item.active ? "ml-6" : "ml-0",
                    )}
                  />
                </div>
              </div>
            ))
          )}

          {!isLoadingSettings && localSettings && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-[#1F2D2E]">
                  Check-in Reminder Time
                </span>
                <span className="text-[10px] text-[#5F6F73] font-medium leading-relaxed max-w-sm">
                  When do you want to receive your check-in reminders?
                </span>
              </div>
              <div className="relative">
                <input
                  type="time"
                  value={
                    localSettings.default_reminder_time?.includes(" ")
                      ? (function () {
                          const parts =
                            localSettings.default_reminder_time.split(" ");
                          const time = parts[0];
                          const modifier = parts[1];
                          let [hoursStr, minutes] = time.split(":");
                          let hours = parseInt(hoursStr, 10);
                          if (modifier === "PM" && hours < 12) hours += 12;
                          if (modifier === "AM" && hours === 12) hours = 0;
                          return `${hours.toString().padStart(2, "0")}:${minutes}`;
                        })()
                      : localSettings.default_reminder_time
                  }
                  onChange={(e) => {
                    const time24 = e.target.value;
                    let [hours, minutes] = time24.split(":");
                    const modifier = parseInt(hours, 10) >= 12 ? "PM" : "AM";
                    hours = (parseInt(hours, 10) % 12 || 12)
                      .toString()
                      .padStart(2, "0");
                    handleReminderTimeChange(`${hours}:${minutes} ${modifier}`);
                  }}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold text-[#1F2D2E] outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 transition-all cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-50">
            <p className="text-[11px] text-[#94A3B8] font-medium italic">
              Choose what you want to be notified about. You can change these
              settings at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      {/* <section className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-[#1F2D2E]">Privacy & Security</h2>
        <div className="bg-white rounded-[16px] border border-[#3A86FF]/25 shadow-sm overflow-hidden">
        
          <div className="p-8 flex items-start gap-6 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#E4EFFF] flex items-center justify-center text-[#3A86FF] shrink-0">
               <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-[#1F2D2E]">Data visibility</span>
              <p className="text-[11px] text-[#5F6F73] font-medium leading-relaxed">
                Your biometric and activity data is private by default. It is only shared with connected professionals you have explicitly authorized.
              </p>
            </div>
          </div>

          <div className="p-8 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-[#1F2D2E] shrink-0">
                 <Download size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-[#1F2D2E]">Download your data</span>
                <span className="text-[11px] text-[#5F6F73] font-medium">Get a copy of your health records in CSV format</span>
              </div>
            </div>
            <button className="text-[#0FA4A9] text-xs font-bold hover:underline">Export</button>
          </div>

        
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                 <Trash2 size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-[#1F2D2E]">Delete account</span>
                <span className="text-[11px] text-[#5F6F73] font-medium">Permanently remove your account and all associated data</span>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-[#F8FAFB] px-4 py-2 rounded-xl border border-gray-100 group transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                 <LogOut size={16} />
              </div>
              <span className="text-red-500 text-xs font-bold">Sign Out</span>
            </button>
          </div>
        </div>

       
        <div className="bg-[#F8FAFB] rounded-[16px] py-4 flex items-center justify-center gap-3">
           <Info size={16} className="text-[#94A3B8]" />
           <span className="text-[10px] text-[#5F6F73] font-bold uppercase tracking-widest">
             END-TO-END ENCRYPTED • HIPAA COMPLIANT STORAGE
           </span>
        </div>
      </section> */}
    </div>
  );
};

// --- Sub-components (Views) ---

const ProfileEditView = ({
  onBack,
  currentUser,
}: {
  onBack: () => void;
  currentUser: any;
}) => {
  const router = useRouter();
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileQuery(
    currentUser?.id,
    { skip: !currentUser?.id },
  );
  const [createUpdateProfile, { isLoading: isUpdatingProfile }] =
    useCreateUpdateProfileMutation();
  const [fetchInsights, { isLoading: isFetchingInsights }] =
    useFetchInsightsMutation();
  const [fetchFutureInsights, { isLoading: isFetchingFutureInsights }] =
    useFetchFutureInsightsMutation();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    age: "",
    sex: "Male",
    height: "",
    weight: "",
    location: "",
    body_fat: "",
    smoking_status: "0",
    alcohol_consumption: "0",
    stress_level: "5",
    daily_step: "",
    sleep_hour: "",
    water_consumption_week: "",
    overall_diet_quality: "Good",
    fast_food_frequency: "Once a week",
    strength_training_week: "3 sessions",
    workout_week: "5 sessions",
    is_athletic: 0,
    toned: 0,
    lean: 0,
    muscular: 0,
    curvy_fit: 0,
    notes: "",
    diabetes: 0,
    high_blood_pressure: 0,
    high_cholesterol: 0,
    heart_disease: 0,
    asthma: 0,
    athritis: 0,
    depression: 0,
    anxiety: 0,
    sleep_apnea: 0,
    thyroid_issue: 0,
    current_medication: "",
    profile_id: "",
    unit_system: "",
  });

  useEffect(() => {
    if (profileData?.data) {
      const u = profileData.data;
      const p = u.profile;
      const m = u.medical_history;

      setFormData({
        name: u?.name || currentUser?.name || "",
        age: p?.age?.toString() || "",
        sex: p?.sex || "Male",
        height: p?.height?.toString() || "",
        weight: p?.weight?.toString() || "",
        location: p?.location || "",
        body_fat: p?.body_fat?.toString() || "",
        smoking_status: p?.smoking_status?.toString() || "0",
        alcohol_consumption: p?.alcohol_consumption?.toString() || "0",
        stress_level: p?.stress_level?.toString() || "5",
        daily_step: p?.daily_step?.toString() || "",
        sleep_hour: p?.sleep_hour?.toString() || "",
        water_consumption_week: p?.water_consumption_week?.toString() || "",
        overall_diet_quality: p?.overall_diet_quality || "good",
        fast_food_frequency: p?.fast_food_frequency || "once in a week",
        strength_training_week: p?.strength_training_week || "3 sessions",
        workout_week: p?.workout_week || "5 sessions",
        is_athletic: p?.is_athletic || 0,
        toned: p?.toned || 0,
        lean: p?.lean || 0,
        muscular: p?.muscular || 0,
        curvy_fit: p?.curvy_fit || 0,
        notes: p?.notes || "",
        diabetes: m?.diabetes || 0,
        high_blood_pressure: m?.high_blood_pressure || 0,
        high_cholesterol: m?.high_cholesterol || 0,
        heart_disease: m?.heart_disease || 0,
        asthma: m?.asthma || 0,
        athritis: m?.athritis || 0,
        depression: m?.depression || 0,
        anxiety: m?.anxiety || 0,
        sleep_apnea: m?.sleep_apnea || 0,
        thyroid_issue: m?.thyroid_issue || 0,
        current_medication: m?.current_medication || "",
        profile_id: p?.id?.toString() || "",
        unit_system: p?.unit_system || "imperial",
      });

      if (p?.image) {
        setImagePreview(getFullImageUrl(p.image));
      }
    }
  }, [profileData, currentUser]);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const wellnessKeys = [
    "is_athletic",
    "toned",
    "lean",
    "muscular",
    "curvy_fit",
  ];

  const toggleField = (field: string) => {
    setFormData((prev) => {
      const updated: any = { ...prev };

      // Reset all to 0
      wellnessKeys.forEach((key) => {
        updated[key] = 0;
      });

      // Set only selected one to 1
      updated[field] = 1;

      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      if (formData.profile_id) {
        data.append("id", formData.profile_id);
      }
      data.append("user_id", currentUser?.id);
      data.append("user_type", "individual");
      data.append("name", formData.name);
      data.append("age", formData.age);
      data.append("sex", formData.sex);
      data.append("height", formData.height);
      data.append("weight", formData.weight);
      data.append("unit", formData.unit_system);
      data.append("unit_system", formData.unit_system);
      data.append("location", formData.location);
      data.append("agreed_terms", "1");
      data.append("body_fat", formData.body_fat);
      data.append("smoking_status", formData.smoking_status);
      data.append("alcohol_consumption", formData.alcohol_consumption);
      data.append("stress_level", formData.stress_level);
      data.append("daily_step", formData.daily_step);
      data.append("sleep_hour", formData.sleep_hour);
      data.append("water_consumption_week", formData.water_consumption_week);
      data.append("overall_diet_quality", formData.overall_diet_quality);
      data.append("fast_food_frequency", formData.fast_food_frequency);
      data.append("strength_training_week", formData.strength_training_week);
      data.append("workout_week", formData.workout_week);

      data.append("is_athletic", formData.is_athletic.toString());
      data.append("toned", formData.toned.toString());
      data.append("lean", formData.lean.toString());
      data.append("muscular", formData.muscular.toString());
      data.append("curvy_fit", formData.curvy_fit.toString());

      data.append("notes", formData.notes);
      data.append("diabetes", formData.diabetes.toString());
      data.append(
        "high_blood_pressure",
        formData.high_blood_pressure.toString(),
      );
      data.append("high_cholesterol", formData.high_cholesterol.toString());
      data.append("heart_disease", formData.heart_disease.toString());
      data.append("asthma", formData.asthma.toString());
      data.append("athritis", formData.athritis.toString());
      data.append("depression", formData.depression.toString());
      data.append("anxiety", formData.anxiety.toString());
      data.append("sleep_apnea", formData.sleep_apnea.toString());
      data.append("thyroid_issue", formData.thyroid_issue.toString());
      data.append("current_medication", formData.current_medication);

      if (image) {
        data.append("image", image);
      }

      const res = await createUpdateProfile(data).unwrap();

      if (res.success) {
        await fetchInsights({ user_id: currentUser?.id }).unwrap();
        await fetchFutureInsights({
          user_id: currentUser?.id,
          timeframe: "5 years",
        }).unwrap();

        toast.success("Profile updated successfully!");
        // We stay on the settings page as requested
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
      console.error(error);
    }
  };

  const isSaving =
    isUpdatingProfile || isFetchingInsights || isFetchingFutureInsights;

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 w-full min-h-screen pb-24 max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#3A86FF]/30 rounded-lg text-[#3A86FF] text-xs font-semibold hover:bg-blue-50/50 transition-all w-fit cursor-pointer"
      >
        <ArrowLeft size={14} />
        Back to Settings
      </button>

      {/* Profile Image Section */}
      <div className="flex flex-col items-center gap-4 bg-white rounded-[24px] p-8 border border-[#3A86FF]/20 shadow-sm">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-[#0FA4A9]/10 overflow-hidden bg-gray-50 flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={64} className="text-[#94A3B8]" />
            )}
          </div>
          <label className="absolute bottom-1 right-1 w-10 h-10 bg-[#0FA4A9] rounded-xl border-4 border-white flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
            <Plus size={20} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-[#1F2D2E]">Profile Picture</h3>
          <p className="text-xs text-[#5F6F73] font-medium mt-1">
            PNG, JPG or JPEG.
          </p>
        </div>
      </div>

      <div className="bg-[#EAFBF7] rounded-[16px] p-6 flex items-center gap-4 text-[#0FA4A9]">
        <Info size={20} />
        <p className="text-xs font-medium">
          This information helps personalize your wellness insights and
          projections. Your privacy is our priority.
        </p>
      </div>

      {/* Personal & Body Section */}
      <div className="bg-white rounded-[16px] p-8 border border-[#3A86FF]/25 shadow-sm flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#1F2D2E]">
          Personal & Body Details
        </h2>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#1F2D2E]">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-[12px] py-4 px-6 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#3A86FF]/10 transition-all"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#1F2D2E]">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-[12px] py-4 px-6 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#3A86FF]/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#1F2D2E]">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-[12px] py-4 px-6 text-sm md:text-base outline-none"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#1F2D2E]">Gender</label>
              <div className="relative">
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 rounded-[12px] py-4 px-6 text-sm md:text-base outline-none appearance-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <ChevronDown
                  size={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0FA4A9] pointer-events-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#1F2D2E]">
                Body Fat (%)
              </label>
              <input
                type="number"
                name="body_fat"
                value={formData.body_fat}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-[12px] py-4 px-6 text-sm md:text-base outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-xs text-[#5F6F73] font-bold uppercase tracking-widest">
                HEIGHT ({formData.unit_system === "metric" ? "metric (cm)" : "imperial (inch)"})
              </label>
              <input
                type="number"
                step="any"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-[12px] py-4 px-6 text-sm md:text-base outline-none"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-xs text-[#5F6F73] font-bold uppercase tracking-widest">
                WEIGHT ({formData.unit_system === "metric" ? "metric (kg)" : "imperial (lbs)"})
              </label>
              <input
                type="number"
                step="any"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-[12px] py-4 px-6 text-sm md:text-base outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lifestyle Section */}
      <div className="bg-white rounded-[16px] p-8 border border-[#3A86FF]/25 shadow-sm flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#1F2D2E]">Lifestyle Context</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#1F2D2E]">
                Stress Level (1-10)
              </label>
              <input
                type="range"
                name="stress_level"
                min="1"
                max="10"
                value={formData.stress_level}
                onChange={handleInputChange}
                className="w-full accent-[#0FA4A9]"
              />
              <div className="flex justify-between text-[10px] text-[#94A3B8] font-bold">
                <span>LOW</span>
                <span className="text-[#0FA4A9] text-sm">
                  {formData.stress_level}
                </span>
                <span>HIGH</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#1F2D2E]">
                Daily Steps
              </label>
              <input
                type="number"
                name="daily_step"
                value={formData.daily_step}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-[12px] py-4 px-6 text-sm outline-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#1F2D2E]">
                Sleep Hours
              </label>
              <input
                type="number"
                name="sleep_hour"
                step="0.5"
                value={formData.sleep_hour}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-[12px] py-4 px-6 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#1F2D2E]">
                Overall Diet Quality
              </label>
              <input
                type="text"
                name="overall_diet_quality"
                value={formData.overall_diet_quality}
                onChange={handleInputChange}
                placeholder="e.g. good"
                className="w-full bg-white border border-gray-200 rounded-[12px] py-4 px-6 text-sm outline-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#1F2D2E]">
                Workout (sessions/week)
              </label>
              <input
                type="text"
                name="workout_week"
                value={formData.workout_week}
                onChange={handleInputChange}
                placeholder="e.g. 3"
                className="w-full bg-white border border-gray-200 rounded-[12px] py-4 px-6 text-sm outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-[#1F2D2E]">
                  Smoking
                </label>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                  <button
                    onClick={() =>
                      setFormData((p) => ({ ...p, smoking_status: "0" }))
                    }
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold",
                      formData.smoking_status === "0"
                        ? "bg-white text-[#0FA4A9] shadow-sm"
                        : "text-[#94A3B8]",
                    )}
                  >
                    No
                  </button>
                  <button
                    onClick={() =>
                      setFormData((p) => ({ ...p, smoking_status: "1" }))
                    }
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold",
                      formData.smoking_status === "1"
                        ? "bg-white text-red-500 shadow-sm"
                        : "text-[#94A3B8]",
                    )}
                  >
                    Yes
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-[#1F2D2E]">
                  Alcohol
                </label>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                  <button
                    onClick={() =>
                      setFormData((p) => ({ ...p, alcohol_consumption: "0" }))
                    }
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold",
                      formData.alcohol_consumption === "0"
                        ? "bg-white text-[#0FA4A9] shadow-sm"
                        : "text-[#94A3B8]",
                    )}
                  >
                    No
                  </button>
                  <button
                    onClick={() =>
                      setFormData((p) => ({ ...p, alcohol_consumption: "1" }))
                    }
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold",
                      formData.alcohol_consumption === "1"
                        ? "bg-white text-red-500 shadow-sm"
                        : "text-[#94A3B8]",
                    )}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wellness Characteristics */}
      <div className="bg-white rounded-[16px] p-8 border border-[#3A86FF]/25 shadow-sm flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#1F2D2E]">
          Wellness Characteristics
        </h2>
        <div className="flex flex-wrap gap-4">
          {[
            { label: "Athletic", key: "is_athletic" },
            { label: "Toned", key: "toned" },
            { label: "Lean", key: "lean" },
            { label: "Muscular", key: "muscular" },
            { label: "Curvy Fit", key: "curvy_fit" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => toggleField(item.key)}
              className={cn(
                "px-6 py-3 rounded-xl font-bold text-sm transition-all border",
                (formData as any)[item.key] === 1
                  ? "bg-[#EAFBF7] border-[#0FA4A9] text-[#0FA4A9] shadow-sm"
                  : "bg-white border-gray-100 text-[#94A3B8] hover:bg-gray-50",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medical History Section */}
      <div className="bg-white rounded-[16px] p-8 border border-[#3A86FF]/25 shadow-sm flex flex-col gap-8">
        <h2 className="text-xl font-bold text-[#1F2D2E]">Medical History</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
          {[
            { label: "Diabetes", key: "diabetes" },
            { label: "High Blood Pressure", key: "high_blood_pressure" },
            { label: "High Cholesterol", key: "high_cholesterol" },
            { label: "Heart Disease", key: "heart_disease" },
            { label: "Asthma", key: "asthma" },
            { label: "Arthritis", key: "athritis" },
            { label: "Depression", key: "depression" },
            { label: "Anxiety", key: "anxiety" },
            { label: "Sleep Apnea", key: "sleep_apnea" },
            { label: "Thyroid Issue", key: "thyroid_issue" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => toggleField(item.key)}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                  (formData as any)[item.key] === 1
                    ? "bg-[#0FA4A9] border-[#0FA4A9]"
                    : "border-gray-200 group-hover:border-[#0FA4A9]/50",
                )}
              >
                {(formData as any)[item.key] === 1 && (
                  <Check size={14} className="text-white" />
                )}
              </div>
              <span className="text-sm font-semibold text-[#5F6F73]">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <label className="text-sm font-bold text-[#1F2D2E]">
            Current Medication (Optional)
          </label>
          <textarea
            name="current_medication"
            value={formData.current_medication}
            onChange={handleInputChange}
            rows={3}
            placeholder="List any medications you are currently taking..."
            className="w-full bg-white border border-gray-200 rounded-[12px] p-6 text-sm outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex-1 bg-[#0FA4A9] text-white py-4 rounded-[12px] font-bold text-base hover:bg-[#0d8e92] transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Save Changes & Update Insights"
          )}
        </button>
        <button
          onClick={onBack}
          className="flex-1 bg-white border border-gray-100 text-[#5F6F73] py-4 rounded-[12px] font-bold text-base hover:bg-gray-50 transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const SubscriptionView = ({
  onBack,
  currentUser,
  router,
}: {
  onBack: () => void;
  currentUser: any;
  router: any;
}) => {
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const [processPayment] = useProcessPaymentMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );

  const { data: plansData, isLoading: isLoadingPlans } =
    useGetSubscriptionPlansQuery({
      billing: billingCycle,
      type: currentUser?.role || "individual",
    });


    console.log("Plans Data:",plansData)

  const { data: paymentSummary } = useGetPaymentSummaryQuery();

  console.log("Payment Summary:", paymentSummary);

  
  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();

  const plans = (plansData?.data || []).filter((plan: any) => plan.status === true);

console.log("Plans:", plans);

  // Determine active plan ID - source of truth is either the summary (if active status) or the auth user data
  const ACTIVE_STATUSES = ["active", "succeeded", "paid", "complete", "completed"];
  const activePlanFromSummary =
    paymentSummary?.latest_payment &&
    ACTIVE_STATUSES.includes(
      (paymentSummary.latest_payment.status ?? "").toLowerCase()
    )
      ? paymentSummary.latest_payment.plan.id
      : null;

  // Final active plan ID to use for UI highlights
  const activePlanId = activePlanFromSummary || currentUser?.plan_id;
  const activePlanName = paymentSummary?.latest_payment?.plan?.name || currentUser?.plan_name || (activePlanId ? "Active Plan" : "Free Trial");

  // Logic to help the user find their plan if it's on a different cycle
  useEffect(() => {
    if (activePlanId && plans.length > 0) {
      const foundInCurrentCycle = plans.some(p => Number(p.id) === Number(activePlanId));
      if (!foundInCurrentCycle) {
        // If we have an active plan but it's not in the currently displayed (monthly/annual) list,
        // we might want to tell the user or auto-switch?
        // For now, let's just log it.
        console.log("Active plan not in current cycle view");
      }
    }
  }, [activePlanId, plans]);

  // Calculate if the subscription is more than 6 months old
  const canCancel = useMemo(() => {
    // If no summary available yet, default to allowing cancel if they have a plan_id (or as per business logic)
    if (!paymentSummary?.latest_payment) return true; 
    
    if (!paymentSummary.latest_payment.created_at) return false;
    const createdAt = new Date(paymentSummary.latest_payment.created_at);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return createdAt <= sixMonthsAgo;
  }, [paymentSummary]);

  const handleCancelSubscription = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel your subscription?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0FA4A9",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        await cancelSubscription().unwrap();
        dispatch(updateUser({ plan_id: null, plan_name: null, plan_duration: null }));
        toast.success("Subscription cancelled successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to cancel subscription");
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 w-full min-h-screen pb-24">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#3A86FF]/30 rounded-lg text-[#3A86FF] text-xs font-semibold hover:bg-blue-50/50 transition-all w-fit cursor-pointer"
      >
        <ArrowLeft size={14} />
        Back to Settings
      </button>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-[#1F2D2E]">
          Manage Subscription
        </h1>
        <p className="text-[#5F6F73] text-sm font-medium">
          Control your plan, billing, and access
        </p>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-[#0FA4A9] rounded-[16px] p-8 text-white relative overflow-hidden">
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                Current Plan
              </span>
              <h2 className="text-3xl font-extrabold">
                {activePlanName}
              </h2>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs font-bold opacity-80 uppercase tracking-widest">
                {currentUser?.plan_duration
                  ? `${currentUser.plan_duration} Days Left`
                  : activePlanId ? "Active Plan" : "No Active Plan"}
              </span>
              <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    activePlanId ? "bg-[#4ADE80]" : "bg-gray-400",
                  )}
                />
                <span className="text-[10px] font-extrabold uppercase tracking-widest">
                  {activePlanId ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <div className="h-px bg-white/20 w-full" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-80">
              Plan: {activePlanName}
            </span>
            <div className="flex flex-col items-end gap-1">
              {/* Show cancel button if ANY active plan is detected and NOT an individual account */}
              {(activePlanId || currentUser?.plan_id) && 
               currentUser?.user_type !== "individual" && 
               currentUser?.role !== "individual" && (
                <>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={isCancelling}
                    className={cn(
                      "text-[10px] font-extrabold uppercase tracking-widest border px-4 py-1.5 rounded-lg transition-all",
                      !isCancelling
                        ? "border-white/40 hover:bg-white/10 cursor-pointer"
                        : "border-white/20 text-white/40 cursor-not-allowed opacity-50 grayscale",
                    )}
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                  </button>
                  {!canCancel && activePlanId && (
                    <span className="text-[8px] font-bold text-white/50 uppercase tracking-tighter">
                      6 months commitment required
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {/* Decorative Crown */}
        <Crown
          size={120}
          className="absolute -right-4 top-1/2 -translate-y-1/2 text-white opacity-5 rotate-[15deg] pointer-events-none"
        />
      </div>

      {/* Billing Cycle */}
      <div
        id="billing-cycle"
        className="bg-white rounded-[16px] p-8 border border-[#3A86FF]/25 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-[#1F2D2E]">Billing Cycle</h3>
          <p className="text-[#5F6F73] text-sm font-medium">
            Save up to 10% with annual billing
          </p>
        </div>
        <div className="flex text-sm font-bold items-center gap-4">
          <span
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "cursor-pointer transition-all",
              billingCycle === "monthly"
                ? "text-[#0FA4A9] underline underline-offset-4"
                : "text-[#94A3B8]",
            )}
          >
            Monthly
          </span>
          <span
            onClick={() => setBillingCycle("annual")}
            className={cn(
              "cursor-pointer transition-all",
              billingCycle === "annual"
                ? "text-[#0FA4A9] underline underline-offset-4"
                : "text-[#94A3B8]",
            )}
          >
            Annual
          </span>
        </div>
      </div>

      {/* Plan Tiers */}
      <div className="flex flex-col gap-4">
        {isLoadingPlans ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#0FA4A9] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="py-12 bg-white rounded-2xl border border-gray-100 text-center text-gray-500 font-medium">
            No plans available for this cycle.
          </div>
        ) : (
          plans.map((plan: any) => {
            const isActive = Number(activePlanId) === Number(plan.id);
            return (
              <div
                key={plan.id}
                onClick={async () => {
                  if (isActive) return;

                  // Enterprise or custom / zero-priced professional -> open contact mailto
                  if (
                    plan.name?.toLowerCase().includes("enterprise") ||
                    (plan.plan_type === "professional" &&
                      (plan.price === "0.00" || plan.price === 0))
                  ) {
                    window.location.href = `mailto:BioVueSupport@gmail.com?subject=Plan%20Inquiry%20-%20${encodeURIComponent(
                      plan.name || "",
                    )}`;
                    return;
                  }

                  // Free trial / zero price handling
                  if (
                    plan.price === "0.00" ||
                    plan.price === 0 ||
                    (plan.name || "").toLowerCase().includes("free trial")
                  ) {
                    if (token) {
                      router.push("/user-dashboard");
                    } else {
                      router.push("/login");
                    }
                    return;
                  }

                  // If not authenticated (unlikely on settings), redirect to register with plan
                  if (!token) {
                    router.push(`/register?plan_id=${plan.id}`);
                    return;
                  }

                  // Otherwise, initiate payment and redirect to checkout (same as pricing page)
                  try {
                    setLoadingPlanId(plan.id);
                    const response = await processPayment({
                      plan_id: plan.id,
                      billing: plan.billing_cycle || "monthly",
                    }).unwrap();

                    if (response.success && response.checkout_url) {
                      window.location.href = response.checkout_url;
                    } else {
                      toast.error("Failed to initiate payment. Please try again.");
                    }
                  } catch (error: any) {
                    console.error("Payment error:", error);
                    toast.error(
                      error?.data?.message ||
                        "An error occurred while processing payment.",
                    );
                  } finally {
                    setLoadingPlanId(null);
                  }
                }}
                className={cn(
                  "rounded-[16px] p-6 border transition-all duration-300",
                  !isActive && "cursor-pointer",
                  isActive
                    ? "bg-[#EAFBF7] border-2 border-[#0FA4A9] shadow-sm ring-4 ring-[#0FA4A9]/5"
                    : "bg-white border-[#3A86FF]/25 shadow-sm hover:border-[#0FA4A9]/50",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        isActive
                          ? "bg-[#0FA4A9] text-white"
                          : "bg-[#E4EFFF] text-[#3A86FF]",
                      )}
                    >
                      {plan.name === "Premium" || plan.name === "Plus" ? (
                        <Crown size={24} />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-xl font-bold text-[#1F2D2E]">
                        {plan.name}
                      </h4>
                      <div className="flex flex-col gap-1 mt-1">
                        {plan.features?.slice(0, 2)
                          .map((feature: string, i: number) => (
                            <span
                              key={i}
                              className={cn(
                                "text-[11px] font-medium flex items-center gap-1.5",
                                isActive ? "text-[#0FA4A9]" : "text-[#5F6F73]",
                              )}
                            >
                              <div
                                className={cn(
                                  "w-1 h-1 rounded-full",
                                  isActive ? "bg-[#0FA4A9]" : "bg-gray-300",
                                )}
                              />
                              {feature}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-2xl font-extrabold text-[#1F2D2E]">
                      ${plan.price}
                      <span className="text-sm font-medium text-[#94A3B8]">
                        /{plan.billing_cycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </span>
                    {isActive && (
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] font-bold text-[#0FA4A9] uppercase tracking-widest flex items-center gap-1">
                          <Check size={10} /> Active Plan
                        </span>
                        {currentUser?.user_type !== "individual" && currentUser?.role !== "individual" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelSubscription();
                            }}
                            disabled={!canCancel || isCancelling}
                            className={cn(
                              "text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-50 transition-all",
                              (!canCancel || isCancelling) &&
                                "opacity-50 cursor-not-allowed",
                            )}
                          >
                            <Trash2 size={10} /> Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* <div className="flex items-center gap-4">
        <button className="flex-[2] bg-[#0FA4A9] text-white py-4 rounded-[12px] font-bold text-base hover:bg-[#0d8e92] transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20">
          Confirm Changes
        </button>
        <button
          onClick={onBack}
          className="flex-1 bg-white border border-gray-100 text-[#5F6F73] py-4 rounded-[12px] font-bold text-base hover:bg-gray-50 transition-all cursor-pointer"
        >
          Back To Settings
        </button>
      </div> */}
    </div>
  );
};

export default SettingsPage;
