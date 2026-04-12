"use client";

import { X } from "lucide-react";
import { ProgramFormData } from "../CreateProgramsModal";

interface Step1Props {
  formData: ProgramFormData;
  setFormData: (data: ProgramFormData) => void;
  onClose: () => void;
}

export default function Step1ProgramBasics({
  formData,
  setFormData,
  onClose,
}: Step1Props) {
  const handleChange = (
    field: keyof ProgramFormData,
    value: string | boolean,
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b bg-white flex justify-between items-start">
        <div>
          <div className="text-2xl mb-3 font-medium text-black">
            Step 1 of 4
          </div>
          <p className="text-base mb-4 text-[#5F6F73]">Program Basics</p>
        </div>
        <button
          onClick={onClose}
          className="cursor-pointer rounded-full border-2 p-1 hover:opacity-80"
        >
          <X />
        </button>
      </div>

      {/* Program Name */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">
          Program Name
        </label>
        <input
          type="text"
          placeholder="e.g. 12-Week Fat Loss Accelerator"
          value={formData.programName}
          onChange={(e) => handleChange("programName", e.target.value)}
          className="w-full placeholder:text-[#9AAEB2] px-5 text-base py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Duration and Primary Goal */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Duration
          </label>
          <select
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="w-full placeholder:text-[#9AAEB2] px-5 text-base py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="4 weeks">4 weeks</option>
            <option value="8 weeks">8 weeks</option>
            <option value="12 weeks">12 weeks</option>
            <option value="16 weeks">16 weeks</option>
            <option value="20 weeks">20 weeks</option>
          </select>
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Primary Goal
          </label>
          <select
            value={formData.primaryGoal}
            onChange={(e) => handleChange("primaryGoal", e.target.value)}
            className="w-full placeholder:text-[#9AAEB2] px-5 text-base py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="Fat Loss">Fat Loss</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Performance">Performance</option>
            <option value="General Health">General Health</option>
            <option value="Endurance">Endurance</option>
          </select>
        </div>
      </div>

      {/* Target Intensity */}
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">
          Target Intensity
        </label>
        <div className="flex gap-3 bg-[#0FA4A926] rounded-lg px-5 md:px-14 py-4">
          {["light", "moderate", "high"].map((intensity) => (
            <button
              key={intensity}
              onClick={() => handleChange("targetIntensity", intensity)}
              className={`flex-1 cursor-pointer placeholder:text-[#9AAEB2] px-5 text-base py-3 rounded-lg font-medium transition ${
                formData.targetIntensity === intensity
                  ? "bg-white text-black"
                  : "bg-transparent text-gray-700 hover:bg-gray-300"
              }`}
            >
              {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
