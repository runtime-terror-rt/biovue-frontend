"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useCreatePlanMutation } from "@/redux/features/api/adminDashboard/plan";

interface AddPlanModalProps {
  isOpen: boolean;
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
  features: string;
  duration: number;
  member_limit: number | null;
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

export default function AddPlanModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: AddPlanModalProps) {
  const [createPlan, { isLoading }] = useCreatePlanMutation();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    plan_type: "individual",
    billing_cycle: "monthly",
    price: 0,
    status: true,
    features: "",
    duration: 30,
    member_limit: null,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPlan({
        ...formData,
        price: formData.price.toString(),
        features: formData.features.split("\n").filter((f) => f.trim() !== ""),
      }).unwrap();
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: "",
        plan_type: "individual",
        billing_cycle: "monthly",
        price: 0,
        status: true,
        features: "",
        duration: 30,
        member_limit: null,
      });
    } catch (error) {
      console.error("Failed to create plan:", error);
      onError("Failed to create plan. Please try again.");
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
              Add New{" "}
              {formData.plan_type === "individual"
                ? "Individual"
                : "Professional"}{" "}
              Plan
            </h2>
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    plan_type: "individual",
                    member_limit: null,
                  })
                }
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.plan_type === "individual" ? "bg-[#4F39F6] text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                Individual
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    plan_type: "professional",
                    member_limit: 10,
                  })
                }
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.plan_type === "professional" ? "bg-[#4F39F6] text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                Professional
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] cursor-pointer hover:text-[#4B5563] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {/* Layout logic same as Edit modal */}
          {formData.plan_type === "individual" ? (
            <div className="space-y-4">
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
                  placeholder="e.g. Plus Plan"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl appearance-none cursor-pointer"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                    Projection Limit
                  </label>
                  <input
                    type="number"
                    placeholder="i.e 10"
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
                <div>
                  <label className="block text-sm font-medium text-[#4B5563] mb-1.5">
                    Price
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
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
                      className="w-full pl-8 pr-14 py-2.5 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F39F6]/20 focus:border-[#4F39F6]"
                      step="0.01"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm">
                      USD
                    </span>
                  </div>
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
                    className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl"
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
                  className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl min-h-[140px] resize-none"
                  placeholder="Enter features (one per line)..."
                />
              </div>

              <div className="pt-4 flex items-center gap-4">
                <span
                  className={`text-sm font-medium ${formData.status ? "text-green-600" : "text-gray-500"}`}
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#4F39F6] uppercase tracking-wider">
                    Core Billing & Limits
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#4F39F6] uppercase tracking-wider">
                    Teams & Features
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-400">
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
                        className="w-full pl-7 pr-12 py-2 bg-white border border-gray-300 rounded-xl"
                        step="0.01"
                      />
                      <span className="absolute right-3 top-2 text-gray-400 text-xs">
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
                      placeholder="i.e 10"
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
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    Features List
                  </label>
                  <span className="text-[10px] font-bold text-gray-400">
                    MARKDOWN SUPPORTED
                  </span>
                </div>
                <textarea
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl min-h-[160px] resize-none shadow-sm"
                  placeholder="Enter features (one per line)..."
                />
              </div>

              <div className="pt-6 border-t flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-gray-900">
                    Plan Availability
                  </label>
                  <p className="text-xs text-gray-500">
                    Enable or disable this plan from the pricing page.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold tracking-widest ${formData.status ? "text-emerald-600" : "text-gray-400"}`}
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

          <div className="flex gap-4 justify-end mt-10 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 cursor-pointer text-gray-600 font-medium bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 cursor-pointer bg-[#0D9488] text-white font-medium rounded-xl hover:bg-[#0F766E] disabled:opacity-50 transition-all shadow-lg active:scale-95 min-w-[140px]"
            >
              {isLoading ? "Creating..." : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
