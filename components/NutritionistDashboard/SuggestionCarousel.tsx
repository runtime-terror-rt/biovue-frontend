"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Zap, Target, Activity, Dumbbell, Heart, Star, ShieldAlert } from "lucide-react";

interface Suggestion {
  user_profile: {
    user_id: string;
    goal: string;
    goal_description: string;
    key_health_concerns: string[];
  };
  match_reason: string;
  priority: number;
  status: string;
}

interface SuggestionCarouselProps {
  suggestions: Suggestion[];
}

const goalIcons: Record<string, React.ReactNode> = {
  Athletic: <Target className="text-blue-500" size={24} />,
  Toned: <Zap className="text-yellow-500" size={24} />,
  Lean: <Activity className="text-green-500" size={24} />,
  Muscular: <Dumbbell className="text-red-500" size={24} />,
  "Curvy-Fit": <Heart className="text-pink-500" size={24} />,
};

const getPriorityTheme = (priority: number) => {
  if (priority <= 1) return {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-100",
    accent: "bg-red-600",
    shadow: "shadow-red-900/5"
  };
  if (priority <= 3) return {
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
    accent: "bg-orange-600",
    shadow: "shadow-orange-900/5"
  };
  return {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    accent: "bg-blue-600",
    shadow: "shadow-blue-900/5"
  };
};

export default function SuggestionCarousel({ suggestions }: SuggestionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 3;
  const totalPages = Math.ceil(suggestions.length / cardsPerPage);

  const next = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleSuggestions = suggestions.slice(
    currentIndex * cardsPerPage,
    (currentIndex + 1) * cardsPerPage
  );

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Priority Suggestions
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0FA4A9]/10 text-[#0FA4A9] rounded-full border border-[#0FA4A9]/20">
              <Star size={14} className="fill-[#0FA4A9]" />
              <span className="text-[11px] font-bold uppercase tracking-wider">AI Powered</span>
            </div>
          </div>
          <p className="text-gray-500 font-medium">Clinically mapped recommendations for your attention</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="p-3 rounded-full border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            <ChevronLeft size={22} className="text-gray-700" />
          </button>
          <button
            onClick={next}
            disabled={currentIndex === totalPages - 1}
            className="p-3 rounded-full border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
          >
            <ChevronRight size={22} className="text-gray-700" />
          </button>
        </div>
      </div>

      <div className="relative overflow-visible min-h-[380px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {visibleSuggestions.map((suggestion, idx) => {
              const theme = getPriorityTheme(suggestion.priority);
              return (
                <motion.div
                  key={suggestion.user_profile.user_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative flex flex-col h-full bg-white rounded-[2.5rem] p-8 border ${theme.border} shadow-xl ${theme.shadow} overflow-hidden group hover:-translate-y-2 transition-all duration-500`}
                >
                  {/* Decorative Gradient Background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${theme.bg} rounded-full -mr-16 -mt-16 opacity-40 blur-3xl group-hover:scale-150 transition-transform duration-700`} />
                  
                  {/* Priority Badge */}
                  <div className={`absolute top-6 right-8 flex items-center gap-1.5 px-3 py-1 ${theme.bg} ${theme.text} rounded-full border ${theme.border} text-[10px] font-black uppercase tracking-widest z-10`}>
                    <ShieldAlert size={12} />
                    PRIORITY {suggestion.priority}
                  </div>

                  {/* Header Component */}
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 mb-4 group-hover:rotate-6 transition-transform duration-500">
                      {goalIcons[suggestion.user_profile.goal] || goalIcons.Lean}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Client #{suggestion.user_profile.user_id}</h3>
                    <div className="text-xs font-bold text-[#0FA4A9] uppercase tracking-[0.2em]">
                      {suggestion.user_profile.goal}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 space-y-4 relative z-10">
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Primary Goal</span>
                      <p className="text-sm text-gray-800 font-semibold leading-relaxed">
                        {suggestion.user_profile.goal_description}
                      </p>
                    </div>

                    <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 group-hover:bg-white transition-colors">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Match Logic</span>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium italic">
                        "{suggestion.match_reason}"
                      </p>
                    </div>
                  </div>

                  {/* Footer Metrics */}
                  <div className="mt-6 pt-6 border-t border-gray-50">
                    <div className="flex flex-wrap gap-2">
                      {suggestion.user_profile.key_health_concerns.map((concern) => (
                        <span
                          key={concern}
                          className="px-3 py-1.5 bg-white text-gray-600 rounded-xl text-[10px] font-bold border border-gray-100 capitalize shadow-sm hover:border-[#0FA4A9]/30 transition-colors"
                        >
                          {concern.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  {/* <button className={`mt-6 w-full py-4 ${theme.accent} text-white rounded-[1.25rem] text-[13px] font-black uppercase tracking-widest shadow-lg shadow-${theme.accent}/20 hover:scale-[1.02] active:scale-[0.98] transition-all`}>
                    Analyze Profile
                  </button> */}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Indicators */}
      <div className="flex justify-center mt-10 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all duration-500 ease-out ${
              i === currentIndex ? "w-10 bg-[#0FA4A9]" : "w-2 bg-gray-200 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
