"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGetProgramsQuery, Program } from "@/redux/features/api/userDashboard/GetPrograms";
import {
  Loader2,
  FileText,
  Calendar,
  Target,
  Zap,
  User,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  X,
  MessageCircle,
  Utensils,
  Pill,
  Info,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AssignedProgramsPage() {
  const searchParams = useSearchParams();
  const { data: response, isLoading, error } = useGetProgramsQuery();
  const [expandedRoutineId, setExpandedRoutineId] = useState<number | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const programs = response?.data || [];

  // If URL has program_id from notification or deep-link, open modal automatically
  useEffect(() => {
    const pId = searchParams.get("program_id");
    if (pId && programs.length > 0) {
      const match = programs.find((p) => p.program_id === Number(pId));
      if (match) {
        setSelectedProgram(match);
      }
    }
  }, [searchParams, programs]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProgram) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProgram]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0FA4A9]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500 font-medium">
        Failed to load assigned programs. Please try again later.
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 sm:py-8 px-4 sm:px-6 md:px-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1F2D2E]">
          Your Assigned Programs
        </h1>
        <p className="text-xs sm:text-sm text-[#5F6F73] mt-1">
          View the training programs and workout routines assigned directly by your coach. Click any program to inspect full details.
        </p>
      </div>

      {programs.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 text-[#0FA4A9] mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#1F2D2E]">
            No Programs Assigned Yet
          </h3>
          <p className="text-xs sm:text-sm text-[#5F6F73] max-w-xs mx-auto mt-2">
            You don&apos;t have any programs assigned yet. Reach out to your coach to receive a personalized workout plan!
          </p>
          <Link href="/user-dashboard/messages">
            <Button className="mt-5 bg-[#0FA4A9] hover:bg-[#0FA4A9]/90 text-white font-medium text-xs sm:text-sm">
              <MessageCircle size={15} className="mr-2" />
              Message Coach
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {programs.map((program) => {
            const routineText = program.workout_routine || program.description;
            const isExpanded = expandedRoutineId === program.program_id;

            return (
              <Card
                key={program.program_id}
                onClick={() => setSelectedProgram(program)}
                className="border border-gray-100 hover:border-[#0FA4A9]/40 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_24px_rgba(15,164,169,0.12)] transition-all overflow-hidden group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-1.5 w-full bg-[#0FA4A9] opacity-20 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start py-2 mb-2">
                      <Badge className="bg-[#E4EFFF] text-[#3A86FF] hover:bg-[#E4EFFF] border-none px-2.5 py-0.5 text-[11px] font-semibold">
                        ACTIVE
                      </Badge>
                      <span className="text-[11px] text-[#9AAEB2] font-medium flex items-center gap-1">
                        <Calendar size={12} />
                        {program.assigned_date}
                      </span>
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-[#1F2D2E] leading-tight group-hover:text-[#0FA4A9] transition-colors">
                      {program.program_name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-3 bg-[#F8FBFA] p-3 rounded-xl border border-gray-100">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-[#9AAEB2] uppercase tracking-wider">
                          GOAL
                        </span>
                        <div className="flex items-center gap-1.5 text-[#1F2D2E] font-semibold text-xs sm:text-sm">
                          <Target size={14} className="text-[#3A86FF] shrink-0" />
                          <span className="truncate">{program.primary_goal}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-[#9AAEB2] uppercase tracking-wider">
                          INTENSITY
                        </span>
                        <div className="flex items-center gap-1.5 text-[#1F2D2E] font-semibold text-xs sm:text-sm">
                          <Zap size={14} className="text-[#F59E0B] shrink-0" />
                          <span>{program.target_intensity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Workout Types Tags */}
                    {program.workout_types && Array.isArray(program.workout_types) && program.workout_types.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-[#9AAEB2] uppercase tracking-wider block">
                          WORKOUT TYPES
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {program.workout_types.map((type, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 bg-teal-50 text-[#0FA4A9] rounded-md text-xs font-semibold"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Workout Routine Preview */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F2D2E]">
                          <Dumbbell size={14} className="text-[#0FA4A9]" />
                          <span>Workout Routine & Plan</span>
                        </div>
                      </div>

                      {routineText ? (
                        <div className="bg-[#F8FBFA] border border-[#E4EFFF] rounded-xl p-3">
                          <p className="text-xs text-[#374151] leading-relaxed whitespace-pre-wrap font-sans line-clamp-3">
                            {routineText}
                          </p>
                          <span className="mt-2 text-xs text-[#3A86FF] font-semibold block">
                            Click card to read full routine →
                          </span>
                        </div>
                      ) : (
                        <div className="bg-[#F8FBFA] border border-dashed border-gray-200 rounded-xl p-3 text-center">
                          <p className="text-xs text-[#9AAEB2] italic">
                            Template enrolled • Click for full plan details
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Trainer Notes snippet */}
                    {program.notes && (
                      <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-2.5">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-0.5">
                          Coach Note:
                        </span>
                        <p className="text-xs text-amber-900 leading-relaxed line-clamp-2">
                          {program.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#0FA4A9]">
                        <User size={15} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-[#9AAEB2] uppercase tracking-wider leading-none mb-0.5">
                          TRAINER
                        </span>
                        <span className="text-xs font-bold text-[#1F2D2E]">
                          {program.created_by}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-[#9AAEB2] uppercase tracking-wider leading-none mb-0.5 block">
                        DURATION
                      </span>
                      <span className="text-xs font-extrabold text-[#3A86FF]">
                        {program.duration} WEEKS
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProgram(program);
                    }}
                    className="w-full mt-3 py-2 bg-[#F4FBFA] hover:bg-[#0FA4A9] text-[#0FA4A9] hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Program Details</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Program Details Modal */}
      {selectedProgram && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-200 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-5 sm:px-6 py-4 rounded-t-2xl flex items-start justify-between gap-3 z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-[#E4EFFF] text-[#3A86FF] border-none text-[10px] font-bold uppercase">
                    ACTIVE PROGRAM
                  </Badge>
                  <span className="text-xs text-[#9AAEB2] flex items-center gap-1">
                    <Calendar size={13} />
                    Assigned: {selectedProgram.assigned_date}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1F2D2E]">
                  {selectedProgram.program_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#5F6F73] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-6">
              {/* Coach Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-teal-50/70 to-blue-50/60 border border-teal-100/60">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#0FA4A9] text-white flex items-center justify-center font-bold text-sm">
                    <User size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#0FA4A9] uppercase tracking-wider block">
                      ASSIGNED COACH
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#1F2D2E]">
                      {selectedProgram.created_by}
                    </h4>
                    {selectedProgram.trainer_email && (
                      <p className="text-xs text-[#5F6F73]">{selectedProgram.trainer_email}</p>
                    )}
                  </div>
                </div>

                <Link href="/user-dashboard/messages">
                  <Button
                    size="sm"
                    className="bg-[#0FA4A9] hover:bg-[#0FA4A9]/90 text-white font-semibold text-xs gap-1.5"
                  >
                    <MessageCircle size={14} />
                    Message Coach
                  </Button>
                </Link>
              </div>

              {/* Core Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F8FBFA] border border-gray-100 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-bold text-[#9AAEB2] uppercase tracking-wider block mb-1">
                    PRIMARY GOAL
                  </span>
                  <div className="inline-flex items-center justify-center gap-1 text-sm font-bold text-[#1F2D2E]">
                    <Target size={14} className="text-[#3A86FF]" />
                    <span className="truncate">{selectedProgram.primary_goal}</span>
                  </div>
                </div>

                <div className="bg-[#F8FBFA] border border-gray-100 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-bold text-[#9AAEB2] uppercase tracking-wider block mb-1">
                    INTENSITY
                  </span>
                  <div className="inline-flex items-center justify-center gap-1 text-sm font-bold text-[#1F2D2E]">
                    <Zap size={14} className="text-[#F59E0B]" />
                    <span>{selectedProgram.target_intensity}</span>
                  </div>
                </div>

                <div className="bg-[#F8FBFA] border border-gray-100 rounded-xl p-3 text-center">
                  <span className="text-[10px] font-bold text-[#9AAEB2] uppercase tracking-wider block mb-1">
                    DURATION
                  </span>
                  <div className="inline-flex items-center justify-center gap-1 text-sm font-bold text-[#3A86FF]">
                    <Clock size={14} />
                    <span>{selectedProgram.duration} Weeks</span>
                  </div>
                </div>
              </div>

              {/* Workout Types */}
              {selectedProgram.workout_types && Array.isArray(selectedProgram.workout_types) && selectedProgram.workout_types.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#5F6F73] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Dumbbell size={14} className="text-[#0FA4A9]" />
                    Target Workout Disciplines
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProgram.workout_types.map((type, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-teal-50 border border-teal-200/50 text-[#0FA4A9] rounded-lg text-xs font-semibold"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Workout Routine & Plan */}
              <div>
                <h4 className="text-xs font-bold text-[#5F6F73] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-[#0FA4A9]" />
                  Prescribed Workout Routine & Plan
                </h4>
                {selectedProgram.workout_routine || selectedProgram.description ? (
                  <div className="bg-[#F8FBFA] border border-gray-200 rounded-xl p-4 sm:p-5">
                    <p className="text-xs sm:text-sm text-[#1F2D2E] leading-relaxed whitespace-pre-wrap font-sans">
                      {selectedProgram.workout_routine || selectedProgram.description}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#F8FBFA] border border-dashed border-gray-200 rounded-xl p-5 text-center">
                    <Info size={24} className="text-[#0FA4A9] mx-auto mb-2 opacity-80" />
                    <h5 className="text-xs sm:text-sm font-semibold text-[#1F2D2E] mb-1">
                      Program Template Assigned
                    </h5>
                    <p className="text-xs text-[#5F6F73] max-w-sm mx-auto mb-3">
                      Your coach has assigned this training track to your profile. You can reach out directly via chat to receive daily exercises and rep targets.
                    </p>
                    <Link href="/user-dashboard/messages">
                      <Button size="sm" className="bg-[#0FA4A9] hover:bg-[#0FA4A9]/90 text-white font-medium text-xs">
                        <MessageCircle size={13} className="mr-1.5" />
                        Ask Coach for Detailed Routine
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Target Macros if assigned */}
              {(selectedProgram.calories || selectedProgram.protein || selectedProgram.carbs || selectedProgram.fat) && (
                <div>
                  <h4 className="text-xs font-bold text-[#5F6F73] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Utensils size={14} className="text-[#0FA4A9]" />
                    Assigned Macro & Nutrition Targets
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold text-amber-800 uppercase block mb-0.5">Calories</span>
                      <span className="text-base font-extrabold text-[#1F2D2E]">{selectedProgram.calories || "—"}</span>
                      <span className="text-[10px] text-gray-500 block">kcal / day</span>
                    </div>
                    <div className="bg-blue-50/50 border border-blue-200/60 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold text-[#3A86FF] uppercase block mb-0.5">Protein</span>
                      <span className="text-base font-extrabold text-[#1F2D2E]">{selectedProgram.protein || "—"}</span>
                      <span className="text-[10px] text-gray-500 block">grams</span>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-0.5">Carbs</span>
                      <span className="text-base font-extrabold text-[#1F2D2E]">{selectedProgram.carbs || "—"}</span>
                      <span className="text-[10px] text-gray-500 block">grams</span>
                    </div>
                    <div className="bg-purple-50/50 border border-purple-200/60 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold text-purple-700 uppercase block mb-0.5">Fats</span>
                      <span className="text-base font-extrabold text-[#1F2D2E]">{selectedProgram.fat || "—"}</span>
                      <span className="text-[10px] text-gray-500 block">grams</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Supplement Recommendations */}
              {selectedProgram.supplement_recommendation &&
                Array.isArray(selectedProgram.supplement_recommendation) &&
                selectedProgram.supplement_recommendation.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-[#5F6F73] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Pill size={14} className="text-[#0FA4A9]" />
                      Coach Supplement Recommendations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProgram.supplement_recommendation.map((supp, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 border border-blue-200/60 text-[#3A86FF] rounded-lg text-xs font-semibold"
                        >
                          {supp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Coach Notes */}
              {selectedProgram.notes && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                    Coach Notes & Instructions
                  </span>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed whitespace-pre-wrap">
                    {selectedProgram.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-5 sm:px-6 py-3.5 rounded-b-2xl flex items-center justify-between gap-3">
              <Link href="/user-dashboard/goals" className="text-xs text-[#0FA4A9] hover:underline font-semibold flex items-center gap-1">
                <span>View Full Coach Goals & Targets</span>
                <ArrowRight size={13} />
              </Link>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProgram(null)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Link href="/user-dashboard/messages">
                  <Button size="sm" className="bg-[#0FA4A9] hover:bg-[#0FA4A9]/90 text-white text-xs font-semibold gap-1.5">
                    <MessageCircle size={14} />
                    Message Coach
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
