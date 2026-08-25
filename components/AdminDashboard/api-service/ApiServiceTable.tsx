"use client";

import { Eye, Activity, Zap, Calendar, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminExternalApiData } from "@/redux/features/api/externalApi";
import { avatarColor, formatDate, initials } from "./utils";
import ApiServicePagination from "./ApiServicePagination";

interface ApiServiceTableProps {
  apis: AdminExternalApiData[];
  page: number;
  perPage: number;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  onViewKey: (api: AdminExternalApiData) => void;
  onPage: (p: number) => void;
}

export default function ApiServiceTable({
  apis,
  page,
  perPage,
  meta,
  onViewKey,
  onPage,
}: ApiServiceTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/60 hover:bg-gray-50/60 border-b border-gray-100">
            <TableHead className="pl-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500 w-10">
              #
            </TableHead>
            <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              User
            </TableHead>
            <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              API Key
            </TableHead>
            <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Proj. Limit
            </TableHead>
            <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Insite Limit
            </TableHead>
            <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Validity
            </TableHead>
            <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Expires
            </TableHead>
            <TableHead className="py-3.5 pr-6 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {apis.map((api, i) => {
            const expiryPct = Math.min(
              100,
              Math.max(0, (api.expires_in_days / 30) * 100)
            );
            const expiryColor =
              api.expires_in_days <= 5
                ? "bg-red-500"
                : api.expires_in_days <= 14
                ? "bg-orange-400"
                : "bg-emerald-500";

            return (
              <TableRow
                key={api.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0 group"
              >
                {/* Row number */}
                <TableCell className="pl-6 py-4 text-xs text-gray-400 font-medium">
                  {(page - 1) * perPage + i + 1}
                </TableCell>

                {/* User */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor(
                        api.user.id
                      )} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                    >
                      {initials(api.user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {api.user.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {api.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* API Key — masked + eye button on hover */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg font-mono border border-gray-200 tracking-tight select-none">
                      ••••••••••••{api.api_key.slice(-6)}
                    </code>
                    <button
                      onClick={() => onViewKey(api)}
                      title="View full key"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#0FA4A9] hover:bg-teal-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>

                {/* Projection limit */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-800">
                      {api.projection_limit.toLocaleString()}
                    </span>
                  </div>
                </TableCell>

                {/* Insite limit */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-sm font-semibold text-gray-800">
                      {api.insite_limit.toLocaleString()}
                    </span>
                  </div>
                </TableCell>

                {/* Validity dates */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>
                      {formatDate(api.start_date)}
                      <span className="text-gray-300 mx-1">→</span>
                      {formatDate(api.end_date)}
                    </span>
                  </div>
                </TableCell>

                {/* Expiry progress bar */}
                <TableCell className="py-4">
                  <div className="w-28 space-y-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">
                        {Math.ceil(api.expires_in_days)}d left
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${expiryColor}`}
                        style={{ width: `${expiryPct}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Status badge */}
                <TableCell className="py-4 pr-6">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      api.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        api.is_active
                          ? "bg-emerald-500 animate-pulse"
                          : "bg-red-400"
                      }`}
                    />
                    {api.is_active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <ApiServicePagination
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          total={meta.total}
          perPage={meta.per_page}
          onPage={onPage}
        />
      )}
    </div>
  );
}
