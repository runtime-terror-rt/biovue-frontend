"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Smartphone,
  Bed,
  Footprints,
  Droplets,
  Frown,
  Scale,
  Loader2,
  Dumbbell,
  Timer,
  Flame,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { usePostSleepLogMutation } from "@/redux/features/api/userDashboard/sleeplog";
import { usePostActivityLogMutation } from "@/redux/features/api/userDashboard/activitylog";
import { usePostHydrationLogMutation } from "@/redux/features/api/userDashboard/hydration";
import { toast } from "sonner";
import { triggerConfetti } from "@/lib/confetti";

interface LogHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitType: string;
}

export default function LogHabitModal({
  isOpen,
  onClose,
  habitType,
}: LogHabitModalProps) {
  const [source, setSource] = useState<"device" | "manual">("device");
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || currentUser?.user_id;

  const [postSleepLog, { isLoading: isSleepPosting }] =
    usePostSleepLogMutation();
  const [postActivityLog, { isLoading: isActivityPosting }] =
    usePostActivityLogMutation();
  const [postHydrationLog, { isLoading: isHydrationPosting }] =
    usePostHydrationLogMutation();

  const isPosting = isSleepPosting || isActivityPosting || isHydrationPosting;

  const [formData, setFormData] = useState({
    weight: "",
    daily_steps: "",
    sleep_hours: "",
    water_glasses: "",
    workout_type: "",
    workout_time: "",
    workout_calories: "",
  });
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const type = habitType.toLowerCase();

    if (type !== "sleep" && type !== "activity" && type !== "hydration" && type !== "weight") {
      toast.info(`${habitType} logging not fully implemented yet.`);
      onClose();
      return;
    }

    // Validate mandatory fields based on log type
    if (type === "weight") {
      if (!formData.weight || Number(formData.weight) <= 0) {
        toast.error("Please enter a valid weight.");
        return;
      }
    } else if (type === "sleep") {
      if (!formData.sleep_hours) {
        toast.error("Please enter sleep hours.");
        return;
      }
    } else if (type === "activity") {
      if (!formData.daily_steps) {
        toast.error("Please enter daily steps.");
        return;
      }
    } else if (type === "hydration") {
      if (!formData.water_glasses) {
        toast.error("Please enter water ounces.");
        return;
      }
    }

    try {
      const pad = (n: number) => n.toString().padStart(2, "0");
      const formatLocalDate = (d = new Date()) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const formatLocalDateTime = (d = new Date()) =>
        `${d.getFullYear()}-${pad(
          d.getMonth() + 1,
        )}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
          d.getSeconds(),
        )}`;

      let payload: any = {
        user_id: userId || 3,
        log_date: formatLocalDate(),
      };

      if (type === "weight") {
        payload.weight = Number(formData.weight);
        payload.unit = weightUnit === "kg" ? "metric" : "imperial";
      } else if (type === "activity") {
        payload.daily_steps = Number(formData.daily_steps) || 0;
        if (formData.workout_type) payload.workout_type = formData.workout_type;
        if (formData.workout_time) payload.workout_time = Number(formData.workout_time);
        if (formData.workout_calories) payload.workout_calories = Number(formData.workout_calories);
      } else if (type === "sleep") {
        payload.sleep_hours = Number(formData.sleep_hours) || 0;
        payload.log_date = formatLocalDateTime();
      } else if (type === "hydration") {
        payload.water_glasses = Number(formData.water_glasses) || 0;
        payload.water_oz = Number(formData.water_glasses) || 0;
      }

      console.log(`Sending ${habitType} Log Payload:`, payload);

      let response;
      if (type === "sleep") {
        // sleep expects a timestamp (local)
        const sleepPayload = { ...payload, log_date: formatLocalDateTime() };
        response = await postSleepLog(sleepPayload).unwrap();
      } else if (type === "activity" || type === "weight") {
        response = await postActivityLog(payload).unwrap();
      } else {
        response = await postHydrationLog(payload).unwrap();
      }

      if (
        response.success !== false &&
        (response.success ||
          response.status === "success" ||
          response.id ||
          response.sleep_hours !== undefined ||
          Object.keys(response).length > 0)
      ) {
        triggerConfetti();
        toast.success(`${habitType} data logged successfully!`);
        onClose();
      } else {
        toast.error(response.message || `Failed to log ${type} data.`);
      }
    } catch (err: any) {
      console.error(`Error logging ${type}:`, err);

      const errorData = err.data || {};
      const errorMessage = (errorData.message || "").toLowerCase();
      const exception = (errorData.exception || "").toLowerCase();

      if (
        err.status === 409 || // Conflict
        err.status === 500 || // Internal Server Error (UniqueConstraintViolation)
        exception.includes("uniqueconstraintviolationexception") ||
        errorMessage.includes("duplicate entry") ||
        errorMessage.includes("already logged")
      ) {
        toast.error("You have already logged data for today.");
      } else if (err.status === 400) {
        toast.error(
          errorData.message || "Invalid data. Please check your inputs.",
        );
      } else {
        toast.error(
          `An error occurred while logging ${type} data. Please try again.`,
        );
      }
    }
  };

  const getIcon = () => {
    switch (habitType.toLowerCase()) {
      case "sleep":
        return <Bed size={20} className="text-[#3A86FF]" />;
      case "activity":
        return <Footprints size={20} className="text-[#3A86FF]" />;
      case "hydration":
        return <Droplets size={20} className="text-[#3A86FF]" />;
      case "stress":
        return <Frown size={20} className="text-[#A855F7]" />;
      case "weight":
        return <Scale size={20} className="text-[#3A86FF]" />;
      default:
        return <Scale size={20} className="text-[#3A86FF]" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-[2px]"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto pointer-events-auto border border-[#3A86FF]/25 flex flex-col gap-4 sm:gap-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
                    {getIcon()}
                  </div>
                  <h2 className="text-lg sm:text-[22px] font-bold text-[#3A86FF]">
                    Logging: {habitType}
                  </h2>
                  {habitType.toLowerCase() === "weight" && (
                    <div className="flex bg-gray-100/80 rounded-lg p-1 border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setWeightUnit("lbs")}
                        className={`px-3 sm:px-4 py-1 text-[10px] font-black rounded-md transition-all cursor-pointer ${
                          weightUnit === "lbs"
                            ? "bg-white text-[#3A86FF] shadow-sm"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        Imperial (lbs)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWeightUnit("kg")}
                        className={`px-3 sm:px-4 py-1 text-[10px] font-black rounded-md transition-all cursor-pointer ${
                          weightUnit === "kg"
                            ? "bg-white text-[#3A86FF] shadow-sm"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        Metric (kg)
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full transition-colors cursor-pointer shrink-0 mt-1"
                >
                  <X size={16} />
                </button>
              </div>

              {/* <div className="bg-blue-50/30 rounded-xl p-4 border border-[#3A86FF]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-[#0FA4A9]" />
                  <span className="text-[#1F2D2E] font-semibold text-sm">
                    Device Sync Active
                  </span>
                </div>
                <button
                  onClick={() => setSource(prev => prev === "device" ? "manual" : "device")}
                  className="text-[#3A86FF] text-xs font-bold hover:underline cursor-pointer"
                >
                  Switch Source
                </button>
              </div> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weight Input (ONLY for Weight habit) */}
                {habitType.toLowerCase() === "weight" && (
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[13px] font-bold text-[#5F6F73] uppercase tracking-wider flex items-center gap-2">
                        <Scale size={15} className="text-[#3A86FF]" />
                        Current Body Weight <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-400 font-semibold">
                        Unit: {weightUnit === "kg" ? "Kilograms (kg)" : "Pounds (lbs)"}
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        step="0.1"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder={`Enter weight (e.g. ${weightUnit === "kg" ? "70" : "155"})...`}
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#1F2D2E] text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-300 pr-16"
                      />
                      <span className="absolute right-5 text-sm font-black text-gray-400 uppercase pointer-events-none">
                        {weightUnit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      <span className="text-xs text-gray-400 font-semibold">Quick Adjust:</span>
                      {[-1, -0.5, +0.5, +1].map((delta) => (
                        <button
                          key={delta}
                          type="button"
                          onClick={() => {
                            const cur = parseFloat(formData.weight) || 0;
                            const next = Math.max(0, cur + delta);
                            setFormData((prev) => ({
                              ...prev,
                              weight: (Math.round(next * 10) / 10).toString(),
                            }));
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-200 bg-white hover:bg-blue-50 text-gray-600 hover:text-[#3A86FF] transition-all cursor-pointer shadow-xs"
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Steps (Mandatory - Activity only) */}
                {habitType.toLowerCase() === "activity" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#5F6F73] uppercase tracking-wider ml-1 flex items-center gap-2">
                      <Footprints size={14} className="text-[#3A86FF]" />
                      Daily Steps
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="daily_steps"
                      value={formData.daily_steps}
                      onChange={handleChange}
                      placeholder="Enter steps (e.g. 8000)..."
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2D2E] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-300"
                    />
                  </div>
                )}

                {/* Workout Type Dropdown (Activity only) */}
                {habitType.toLowerCase() === "activity" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#5F6F73] uppercase tracking-wider ml-1 flex items-center gap-2">
                      <Dumbbell size={14} className="text-[#3A86FF]" />
                      Workout Type (Optional)
                    </label>
                    <select
                      name="workout_type"
                      value={formData.workout_type}
                      onChange={handleChange}
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2D2E] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="">Select Workout Type...</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Weight Lifting">Weight Lifting</option>
                      <option value="Sprints">Sprints</option>
                      <option value="Yoga">Yoga</option>
                      <option value="Walking">Walking</option>
                      <option value="Cycling">Cycling</option>
                      <option value="HIIT">HIIT</option>
                      <option value="Swimming">Swimming</option>
                      <option value="Pilates">Pilates</option>
                      <option value="Strength Training">Strength Training</option>
                      <option value="Other">Other Workout</option>
                    </select>
                  </div>
                )}

                {/* Workout Time / Duration (Activity only) */}
                {habitType.toLowerCase() === "activity" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#5F6F73] uppercase tracking-wider ml-1 flex items-center gap-2">
                      <Timer size={14} className="text-[#3A86FF]" />
                      Workout Time (Minutes)
                    </label>
                    <input
                      type="number"
                      name="workout_time"
                      value={formData.workout_time}
                      onChange={handleChange}
                      placeholder="e.g. 45 mins"
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2D2E] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-300"
                    />
                  </div>
                )}

                {/* Workout Calories Burned (Activity only) - Balanced in 2nd Column */}
                {habitType.toLowerCase() === "activity" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#5F6F73] uppercase tracking-wider ml-1 flex items-center gap-2">
                      <Flame size={14} className="text-[#3A86FF]" />
                      Workout Calories (Burned)
                    </label>
                    <input
                      type="number"
                      name="workout_calories"
                      value={formData.workout_calories}
                      onChange={handleChange}
                      placeholder="e.g. 350 kcal"
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2D2E] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-300"
                    />
                  </div>
                )}

                {/* Sleep Hours (Mandatory - Sleep only) - Full Width */}
                {habitType.toLowerCase() === "sleep" && (
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[13px] font-bold text-[#5F6F73] uppercase tracking-wider flex items-center gap-2">
                        <Bed size={15} className="text-[#3A86FF]" />
                        Sleep Duration <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-400 font-semibold">
                        Recommended: 7 - 9 hours
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        step="0.1"
                        name="sleep_hours"
                        value={formData.sleep_hours}
                        onChange={handleChange}
                        placeholder="Enter hours (e.g. 7.5)..."
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#1F2D2E] text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-300 pr-16"
                      />
                      <span className="absolute right-5 text-sm font-black text-gray-400 uppercase pointer-events-none">
                        HRS
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      <span className="text-xs text-gray-400 font-semibold">Quick Presets:</span>
                      {[6, 6.5, 7, 7.5, 8, 8.5].map((hrs) => (
                        <button
                          key={hrs}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              sleep_hours: hrs.toString(),
                            }))
                          }
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-200 bg-white hover:bg-blue-50 text-gray-600 hover:text-[#3A86FF] transition-all cursor-pointer shadow-xs"
                        >
                          {hrs} hrs
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Water Ounces (Mandatory - Hydration only) - Full Width */}
                {habitType.toLowerCase() === "hydration" && (
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[13px] font-bold text-[#5F6F73] uppercase tracking-wider flex items-center gap-2">
                        <Droplets size={15} className="text-[#3A86FF]" />
                        Water Intake <span className="text-red-500">*</span>
                      </label>
                      {formData.water_glasses && Number(formData.water_glasses) > 0 && (
                        <span className="text-xs font-semibold text-[#0FA4A9] bg-[#0FA4A9]/10 px-2.5 py-1 rounded-md">
                          ≈ {(Number(formData.water_glasses) / 8).toFixed(1).replace(/\.0$/, "")} glasses (1 glass = 8 oz)
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        name="water_glasses"
                        value={formData.water_glasses}
                        onChange={handleChange}
                        placeholder="Enter total ounces (e.g. 64)..."
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl px-5 py-3.5 text-[#1F2D2E] text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-300 pr-16"
                      />
                      <span className="absolute right-5 text-sm font-black text-gray-400 uppercase pointer-events-none">
                        OZ
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      <span className="text-xs text-gray-400 font-semibold">Quick Add:</span>
                      {[
                        { label: "+8 oz (1 Glass)", val: 8 },
                        { label: "+16 oz (Bottle)", val: 16 },
                        { label: "+24 oz", val: 24 },
                        { label: "+32 oz", val: 32 },
                      ].map((chip) => (
                        <button
                          key={chip.val}
                          type="button"
                          onClick={() => {
                            const cur = parseInt(formData.water_glasses, 10) || 0;
                            setFormData((prev) => ({
                              ...prev,
                              water_glasses: (cur + chip.val).toString(),
                            }));
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-200 bg-white hover:bg-blue-50 text-gray-600 hover:text-[#3A86FF] transition-all cursor-pointer shadow-xs"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isPosting}
                className="w-full bg-[#0FA4A9] text-white py-4 rounded-xl font-bold text-[17px] hover:bg-opacity-90 disabled:bg-opacity-50 transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20 flex items-center justify-center gap-2"
              >
                {isPosting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  `Save Today's ${habitType}`
                )}
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
