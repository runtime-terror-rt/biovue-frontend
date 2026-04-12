"use client";

import { useState } from "react";
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Edit,
  Loader2,
} from "lucide-react";
import { Ad } from "./data";
import { useGetAdminAdsQuery, useToggleAdStatusMutation, useDeleteAdMutation } from "@/redux/features/api/adminDashboard/ads";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface BannersTableProps {
  onEdit: (banner: Ad) => void;
}
export default function BannersTable({ onEdit }: BannersTableProps) {
  const { data, isLoading } = useGetAdminAdsQuery(undefined);
  const [toggleStatus] = useToggleAdStatusMutation();
  const [deleteAd] = useDeleteAdMutation();

  const banners: Ad[] = data?.data || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [placementFilter, setPlacementFilter] = useState("All Placement");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredBanners = banners.filter((banner) => {
    const matchesSearch = banner.ads_title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // Status in API seems to be 1/0 or true/false. Map to simple strings for filter.
    const isActv = banner.status === 1 || banner.status === true;
    const bannerStatusStr = isActv ? "ACTIVE" : "INACTIVE";

    const matchesStatus =
      statusFilter === "All Statuses" || bannerStatusStr === statusFilter;
      
    const bannerPlacements = banner.placement ? banner.placement.split(",").map(s => s.trim()) : [];
    const matchesPlacement =
      placementFilter === "All Placement" ||
      bannerPlacements.includes(placementFilter);
    return matchesSearch && matchesStatus && matchesPlacement;
  });

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBanners = filteredBanners.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const toggleBannerStatus = async (id: number) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success("Banner status updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update banner status");
    }
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAd(id).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "Your banner has been deleted.",
            icon: "success"
          });
        } catch (err: any) {
          Swal.fire({
             title: "Error!",
             text: err?.data?.message || "Failed to delete banner.",
             icon: "error"
          });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-[#22C55E]";
      case "INACTIVE":
        return "text-[#E31D48]";
      case "EXPIRED":
        return "text-[#9AAEB2]";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="w-full md:w-1/2 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search banners by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 outline-none text-sm"
          />
        </div>
        <div className="w-full md:w-1/2 text-[#5F6F73] flex justify-end gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm outline-none cursor-pointer "
          >
            <option>All Statuses</option>
            <option>ACTIVE</option>
            <option>INACTIVE</option>
            <option>EXPIRED</option>
          </select>
          <select
            value={placementFilter}
            onChange={(e) => {
              setPlacementFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm outline-none cursor-pointer"
          >
            <option>All Placement</option>
            <option>Home Page</option>
            <option>Free Dashboard</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">
                PREVIEW
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">
                BANNER DETAILS
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">
                PLACEMENT
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">
                SCHEDULE
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">
                STATUS
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedBanners.map((banner, index) => {
              const isActv = banner.status === 1 || banner.status === true;
              const statusStr = isActv ? "ACTIVE" : "INACTIVE";
              const plmnts = banner.placement ? banner.placement.split(",") : [];
              
              return (
              <tr
                key={banner.id}
                className={`border-b border-[#9AAEB2] bg-white`}
              >
                {/* Preview */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400 text-lg">⋮⋮</div>
                    <div className="w-25 h-12.5 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
                      {banner.image ? (
                        <img
                          src={banner.image}
                          alt={banner.ads_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Banner Details */}
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{banner.ads_title}</p>
                    <span
                      className={`inline-block px-3 py-1 rounded text-base font-regular bg-[#0FA4A91A] text-black border border-[#0D9488]`}
                    >
                      {banner.ads_type}
                    </span>
                  </div>
                </td>

                {/* Placement */}
                <td className="px-6 py-4">
                  <div className="flex flex-col w-fit gap-2">
                    {plmnts.map((place) => (
                      <span
                        key={place}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#5E5E5E1A] text-[#5E5E5E] border border-[#5E5E5E] rounded-lg text-base font-medium"
                      >
                        <Layers /> {place.trim()}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Schedule */}
                <td className="px-6 py-4 text-base text-[#5E5E5E]">
                  <div>FROM {banner.start_date}</div>
                  <div>TO {banner.end_date}</div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`font-semibold text-base ${getStatusColor(statusStr)}`}
                  >
                    {statusStr}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleBannerStatus(banner.id)}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                        isActv ? "bg-[#0FA4A9]" : "bg-[#9AAEB2]"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                          isActv ? "translate-x-5" : "translate-x-0.5"
                        } mt-0.5`}
                      />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onEdit(banner)}
                      className="p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit size={18} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-teal-600 font-semibold">
          SHOWING {paginatedBanners.length} OF {filteredBanners.length}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-[#8746E7] text-white rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
