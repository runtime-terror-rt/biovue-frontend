"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Search,
  Sparkles,
  Mail,
  User as UserIcon,
  Calendar,
  Target,
  Bell,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { User } from "@/redux/features/api/SupplierDashboard/AllUsers";
import SupplementMatchModal from "./SupplementMatchModal";
import TargetGoalsModal from "./TargetGoalsModal";
import NotifyClientModal from "./NotifyClientModal";
import WalkInClientModal from "./WalkInClientModal";

const getSafeImageSrc = (src: string | null | undefined) => {
  if (!src) return null;
  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    try {
      if (src.startsWith("http")) {
        new URL(src);
      }
      return src;
    } catch (e) {
      return null;
    }
  }
  return null;
};
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  useFindMatchMutation,
  buildFindMatchUserPayload,
} from "@/redux/features/api/SupplierDashboard/FindMatch";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";

// clients er table
interface ClientTableProps {
  users: User[];
}

export default function ClientTable({ users }: ClientTableProps) {
  const currentUser = useSelector(selectCurrentUser);
  const supplier_id = currentUser?.id;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTargetGoalsModalOpen, setIsTargetGoalsModalOpen] = useState(false);
  const [matchingUserId, setMatchingUserId] = useState<number | null>(null);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyUser, setNotifyUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<User | null>(null);

  const [findMatch, { isLoading: isMatching }] = useFindMatchMutation();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  const from = filteredUsers.length === 0 ? 0 : startIndex + 1;
  const to = Math.min(startIndex + itemsPerPage, filteredUsers.length);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
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

  const handleFindMatch = async (user: User) => {
    setMatchingUserId(user.id);
    setSelectedUser(user);

    if (!supplier_id) {
      toast.error("Supplier ID not found. Please log in again.");
      setMatchingUserId(null);
      return;
    }

    try {
      // ✅ Step 1: Run AI (POST)
      await findMatch({
        user_id: user.id.toString(),
        supplier_id: supplier_id.toString(),
        user_data: buildFindMatchUserPayload(user),
      }).unwrap();

      // ✅ Step 2: Open modal AFTER AI done
      setIsModalOpen(true);
    } catch (error) {
      console.error("Match finding failed:", error);
      toast.error("Failed to es. Please try again.");
    } finally {
      setMatchingUserId(null);
    }
  };
  const handleViewGoals = (user: User) => {
    setSelectedUser(user);
    setIsTargetGoalsModalOpen(true);
  };

  const handleNotifyClient = (user: User) => {
    setNotifyUser(user);
    setIsNotifyModalOpen(true);
  };

  const handleEditClient = (user: User) => {
    setEditingClient(user);
    setIsEditModalOpen(true);
  };

  return (
    <div className="bg-white rounded-[40px] border border-[#D9E6FF] shadow-sm overflow-hidden">
      {/* Table Header / Toolbar */}
      <div className="px-10 py-8 border-b border-[#F8FBFA] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[#041228] mb-1 tracking-tight">
            Client Directory
          </h2>
          <p className="text-sm text-[#94A3B8] font-medium uppercase tracking-widest">
            {users.length} Total Users
          </p>
        </div>

          <div className="relative w-full md:w-80 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#0FA4A9] transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 focus:border-[#0FA4A9] transition-all"
            />
        </div>
      </div>

      <div className="overflow-x-auto min-h-100">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-[#F8FBFA]/50 border-b border-[#F8FBFA] hover:bg-transparent">
              <TableHead className="px-10 py-6 text-xs font-black text-[#94A3B8] uppercase tracking-[0.2em]">
                Profile
              </TableHead>
              <TableHead className="px-10 py-6 text-xs font-black text-[#94A3B8] uppercase tracking-[0.2em]">
                User Details
              </TableHead>
              <TableHead className="px-10 py-6 text-xs font-black text-[#94A3B8] uppercase tracking-[0.2em]">
                Classification
              </TableHead>
              <TableHead className="px-10 py-6 text-xs font-black text-[#94A3B8] uppercase tracking-[0.2em]">
                Target Goals
              </TableHead>
              <TableHead className="px-10 py-6 text-xs font-black text-[#94A3B8] uppercase tracking-[0.2em]">
                Joined Date
              </TableHead>
              <TableHead className="px-10 py-6 text-xs font-black text-[#94A3B8] uppercase tracking-[0.2em] text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#F8FBFA]">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-[#F8FBFA]/30 transition-all border-b border-[#F8FBFA]"
                >
                  <TableCell className="px-10 py-6">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#E4F0FF] to-[#D9E6FF] overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                      {getSafeImageSrc(user.profile_image) ? (
                        <Image
                          src={getSafeImageSrc(user.profile_image)!}
                          alt={user.name}
                          width={56}
                          height={56}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <UserIcon
                          size={24}
                          className="text-[#3A86FF]"
                          strokeWidth={1.5}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-[#041228] mb-1">
                        {user.name}
                      </span>
                      <div className="flex items-center gap-2 text-[#94A3B8]">
                        <Mail size={14} />
                        <span className="text-sm font-medium">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-6">
                    <div className="flex flex-col gap-1.5">
                      <Badge className="w-fit bg-[#E4F0FF] text-[#3A86FF] hover:bg-[#E4F0FF] border-none px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider">
                        {user.user_type}
                      </Badge>
                      {user.profession_type && (
                        <span className="text-xs text-[#94A3B8] font-medium ml-1">
                          {user.profession_type}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-10 py-6">
                    <Button
                      onClick={() => handleViewGoals(user)}
                      className="bg-[#3A86FF]/10 hover:bg-[#3A86FF] text-[#3A86FF] hover:text-white border border-[#3A86FF]/20 rounded-xl px-4 py-1.5 h-auto text-[11px] font-bold flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Target size={14} />
                      View Goals
                    </Button>
                  </TableCell>
                  <TableCell className="px-10 py-6">
                    <div className="flex items-center gap-2 text-[#5F6F73]">
                      <Calendar size={16} className="text-[#94A3B8]" />
                      <span className="text-sm font-semibold">
                        {new Date(user.joined_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        onClick={() => handleEditClient(user)}
                        className="bg-white hover:bg-[#0FA4A9] text-[#0FA4A9] hover:text-white border-2 border-[#0FA4A9]/20 hover:border-[#0FA4A9] rounded-2xl px-3.5 py-2 h-auto text-xs font-bold flex items-center gap-1.5 transition-all group active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
                        title="Edit client profile and goals"
                      >
                        <Edit size={14} className="group-hover:scale-110 transition-transform" />
                        Edit
                      </Button>

                      <Button
                        disabled={matchingUserId === user.id}
                        onClick={() => handleFindMatch(user)}
                        className="bg-white hover:bg-[#0FA4A9] text-[#0FA4A9] hover:text-white border-2 border-[#0FA4A9]/20 hover:border-[#0FA4A9] rounded-2xl px-4 py-2 h-auto text-xs font-bold flex items-center gap-1.5 transition-all group active:scale-95 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50"
                      >
                        <Sparkles
                          size={14}
                          className={matchingUserId === user.id ? "animate-spin" : "group-hover:animate-pulse"}
                        />
                        {matchingUserId === user.id ? "Analysing..." : "Find Match"}
                      </Button>

                      <Button
                        onClick={() => handleNotifyClient(user)}
                        className="bg-[#0FA4A9]/10 hover:bg-[#0FA4A9] text-[#0FA4A9] hover:text-white border border-[#0FA4A9]/20 hover:border-[#0FA4A9] rounded-2xl px-3.5 py-2 h-auto text-xs font-bold flex items-center gap-1.5 transition-all group active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
                        title="Send notification email to client"
                      >
                        <Bell size={14} className="group-hover:rotate-12 transition-transform" />
                        Notify
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-[#94A3B8]">
                    <Search size={40} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">
                    No users found matching your search
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {filteredUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-xs text-[#5F6F73] font-medium">
            Showing <span className="font-bold text-[#041228]">{from}–{to}</span> of{" "}
            <span className="font-bold text-[#041228]">{filteredUsers.length}</span> clients
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 sm:px-3 sm:py-1.5 flex items-center gap-1 rounded-xl border border-gray-200 text-xs font-semibold text-[#5F6F73] hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={'dots-' + i} className="px-2 text-xs text-[#94A3B8] select-none">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p as number)}
                  className={cn(
                    "w-8 h-8 rounded-xl text-xs font-bold transition-all",
                    currentPage === p
                      ? "bg-[#0FA4A9] text-white shadow-xs"
                      : "text-[#5F6F73] hover:bg-gray-100 border border-transparent"
                  )}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 sm:px-3 sm:py-1.5 flex items-center gap-1 rounded-xl border border-gray-200 text-xs font-semibold text-[#5F6F73] hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      <div className="h-10" />

      <SupplementMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />

      <TargetGoalsModal
        isOpen={isTargetGoalsModalOpen}
        onClose={() => setIsTargetGoalsModalOpen(false)}
        user={selectedUser}
      />

      <NotifyClientModal
        isOpen={isNotifyModalOpen}
        onClose={() => {
          setIsNotifyModalOpen(false);
          setNotifyUser(null);
        }}
        user={notifyUser}
      />

      <WalkInClientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingClient(null);
        }}
        editingUser={editingClient}
      />
    </div>
  );
}
