import { PlanTableItem } from "@/redux/features/api/adminDashboard/reports";

interface PlanTableProps {
  data?: PlanTableItem[];
}

export default function PlanTable({ data = [] }: PlanTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0FA4A91A] border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Plan Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Plan Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Active Subscribers
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Monthly Revenue
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Churn %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((plan, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {plan.name}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plan.plan_type === "individual"
                        ? "bg-[#8746E726] text-[#8746E7] border border-[#8746E7]"
                        : "bg-[#0FA4A926] text-[#0FA4A9] border border-[#0FA4A9]"
                    }`}
                  >
                    {plan.plan_type.charAt(0).toUpperCase() + plan.plan_type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {plan.active_subscribers.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                   {typeof plan.monthly_revenue === 'string' && plan.monthly_revenue.startsWith('$') ? plan.monthly_revenue : `$${plan.monthly_revenue}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {plan.churn_percentage}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-sm italic">
                  No plan data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
