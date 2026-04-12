"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Plus, Filter } from "lucide-react";
import {
  useGetPlansQuery,
  useDeletePlanMutation,
  Plan,
} from "@/redux/features/api/adminDashboard/plan";
import SubscriptionPlansTable from "@/components/AdminDashboard/subscription-plans/SubscriptionTables";
import AddPlanModal from "@/components/AdminDashboard/subscription-plans/AddPlanModal";
import EditPlanModal from "@/components/AdminDashboard/subscription-plans/EditPlanModal";
import Toast from "@/components/AdminDashboard/subscription-plans/Toast";
import DashboardHeading from "@/components/common/DashboardHeading";

function SubscriptionPlansContent() {
  const searchParams = useSearchParams();
  const planType = searchParams.get("type"); // individual | professional | null

  const [billingCycle, setBillingCycle] = useState<
    "All" | "monthly" | "annual"
  >("All");

  const { data: plans = [], isLoading, refetch } = useGetPlansQuery(billingCycle === "All" ? undefined : billingCycle);
  const [deletePlan] = useDeletePlanMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredPlans = plans.filter((plan) => {
    const matchType = planType
      ? plan.plan_type.toLowerCase() === planType.toLowerCase()
      : true;

    const matchBilling =
      billingCycle === "All"
        ? true
        : plan.billing_cycle.toLowerCase() === billingCycle.toLowerCase();

    return matchType && matchBilling;
  });

  /* ---------------- CRUD ---------------- */

  const handleAddPlanSuccess = () => {
    refetch();
    setShowAddModal(false);
    setToast({ message: "Plan added successfully!", type: "success" });
  };

  const handleEditPlanSuccess = () => {
    refetch();
    setShowEditModal(false);
    setSelectedPlan(null);
    setToast({ message: "Plan updated successfully!", type: "success" });
  };

  const handleDeletePlan = async (id: number) => {
    try {
      await deletePlan(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete plan:", error);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen font-inter pb-10">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-end items-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex cursor-pointer items-center gap-2 px-6 py-2.5 bg-[#0D9488] text-white rounded-xl hover:bg-[#0F766E] transition-all shadow-lg active:scale-95"
          >
            <Plus size={18} />
            <span className="font-semibold">Add New Plan</span>
          </button>
        </div> 

        <div className="mb-8 flex justify-between items-end">
          <div>
            <DashboardHeading
              heading="Subscription Plans"
              subheading="Manage and configure your application's subscription tiers"
            />
          </div>
          {/* Billing Cycle Filter */}
          <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="pl-3 text-gray-400">
               <Filter size={18} />
            </div>
            <select
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value as any)}
              className="px-4 py-2 bg-transparent cursor-pointer rounded-xl text-sm font-medium focus:outline-none"
            >
              <option value="All">All Billing Cycles</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-visible">
          {isLoading ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
               <p className="text-gray-500 font-medium tracking-wide">Fetching your plans...</p>
            </div>
          ) : (
            <SubscriptionPlansTable
              plans={filteredPlans}
              onEdit={setSelectedPlan}
              onDelete={(id) => handleDeletePlan(Number(id))}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AddPlanModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddPlanSuccess}
        onError={(msg) => setToast({ message: msg, type: "error" })}
      />

      <EditPlanModal
        isOpen={!!selectedPlan}
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onSuccess={handleEditPlanSuccess}
        onError={(msg) => setToast({ message: msg, type: "error" })}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function SubscriptionPlansPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubscriptionPlansContent />
    </Suspense>
  );
}
