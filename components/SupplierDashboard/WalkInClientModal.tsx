"use client";

import { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Ruler,
  Weight,
  Target,
  Footprints,
  Sparkles,
  Loader2,
  Plus,
  Check,
  Activity,
  Flame,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCreateWalkInClientMutation,
  WalkInClientPayload,
} from "@/redux/features/api/SupplierDashboard/WalkInClient";

interface WalkInClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_SUPPLEMENTS = [
  "Whey Protein",
  "Creatine",
  "Multivitamin",
  "Omega-3",
  "BCAAs",
  "Pre-Workout",
  "Vitamin D3",
  "Magnesium",
  "Electrolytes",
  "Glutamine",
];

const BODY_GOAL_PRESETS = [
  "Muscle Gain and Fat Loss",
  "Weight Loss & Shred",
  "Lean Muscle Hypertrophy",
  "Strength & Conditioning",
  "Endurance & Stamina",
  "General Wellness & Fitness",
];

const INITIAL_FORM_STATE: WalkInClientPayload = {
  name: "",
  email: "",
  phone: "",
  unit: "imperial",
  height: 5.9,
  weight: 75,
  age: 28,
  sex: "male",
  body_goal: "Muscle Gain and Fat Loss",
  target_weight: 70,
  daily_step_goal: 10000,
  is_athletic: true,
  toned: false,
  lean: true,
  muscular: true,
  curvy_fit: false,
  supplement_recommendation: ["Whey Protein", "Creatine"],
};

export default function WalkInClientModal({
  isOpen,
  onClose,
}: WalkInClientModalProps) {
  const [formData, setFormData] = useState<WalkInClientPayload>(INITIAL_FORM_STATE);
  const [customSupplement, setCustomSupplement] = useState("");
  const [createWalkInClient, { isLoading }] = useCreateWalkInClientMutation();

  if (!isOpen) return null;

  const handleInputChange = (
    field: keyof WalkInClientPayload,
    value: string | number | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePhysiqueAttribute = (
    attribute: "is_athletic" | "toned" | "lean" | "muscular" | "curvy_fit"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [attribute]: !prev[attribute],
    }));
  };

  const toggleSupplement = (supplement: string) => {
    setFormData((prev) => {
      const exists = prev.supplement_recommendation.includes(supplement);
      return {
        ...prev,
        supplement_recommendation: exists
          ? prev.supplement_recommendation.filter((item) => item !== supplement)
          : [...prev.supplement_recommendation, supplement],
      };
    });
  };

  const handleAddCustomSupplement = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSupplement.trim();
    if (!trimmed) return;

    if (!formData.supplement_recommendation.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        supplement_recommendation: [...prev.supplement_recommendation, trimmed],
      }));
    }
    setCustomSupplement("");
  };

  const handleRemoveSupplement = (supplement: string) => {
    setFormData((prev) => ({
      ...prev,
      supplement_recommendation: prev.supplement_recommendation.filter(
        (item) => item !== supplement
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter the client's full name.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter a contact phone number.");
      return;
    }

    if (!formData.height || formData.height <= 0) {
      toast.error("Please enter a valid height.");
      return;
    }

    if (!formData.weight || formData.weight <= 0) {
      toast.error("Please enter a valid current weight.");
      return;
    }

    if (!formData.age || formData.age <= 0) {
      toast.error("Please enter a valid age.");
      return;
    }

    if (!formData.target_weight || formData.target_weight <= 0) {
      toast.error("Please enter a valid target weight.");
      return;
    }

    const payload: WalkInClientPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      unit: formData.unit,
      height: Number(formData.height),
      weight: Number(formData.weight),
      age: Number(formData.age),
      sex: formData.sex,
      body_goal: formData.body_goal.trim() || "Muscle Gain and Fat Loss",
      target_weight: Number(formData.target_weight),
      daily_step_goal: Number(formData.daily_step_goal) || 10000,
      is_athletic: Boolean(formData.is_athletic),
      toned: Boolean(formData.toned),
      lean: Boolean(formData.lean),
      muscular: Boolean(formData.muscular),
      curvy_fit: Boolean(formData.curvy_fit),
      supplement_recommendation: formData.supplement_recommendation,
    };

    try {
      const res = await createWalkInClient(payload).unwrap();
      toast.success(res.message || "Walk-in client profile created successfully!");
      setFormData(INITIAL_FORM_STATE);
      onClose();
    } catch (err: unknown) {
      console.error("Failed to create walk-in client:", err);
      const apiErr = err as { data?: { message?: string; error?: string } };
      toast.error(
        apiErr?.data?.message ||
          apiErr?.data?.error ||
          "Failed to create walk-in client. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl border border-[#D9E6FF] overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0FA4A9] via-[#0D9488] to-[#0284C7] text-white shrink-0">
          <button
            onClick={onClose}
            type="button"
            className="absolute right-6 top-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner shrink-0">
              <Sparkles className="text-white" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Supplier Direct Intake
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Add Walk-in Client
              </h2>
              <p className="text-white/85 text-xs sm:text-sm font-medium mt-0.5">
                Register a client in-store, configure body goals, and prescribe target supplements.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body - Scrollable */}
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 overflow-y-auto space-y-8 divide-y divide-[#F1F5F9]"
        >
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#0FA4A9]" />
              <h3 className="text-sm font-black text-[#041228] uppercase tracking-wider">
                1. Client Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#041228] flex items-center gap-1.5">
                  <User size={13} className="text-[#0FA4A9]" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahim Ahmed"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl py-3 px-4 text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#041228] flex items-center gap-1.5">
                  <Mail size={13} className="text-[#0FA4A9]" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahim@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl py-3 px-4 text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#041228] flex items-center gap-1.5">
                  <Phone size={13} className="text-[#0FA4A9]" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +8801700000000"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl py-3 px-4 text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#041228] flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#0FA4A9]" />
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    placeholder="28"
                    value={formData.age || ""}
                    onChange={(e) =>
                      handleInputChange("age", e.target.value ? Number(e.target.value) : "")
                    }
                    className="bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl py-3 px-4 text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#041228]">Sex</label>
                  <select
                    value={formData.sex}
                    onChange={(e) =>
                      handleInputChange("sex", e.target.value as "male" | "female" | "other")
                    }
                    className="bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl py-3 px-3 text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9] transition-all cursor-pointer font-medium"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Measurements & Goals */}
          <div className="pt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3A86FF]" />
                <h3 className="text-sm font-black text-[#041228] uppercase tracking-wider">
                  2. Metrics & Body Goals
                </h3>
              </div>

              {/* Unit Toggle */}
              <div className="inline-flex p-1 bg-[#F1F5F9] rounded-2xl border border-[#D9E6FF]">
                <button
                  type="button"
                  onClick={() => handleInputChange("unit", "imperial")}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    formData.unit === "imperial"
                      ? "bg-[#0FA4A9] text-white shadow-sm"
                      : "text-[#5F6F73] hover:text-[#041228]"
                  }`}
                >
                  Imperial (ft / lbs)
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("unit", "metric")}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    formData.unit === "metric"
                      ? "bg-[#0FA4A9] text-white shadow-sm"
                      : "text-[#5F6F73] hover:text-[#041228]"
                  }`}
                >
                  Metric (cm / kg)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#041228] flex items-center gap-1.5">
                  <Ruler size={13} className="text-[#3A86FF]" />
                  Height ({formData.unit === "imperial" ? "ft.in" : "cm"})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder={formData.unit === "imperial" ? "5.9" : "175"}
                  value={formData.height || ""}
                  onChange={(e) =>
                    handleInputChange("height", e.target.value ? Number(e.target.value) : "")
                  }
                  className="bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl py-3 px-4 text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/20 focus:border-[#3A86FF] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#041228] flex items-center gap-1.5">
                  <Weight size={13} className="text-[#3A86FF]" />
                  Current Weight ({formData.unit === "imperial" ? "lbs" : "kg"})
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="75"
                  value={formData.weight || ""}
                  onChange={(e) =>
                    handleInputChange("weight", e.target.value ? Number(e.target.value) : "")
                  }
                  className="bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl py-3 px-4 text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/20 focus:border-[#3A86FF] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#041228] flex items-center gap-1.5">
                  <Target size={13} className="text-[#3A86FF]" />
                  Target Weight ({formData.unit === "imperial" ? "lbs" : "kg"})
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="70"
                  value={formData.target_weight || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "target_weight",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl py-3 px-4 text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/20 focus:border-[#3A86FF] transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#041228] flex items-center gap-1.5">
                  <Footprints size={13} className="text-[#3A86FF]" />
                  Daily Step Goal
                </label>
                <input
                  type="number"
                  step="500"
                  placeholder="10000"
                  value={formData.daily_step_goal || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "daily_step_goal",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl py-3 px-4 text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/20 focus:border-[#3A86FF] transition-all"
                />
              </div>
            </div>

            {/* Body Goal */}
            <div className="flex flex-col gap-2 pt-1">
              <label className="text-xs font-bold text-[#041228]">
                Primary Goal / Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Muscle Gain and Fat Loss"
                value={formData.body_goal}
                onChange={(e) => handleInputChange("body_goal", e.target.value)}
                className="bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl py-3 px-4 text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/20 focus:border-[#3A86FF] transition-all"
              />

              <div className="flex flex-wrap gap-1.5 pt-1">
                {BODY_GOAL_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleInputChange("body_goal", preset)}
                    className={`text-xs px-2.5 py-1 rounded-xl transition-all cursor-pointer border ${
                      formData.body_goal === preset
                        ? "bg-[#3A86FF]/15 text-[#3A86FF] border-[#3A86FF] font-bold"
                        : "bg-white text-[#5F6F73] border-[#E2E8F0] hover:border-[#3A86FF] font-medium"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Physique Profile */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              <h3 className="text-sm font-black text-[#041228] uppercase tracking-wider">
                3. Physique & Build Targets
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] font-medium">
              Select all target body attributes that match the client’s transformation journey:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                {
                  key: "is_athletic" as const,
                  label: "Athletic",
                  icon: Activity,
                  desc: "Agile & Dynamic",
                },
                {
                  key: "toned" as const,
                  label: "Toned",
                  icon: Sparkles,
                  desc: "Defined & Trim",
                },
                {
                  key: "lean" as const,
                  label: "Lean",
                  icon: Flame,
                  desc: "Low Body Fat",
                },
                {
                  key: "muscular" as const,
                  label: "Muscular",
                  icon: Zap,
                  desc: "High Muscle Mass",
                },
                {
                  key: "curvy_fit" as const,
                  label: "Curvy Fit",
                  icon: Target,
                  desc: "Shaped & Balanced",
                },
              ].map(({ key, label, icon: Icon, desc }) => {
                const active = Boolean(formData[key]);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => togglePhysiqueAttribute(key)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      active
                        ? "bg-[#0FA4A9]/10 border-[#0FA4A9] shadow-sm shadow-[#0FA4A9]/10"
                        : "bg-[#F8FBFA] border-[#D9E6FF] hover:border-[#0FA4A9]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                          active
                            ? "bg-[#0FA4A9] text-white"
                            : "bg-white text-[#94A3B8] border border-[#D9E6FF]"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          active
                            ? "bg-[#0FA4A9] text-white"
                            : "border border-[#CBD5E1] bg-white"
                        }`}
                      >
                        {active && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold leading-tight ${
                          active ? "text-[#0FA4A9]" : "text-[#041228]"
                        }`}
                      >
                        {label}
                      </p>
                      <p className="text-[10px] text-[#94A3B8] font-medium leading-tight mt-0.5">
                        {desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Supplement Recommendations */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <h3 className="text-sm font-black text-[#041228] uppercase tracking-wider">
                4. Supplement Recommendations
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] font-medium">
              Recommend supplements tailored to the walk-in client profile:
            </p>

            {/* Selected Pills */}
            <div className="min-h-12 p-3 bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl flex flex-wrap gap-2 items-center">
              {formData.supplement_recommendation.length > 0 ? (
                formData.supplement_recommendation.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0FA4A9] text-white text-xs font-bold rounded-xl shadow-sm animate-in zoom-in duration-150"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveSupplement(item)}
                      className="hover:bg-black/20 rounded-full p-0.5 transition-colors cursor-pointer"
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#94A3B8] font-medium italic">
                  No supplements selected yet. Choose from below or add custom ones.
                </span>
              )}
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2">
              {COMMON_SUPPLEMENTS.map((supplement) => {
                const isSelected = formData.supplement_recommendation.includes(supplement);
                return (
                  <button
                    key={supplement}
                    type="button"
                    onClick={() => toggleSupplement(supplement)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#0FA4A9]/10 text-[#0FA4A9] border-[#0FA4A9]"
                        : "bg-white text-[#5F6F73] border-[#E2E8F0] hover:border-[#0FA4A9]"
                    }`}
                  >
                    {isSelected ? <Check size={12} strokeWidth={2.5} /> : <Plus size={12} />}
                    {supplement}
                  </button>
                );
              })}
            </div>

            {/* Custom Supplement Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Or type a custom supplement (e.g. Ashwagandha, Zinc)..."
                value={customSupplement}
                onChange={(e) => setCustomSupplement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomSupplement();
                  }
                }}
                className="flex-1 bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl py-2.5 px-4 text-xs sm:text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9] transition-all"
              />
              <button
                type="button"
                onClick={() => handleAddCustomSupplement()}
                disabled={!customSupplement.trim()}
                className="bg-[#0FA4A9] hover:bg-[#0D9488] disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Plus size={15} />
                Add
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl text-sm font-bold text-[#5F6F73] hover:text-[#041228] hover:bg-[#F1F5F9] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-[#0FA4A9] hover:bg-[#0D9488] disabled:opacity-60 text-white px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0FA4A9]/25 cursor-pointer active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Client Profile...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Register Walk-in Client
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
