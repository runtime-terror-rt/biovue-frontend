"use client";

import React from "react";
import Image from "next/image";
import { Check, UploadCloud, Sparkles, RefreshCw, Send } from "lucide-react";

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
    showImage: boolean;
    showResolution: boolean;
    showTimeframe: boolean;
  };
  handleClear: () => void;
  activeApiTab: string;
}

export default function ApiForm({
  formData,
  handleInputChange,
  handleImageChange,
  imagePreview,
  formConfig,
  handleClear,
  activeApiTab,
}: ApiFormProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
      <h2 className="text-xl font-extrabold text-gray-900 mb-6">{formConfig.title}</h2>
      
      <form onSubmit={formConfig.submitFn} className="space-y-8">
        {/* Section 1: Vitals */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">
            1. Vitals & Personal Info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeApiTab === "insights" && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input required type="text" name="full_name" value={formData.full_name || ""} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white" placeholder="e.g. John Doe" />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Age *</label>
              <input required type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 30" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Gender *</label>
              <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Height (cm) *</label>
              <input required type="number" step="0.1" name="height_cm" value={formData.height_cm} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 175" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Weight (lbs) *</label>
              <input required type="number" step="0.1" name="weight_lbs" value={formData.weight_lbs} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 160" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Body Fat (%)</label>
              <input type="number" step="0.1" name="body_fat_percent" value={formData.body_fat_percent} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white" placeholder="e.g. 15" />
            </div>
          </div>
        </div>

        {/* Section 2: Lifestyle */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">
            2. Lifestyle & Habits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Activity Level</label>
              <select name="activity_level" value={formData.activity_level} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                <option value="" disabled>Select</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Moderate">Moderate</option>
                <option value="Active">Active</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Weekly Workouts *</label>
              <input required type="number" name="weekly_workout_sessions" value={formData.weekly_workout_sessions} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 3" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Avg Daily Steps *</label>
              <input required type="number" name="weekly_avg_daily_steps" value={formData.weekly_avg_daily_steps} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 8000" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Avg Sleep (Hours) *</label>
              <input required type="number" name="weekly_avg_sleep_hours" step="0.1" value={formData.weekly_avg_sleep_hours} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 7.5" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Water (Litres/Day) *</label>
              <input required type="number" name="weekly_avg_water_litres" step="0.1" value={formData.weekly_avg_water_litres} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 2.5" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nutrition Quality (1-10) *</label>
              <input required type="number" name="nutrition_quality" min="1" max="10" value={formData.nutrition_quality} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="e.g. 7" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Alcohol Consumption *</label>
              <select required name="alcohol_consumption" value={formData.alcohol_consumption} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                <option value="" disabled>Select</option>
                <option value="None">None</option>
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="Heavy">Heavy</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Fast Food Freq *</label>
              <select required name="fast_food_frequency" value={formData.fast_food_frequency} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                <option value="" disabled>Select</option>
                <option value="Rarely">Rarely</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Often">Often</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Stress Level *</label>
              <select required name="stress_level" value={formData.stress_level} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                <option value="" disabled>Select</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Smoking *</label>
              <select required name="smoking" value={formData.smoking} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                <option value="" disabled>Select</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
                <option value="Occasionally">Occasionally</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Goals */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">
            3. Goals
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Goal Type</label>
              <select name="goal_type" value={formData.goal_type} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                <option value="" disabled>Select</option>
                <option value="Lean">Lean</option>
                <option value="Toned">Toned</option>
                <option value="Athletic">Athletic</option>
                <option value="Muscular">Muscular</option>
                <option value="Curvy Fit">Curvy Fit</option>
              </select>
            </div>
            {formConfig.showTimeframe && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Timeframe *</label>
                <select required name="goal_timeframe" value={formData.goal_timeframe} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                  <option value="" disabled>Select</option>
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                </select>
              </div>
            )}
            <div className={formConfig.showTimeframe ? "sm:col-span-3" : "sm:col-span-2"}>
              <label className="block text-xs font-bold text-gray-700 mb-1">Goal Description *</label>
              <textarea required name="goal_description" value={formData.goal_description} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm resize-none" rows={3} placeholder="Describe your target physique..."></textarea>
            </div>
          </div>
        </div>

        {/* Section 4: Medical */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">
            4. Medical Conditions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "diabetes", label: "Diabetes" },
              { name: "thyroid_issue", label: "Thyroid Issue" },
              { name: "high_blood_pressure", label: "High BP" },
              { name: "high_cholesterol", label: "High Cholesterol" },
              { name: "depression", label: "Depression" },
              { name: "anxiety", label: "Anxiety" },
              { name: "sleep_apnea", label: "Sleep Apnea" }
            ].map((condition) => (
              <label key={condition.name} className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" name={condition.name} checked={formData[condition.name as keyof typeof formData] as boolean} onChange={handleInputChange} className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-colors"></div>
                  <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">{condition.label}</span>
              </label>
            ))}
            <div className="col-span-2 sm:col-span-4 mt-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Medications</label>
              <input type="text" name="medications" value={formData.medications} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm" placeholder="List any medications (optional)" />
            </div>
          </div>
        </div>

        {/* Conditionally Rendered Section 5: Image Upload & Submit OR Just Submit */}
        {formConfig.showImage ? (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-teal-600 border-b border-gray-100 pb-2">
              5. Photo Upload
            </h3>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1 w-full">
                <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl hover:border-teal-500 bg-slate-50 hover:bg-teal-50/30 transition-colors cursor-pointer group overflow-hidden">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                  ) : null}
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                    <UploadCloud className={`w-10 h-10 mb-3 ${imagePreview ? 'text-white' : 'text-gray-400 group-hover:text-teal-500'}`} />
                    <p className={`mb-2 text-sm font-semibold ${imagePreview ? 'text-white drop-shadow-md' : 'text-gray-500'}`}>
                      <span className="font-bold">Click to upload</span> or drag and drop
                    </p>
                    <p className={`text-xs ${imagePreview ? 'text-white drop-shadow-md' : 'text-gray-400'}`}>PNG, JPG up to 10MB</p>
                  </div>
                  <input required={!imagePreview} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <div className="sm:w-64 space-y-4 w-full flex flex-col justify-end">
                {formConfig.showResolution && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Resolution</label>
                    <select required name="resolution" value={formData.resolution} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm bg-white cursor-pointer">
                      <option value="" disabled>Select</option>
                      <option value="1K">1K</option>
                      <option value="2K">2K</option>
                      <option value="4K">4K</option>
                    </select>
                  </div>
                )}
                <button 
                  disabled={formConfig.isSubmitting}
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
                >
                  {formConfig.isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {formConfig.btnText}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-6 border-t border-gray-100 flex gap-4">
            <button
              type="submit"
              disabled={formConfig.isSubmitting}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {formConfig.isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {formConfig.isSubmitting ? "Processing..." : formConfig.btnText}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Clear Form
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
