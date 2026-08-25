"use client";

import { useState } from "react";
import {
  Search,
  Info,
  Loader2,
  Key,
  Eye,
  Users,
  ShieldCheck,
  Activity,
  Zap,
} from "lucide-react";
import {
  useGetAdminExternalApisQuery,
  AdminExternalApiData,
} from "@/redux/features/api/externalApi";
import ApiServiceStatCard from "@/components/AdminDashboard/api-service/ApiServiceStatCard";
import ApiKeyModal from "@/components/AdminDashboard/api-service/ApiKeyModal";
import ApiServiceTable from "@/components/AdminDashboard/api-service/ApiServiceTable";

const PER_PAGE = 10;

export default function ApiServicePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedApi, setSelectedApi] = useState<AdminExternalApiData | null>(null);

  const { data: apiResponse, isLoading, error } = useGetAdminExternalApisQuery({
    page,
    per_page: PER_PAGE,
  });

  const apis: AdminExternalApiData[] = apiResponse?.data || [];
  const meta = apiResponse?.meta;
  const activeCount = apis.filter((a) => a.is_active).length;

  // Client-side search filter within current page
  const filteredApis = apis.filter((api) => {
    if (!searchQuery) return true;
    const s = `${api.user.name} ${api.user.email} ${api.api_key}`.toLowerCase();
    return s.includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <div className="min-h-screen pb-20 space-y-7">

        {/* ── Gradient Header Banner ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0FA4A9] via-[#0d8f94] to-[#0b7a7e] p-8 text-white shadow-xl shadow-teal-600/20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-10 h-40 w-40 rounded-full bg-black/10 blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin Control Panel
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">AI API Services</h1>
              <p className="mt-1 max-w-md text-sm text-teal-100/90">
                Manage and monitor external API access, limits, and validity across all registered users.
              </p>
            </div>

            {/* Search bar embedded in banner */}
            <div className="relative w-full md:w-80 group shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 group-focus-within:text-white transition-colors" />
              <input
                placeholder="Search by user or API key…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-11 pr-4 h-12 rounded-xl bg-white/20 border border-white/30 placeholder-white/60 text-white text-sm font-medium backdrop-blur-sm focus:outline-none focus:border-white/60 focus:bg-white/25 transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ApiServiceStatCard
            icon={Users}
            label="Total Users"
            value={meta?.total ?? apis.length}
            sub="registered keys"
            accent="bg-gradient-to-br from-violet-500 to-purple-600"
          />
          <ApiServiceStatCard
            icon={ShieldCheck}
            label="Active Keys"
            value={activeCount}
            sub={`${apis.length - activeCount} inactive`}
            accent="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <ApiServiceStatCard
            icon={Activity}
            label="Total Proj. Limit"
            value={apis.reduce((s, a) => s + a.projection_limit, 0).toLocaleString()}
            sub="across all users"
            accent="bg-gradient-to-br from-blue-500 to-cyan-600"
          />
          <ApiServiceStatCard
            icon={Zap}
            label="Total Insite Limit"
            value={apis.reduce((s, a) => s + a.insite_limit, 0).toLocaleString()}
            sub="across all users"
            accent="bg-gradient-to-br from-orange-500 to-rose-600"
          />
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900">API Key Registry</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {filteredApis.length} result{filteredApis.length !== 1 ? "s" : ""} on this page
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <Key className="w-3.5 h-3.5 text-[#0FA4A9]" />
              Click <Eye className="w-3.5 h-3.5 mx-0.5" /> to view full key
            </div>
          </div>

          {/* States: loading / error / empty / table */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#0FA4A9]">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-medium text-sm">Loading API Services…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-red-400">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                <Info className="w-7 h-7" />
              </div>
              <p className="font-semibold text-sm">Failed to load API services</p>
              <p className="text-xs text-gray-400 mt-1">Please refresh the page</p>
            </div>
          ) : filteredApis.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <Search className="w-7 h-7" />
              </div>
              <p className="font-semibold text-sm">No results found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-3 text-[#0FA4A9] text-xs font-bold hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <ApiServiceTable
              apis={filteredApis}
              page={page}
              perPage={PER_PAGE}
              meta={meta}
              onViewKey={setSelectedApi}
              onPage={setPage}
            />
          )}
        </div>
      </div>

      {/* ── API Key Modal ── */}
      <ApiKeyModal api={selectedApi} onClose={() => setSelectedApi(null)} />
    </>
  );
}
