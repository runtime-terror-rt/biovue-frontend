"use client";

import { X } from "lucide-react";
import { ProgramFormData } from "../CreateProgramsModal";

interface Step3Props {
  formData: ProgramFormData;
  setFormData: (data: ProgramFormData) => void;
  onClose: () => void;
}

const supplementOptions = [
  { id: "protein", label: "Protein" },
  { id: "creatine", label: "Creatine" },
  { id: "multivitamin", label: "Multivitamin" },
  { id: "omega3", label: "Omega-3" },
  { id: "electrolytes", label: "Electrolytes" },
  { id: "vitaminD", label: "Vitamin D" },
  { id: "magnesium", label: "Magnesium" },
  { id: "other", label: "Other" },
  { id: "aminoAcids", label: "Amino Acids (BCAAs/Glutamine)" },
  { id: "preWorkout", label: "Pre-Workout" },
];

export default function Step3NutritionAndSupplements({
  formData,
  setFormData,
  onClose,
}: Step3Props) {
  const handleMetricsChange = (key: string, value: string | boolean) => {
    setFormData({
      ...formData,
      wellnessMetrics: {
        ...formData.wellnessMetrics,
        [key]: value,
      },
    });
  };

  const handleSupplementChange = (supplementId: string, isChecked: boolean) => {
    setFormData({
      ...formData,
      supplementRecommendations: {
        ...formData.supplementRecommendations,
        [supplementId]: isChecked,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="border-b bg-white flex justify-between items-start">
        <div>
          <div className="text-2xl mb-3 font-medium text-black">
            Step 3 of 4
          </div>
          <p className="text-base mb-4 text-[#5F6F73]">
            Nutrition & Supplements
          </p>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer rounded-full border-2 p-1 hover:opacity-80"
        >
          <X />
        </button>
      </div>

      {/* Wellness Metrics */}
      <div>
        <h4 className="font-medium text-lg text-gray-900 mb-4">
          A. Wellness Metrics (Optional)
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-medium text-[#5F6F73] mb-2">
              Calories (kcal)
            </label>
            <input
              type="text"
              placeholder="e.g. 2000-2200"
              value={formData.wellnessMetrics.calories}
              onChange={(e) => handleMetricsChange("calories", e.target.value)}
              className="w-full px-5 py-6 border placeholder:text-[#9AAEB2] placeholder:text-md placeholder:text-xl border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-[#5F6F73] mb-2">
              Protein (g)
            </label>
            <input
              type="text"
              placeholder="e.g. 160"
              value={formData.wellnessMetrics.protein}
              onChange={(e) => handleMetricsChange("protein", e.target.value)}
              className="w-full px-5 py-6 border placeholder:text-[#9AAEB2] placeholder:text-md placeholder:text-xl border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-lg font-medium text-[#5F6F73] mb-2">
              Carbs (g)
            </label>
            <input
              type="text"
              placeholder="e.g. 300"
              value={formData.wellnessMetrics.carbs}
              onChange={(e) => handleMetricsChange("carbs", e.target.value)}
              className="w-full px-5 py-6 border placeholder:text-[#9AAEB2] placeholder:text-md placeholder:text-xl border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-[#5F6F73] mb-2">
              Fat (g)
            </label>
            <input
              type="text"
              placeholder="e.g. 70"
              value={formData.wellnessMetrics.fat}
              onChange={(e) => handleMetricsChange("fat", e.target.value)}
              className="w-full px-5 py-6 border placeholder:text-[#9AAEB2] placeholder:text-md md:placeholder:text-xl border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Supplement Recommendations */}
      <div>
        <h4 className="font-medium text-lg text-gray-900 mb-4">
          B. Supplement Recommendations (Optional)
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {supplementOptions.map((supplement) => (
            <label
              key={supplement.id}
              className="flex  items-center gap-3 p-6 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
            >
              <input
                type="checkbox"
                checked={
                  formData.supplementRecommendations[
                    supplement.id as keyof typeof formData.supplementRecommendations
                  ]
                }
                onChange={(e) =>
                  handleSupplementChange(supplement.id, e.target.checked)
                }
                className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-md md:text-xl font-medium text-black">
                {supplement.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
