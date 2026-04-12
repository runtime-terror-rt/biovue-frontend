"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Apple } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogNutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MEAL_BALANCES = [
  "Mostly Carbs",
  "Balanced",
  "Protein-Focused",
  "High Fat/Processed",
];
const FAT_SOURCES = ["Fried/Processed", "Dairy", "Nut & Seeds", "Healthy Oils"];
const CARB_QUALITIES = [
  {
    title: "Mostly Refined Carbs",
    desc: "White Bread, Pasta, Sugary Snacks",
    id: "refined",
  },
  {
    title: "Mixed",
    desc: "A Mix Of Refined And Whole Foods",
    id: "mixed",
  },
  {
    title: "Mostly Whole Grains/Fruits",
    desc: "Quinoa, Oats, Berries, Legumes",
    id: "whole",
  },
];

export default function LogNutritionModal({
  isOpen,
  onClose,
}: LogNutritionModalProps) {
  const [mealBalance, setMealBalance] = useState("Mostly Carbs");
  const [proteinServings, setProteinServings] = useState(2);
  const [carbQuality, setCarbQuality] = useState("mixed");
  const [fatSource, setFatSource] = useState("Fried/Processed");
  const [vegServings, setVegServings] = useState(2);

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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-250 pointer-events-auto border border-gray-100 flex flex-col gap-6 my-4 max-h-[95vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F6F6] border border-[#0FA4A9]/20 flex items-center justify-center shrink-0">
                    <Apple size={20} className="text-[#0FA4A9]" />
                  </div>
                  <h2 className="text-[20px] font-bold text-[#3A86FF]">
                    Logging : Nutrition
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2 custom-scrollbar">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                  {/* Meal Balance */}
                  <div className="flex flex-col gap-3 p-4 rounded-2xl border border-gray-100 bg-[#F8FBFF]/50">
                    <h3 className="text-[#1F2D2E] font-bold text-[14px]">
                      Meal Balance
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {MEAL_BALANCES.map((option) => (
                        <button
                          key={option}
                          onClick={() => setMealBalance(option)}
                          className={cn(
                            "px-1 py-2.5 rounded-lg text-[12px] font-bold transition-all border shrink-0",
                            mealBalance === option
                              ? "bg-[#D9E6FF] text-[#1F2D2E] border-[#3A86FF]/30"
                              : "bg-white text-[#5F6F73] border-gray-100 hover:bg-gray-50",
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Protein Servings */}
                  <div className="flex flex-col gap-4 p-4 rounded-2xl border border-gray-100 bg-[#F8FBFF]/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#1F2D2E] font-bold text-[14px]">
                        Protein Servings
                      </h3>
                      <span className="bg-[#EAF6F6] text-[#1F2D2E] px-2.5 py-1 rounded-md text-[11px] font-bold border border-teal-100">
                        {proteinServings === 3
                          ? "6+"
                          : proteinServings === 2
                            ? "4-5"
                            : proteinServings === 1
                              ? "2-3"
                              : "0-1"}{" "}
                        Servings
                      </span>
                    </div>
                    <div className="relative px-2">
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step="1"
                        value={proteinServings}
                        onChange={(e) =>
                          setProteinServings(parseInt(e.target.value))
                        }
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3A86FF]"
                      />
                      <div className="flex justify-between mt-3 text-[11px] font-bold text-[#1F2D2E]">
                        <span>0-1</span>
                        <span>2-3</span>
                        <span>4-5</span>
                        <span>6+</span>
                      </div>
                    </div>
                  </div>

                  {/* Carb Quality */}
                  <div className="flex flex-col gap-3 p-4 rounded-2xl border border-[#3A86FF]/20 bg-[#F0F5FF]/30">
                    <h3 className="text-[#1F2D2E] font-bold text-[14px]">
                      Carb Quality
                    </h3>
                    <div className="flex flex-col gap-2">
                      {CARB_QUALITIES.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setCarbQuality(item.id)}
                          className={cn(
                            "flex flex-col gap-0.5 p-3 rounded-xl border transition-all text-left",
                            carbQuality === item.id
                              ? "bg-[#EAF6F6] border-[#0FA4A9]/30"
                              : "bg-white border-gray-100 hover:border-gray-200",
                          )}
                        >
                          <span className="text-[#1F2D2E] font-bold text-[14px]">
                            {item.title}
                          </span>
                          <span className="text-[#5F6F73] text-[12px] font-medium">
                            {item.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  {/* Fat Sources */}
                  <div className="flex flex-col gap-3 p-4 rounded-2xl border border-gray-100 bg-[#F8FBFF]/50">
                    <h3 className="text-[#1F2D2E] font-bold text-[14px]">
                      Fat Sources
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {FAT_SOURCES.map((option) => (
                        <button
                          key={option}
                          onClick={() => setFatSource(option)}
                          className={cn(
                            "px-1 py-2.5 rounded-lg text-[12px] font-bold transition-all border",
                            fatSource === option
                              ? "bg-[#D9E6FF] text-[#1F2D2E] border-[#3A86FF]/30"
                              : "bg-white text-[#5F6F73] border-gray-100 hover:bg-gray-50",
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vegetable Servings */}
                  <div className="flex flex-col gap-4 p-4 rounded-2xl border border-gray-100 bg-[#F8FBFF]/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[#1F2D2E] font-bold text-[14px]">
                        Vegetable Servings
                      </h3>
                      <span className="bg-[#EAF6F6] text-[#1F2D2E] px-2.5 py-1 rounded-md text-[11px] font-bold border border-teal-100">
                        {vegServings === 6 ? "6+" : vegServings} Servings
                      </span>
                    </div>
                    <div className="relative px-2">
                      <input
                        type="range"
                        min="0"
                        max="6"
                        step="1"
                        value={vegServings}
                        onChange={(e) =>
                          setVegServings(parseInt(e.target.value))
                        }
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                      />
                      <div className="flex justify-between mt-3 text-[11px] font-bold text-[#1F2D2E]">
                        {[0, 1, 2, 3, 4, 5, "6+"].map((v, i) => (
                          <span key={i}>{v}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Save Button Placeholder for spacing or just the button */}
                  <div className="mt-auto pt-4 hidden md:block">
                    <button
                      onClick={onClose}
                      className="w-full bg-[#0FA4A9] text-white py-4 rounded-xl font-bold text-[17px] hover:bg-opacity-90 transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20"
                    >
                      Save Today&apos;s Nutrition
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Save Button */}
              <div className="md:hidden">
                <button
                  onClick={onClose}
                  className="w-full bg-[#0FA4A9] text-white py-4 rounded-xl font-bold text-[17px] hover:bg-opacity-90 transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20"
                >
                  Save Today&apos;s Nutrition
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
