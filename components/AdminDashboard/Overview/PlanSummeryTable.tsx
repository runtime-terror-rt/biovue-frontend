
"use client";

import React from "react";

export default function PlanSummaryTable({ data = [] }: { data?: any[] }) {
  return (
    <div className="bg-white rounded-xl border-2 border-[#F3F4F6]! p-6">
      <p className="text-sm border-b-2 pb-4 border-[#F3F4F6]! font-medium mb-4">
        Plan Wise Summary
      </p>

      <table className="w-full text-sm">
        <thead className="text-gray-400">
          <tr>
            <th className="text-left py-2">PLAN NAME</th>
            <th>PLAN TYPE</th>
            <th>ACTIVE SUBSCRIBERS</th>
            <th className="text-right">MONTHLY REVENUE</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((plan, index) => (
              <tr key={index} className="border-b border-[#F3F4F6]!">
                <td className="py-2">{plan.plan_name || plan.name}</td>
                <td className="py-2 text-center capitalize">{plan.plan_type || plan.type}</td>
                <td className="text-center">{plan.active_subscribers || plan.subscribers || 0}</td>
                <td className="text-right">{plan.monthly_revenue || plan.revenue || "$0"}</td>
              </tr>
            ))
          ) : (
            <tr className="border-b border-[#F3F4F6]!">
              <td colSpan={4} className="py-4 text-center text-gray-500">No plan summary data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
