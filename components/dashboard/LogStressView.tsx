"use client";

import React, { useState } from "react";
import { Frown, Meh, Smile, X, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePostStressLogMutation } from "@/redux/features/api/userDashboard/stresslog";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";

interface LogStressViewProps {
  onSave: () => void;
  onBack: () => void;
}

const MOODS = [
  { id: "motivated", label: "Motivated", color: "text-[#0FA4A9]", bg: "bg-[#EAF6F6]" },
  { id: "happy", label: "Happy", color: "text-[#10B981]", bg: "bg-green-50" },
  { id: "normal", label: "Normal", color: "text-[#3A86FF]", bg: "bg-blue-50" },
  { id: "neutral", label: "Neutral", color: "text-gray-500", bg: "bg-gray-100" },
  { id: "low", label: "Low", color: "text-[#A855F7]", bg: "bg-purple-50" },
  { id: "sad", label: "Sad", color: "text-pink-500", bg: "bg-pink-50" },
  { id: "anxious", label: "Anxious", color: "text-orange-500", bg: "bg-orange-50" },
  { id: "angry", label: "Angry", color: "text-red-500", bg: "bg-red-50" },
];

export default function LogStressView({ onSave, onBack }: LogStressViewProps) {
  const [stressLevel, setStressLevel] = useState(5);
  const [selectedMood, setSelectedMood] = useState("normal");
  const [description, setDescription] = useState("");
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?.id || currentUser?.user_id;
  
  const [postStressLog, { isLoading: isPosting }] = usePostStressLogMutation();

  const handleSubmit = async () => {
    try {
      const payload = {
        user_id: userId || 3, // Consistency with other logs
        stress_level: stressLevel,
        mood: selectedMood,
        description: description,
        log_date: new Date().toISOString().slice(0, 10),
      };

      console.log("Sending Stress Log Payload:", payload);
      
      const response = await postStressLog(payload).unwrap();
      if (response.success || response.status === "success") {
        toast.success("Stress data logged successfully!");
        onSave(); // Close or return
      } else {
        toast.error(response.message || "Failed to log stress data.");
      }
    } catch (err: any) {
      console.error("Error logging stress:", err);
      
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
      } else if (err.status === 400) {
        toast.error(errorData.message || "Invalid data. Please check your inputs.");
      } else {
        toast.error("An error occurred while logging stress data. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[800px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="self-start">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#3A86FF]/30 text-[#5F6F73] hover:text-[#1F2D2E] hover:bg-blue-50/50 rounded-lg text-xs font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back To Habit
        </button>
      </div>

      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-gray-100 shadow-sm flex flex-col gap-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] border border-purple-100 flex items-center justify-center shrink-0">
              <Frown size={22} className="text-[#A855F7]" />
            </div>
            <h2 className="text-[22px] font-bold text-[#3A86FF]">Logging : Stress</h2>
          </div>
          <button 
            onClick={onBack}
            className="p-1 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stress Level */}
        <div className="flex flex-col gap-6 p-6 rounded-[16px] border border-[#3A86FF]/25 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-[#1F2D2E] font-medium text-[16px]">Rate your stress level</h3>
            <span className="text-[#3A86FF] font-bold text-[18px]">
              {stressLevel}/10
            </span>
          </div>
          <div className="relative px-2">
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3A86FF]"
            />
          </div>
        </div>

        {/* Today's Mood */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[#1F2D2E] font-medium text-[16px]">Today's Mood</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl border transition-all",
                  selectedMood === mood.id
                    ? cn(mood.bg, "border-[#3A86FF] border-2 shadow-sm")
                    : "bg-white border-gray-100 hover:border-gray-200"
                )}
              >
                <span className={cn("text-xs font-bold uppercase tracking-wider", mood.color)}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[#1F2D2E] font-medium text-[16px]">Tell us more (Optional)</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="How was your day? What influenced your stress level?"
            className="w-full min-h-[120px] p-4 rounded-xl border border-gray-100 focus:border-[#3A86FF]/30 focus:ring-4 focus:ring-blue-50/50 focus:outline-none transition-all resize-none text-[15px] bg-gray-50/30"
          />
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSubmit}
          disabled={isPosting}
          className="w-full bg-[#0FA4A9] text-white py-4 rounded-xl font-bold text-[18px] hover:bg-opacity-90 transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20 flex items-center justify-center gap-2"
        >
          {isPosting ? <Loader2 className="animate-spin" /> : "Save Today's Stress"}
        </button>
      </div>
    </div>
  );
}
