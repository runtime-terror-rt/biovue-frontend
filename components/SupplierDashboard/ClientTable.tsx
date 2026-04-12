"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Sparkles,
  Mail,
  User as UserIcon,
  Calendar,
  Target,
} from "lucide-react";
import { User } from "@/redux/features/api/SupplierDashboard/AllUsers";
import SupplementMatchModal from "./SupplementMatchModal";
import TargetGoalsModal from "./TargetGoalsModal";

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

  const [findMatch, { isLoading: isMatching }] = useFindMatchMutation();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
        user_data: user,
      }).unwrap();

      // ✅ Step 2: Open modal AFTER AI done
      setIsModalOpen(true);
    } catch (error) {
      console.error("Match finding failed:", error);
      toast.error("Failed to find matches. Please try again.");
    } finally {
      setMatchingUserId(null);
    }
  };
  const handleViewGoals = (user: User) => {
    setSelectedUser(user);
    setIsTargetGoalsModalOpen(true);
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
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
                  <TableCell className="px-10 py-6 text-center">
                    <Button
                      disabled={isMatching || matchingUserId === user.id}
                      onClick={() => handleFindMatch(user)}
                      className="bg-white hover:bg-[#0FA4A9] text-[#0FA4A9] hover:text-white border-2 border-[#0FA4A9]/20 hover:border-[#0FA4A9] rounded-2xl px-6 py-2 h-auto text-sm font-bold flex items-center gap-2 mx-auto transition-all group active:scale-95 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50"
                    >
                      <Sparkles
                        size={16}
                        className={matchingUserId === user.id ? "animate-spin" : "group-hover:animate-pulse"}
                      />
                      {matchingUserId === user.id ? "Analysing..." : "Find Match"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
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
    </div>
  );
}
