"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MoreVertical, Eye, Gift, UserMinus, ChevronLeft, ChevronRight } from "lucide-react";
import { useCancelConnectedUserMutation } from "@/redux/features/api/userDashboard/CancelConnect";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientTableItem } from "@/redux/features/api/TrainerDashboard/trainerOverviewApi";
import GiftProjectionModal from "./GiftProjectionModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ClientsTableProps = {
  limit?: number;
  clients: ClientTableItem[];
  itemsPerPage?: number;
};

export default function ClientsTable({ clients, limit, itemsPerPage = 8 }: ClientsTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  const [cancelConnectedUser] = useCancelConnectedUserMutation();

  const pageSize = itemsPerPage || 8;
  const totalPages = Math.max(1, Math.ceil(clients.length / pageSize));

  // Reset to page 1 if current page becomes invalid due to filter/data changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [clients.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const visibleClients = limit
    ? clients.slice(0, limit)
    : clients.slice(startIndex, startIndex + pageSize);

  const from = clients.length === 0 ? 0 : startIndex + 1;
  const to = Math.min(startIndex + pageSize, clients.length);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleDisconnect = async (userId: number, userName: string) => {
    Swal.fire({
      title: "Disconnect Client?",
      text: `Are you sure you want to disconnect ${userName}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, disconnect",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await cancelConnectedUser({ user_id: userId }).unwrap();
          if (res.success) {
            toast.success(res.message || `${userName} has been successfully disconnected.`);
          } else {
            toast.error(res.message || "Failed to disconnect client.");
          }
        } catch (err: any) {
          console.error("Disconnect error:", err);
          toast.error(
            err?.data?.message || "An error occurred while disconnecting the client."
          );
        }
      }
    });
  };
  const statusConfig: Record<string, { label: string; className: string }> = {
    "on-track": {
      label: "On track",
      className: "bg-[#22C55E1A] text-[#22C55E] hover:bg-green-50",
    },
    "need-attention": {
      label: "Need attention",
      className: "bg-[#D3BB5B1A] text-[#D3BB5B] hover:bg-yellow-50",
    },
    inactive: {
      label: "Inactive",
      className: "bg-[#9AAEB24D] text-[#5F6F73] hover:bg-gray-50",
    },
  };

  const normalizeStatus = (status: string) => {
    const s = status.toLowerCase().replace(/\s+/g, "-");
    if (statusConfig[s]) return s;
    if (s === "on-track") return "on-track";
    if (s === "needs-attention" || s === "need-attention")
      return "need-attention";
    return "inactive";
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.length === visibleClients.length && visibleClients.length > 0) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(visibleClients.map((c) => c.user_id));
    }
  };

  const toggleSelectUser = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className=" bg-white p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[#111827]">Clients</h3>
        {selectedUserIds.length > 0 && (
          <Button
            onClick={() => setIsGiftModalOpen(true)}
            className="bg-[#0FA4A9] hover:bg-[#0D9488] text-white flex items-center gap-2"
          >
            <Gift size={16} />
            Gift Selected ({selectedUserIds.length})
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 py-3">
                <Checkbox
                  checked={
                    selectedUserIds.length === visibleClients.length &&
                    visibleClients.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="font-medium text-base md:text-lg py-3">
                USER NAME
              </TableHead>
              <TableHead className="font-medium text-base md:text-lg py-3">
                GOAL
              </TableHead>
              <TableHead className="font-medium text-base md:text-lg py-3">
                PROJECTION USED
              </TableHead>
              <TableHead className="font-medium text-base md:text-lg py-3">
                STATUS
              </TableHead>
              <TableHead className="font-medium text-base md:text-lg py-3">
                ACTIVITY
              </TableHead>
              <TableHead className="font-medium text-base md:text-lg py-3">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleClients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-[#5F6F73] text-sm"
                >
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              visibleClients.map((client) => {
                const statusKey = normalizeStatus(client.status);
                const config = statusConfig[statusKey];

                return (
                  <TableRow key={client.user_id}>
                    <TableCell className="py-3">
                      <Checkbox
                        checked={selectedUserIds.includes(client.user_id)}
                        onCheckedChange={() => toggleSelectUser(client.user_id)}
                        aria-label={`Select ${client.user_name}`}
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-[#666666] text-base md:text-lg">
                          {client.user_name}
                        </span>

                        <span className="text-sm text-[#9CA3AF]">
                          {client.connected_at || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#666666] py-3 text-base md:text-lg">
                      {client.goal || "Not specified"}
                    </TableCell>
                    <TableCell className="text-[#666666] py-3 text-base md:text-lg">
                      {client.projection_used || "-"}
                    </TableCell>
                    <TableCell className="text-[#666666] py-3 text-base md:text-lg">
                      <Badge className={config.className}>{config.label}</Badge>
                    </TableCell>
                    <TableCell className="text-[#666666] py-3 text-base md:text-lg">
                      {client.activity || "Recent"}
                    </TableCell>
                    <TableCell className="py-3 text-base md:text-lg">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-[#F8FBFA] rounded-full transition-colors text-[#5F6F73] focus:outline-none">
                            <MoreVertical size={20} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 p-2 rounded-xl border-[#E4EFFF] shadow-md bg-white"
                        >
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[#F8FBFA] text-sm text-[#041228] font-medium transition-colors"
                            onClick={() =>
                              router.push(
                                `/trainer-dashboard/clients/${client.user_id}`,
                              )
                            }
                          >
                            <Eye size={16} className="text-[#0FA4A9]" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[#F8FBFA] text-sm text-[#041228] font-medium transition-colors mt-1"
                            onClick={() => {
                              setSelectedUserId(client.user_id);
                              setIsGiftModalOpen(true);
                            }}
                          >
                            <Gift size={16} className="text-[#0FA4A9]" />
                            Gift Projection
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[#F8FBFA] text-sm text-red-600 hover:text-red-700 font-medium transition-colors mt-1"
                            onClick={() => handleDisconnect(client.user_id, client.user_name)}
                          >
                            <UserMinus size={16} className="text-red-500" />
                            Disconnect
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!limit && clients.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100">
          <span className="text-xs sm:text-sm text-[#5F6F73]">
            Showing <span className="font-semibold text-[#111827]">{from}</span> to{" "}
            <span className="font-semibold text-[#111827]">{to}</span> of{" "}
            <span className="font-semibold text-[#111827]">{clients.length}</span> clients
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 sm:px-3 sm:py-1.5 flex items-center justify-center gap-1 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium text-[#5F6F73] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className="px-2 text-xs text-gray-400 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center",
                      currentPage === p
                        ? "bg-[#0FA4A9] text-white shadow-sm shadow-[#0FA4A9]/30"
                        : "text-[#5F6F73] border border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 sm:px-3 sm:py-1.5 flex items-center justify-center gap-1 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium text-[#5F6F73] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      <GiftProjectionModal
        isOpen={isGiftModalOpen}
        onClose={() => {
          setIsGiftModalOpen(false);
          setSelectedUserId(null);
          setSelectedUserIds([]);
        }}
        preselectedUserIds={
          selectedUserIds.length > 0
            ? selectedUserIds
            : selectedUserId
              ? [selectedUserId]
              : []
        }
      />
    </div>
  );
}
