"use client";

import { X } from "lucide-react";
import ProgramView from "./ProgramView";
import { Program } from "./ProgramsData";

interface ProgramViewModalProps {
  program: Program | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgramViewModal({
  program,
  isOpen,
  onClose,
}: ProgramViewModalProps) {
  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white max-w-6xl w-full mx-4 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <div className="flex justify-end p-4 border-b">
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Program Content */}
        <ProgramView
          program={{
            id: program.id,
            name: program.name,
            duration: program.duration,
            primaryGoal: program.primaryGoal,
            intensity: program.intensity,
            focusCount: program.focusAreas?.length ?? 0,
            habitFocus: program.habitFocus ?? [],
            programFocus: program.focusAreas ?? [],
            wellnessMacros: {
              calories: program.wellnessMetrics?.calories ?? 0,
              protein: program.wellnessMetrics?.protein ?? 0,
              carbs: program.wellnessMetrics?.carbs ?? 0,
              fat: program.wellnessMetrics?.fat ?? 0,
            },
            supplements: Object.entries(program.supplementRecommendations ?? {})
              .filter(([_, v]) => v)
              .map(([k]) =>
                k
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (s) => s.toUpperCase()),
              ),
            users: [], // Added to satisfy TypeScript requirement
          }}
        />
      </div>
    </div>
  );
}
