"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { useGetSubscriptionPlansQuery, useProcessPaymentMutation } from "@/redux/features/api/paymentApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function BusinessChoosePlanPage() {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const { data: plansResp, isLoading } = useGetSubscriptionPlansQuery({ billing, type: "professional" });
  const plans = (plansResp?.data || []).filter((p: any) => p.plan_type === "professional" && p.status);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [processPayment, { isLoading: isProcessing }] = useProcessPaymentMutation();

  const handleContinue = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan to continue.");
      return;
    }

    try {
      const res = await processPayment({ plan_id: Number(selectedPlan), billing }).unwrap();
      if (res?.checkout_url) {
        toast.info("Redirecting to payment...");
        window.location.href = res.checkout_url;
        return;
      }
      toast.error("Failed to initiate payment. Please try again.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Payment initiation failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-start py-12">
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Choose a Professional Plan</h1>
        <p className="text-sm text-gray-500 mb-6">Select a plan to activate your business account.</p>

        <div className="mb-6">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 rounded-l-lg border ${billing === "monthly" ? "bg-[#0FA4A9] text-white" : "bg-white"}`}
          >Monthly</button>
          <button
            onClick={() => setBilling("annual")}
            className={`px-4 py-2 rounded-r-lg border ${billing === "annual" ? "bg-[#0FA4A9] text-white" : "bg-white"}`}
          >Annual</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <div>Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="p-6 bg-gray-50 rounded">No professional plans available.</div>
          ) : (
            plans.map((plan: any) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(Number(plan.id))}
                className={`p-6 rounded-lg border cursor-pointer ${selectedPlan === Number(plan.id) ? "border-[#3A86FF] bg-[#F8FBFF]" : "border-gray-100"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.description || plan.features?.slice(0,2).join(", ")}</p>
                  </div>
                  <div className="text-2xl font-extrabold">${plan.price}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => router.back()}
            className="mr-3 px-4 py-2 rounded-lg border"
          >Back</button>
          <button
            onClick={handleContinue}
            disabled={!selectedPlan || isProcessing}
            className="px-6 py-2 rounded-lg bg-[#0FA4A9] text-white disabled:opacity-60"
          >
            {isProcessing ? "Processing..." : "Continue to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
