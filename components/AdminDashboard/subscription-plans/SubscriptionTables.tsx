"use client";

import {
  AlertCircleIcon,
  Edit2,
  MoreVertical,
  Trash2,
  Plus,
  Filter,
  ShieldCheck,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  useGetPlansQuery,
  useDeletePlanMutation,
  Plan,
} from "@/redux/features/api/adminDashboard/plan";
import { useState } from "react";
import ViewPlanDetailsModal from "./view-details";
import { useTogglePlanStatusMutation } from "@/redux/features/api/adminDashboard/PlanStatus";

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
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusPlan, setStatusPlan] = useState<Plan | null>(null);
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();
  const [toggleStatus, { isLoading: isUpdating }] =
    useTogglePlanStatusMutation();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const getTypeColor = (type: string) => {
    if (type.toLowerCase() === "individual") {
      return "bg-[#8746E726] text-[#8746E7] border-[#8746E7]";
    }
    return "bg-[#0FA4A926] text-[#0FA4A9] border-[#0FA4A9]";
  };

  const handleToggleStatus = async () => {
    if (!statusPlan) return;

    try {
      const res = await toggleStatus(statusPlan.id).unwrap();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.message || "Plan status updated",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsStatusModalOpen(false);
      setStatusPlan(null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not update plan status",
      });
    }
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
                <span
                  className={`flex items-center gap-2 text-sm ${plan.status ? "text-[#22C55E]" : "text-red-500"}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${plan.status ? "bg-[#22C55E]" : "bg-red-500"}`}
                  ></span>
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
                          setStatusPlan(plan);
                          setIsStatusModalOpen(true);
                          setOpenMenuId(null);
                        }}
                        className="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <ShieldCheck /> Update Status
                      </button>
                      <button
                        // onClick={() => {
                        //   setOpenMenuId(null);
                        //   Swal.fire({
                        //     title: "Are you sure?",
                        //     text: "You won't be able to revert this!",
                        //     icon: "warning",
                        //     showCancelButton: true,
                        //     confirmButtonColor: "#3085d6",
                        //     cancelButtonColor: "#d33",
                        //     confirmButtonText: "Yes, delete it!",
                        //   }).then((result) => {
                        //     if (result.isConfirmed) {
                        //       onDelete(plan.id.toString());
                        //       Swal.fire({
                        //         title: "Deleted!",
                        //         text: "The plan has been deleted.",
                        //         icon: "success",
                        //       });
                        //     }
                        //   });
                        // }}
                        onClick={() => {
                          setOpenMenuId(null);

                          Swal.fire({
                            title: "Are you sure?",
                            text: "You won't be able to revert this!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#6b7280",
                            confirmButtonText: "Yes, delete it!",
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              try {
                                await deletePlan(plan.id).unwrap();

                                Swal.fire({
                                  icon: "success",
                                  title: "Deleted!",
                                  text: "The plan has been deleted.",
                                  timer: 1500,
                                  showConfirmButton: false,
                                });
                              } catch (error) {
                                Swal.fire({
                                  icon: "error",
                                  title: "Failed!",
                                  text: "Something went wrong while deleting.",
                                });
                              }
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
      {isStatusModalOpen && statusPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold mb-4 text-center">
              Update Plan Status
            </h2>

            <p className="text-sm text-gray-500 text-center mb-6">
              Choose status for <strong>{statusPlan.name}</strong>
            </p>

            <div className="flex gap-3">
              {/* Activate */}
              <button
                disabled={isUpdating || statusPlan.status === true}
                onClick={handleToggleStatus}
                className={`flex-1 py-2 rounded-lg transition font-medium
      ${
        statusPlan.status
          ? "bg-green-100 text-green-600 cursor-not-allowed border border-green-300"
          : "bg-green-600 text-white hover:bg-green-700"
      }
    `}
              >
                {statusPlan.status ? "Active ✓" : "Activate"}
              </button>

              {/* Deactivate */}
              <button
                disabled={isUpdating || statusPlan.status === false}
                onClick={handleToggleStatus}
                className={`flex-1 py-2 rounded-lg transition font-medium
      ${
        !statusPlan.status
          ? "bg-red-100 text-red-500 cursor-not-allowed border border-red-300"
          : "bg-red-500 text-white hover:bg-red-600"
      }
    `}
              >
                {!statusPlan.status ? "Inactive ✓" : "Deactivate"}
              </button>
            </div>

            {/* Cancel */}
            <button
              onClick={() => {
                setIsStatusModalOpen(false);
                setStatusPlan(null);
              }}
              className="mt-4 w-full text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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
