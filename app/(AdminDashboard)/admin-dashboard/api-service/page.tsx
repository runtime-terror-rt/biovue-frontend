"use client";

import { useState } from "react";
import {
  Search,
  Info,
  Loader2,
  Copy,
  Check,
  Calendar,
  Activity,
  Zap,
  Key,
  Users,
  ShieldCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAdminExternalApisQuery,
  AdminExternalApiData,
} from "@/redux/features/api/externalApi";

// ─── Helpers ────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-teal-500 to-green-600",
  "from-orange-500 to-rose-600",
  "from-pink-500 to-rose-600",
  "from-indigo-500 to-blue-600",
  "from-emerald-500 to-teal-600",
];
const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

function formatDate(ds: string) {
  return new Date(ds).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── API Key Modal ───────────────────────────────────────────────────────────

function ApiKeyModal({
  api,
  onClose,
}: {
  api: AdminExternalApiData | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!api) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(api.api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Modal — scale-in animation via CSS */}
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-[modalIn_0.2s_ease-out]"
        style={{ animation: "modalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.92) translateY(12px); }
            to   { opacity: 1; transform: scale(1)   translateY(0); }
          }
        `}</style>

        {/* Header gradient */}
        <div className="relative bg-gradient-to-br from-[#0FA4A9] via-[#0d8f94] to-[#0b7a7e] px-8 pt-8 pb-14 text-white">
          {/* decorative circles */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-black/10 blur-xl" />

          {/* Close btn */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-xl bg-white/15 border border-white/20 hover:bg-white/25 transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* User info */}
          <div className="relative z-10 flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColor(api.user.id)} flex items-center justify-center text-white font-extrabold text-lg shadow-xl ring-2 ring-white/30`}
            >
              {initials(api.user.name)}
            </div>
            <div>
              <p className="text-xs text-teal-100/80 font-medium tracking-wide uppercase">API Key for</p>
              <h3 className="text-xl font-extrabold mt-0.5">{api.user.name}</h3>
              <p className="text-xs text-teal-100/80 mt-0.5">{api.user.email}</p>
            </div>
          </div>
        </div>

        {/* Key card — overlaps gradient */}
        <div className="px-7 -mt-7 relative z-10">
          <div className="bg-gray-950 rounded-2xl border border-gray-800/80 shadow-2xl overflow-hidden">
            {/* terminal top bar */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-800/60 bg-gray-900">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs text-gray-500 font-mono">API_KEY</span>
            </div>
            <div className="px-4 py-4 flex items-start gap-3">
              <code className="flex-1 text-xs text-emerald-400 font-mono break-all leading-relaxed tracking-wide">
                {api.api_key}
              </code>
              <button
                onClick={handleCopy}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:border-gray-600"
                }`}
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5" /> Copied!</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="px-7 py-5 grid grid-cols-2 gap-3">
          {[
            {
              label: "Projection Limit",
              value: api.projection_limit.toLocaleString(),
              icon: Activity,
              iconBg: "bg-blue-500",
              valueCls: "text-blue-600",
              cardBg: "bg-blue-50 border-blue-100",
            },
            {
              label: "Insite Limit",
              value: api.insite_limit.toLocaleString(),
              icon: Zap,
              iconBg: "bg-amber-500",
              valueCls: "text-amber-600",
              cardBg: "bg-amber-50 border-amber-100",
            },
            {
              label: "Start Date",
              value: formatDate(api.start_date),
              icon: Calendar,
              iconBg: "bg-violet-500",
              valueCls: "text-violet-600",
              cardBg: "bg-violet-50 border-violet-100",
            },
            {
              label: "Expires In",
              value: `${Math.ceil(api.expires_in_days)} days`,
              icon: Clock,
              iconBg: "bg-orange-500",
              valueCls: "text-orange-600",
              cardBg: "bg-orange-50 border-orange-100",
            },
          ].map(({ label, value, icon: Icon, iconBg, valueCls, cardBg }) => (
            <div
              key={label}
              className={`${cardBg} border rounded-2xl px-4 py-3.5 flex items-center gap-3`}
            >
              <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className={`text-sm font-bold ${valueCls}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-7 border-t border-gray-100" />

        {/* Footer */}
        <div className="px-7 py-4">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                api.is_active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  api.is_active ? "bg-emerald-500 animate-pulse" : "bg-red-400"
                }`}
              />
              {api.is_active ? "Active" : "Inactive"}
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  lastPage,
  total,
  perPage,
  onPage,
}: {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPage: (p: number) => void;
}) {
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  const pages: (number | "…")[] = [];
  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("…");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(lastPage - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < lastPage - 2) pages.push("…");
    pages.push(lastPage);
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/40">
      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-600">{from}–{to}</span>{" "}
        of <span className="font-semibold text-gray-600">{total}</span> entries
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`dots-${i}`} className="px-2 text-gray-400 text-xs select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                p === currentPage
                  ? "bg-[#0FA4A9] text-white shadow-sm shadow-teal-600/30"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPage(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

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

  // client-side search filter (within current page)
  const filteredApis = apis.filter((api) => {
    if (!searchQuery) return true;
    const s = `${api.user.name} ${api.user.email} ${api.api_key}`.toLowerCase();
    return s.includes(searchQuery.toLowerCase());
  });

  const activeCount = apis.filter((a) => a.is_active).length;

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
          <StatCard
            icon={Users}
            label="Total Users"
            value={meta?.total ?? apis.length}
            sub="registered keys"
            accent="bg-gradient-to-br from-violet-500 to-purple-600"
          />
          <StatCard
            icon={ShieldCheck}
            label="Active Keys"
            value={activeCount}
            sub={`${apis.length - activeCount} inactive`}
            accent="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={Activity}
            label="Total Proj. Limit"
            value={apis.reduce((s, a) => s + a.projection_limit, 0).toLocaleString()}
            sub="across all users"
            accent="bg-gradient-to-br from-blue-500 to-cyan-600"
          />
          <StatCard
            icon={Zap}
            label="Total Insite Limit"
            value={apis.reduce((s, a) => s + a.insite_limit, 0).toLocaleString()}
            sub="across all users"
            accent="bg-gradient-to-br from-orange-500 to-rose-600"
          />
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* toolbar */}
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

          {/* states */}
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
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/60 hover:bg-gray-50/60 border-b border-gray-100">
                      <TableHead className="pl-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500 w-10">#</TableHead>
                      <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">User</TableHead>
                      <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">API Key</TableHead>
                      <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Proj. Limit</TableHead>
                      <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Insite Limit</TableHead>
                      <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Validity</TableHead>
                      <TableHead className="py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Expires</TableHead>
                      <TableHead className="py-3.5 pr-6 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredApis.map((api, i) => {
                      const expiryPct = Math.min(100, Math.max(0, (api.expires_in_days / 30) * 100));
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
                          {/* index */}
                          <TableCell className="pl-6 py-4 text-xs text-gray-400 font-medium">
                            {(page - 1) * PER_PAGE + i + 1}
                          </TableCell>

                          {/* user */}
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor(api.user.id)} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                              >
                                {initials(api.user.name)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{api.user.name}</p>
                                <p className="text-xs text-gray-400 truncate">{api.user.email}</p>
                              </div>
                            </div>
                          </TableCell>

                          {/* api key — masked + view button */}
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg font-mono border border-gray-200 tracking-tight select-none">
                                ••••••••••••{api.api_key.slice(-6)}
                              </code>
                              <button
                                onClick={() => setSelectedApi(api)}
                                title="View full key"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#0FA4A9] hover:bg-teal-50 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>

                          {/* projection limit */}
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-blue-400 shrink-0" />
                              <span className="text-sm font-semibold text-gray-800">
                                {api.projection_limit.toLocaleString()}
                              </span>
                            </div>
                          </TableCell>

                          {/* insite limit */}
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                              <span className="text-sm font-semibold text-gray-800">
                                {api.insite_limit.toLocaleString()}
                              </span>
                            </div>
                          </TableCell>

                          {/* validity dates */}
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

                          {/* expiry progress */}
                          <TableCell className="py-4">
                            <div className="w-28 space-y-1.5">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span className="font-medium">{Math.ceil(api.expires_in_days)}d left</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${expiryColor}`}
                                  style={{ width: `${expiryPct}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>

                          {/* status */}
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
                                  api.is_active ? "bg-emerald-500 animate-pulse" : "bg-red-400"
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
              </div>

              {/* pagination */}
              {meta && meta.last_page > 1 && (
                <Pagination
                  currentPage={meta.current_page}
                  lastPage={meta.last_page}
                  total={meta.total}
                  perPage={meta.per_page}
                  onPage={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* ── API Key Modal ── */}
      <ApiKeyModal api={selectedApi} onClose={() => setSelectedApi(null)} />
    </>
  );
}
