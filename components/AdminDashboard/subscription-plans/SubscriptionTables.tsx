"use client";

import { AlertCircleIcon, Edit2, MoreVertical, Trash2, Plus, Filter } from "lucide-react";
import Swal from "sweetalert2";
import {
  useGetPlansQuery,
  useDeletePlanMutation,
  Plan,
} from "@/redux/features/api/adminDashboard/plan";
import { useState } from "react";
import ViewPlanDetailsModal from "./view-details";

interface SubscriptionPlansTableProps {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
}

export default function SubscriptionPlansTable({
  plans,
  onEdit,
  onDelete,
}: SubscriptionPlansTableProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const getTypeColor = (type: string) => {
    if (type.toLowerCase() === "individual") {
      return "bg-[#8746E726] text-[#8746E7] border-[#8746E7]";
    }
    return "bg-[#0FA4A926] text-[#0FA4A9] border-[#0FA4A9]";
  };

  return (
    <div className="rounded-lg overflow-visible">
      <table className="w-full">
        <thead className="bg-[#0FA4A91A] border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
              Plan Name
            </th>
            <th className="px-6 py-4 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
              Plan Type
            </th>
            <th className="px-6 py-4 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
              Billing Cycle
            </th>
            <th className="px-6 py-4 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-4 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
              Created Date
            </th>
            <th className="px-6 py-4 text-left text-base font-medium text-gray-700 uppercase tracking-wider">
              {""}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {plans.map((plan) => (
            <tr key={plan.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {plan.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getTypeColor(
                    plan.plan_type,
                  )}`}
                >
                  {plan.plan_type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                {plan.billing_cycle}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${Number(plan.price).toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`flex items-center gap-2 text-sm ${plan.status ? "text-[#22C55E]" : "text-red-500"}`}>
                  <span className={`w-2 h-2 rounded-full ${plan.status ? "bg-[#22C55E]" : "bg-red-500"}`}></span>
                  {plan.status ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {plan.duration ? `${plan.duration} days` : "Permanent"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === plan.id ? null : plan.id)
                    }
                    className="p-2 cursor-pointer text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === plan.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                      <button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setIsViewOpen(true);
                          setOpenMenuId(null);
                        }}
                        className="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <AlertCircleIcon />
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          onEdit(plan);
                          setOpenMenuId(null);
                        }}
                        className="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit2 /> Edit Plan
                      </button>
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          Swal.fire({
                            title: "Are you sure?",
                            text: "You won't be able to revert this!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, delete it!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              onDelete(plan.id.toString());
                              Swal.fire({
                                title: "Deleted!",
                                text: "The plan has been deleted.",
                                icon: "success",
                              });
                            }
                          });
                        }}
                        className="w-full cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 /> Delete Plan
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ViewPlanDetailsModal
        isOpen={isViewOpen}
        plan={selectedPlan}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedPlan(null);
        }}
      />
    </div>
  );
}
