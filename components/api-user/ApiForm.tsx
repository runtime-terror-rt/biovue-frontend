"use client";

import React from "react";
import Image from "next/image";
import { Check, UploadCloud, Sparkles, Code } from "lucide-react";
import { ApiTab } from "./ApiTabs";

interface ApiFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  formConfig: {
    title: string;
    submitFn: (e: React.FormEvent) => Promise<void>;
    isSubmitting: boolean;
    btnText: string;
  };
  handleClear: () => void;
  activeApiTab: ApiTab;
}

export interface FieldDef {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options: string[] | null;
  inputType: string;
  placeholder: string;
  group: string;
  tabs: ApiTab[];
}

export const ALL_API_FIELDS: FieldDef[] = [
  // Group 0: Identity
  { key: "full_name", label: "Full Name", type: "string", required: true, options: null, inputType: "text", placeholder: "test", group: "Identity & Credentials", tabs: ["combined", "current", "future"] },
  { key: "email", label: "Email", type: "string", required: true, options: null, inputType: "email", placeholder: "test@example.com", group: "Identity & Credentials", tabs: ["combined"] },

  // Group 1: Vitals & Personal Info
  { key: "age", label: "Age", type: "integer", required: true, options: null, inputType: "number", placeholder: "30", group: "Vitals & Personal Info", tabs: ["combined", "current", "future"] },
  { key: "gender", label: "Gender", type: "string", required: true, options: ["Male", "Female"], inputType: "select", placeholder: "Male", group: "Vitals & Personal Info", tabs: ["combined", "current", "future"] },
  { key: "height_cm", label: "Height (cm)", type: "number", required: true, options: null, inputType: "number", placeholder: "175", group: "Vitals & Personal Info", tabs: ["combined", "current", "future"] },
  { key: "weight_lbs", label: "Weight (lbs)", type: "number", required: true, options: null, inputType: "number", placeholder: "160", group: "Vitals & Personal Info", tabs: ["combined", "current", "future"] },
  { key: "body_fat_percent", label: "Body Fat (%)", type: "number", required: false, options: null, inputType: "number", placeholder: "15", group: "Vitals & Personal Info", tabs: ["combined", "current", "future"] },

  // Group 2: Lifestyle & Habits
  { key: "activity_level", label: "Activity Level", type: "string", required: false, options: ["Sedentary", "Moderate", "Active"], inputType: "select", placeholder: "Moderate", group: "Lifestyle & Habits", tabs: ["combined", "current", "future"] },
  { key: "weekly_workout_sessions", label: "Weekly Workouts", type: "integer", required: true, options: null, inputType: "number", placeholder: "3", group: "Lifestyle & Habits", tabs: ["combined", "current", "future"] },
  { key: "weekly_avg_daily_steps", label: "Avg Daily Steps", type: "integer", required: true, options: null, inputType: "number", placeholder: "8000", group: "Lifestyle & Habits", tabs: ["combined", "current", "future"] },
  { key: "weekly_avg_sleep_hours", label: "Avg Sleep (Hours)", type: "number", required: true, options: null, inputType: "number", placeholder: "7.5", group: "Lifestyle & Habits", tabs: ["combined", "current", "future"] },
  { key: "weekly_avg_water_litres", label: "Water (Litres/Day)", type: "number", required: true, options: null, inputType: "number", placeholder: "2.5", group: "Lifestyle & Habits", tabs: ["combined", "current", "future"] },
  { key: "nutrition_quality", label: "Nutrition Quality", type: "integer", required: true, options: null, inputType: "number", placeholder: "7", group: "Lifestyle & Habits", tabs: ["combined", "current", "future"] },
  { key: "alcohol_consumption", label: "Alcohol Consumption", type: "string", required: true, options: ["None", "Light", "Moderate", "Heavy"], inputType: "select", placeholder: "None", group: "Lifestyle & Habits", tabs: ["combined", "current", "future"] },
  { key: "fast_food_frequency", label: "Fast Food Frequency", type: "string", required: true, options: ["Rarely", "Occasionally", "Often"], inputType: "select", placeholder: "Rarely", group: "Lifestyle & Habits", tabs: ["combined", "current", "future"] },
  { key: "stress_level", label: "Stress Level", type: "string", required: true, options: ["Low", "Moderate", "High"], inputType: "select", placeholder: "Low", group: "Lifestyle & Habits", tabs: ["combined", "current", "future"] },
  { key: "smoking", label: "Smoking", type: "string", required: true, options: ["No", "Yes", "Occasionally"], inputType: "select", placeholder: "No", group: "Lifestyle & Habits", tabs: ["combined", "current", "future"] },

  // Group 3: Goals
  { key: "goal_type", label: "Goal Type", type: "string", required: false, options: ["Lean", "Toned", "Athletic", "Muscular", "Curvy Fit"], inputType: "select", placeholder: "Toned", group: "Goals", tabs: ["combined", "current", "future"] },
  { key: "goal_description", label: "Goal Description", type: "string", required: true, options: null, inputType: "text", placeholder: "Build muscle and improve physical stamina", group: "Goals", tabs: ["combined", "current", "future"] },
  { key: "goal_timeframe", label: "Goal Timeframe", type: "string", required: true, options: ["1 month", "3 months", "6 months", "1 year"], inputType: "select", placeholder: "6 months", group: "Goals", tabs: ["combined"] },
  { key: "timeframe", label: "Timeframe", type: "string", required: true, options: ["1 month", "3 months", "6 months", "1 year", "5 years"], inputType: "select", placeholder: "5 years", group: "Goals", tabs: ["future"] },

  // Group 4: Medical Conditions
  { key: "diabetes", label: "Diabetes", type: "boolean", required: false, options: null, inputType: "checkbox", placeholder: "false", group: "Medical Conditions", tabs: ["combined", "current", "future"] },
  { key: "thyroid_issue", label: "Thyroid Issue", type: "boolean", required: false, options: null, inputType: "checkbox", placeholder: "false", group: "Medical Conditions", tabs: ["combined", "current", "future"] },
  { key: "high_blood_pressure", label: "High Blood Pressure", type: "boolean", required: false, options: null, inputType: "checkbox", placeholder: "false", group: "Medical Conditions", tabs: ["combined", "current", "future"] },
  { key: "high_cholesterol", label: "High Cholesterol", type: "boolean", required: false, options: null, inputType: "checkbox", placeholder: "false", group: "Medical Conditions", tabs: ["combined", "current", "future"] },
  { key: "depression", label: "Depression", type: "boolean", required: false, options: null, inputType: "checkbox", placeholder: "false", group: "Medical Conditions", tabs: ["combined", "current", "future"] },
  { key: "anxiety", label: "Anxiety", type: "boolean", required: false, options: null, inputType: "checkbox", placeholder: "false", group: "Medical Conditions", tabs: ["combined", "current", "future"] },
  { key: "sleep_apnea", label: "Sleep Apnea", type: "boolean", required: false, options: null, inputType: "checkbox", placeholder: "false", group: "Medical Conditions", tabs: ["combined", "current", "future"] },
  { key: "medications", label: "Medications", type: "string", required: false, options: null, inputType: "text", placeholder: "None", group: "Medical Conditions", tabs: ["combined", "current", "future"] },

  // Group 5: Image Upload & Options (Combined API Only)
  { key: "resolution", label: "Resolution", type: "string", required: false, options: ["1K", "2K"], inputType: "select", placeholder: "1K", group: "Image Upload & Options", tabs: ["combined"] },
];

export const getActiveFieldsForTab = (activeTab: ApiTab): FieldDef[] => {
  const currentTab = activeTab || "combined";
  return ALL_API_FIELDS.filter((f) => f.tabs.includes(currentTab));
};

export default function ApiForm({
  formData,
  handleInputChange,
  handleImageChange,
  imagePreview,
  formConfig,
  handleClear,
  activeApiTab,
}: ApiFormProps) {
  const activeFields = getActiveFieldsForTab(activeApiTab);
  const groups = Array.from(new Set(activeFields.map((f) => f.group)));
  const showImageUpload = activeApiTab === "combined";

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">{formConfig.title}</h2>
          <p className="text-xs text-gray-500 mt-1">
            Fill in values formatted as <span className="font-mono text-teal-600 font-bold">Key=Value</span> ({activeFields.length} Specified Fields).
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-200 shrink-0">
          <Code className="w-3.5 h-3.5" />
          {activeFields.length} Fields Active for {activeApiTab.toUpperCase()}
        </div>
      </div>

      <form onSubmit={formConfig.submitFn} className="space-y-6 sm:space-y-8">
        {groups.map((groupName, gIdx) => {
          const groupFields = activeFields.filter((f) => f.group === groupName);

          return (
            <div key={gIdx} className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">
                {gIdx + 1}. {groupName}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                {groupFields.map((field) => {
                  const val = formData[field.key];

                  if (field.inputType === "checkbox") {
                    return (
                      <div
                        key={field.key}
                        className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-teal-300 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-800">
                            {field.label}=
                          </span>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              name={field.key}
                              checked={Boolean(val)}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div
                              className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center shrink-0 ${
                                Boolean(val)
                                  ? "bg-teal-500 border-teal-500 text-white"
                                  : "bg-white border-gray-300 text-transparent"
                              }`}
                            >
                              {Boolean(val) && (
                                <Check className="w-3.5 h-3.5 text-white stroke-[3] shrink-0" />
                              )}
                            </div>
                            <span className="font-mono text-xs text-slate-700 font-bold">
                              {Boolean(val) ? "true" : "false"}
                            </span>
                          </label>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          {field.type}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={field.key}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-teal-300 transition-all"
                    >
                      <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
                        <span className="font-mono text-xs font-bold text-slate-800 shrink-0">
                          {field.label}=
                        </span>
                        <span
                          className={`sm:hidden text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                            field.type === "integer"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : field.type === "number"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-teal-50 text-teal-700 border border-teal-200"
                          }`}
                        >
                          {field.type}
                          {field.required ? " *" : ""}
                        </span>
                      </div>

                      {field.inputType === "select" ? (
                        <select
                          name={field.key}
                          value={val || ""}
                          onChange={handleInputChange}
                          className="w-full sm:flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-xs font-mono text-slate-900 focus:border-teal-500 cursor-pointer"
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.inputType}
                          step={field.type === "number" ? "0.1" : undefined}
                          name={field.key}
                          value={val || ""}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          className="w-full sm:flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg outline-none text-xs font-mono text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-200"
                        />
                      )}

                      <span
                        className={`hidden sm:inline-block text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                          field.type === "integer"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : field.type === "number"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-teal-50 text-teal-700 border border-teal-200"
                        }`}
                      >
                        {field.type}
                        {field.required ? " *" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Section 6: Photo Upload (Combined API Only) */}
        {showImageUpload && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2 flex items-center justify-between">
              <span>Photo Upload (Image=)</span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                string * (file/base64)
              </span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-2xl hover:border-teal-500 bg-slate-50 hover:bg-teal-50/30 transition-colors cursor-pointer group overflow-hidden">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                  />
                ) : null}
                <div className="flex flex-col items-center justify-center pt-4 pb-4 relative z-10">
                  <UploadCloud
                    className={`w-8 h-8 mb-2 ${
                      imagePreview ? "text-white" : "text-gray-400 group-hover:text-teal-500"
                    }`}
                  />
                  <p
                    className={`mb-1 text-xs font-semibold ${
                      imagePreview ? "text-white drop-shadow-md" : "text-gray-600"
                    }`}
                  >
                    <span className="font-bold font-mono">Image=</span> Click to upload photo or drag & drop
                  </p>
                  <p className={`text-[11px] ${imagePreview ? "text-white drop-shadow-md" : "text-gray-400"}`}>
                    PNG, JPG up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Submit / Reset buttons */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            disabled={formConfig.isSubmitting}
            type="submit"
            className="flex-1 min-h-[48px] px-5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-teal-500/20 disabled:opacity-70 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {formConfig.isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 shrink-0 text-teal-200" />
                <span className="whitespace-nowrap sm:whitespace-normal text-center">
                  Test & Preview Payload (Key=Value Format)
                </span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-6 min-h-[48px] rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}
