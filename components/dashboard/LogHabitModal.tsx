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
  Loader2
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";

import { usePostSleepLogMutation } from "@/redux/features/api/userDashboard/sleeplog";
import { usePostActivityLogMutation } from "@/redux/features/api/userDashboard/activitylog";
import { usePostHydrationLogMutation } from "@/redux/features/api/userDashboard/hydration";
import { toast } from "sonner";

interface LogHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitType: string;
}

export default function LogHabitModal({ isOpen, onClose, habitType }: LogHabitModalProps) {
  const [source, setSource] = useState<"device" | "manual">("device");
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || currentUser?.user_id;

  const [postSleepLog, { isLoading: isSleepPosting }] = usePostSleepLogMutation();
  const [postActivityLog, { isLoading: isActivityPosting }] = usePostActivityLogMutation();
  const [postHydrationLog, { isLoading: isHydrationPosting }] = usePostHydrationLogMutation();

  const isPosting = isSleepPosting || isActivityPosting || isHydrationPosting;

  const [formData, setFormData] = useState({
    weight: "",
    daily_steps: "",
    sleep_hours: "",
    water_glasses: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const type = habitType.toLowerCase();
    
    if (type !== "sleep" && type !== "activity" && type !== "hydration") {
      toast.info(`${habitType} logging not fully implemented yet.`);
      onClose();
      return;
    }

    if (!formData.weight || !formData.daily_steps || !formData.sleep_hours || !formData.water_glasses) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const payload = {
        user_id: userId || 3,
        weight: Number(formData.weight),
        daily_steps: Number(formData.daily_steps),
        sleep_hours: Number(formData.sleep_hours),
        water_glasses: Number(formData.water_glasses),
        log_date: new Date().toISOString().slice(0, 10), 
      };

      console.log(`Sending ${habitType} Log Payload:`, payload);

      let response;
      if (type === "sleep") {
        const sleepPayload = {
          ...payload,
          log_date: new Date().toISOString().slice(0, 19).replace("T", " ")
        };
        response = await postSleepLog(sleepPayload).unwrap();
      } else if (type === "activity") {
        response = await postActivityLog(payload).unwrap();
      } else {
        response = await postHydrationLog(payload).unwrap();
      }

      if (response.success !== false && (response.success || response.status === "success" || response.id || response.sleep_hours !== undefined || Object.keys(response).length > 0)) {
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
        toast.error(errorData.message || "Invalid data. Please check your inputs.");
      } else {
        toast.error(`An error occurred while logging ${type} data. Please try again.`);
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
      default:
        return <Bed size={20} className="text-[#3A86FF]" />;
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[16px] p-6 md:p-8 shadow-2xl w-full max-w-[600px] pointer-events-auto border border-[#3A86FF]/25 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0">
                    {getIcon()}
                  </div>
                  <h2 className="text-[22px] font-bold text-[#3A86FF]">
                    Logging: {habitType}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="bg-blue-50/30 rounded-xl p-4 border border-[#3A86FF]/10 flex items-center justify-between">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weight */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#5F6F73] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <Scale size={14} className="text-[#3A86FF]" />
                    Weight (kg/lbs)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Enter value..."
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-[#1F2D2E] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-300"
                  />
                </div>

                {/* Steps */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#5F6F73] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <Footprints size={14} className="text-[#3A86FF]" />
                    Daily Steps
                  </label>
                  <input
                    type="number"
                    name="daily_steps"
                    value={formData.daily_steps}
                    onChange={handleChange}
                    placeholder="Enter value..."
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-[#1F2D2E] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-300"
                  />
                </div>

                {/* Sleep */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#5F6F73] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <Bed size={14} className="text-[#3A86FF]" />
                    Sleep Hours
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="sleep_hours"
                    value={formData.sleep_hours}
                    onChange={handleChange}
                    placeholder="Enter value..."
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-[#1F2D2E] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-300"
                  />
                </div>

                {/* Hydration */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-[#5F6F73] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <Droplets size={14} className="text-[#3A86FF]" />
                    Water Ounces
                  </label>
                  <input
                    type="number"
                    name="water_glasses"
                    value={formData.water_glasses}
                    onChange={handleChange}
                    placeholder="Enter value..."
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-[#1F2D2E] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isPosting}
                className="w-full bg-[#0FA4A9] text-white py-4 rounded-xl font-bold text-[17px] hover:bg-opacity-90 disabled:bg-opacity-50 transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20 flex items-center justify-center gap-2"
              >
                {isPosting ? <Loader2 className="animate-spin" size={20} /> : `Save Today's ${habitType}`}
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
