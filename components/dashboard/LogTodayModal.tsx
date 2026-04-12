"use client";

import React from "react";
import { 
  X, 
  Weight, 
  Activity, 
  Cigarette, 
  GlassWater, 
  Footprints, 
  Dumbbell, 
  Zap, 
  Moon, 
  Utensils, 
  Droplets, 
  Smartphone,
  Crown,
  Loader2
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { usePostSleepLogMutation } from "@/redux/features/api/userDashboard/sleeplog";
import { usePostActivityLogMutation } from "@/redux/features/api/userDashboard/activitylog";
import { usePostHydrationLogMutation } from "@/redux/features/api/userDashboard/hydration";
import { toast } from "sonner";

interface LogTodayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeSource: () => void;
  habitData: any;
  setHabitData: (data: any) => void;
}

const LogTodayModal = ({ 
  isOpen, 
  onClose, 
  onChangeSource, 
  habitData, 
  setHabitData 
}: LogTodayModalProps) => {
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || currentUser?.user_id;

  const [postSleepLog, { isLoading: isSleepPosting }] = usePostSleepLogMutation();
  const [postActivityLog, { isLoading: isActivityPosting }] = usePostActivityLogMutation();
  const [postHydrationLog, { isLoading: isHydrationPosting }] = usePostHydrationLogMutation();

  const isLoading = isSleepPosting || isActivityPosting || isHydrationPosting;

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const payload = {
      user_id: userId,
      weight: Number(habitData.weight) || 0,
      daily_steps: Number(habitData.steps) || 0,
      sleep_hours: Number(habitData.sleep) || 0,
      water_glasses: 8, // Fixed mapping or from data? Modal doesn't have water count yet
      log_date: new Date().toISOString().slice(0, 10),
    };

    try {
      // For now, we'll hit the sleep log as the primary log point if any data is provided
      // In a real scenario, we might want to split these or have a combined endpoint
      const response = await postSleepLog({
        ...payload,
        log_date: new Date().toISOString().slice(0, 19).replace("T", " ")
      }).unwrap();

      if (response.success !== false && (response.success || response.status === "success" || response.id || response.sleep_hours !== undefined || Object.keys(response).length > 0)) {
        toast.success("Daily habits logged successfully!");
        onClose();
      } else {
        toast.error(response.message || "Failed to log habits.");
      }
    } catch (err: any) {
      console.error("Error logging habits:", err);
      
      const errorData = err.data || {};
      const errorMessage = (errorData.message || "").toLowerCase();
      const exception = (errorData.exception || "").toLowerCase();
      
      if (
        err.status === 409 || 
        err.status === 500 ||
        exception.includes("uniqueconstraintviolationexception") || 
        errorMessage.includes("duplicate entry") || 
        errorMessage.includes("already logged")
      ) {
        toast.error("You have already logged data for today.");
      } else {
        toast.error(errorData.message || "An error occurred while logging habits.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] w-full max-w-2xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shadow-2xl relative border border-[#3A86FF]/25">
        {/* Close Button */}
        {/* <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 cursor-pointer z-10"
        >
          <X size={20} />
        </button> */}

        {/* Device Sync Banner */}
        <div className="flex items-center justify-between bg-white border-b border-[#3A86FF]/25 px-6 py-4 rounded-t-[16px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50/80 border border-blue-100 rounded-lg flex items-center justify-center">
              <Smartphone size={18} className="text-[#3A86FF]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1F2D2E]">Device Sync Active</p>
              <p className="text-[11px] text-[#5F6F73]">Some Data Is Automatically Synced From Your Connected Device.</p>
            </div>
          </div>
          <button
            onClick={onChangeSource}
            className="bg-white border border-gray-200 text-[#1F2D2E] text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap hover:bg-gray-50"
          >
            Change Source
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-[#E8F1FF] rounded-xl flex items-center justify-center">
              <Crown size={18} className="text-[#3A86FF]" />
            </div>
            <h2 className="text-xl font-bold text-[#041228]">Lifestyle Habits</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6 ml-12">Your daily habits shape your future health</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {/* Weight */}
            <div className="flex flex-col gap-3 p-4 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
              <label className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                <Weight size={16} className="text-[#3A86FF]" /> Weight
              </label>
              <select 
                value={habitData.weight} 
                onChange={e => setHabitData({...habitData, weight: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-[#5F6F73] text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-50"
              >
                <option value="">Select.....</option>
                <option value="150">150 lbs</option>
                <option value="160">160 lbs</option>
                <option value="170">170 lbs</option>
                <option value="180">180 lbs</option>
                <option value="190">190 lbs</option>
                <option value="200">200 lbs</option>
                <option value="210">210 lbs</option>
                <option value="220">220 lbs</option>
              </select>
            </div>

            {/* Body Fat */}
            <div className="flex flex-col gap-3 p-4 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
              <label className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                <Activity size={16} className="text-[#3A86FF]" /> Body Fat (Optional)
              </label>
              <select 
                value={habitData.bodyFat} 
                onChange={e => setHabitData({...habitData, bodyFat: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-[#5F6F73] text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-50"
              >
                <option value="">Select.....</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
                <option value="25">25%</option>
                <option value="30">30%</option>
                <option value="35">35%</option>
              </select>
            </div>

            {/* Smoking */}
            <div className="flex flex-col gap-3 p-4 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
              <label className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                <Cigarette size={16} className="text-[#3A86FF]" /> Smoking Status
              </label>
              <select 
                value={habitData.smoking} 
                onChange={e => setHabitData({...habitData, smoking: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-[#5F6F73] text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-50"
              >
                <option value="">Select.....</option>
                <option value="never">Never Smoked</option>
                <option value="former">Former Smoker</option>
                <option value="occasional">Occasional</option>
                <option value="regular">Regular</option>
              </select>
            </div>

            {/* Alcohol */}
            <div className="flex flex-col gap-3 p-4 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
              <label className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                <GlassWater size={16} className="text-[#3A86FF]" /> Alcohol Consumption
              </label>
              <select 
                value={habitData.alcohol} 
                onChange={e => setHabitData({...habitData, alcohol: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-[#5F6F73] text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-50"
              >
                <option value="">Select.....</option>
                <option value="none">None</option>
                <option value="rarely">Rarely</option>
                <option value="social">Social / Occasional</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            {/* Daily Steps */}
            <div className="flex flex-col gap-3 p-4 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
              <label className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                <Footprints size={16} className="text-[#3A86FF]" /> Daily Steps
              </label>
              <input 
                type="number" 
                value={habitData.steps} 
                onChange={e => setHabitData({...habitData, steps: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-[#1F2D2E] text-sm focus:outline-none focus:ring-2 focus:ring-blue-50" 
              />
            </div>

            {/* Workout */}
            <div className="flex flex-col gap-3 p-4 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
              <label className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                <Dumbbell size={16} className="text-[#3A86FF]" /> Workout Per Week
              </label>
              <input 
                type="number" 
                value={habitData.workout} 
                onChange={e => setHabitData({...habitData, workout: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-[#1F2D2E] text-sm focus:outline-none focus:ring-2 focus:ring-blue-50" 
              />
            </div>

            {/* Strength */}
            <div className="flex flex-col gap-3 p-4 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
              <label className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                <Zap size={16} className="text-[#3A86FF]" /> Strength Training Per Week
              </label>
              <input 
                type="number" 
                value={habitData.strength} 
                onChange={e => setHabitData({...habitData, strength: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-[#1F2D2E] text-sm focus:outline-none focus:ring-2 focus:ring-blue-50" 
              />
            </div>

            {/* Sleep */}
            <div className="flex flex-col gap-3 p-4 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
              <label className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                <Moon size={16} className="text-[#3A86FF]" /> Sleep Hours Per Night
              </label>
              <input 
                type="number" 
                value={habitData.sleep} 
                onChange={e => setHabitData({...habitData, sleep: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-[#1F2D2E] text-sm focus:outline-none focus:ring-2 focus:ring-blue-50" 
              />
            </div>

            {/* Diet Quality */}
            <div className="flex flex-col gap-3 p-4 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
              <label className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                <Utensils size={16} className="text-[#3A86FF]" /> Overall Diet Quality
              </label>
              <select 
                value={habitData.diet} 
                onChange={e => setHabitData({...habitData, diet: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-[#5F6F73] text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-50"
              >
                <option value="">Select.....</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            {/* Fast Food */}
            <div className="flex flex-col gap-3 p-4 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
              <label className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                <Utensils size={16} className="text-[#3A86FF]" /> Fast Food Frequency
              </label>
              <select 
                value={habitData.fastFood} 
                onChange={e => setHabitData({...habitData, fastFood: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-[#5F6F73] text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-50"
              >
                <option value="">Select.....</option>
                <option value="never">Never</option>
                <option value="rarely">Rarely (1x/month)</option>
                <option value="sometimes">Sometimes (1-2x/week)</option>
                <option value="often">Often (3-4x/week)</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            {/* Stress */}
            <div className="flex flex-col gap-3 p-4 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
              <label className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                <Activity size={16} className="text-[#3A86FF]" /> Stress Level
              </label>
              <select 
                value={habitData.stress} 
                onChange={e => setHabitData({...habitData, stress: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-[#5F6F73] text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-50"
              >
                <option value="">Select.....</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="very_high">Very High</option>
              </select>
            </div>

            {/* Water */}
            <div className="flex flex-col gap-3 p-4 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
              <label className="flex items-center gap-2 text-[#1F2D2E] font-semibold text-sm">
                <Droplets size={16} className="text-[#3A86FF]" /> Water Consumption Per Day
              </label>
              <select 
                value={habitData.water} 
                onChange={e => setHabitData({...habitData, water: e.target.value})} 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-[#5F6F73] text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-50"
              >
                <option value="">Select.....</option>
                <option value="less_1L">Less than 1L</option>
                <option value="1_2L">1-2 Liters</option>
                <option value="2_3L">2-3 Liters</option>
                <option value="3L_plus">3+ Liters</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full md:w-auto bg-[#0FA4A9] hover:bg-opacity-90 text-white font-bold px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Today's Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogTodayModal;
