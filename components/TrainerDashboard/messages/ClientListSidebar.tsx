"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useGetConnectedClientsQuery } from "@/redux/features/api/TrainerDashboard/Clients/YourClients";
import { useGetProfileQuery } from "@/redux/features/api/profileApi";
import { useMemo } from "react";
import { getFullImageUrl } from "@/lib/utils";

interface ClientsListSidebarProps {
  selectedClientId: string | null;
  onSelectClient: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

// Sub-component: fetches profile image for a single client via the profile API.
// This is necessary because /connected-professions only returns image_url at the
// top level, which is null for users who uploaded their photo via /profile.
function ClientAvatar({
  clientId,
  fallbackUrl,
  name,
}: {
  clientId: string;
  fallbackUrl: string | null;
  name: string;
}) {
  const { data: profileData } = useGetProfileQuery(clientId, {
    skip: !clientId,
  });

  const imageUrl = getFullImageUrl(
    profileData?.data?.profile?.image ||
      profileData?.data?.profile_image ||
      profileData?.data?.image_url ||
      fallbackUrl,
  );

  return (
    <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden border border-[#E5E7EB] bg-gray-50 flex items-center justify-center">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          unoptimized
          className="object-cover"
        />
      ) : (
        <UserIcon className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
      )}
    </div>
  );
}

export default function ClientsListSidebar({
  selectedClientId,
  onSelectClient,
  searchQuery,
  setSearchQuery,
}: ClientsListSidebarProps) {
  const { data: connectedClientsData, isLoading: isClientsLoading } =
    useGetConnectedClientsQuery();

  const contacts = useMemo(() => {
    if (!connectedClientsData?.data) return [];

    return connectedClientsData.data.map((client) => ({
      id: client.id.toString(),
      name: client.name,
      rawImageUrl: client.image_url || null,
      lastMessage: "Connected",
      timestamp: "",
    }));
  }, [connectedClientsData]);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
          <Search className="w-5 h-5" />
        </div>
        <input
          placeholder="Search Clients"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0D9488] transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Clients List */}
      <ScrollArea className="flex-1 -mr-4 pr-4">
        <div className="space-y-1">
          {isClientsLoading ? (
            <p className="text-sm text-center text-gray-500 py-4">
              Loading clients...
            </p>
          ) : contacts.length === 0 ? (
            <p className="text-sm text-center text-gray-500 py-4">
              No clients found
            </p>
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
                    className={`group relative p-3 cursor-pointer rounded-lg transition-all flex gap-3 ${
                      isActive
                        ? "bg-[#0D94880D] border border-transparent shadow-sm"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0D9488] rounded-r-full" />
                    )}

                    {/* Avatar — fetches from profile API individually */}
                    <ClientAvatar
                      clientId={client.id}
                      fallbackUrl={client.rawImageUrl}
                      name={client.name}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`text-sm font-semibold truncate ${isActive ? "text-[#111827]" : "text-[#374151]"}`}
                        >
                          {client.name}
                        </h3>
                        {client.timestamp && (
                          <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap">
                            {client.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B7280] truncate leading-tight">
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
