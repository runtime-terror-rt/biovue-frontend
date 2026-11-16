"use client";

import React, { useState } from "react";
import Image from "next/image";

import {
  Eye,
  X,
  Calendar,
  Activity,
  CheckCircle2,
  Loader2,
  Clock,
  Columns,
  ArrowLeftRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAppSelector } from "@/redux/store/hooks";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import {
  useGetProjectionGalleryQuery,
  ProjectionGalleryResponse,
} from "@/redux/features/api/userDashboard/Projection/GalleryAPI";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type ProjectionItem = ProjectionGalleryResponse["data"][0];

const getFullUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const clean = url.startsWith("/") ? url.slice(1) : url;
  if (clean.startsWith("storage/")) {
    return `https://api.biovuedigitalwellness.com/${clean}`;
  }
  return `https://ai.biovuedigitalwellness.com/${clean}`;
};

const formatDateShort = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    // The API returns a date string like "2026-05-06".
    // Using UTC ensures the date doesn't shift due to local timezone offsets.
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return "N/A";
  }
};

export default function ProjectionGallery({
  targetUserId,
}: {
  targetUserId?: string | number;
} = {}) {
  const user = useAppSelector(selectCurrentUser);
  const effectiveUserId = targetUserId || user?.id || user?.user_id || "";

  const { data, isLoading } = useGetProjectionGalleryQuery(effectiveUserId, {
    skip: !effectiveUserId,
  });

  const [selectedProjection, setSelectedProjection] =
    useState<ProjectionItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Side-by-side comparison state
  const [compareLeftId, setCompareLeftId] = useState<number | string>("");
  const [compareRightId, setCompareRightId] = useState<number | string>("");
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [leftViewMode, setLeftViewMode] = useState<"future" | "current">("future");
  const [rightViewMode, setRightViewMode] = useState<"future" | "current">("future");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#0FA4A9]" />
      </div>
    );
  }

  const rawProjections = data?.data || [];

  // if (rawProjections.length === 0) {
  //   return null; // Don't show the gallery section if there are no projections yet
  // }

  if (rawProjections.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center justify-center text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 mb-4">
          <Activity size={36} className="text-gray-300" />
        </div>

        <h3 className="text-lg font-semibold text-[#041228] mb-2">
          No Projections Generated Yet
        </h3>

        <p className="text-sm text-[#5F6F73] max-w-md">
          You haven’t generated any projections yet. Once available, they will
          appear here for you to review and track your progress.
        </p>
      </div>
    );
  }
  // Sort projections chronologically (newest first) so the most recently generated one is at the top
  const projections = [...rawProjections].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const totalPages = Math.ceil(projections.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjections = projections.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  React.useEffect(() => {
    if (projections.length >= 2) {
      if (!compareLeftId) setCompareLeftId(projections[1]?.id ?? "");
      if (!compareRightId) setCompareRightId(projections[0]?.id ?? "");
    }
  }, [projections, compareLeftId, compareRightId]);

  const leftProj = projections.find((p) => String(p.id) === String(compareLeftId)) || null;
  const rightProj = projections.find((p) => String(p.id) === String(compareRightId)) || null;

  return (
    <div className="mt-16 space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold text-[#041228]">
          Projection Gallery
        </h2>
        <p className="text-[#5F6F73] text-sm">
          View your previously generated health projections and insights.
        </p>
      </div>

      {/* Side-by-Side Comparison Feature */}
      {projections.length >= 2 && (
        <div className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                <ArrowLeftRight size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#041228]">
                  Compare Projections Side-by-Side
                </h3>
                <p className="text-xs text-[#5F6F73]">
                  Select any two projections from your gallery to view them side-by-side with full visual and metric comparisons.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsComparing((prev) => !prev)}
              className="px-4 py-2 bg-[#0FA4A9] text-white rounded-lg text-xs font-bold hover:bg-[#0d8d91] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <Columns size={15} />
              {isComparing ? "Hide Side-by-Side View" : "Compare Projections Side-by-Side"}
            </button>
          </div>

          {/* Projection Dropdown Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Left Projection (Slot 1):
              </label>
              <select
                value={compareLeftId}
                onChange={(e) => {
                  setCompareLeftId(e.target.value);
                  setIsComparing(true);
                }}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Select Projection...</option>
                {projections.map((p, idx) => (
                  <option key={p.id} value={p.id}>
                    #{projections.length - idx} • {p.timeframe} ({formatDateShort(p.created_at)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Right Projection (Slot 2):
              </label>
              <select
                value={compareRightId}
                onChange={(e) => {
                  setCompareRightId(e.target.value);
                  setIsComparing(true);
                }}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Select Projection...</option>
                {projections.map((p, idx) => (
                  <option key={p.id} value={p.id}>
                    #{projections.length - idx} • {p.timeframe} ({formatDateShort(p.created_at)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Side-by-Side Comparison View */}
          {isComparing && leftProj && rightProj && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Card */}
                {(() => {
                  const pData = (leftProj as any).projections || (leftProj as any).projections_data;
                  const future = pData?.future_goal;
                  const current = pData?.current_lifestyle;
                  const activeItem = leftViewMode === "future" ? future : current;
                  const imgUrl = activeItem?.image || (activeItem as any)?.projection_url || leftProj.input_image;

                  return (
                    <div className="bg-gray-50/70 rounded-xl border border-gray-200 p-4 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                            {formatDateShort(leftProj.created_at)} • {leftProj.timeframe}
                          </span>
                          <div className="inline-flex rounded-md p-0.5 bg-gray-200/60 text-[11px] font-semibold">
                            <button
                              type="button"
                              onClick={() => setLeftViewMode("future")}
                              className={`px-2 py-0.5 rounded ${leftViewMode === "future" ? "bg-white text-teal-800 shadow-xs" : "text-gray-600"}`}
                            >
                              Future Goal
                            </button>
                            <button
                              type="button"
                              onClick={() => setLeftViewMode("current")}
                              className={`px-2 py-0.5 rounded ${leftViewMode === "current" ? "bg-white text-teal-800 shadow-xs" : "text-gray-600"}`}
                            >
                              Current Lifestyle
                            </button>
                          </div>
                        </div>

                        <div className="w-full aspect-[4/3] rounded-lg border border-gray-200 overflow-hidden bg-white relative flex items-center justify-center">
                          {imgUrl ? (
                            <Image
                              src={getFullUrl(imgUrl)}
                              alt="Left Projection"
                              fill
                              className="object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">No Image</span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="bg-white p-2 rounded-lg border border-gray-200">
                            <span className="text-[10px] text-gray-500 uppercase block">Est. BMI</span>
                            <span className="font-bold text-gray-900">{activeItem?.est_bmi || "N/A"}</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-200">
                            <span className="text-[10px] text-gray-500 uppercase block">Est. Weight</span>
                            <span className="font-bold text-gray-900">{activeItem?.est_weight || "N/A"}</span>
                          </div>
                        </div>

                        {Array.isArray(activeItem?.expected_changes) && activeItem.expected_changes.length > 0 && (
                          <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-700">
                            <span className="font-bold text-gray-800 block mb-1.5">Expected Changes:</span>
                            <ul className="space-y-1">
                              {activeItem.expected_changes.slice(0, 3).map((ch: string, i: number) => (
                                <li key={i} className="flex items-start gap-1.5 text-[11px]">
                                  <CheckCircle2 size={12} className="text-teal-600 mt-0.5 shrink-0" />
                                  <span>{ch}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Right Card */}
                {(() => {
                  const pData = (rightProj as any).projections || (rightProj as any).projections_data;
                  const future = pData?.future_goal;
                  const current = pData?.current_lifestyle;
                  const activeItem = rightViewMode === "future" ? future : current;
                  const imgUrl = activeItem?.image || (activeItem as any)?.projection_url || rightProj.input_image;

                  return (
                    <div className="bg-gray-50/70 rounded-xl border border-gray-200 p-4 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                            {formatDateShort(rightProj.created_at)} • {rightProj.timeframe}
                          </span>
                          <div className="inline-flex rounded-md p-0.5 bg-gray-200/60 text-[11px] font-semibold">
                            <button
                              type="button"
                              onClick={() => setRightViewMode("future")}
                              className={`px-2 py-0.5 rounded ${rightViewMode === "future" ? "bg-white text-teal-800 shadow-xs" : "text-gray-600"}`}
                            >
                              Future Goal
                            </button>
                            <button
                              type="button"
                              onClick={() => setRightViewMode("current")}
                              className={`px-2 py-0.5 rounded ${rightViewMode === "current" ? "bg-white text-teal-800 shadow-xs" : "text-gray-600"}`}
                            >
                              Current Lifestyle
                            </button>
                          </div>
                        </div>

                        <div className="w-full aspect-[4/3] rounded-lg border border-gray-200 overflow-hidden bg-white relative flex items-center justify-center">
                          {imgUrl ? (
                            <Image
                              src={getFullUrl(imgUrl)}
                              alt="Right Projection"
                              fill
                              className="object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">No Image</span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="bg-white p-2 rounded-lg border border-gray-200">
                            <span className="text-[10px] text-gray-500 uppercase block">Est. BMI</span>
                            <span className="font-bold text-gray-900">{activeItem?.est_bmi || "N/A"}</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-200">
                            <span className="text-[10px] text-gray-500 uppercase block">Est. Weight</span>
                            <span className="font-bold text-gray-900">{activeItem?.est_weight || "N/A"}</span>
                          </div>
                        </div>

                        {Array.isArray(activeItem?.expected_changes) && activeItem.expected_changes.length > 0 && (
                          <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-700">
                            <span className="font-bold text-gray-800 block mb-1.5">Expected Changes:</span>
                            <ul className="space-y-1">
                              {activeItem.expected_changes.slice(0, 3).map((ch: string, i: number) => (
                                <li key={i} className="flex items-start gap-1.5 text-[11px]">
                                  <CheckCircle2 size={12} className="text-teal-600 mt-0.5 shrink-0" />
                                  <span>{ch}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[#5F6F73] text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">SI</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Timeframe</th>
                <th className="px-6 py-4 font-semibold">Uploaded Image</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedProjections.map((proj, idx) => {
                const thumbnailUrl = proj.input_image;
                const actualIndex = startIndex + idx + 1;
                return (
                  <tr
                    key={proj.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-[#041228] font-medium">
                      {actualIndex}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5F6F73]">
                      {proj.created_at ? formatDateShort(proj.created_at) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5F6F73]">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F8FAFF] border border-[#3A86FF]/20 text-[#3A86FF] font-semibold text-xs">
                        <Clock size={12} />
                        {proj.timeframe}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {thumbnailUrl ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <Image
                              src={getFullUrl(thumbnailUrl)}
                              alt="Thumbnail"
                              width={48}
                              height={48}
                              className="w-full h-full object-cover object-top"
                              loading="lazy"
                            />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                          <span className="text-gray-400 text-xs text-center">
                            No Image
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedProjection(proj)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F6F6] text-[#0FA4A9] border border-[#BDE8E8] rounded-md text-xs font-semibold hover:bg-[#d0f0f0] transition-colors cursor-pointer"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          onClick={() => {
                            setCompareRightId(proj.id);
                            if (!compareLeftId || String(compareLeftId) === String(proj.id)) {
                              const other = projections.find((p) => String(p.id) !== String(proj.id));
                              if (other) setCompareLeftId(other.id);
                            }
                            setIsComparing(true);
                            window.scrollTo({ top: 300, behavior: "smooth" });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-semibold hover:bg-purple-100 transition-colors cursor-pointer"
                          title="Select this projection to compare side-by-side"
                        >
                          <Columns size={13} /> Compare
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {projections.length > 0 && (
        <div className="flex justify-between items-center mt-8 py-4 border-t border-gray-100">
          <span className="text-sm text-[#5F6F73]">
            Page <span className="font-medium text-[#041228]">{currentPage}</span> of{" "}
            <span className="font-medium text-[#041228]">{totalPages}</span> —{" "}
            <span className="font-medium text-[#041228]">{projections.length}</span> total
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center text-[#5F6F73] border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 h-8 flex items-center justify-center gap-1 text-[#5F6F73] border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              ‹ Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === page
                    ? "bg-[#3A86FF] text-white border border-[#3A86FF]"
                    : "text-[#5F6F73] border border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 h-8 flex items-center justify-center gap-1 text-[#5F6F73] border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Next ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center text-[#5F6F73] border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Projection Modal */}
      <AnimatePresence>
        {selectedProjection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProjection(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-bold text-[#041228]">
                    Projection Overview
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-[#5F6F73] font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      Generated {formatDateShort(selectedProjection.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white border border-gray-200 shadow-sm">
                      <Clock size={12} className="text-[#3A86FF]" />
                      Timeframe: {selectedProjection.timeframe}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProjection(null)}
                  className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-[#041228] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {selectedProjection && (() => {
                  const projData = (selectedProjection as any).projections || (selectedProjection as any).projections_data;
                  const current = projData?.current_lifestyle;
                  const future = projData?.future_goal;

                  if (!current || !future) {
                    return (
                      <div className="flex flex-col items-center justify-center py-12 text-[#5F6F73]">
                        <Activity size={48} className="mb-4 opacity-20" />
                        <p>No projection details available for this record.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Current Lifestyle Column */}
                      <div className="flex flex-col gap-6">
                        <div className="text-center pb-4 border-b border-gray-100">
                          <h4 className="text-[#8B5CF6] font-bold text-[15px] uppercase tracking-wider">
                            {current.label || "Current Lifestyle Route"}
                          </h4>
                        </div>

                            <div className="w-full rounded-xl border border-gray-100 overflow-hidden bg-[#F8FAFF] flex items-center justify-center p-2 shadow-inner relative" style={{ minHeight: 200 }}>
                            <Image
                              src={getFullUrl(current.image || (current as any).projection_url)}
                              alt="Current Lifestyle Projection"
                              width={500}
                              height={360}
                              className="w-full h-auto max-h-[360px] object-contain rounded-lg"
                              loading="eager"
                              priority
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#E1F9F0] text-[#10B981] p-3 rounded-lg flex flex-col items-center justify-center border border-[#10B981]/20">
                            <span className="text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                              <Activity size={10} /> EST. BMI
                            </span>
                            <span className="font-bold text-lg">
                              {current.est_bmi || "N/A"}
                            </span>
                          </div>
                          <div className="bg-[#E4EFFF] text-[#3A86FF] p-3 rounded-lg flex flex-col items-center justify-center border border-[#3A86FF]/20">
                            <span className="text-[10px] font-bold uppercase mb-1">
                              EST. WEIGHT
                            </span>
                            <span className="font-bold text-lg">
                              {current.est_weight || "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="bg-[#F8FAFF] p-5 rounded-xl border border-gray-100">
                          <h5 className="font-bold text-[#041228] text-sm mb-3">
                            Expected Changes:
                          </h5>
                          <ul className="space-y-3">
                            {current.expected_changes?.map(
                              (change: string, i: number) => (
                                <li key={i} className="flex gap-2.5 items-start">
                                  <CheckCircle2
                                    size={14}
                                    className="text-[#8B5CF6] shrink-0 mt-0.5"
                                  />
                                  <span className="text-sm text-[#5F6F73] leading-relaxed">
                                    {change}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Future Goal Column */}
                      <div className="flex flex-col gap-6">
                        <div className="text-center pb-4 border-b border-gray-100">
                          <h4 className="text-[#0FA4A9] font-bold text-[15px] uppercase tracking-wider">
                            {future.label || "Future Goal Route"}
                          </h4>
                        </div>

                            <div className="w-full rounded-xl border border-gray-100 overflow-hidden bg-[#F8FAFF] flex items-center justify-center p-2 shadow-inner relative" style={{ minHeight: 200 }}>
                            <Image
                              src={getFullUrl(future.image || (future as any).projection_url)}
                              alt="Future Goal Projection"
                              width={500}
                              height={360}
                              className="w-full h-auto max-h-[360px] object-contain rounded-lg"
                              loading="eager"
                              priority
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#E1F9F0] text-[#10B981] p-3 rounded-lg flex flex-col items-center justify-center border border-[#10B981]/20">
                            <span className="text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                              <Activity size={10} /> EST. BMI
                            </span>
                            <span className="font-bold text-lg">
                              {future.est_bmi || "N/A"}
                            </span>
                          </div>
                          <div className="bg-[#E4EFFF] text-[#3A86FF] p-3 rounded-lg flex flex-col items-center justify-center border border-[#3A86FF]/20">
                            <span className="text-[10px] font-bold uppercase mb-1">
                              EST. WEIGHT
                            </span>
                            <span className="font-bold text-lg">
                              {future.est_weight || "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="bg-[#E6F6F6] p-5 rounded-xl border border-[#BDE8E8]/50">
                          <h5 className="font-bold text-[#041228] text-sm mb-3">
                            Expected Changes:
                          </h5>
                          <ul className="space-y-3">
                            {future.expected_changes?.map(
                              (change: string, i: number) => (
                                <li key={i} className="flex gap-2.5 items-start">
                                  <CheckCircle2
                                    size={14}
                                    className="text-[#0FA4A9] shrink-0 mt-0.5"
                                  />
                                  <span className="text-sm text-[#5F6F73] leading-relaxed">
                                    {change}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
