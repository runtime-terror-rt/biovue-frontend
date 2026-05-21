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
import { useState } from "react";
import { MoreVertical, Eye, Gift, UserMinus } from "lucide-react";
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

type ClientsTableProps = {
  limit?: number;
  clients: ClientTableItem[];
};

export default function ClientsTable({ clients, limit }: ClientsTableProps) {
  const router = useRouter();
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  const [cancelConnectedUser] = useCancelConnectedUserMutation();

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

  const visibleClients = limit ? clients.slice(0, limit) : clients;

  const toggleSelectAll = () => {
    if (selectedUserIds.length === visibleClients.length) {
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
            {visibleClients.map((client) => {
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
            })}
          </TableBody>
        </Table>
      </div>

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
