"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { useGetAllUsersForSupplierQuery } from "@/redux/features/api/SupplierDashboard/AllUsers";
import { useMemo } from "react";

interface ClientsListSidebarProps {
  selectedClientId: string | null;
  onSelectClient: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function ClientsListSidebar({
  selectedClientId,
  onSelectClient,
  searchQuery,
  setSearchQuery,
}: ClientsListSidebarProps) {
  const { data: usersData, isLoading: isUsersLoading } =
    useGetAllUsersForSupplierQuery();

  const contacts = useMemo(() => {
    if (!usersData) return [];

    return usersData.map((user) => ({
      id: user.id.toString(),
      name: user.name,
      avatar: user.profile_image || null,
      lastMessage: "Connected",
      timestamp: "",
    }));
  }, [usersData]);

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-[#E4EFFF] overflow-hidden">
      {/* Search */}
      <div className="p-6 pb-2">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
            <Search className="w-5 h-5" />
          </div>
          <input
            placeholder="Search Clients"
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FBFA] border border-[#E5E7EB] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0FA4A9] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Clients List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {isUsersLoading ? (
            <p className="text-sm text-center text-gray-500 py-10">Loading clients...</p>
          ) : contacts.length === 0 ? (
            <p className="text-sm text-center text-gray-500 py-10">No clients found</p>
          ) : (
            contacts
              .filter((c) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((client) => {
                const isActive = selectedClientId === client.id;
                return (
                  <div
                    key={client.id}
                    onClick={() => onSelectClient(client.id)}
                    className={`group relative p-4 cursor-pointer rounded-2xl transition-all flex gap-4 ${
                      isActive
                        ? "bg-[#E4F0FF] shadow-sm"
                        : "hover:bg-[#F8FBFA]"
                    }`}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-[#3A86FF] rounded-r-full" />
                    )}

                    {/* Avatar */}
                    <Avatar
                      src={client.avatar}
                      name={client.name}
                      size="lg"
                      className="shrink-0 rounded-xl"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3
                          className={`text-sm font-bold truncate ${isActive ? "text-[#041228]" : "text-[#041228]"}`}
                        >
                          {client.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#94A3B8] truncate leading-tight">
                        {client.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
