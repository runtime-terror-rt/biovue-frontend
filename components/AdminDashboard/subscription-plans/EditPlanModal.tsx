"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Plan,
  useUpdatePlanMutation,
} from "@/redux/features/api/adminDashboard/plan";

interface EditPlanModalProps {
  isOpen: boolean;
  plan: Plan | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

interface FormData {
  name: string;
  plan_type: "individual" | "professional";
  billing_cycle: string;
  price: number;
  status: boolean;
  features: string; // We'll handle this as a newline-separated string in the UI
  duration: number;
  member_limit: number | null;
  projection_limit?: number | null;
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#4F39F6]" : "bg-[#E5E7EB]"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function EditPlanModal({
  isOpen,
  plan,
  onClose,
  onSuccess,
  onError,
}: EditPlanModalProps) {
  const [updatePlan, { isLoading }] = useUpdatePlanMutation();
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    if (!plan) return;

    setFormData({
      name: plan.name,
      plan_type: plan.plan_type,
      billing_cycle: plan.billing_cycle,
      price: Number(plan.price),
      status: plan.status,
      features: (plan.features || []).join("\n"),
      duration: plan.duration || 30,
      member_limit: plan.member_limit,
    });
  }, [plan, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !plan) return;

    try {
      await updatePlan({
        id: plan.id,
        ...formData,
        price: formData.price.toString(),
        features: formData.features.split("\n").filter((f) => f.trim() !== ""),
      }).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update plan:", error);
      onError("Failed to update plan. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${formData.plan_type === "professional" ? "max-w-4xl" : "max-w-xl"} mx-4 max-h-[95vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#111827]">
              Edit{" "}
              {formData.plan_type === "individual"
                ? "Individual"
                : "Professional"}{" "}
              Plan
            </h2>
            {formData.plan_type === "professional" && (
              <p className="text-sm text-[#6B7280] mt-1">
                Configure advanced settings and limits for the professional
                tier.
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] cursor-pointer hover:text-[#4B5563] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {formData.plan_type === "individual" ? (
            /* INDIVIDUAL PLAN DESIGN */
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6] transition-all"
                  placeholder="e.g. Premium Individual"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                  Billing Cycle
                </label>
                <select
                  value={formData.billing_cycle}
                  onChange={(e) =>
                    setFormData({ ...formData, billing_cycle: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6] transition-all appearance-none cursor-pointer"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                  Price
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition-colors group-focus-within:text-[#4F39F6]">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full pl-8 pr-14 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6] transition-all"
                    step="0.01"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm font-medium">
                    USD
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1">
                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                  Features List
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6] transition-all min-h-[120px] resize-none"
                  placeholder="Enter features (one per line)"
                />
              </div>

              <div className="pt-4 flex items-center gap-4">
                <span
                  className={`text-sm font-medium transition-colors ${formData.status ? "text-[#059669]" : "text-[#6B7280]"}`}
                >
                  Plan is Active
                </span>
                <Toggle
                  checked={formData.status}
                  onChange={(val) => setFormData({ ...formData, status: val })}
                />
              </div>
            </div>
          ) : (
            /* PROFESSIONAL PLAN DESIGN */
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {/* Left Column */}
                <div className="space-y-5">
                  <h3 className="text-[11px] font-bold text-[#4B39EF] uppercase tracking-[0.05em] mb-2">
                    CORE BILLING & LIMITS
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                      Billing Cycle
                    </label>
                    <select
                      value={formData.billing_cycle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing_cycle: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6] transition-all appearance-none cursor-pointer"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6] transition-all"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <h3 className="text-[11px] font-bold text-[#4B39EF] uppercase tracking-[0.05em] mb-2">
                    TEAMS & FEATURES
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                      Member Limit
                    </label>
                    <input
                      type="number"
                      value={formData.member_limit || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          member_limit: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                      Price
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition-colors group-focus-within:text-[#4F39F6]">
                        $
                      </span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: parseFloat(e.target.value),
                          })
                        }
                        className="w-full pl-8 pr-14 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6] transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm font-medium">
                        USD
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                      Projection Limit
                    </label>
                    <input
                      type="number"
                      // value={formData.member_limit || 0}
                      // onChange={(e) =>
                      //   setFormData({
                      //     ...formData,
                      //     member_limit: parseInt(e.target.value),
                      //   })
                      // }
                      className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-[#4B5563]">
                    Features List
                  </label>
                  <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                    MARKDOWN SUPPORTED
                  </span>
                </div>
                <textarea
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6] transition-all min-h-[180px] resize-none shadow-sm"
                  placeholder="Enter features (one per line)..."
                />
              </div>

              <div className="pt-6 border-t border-[#F3F4F6] flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold text-[#111827]">
                    Plan Availability
                  </label>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Enable or disable this plan from the pricing page.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold tracking-wider ${formData.status ? "text-[#059669]" : "text-[#9CA3AF]"}`}
                  >
                    {formData.status ? "ACTIVE" : "INACTIVE"}
                  </span>
                  <Toggle
                    checked={formData.status}
                    onChange={(val) =>
                      setFormData({ ...formData, status: val })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 justify-end mt-10 pt-6 border-t border-[#F3F4F6]">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 cursor-pointer text-[#4B5563] font-medium bg-white border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors min-w-[120px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 cursor-pointer bg-[#0D9488] text-white font-medium rounded-xl hover:bg-[#0F766E] disabled:opacity-50 transition-all shadow-lg shadow-teal-500/20 active:scale-95 min-w-[120px]"
            >
              {isLoading ? "Saving..." : "Save Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
