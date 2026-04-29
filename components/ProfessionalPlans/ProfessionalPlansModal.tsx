"use client";

import React from "react";
import { mockPlans } from "@/components/AdminDashboard/subscription-plans/MockData";
import { useRouter } from "next/navigation";

export default function ProfessionalPlansModal({ onClose }: { onClose?: () => void }) {
  const router = useRouter();

  const plans = mockPlans.filter((p) => p.type === "Professional");

  const handleSelect = (planId: string) => {
    // Route to the public pricing/checkout flow which handles payments.
    router.push(`/pricing?plan_id=${planId}&type=professional`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Choose a Professional Plan</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close plans modal"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{plan.name}</h4>
                <div className="text-sm text-gray-600">${plan.price}</div>
              </div>
              <div className="text-xs text-gray-500 mb-4">{plan.billingCycle}</div>
              <ul className="text-sm text-gray-700 mb-4 space-y-1">
                <li>Projections: {plan.projectionsPerMonth}/mo</li>
                <li>Priority support: {plan.features.prioritySupport ? "Yes" : "No"}</li>
                <li>Device sync: {plan.features.deviceSync ? "Yes" : "No"}</li>
              </ul>
              <div className="flex justify-end">
                <button
                  onClick={() => handleSelect(plan.id)}
                  className="bg-[#0FA4A9] text-white px-4 py-2 rounded-lg text-sm"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
