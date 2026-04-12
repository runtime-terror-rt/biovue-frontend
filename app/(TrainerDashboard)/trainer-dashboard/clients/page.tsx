"use client";

import { useState } from "react";
import DashboardHeading from "@/components/common/DashboardHeading";
import ClientsTable from "@/components/TrainerDashboard/Clients/ClientsTable";
import { Client } from "@/components/TrainerDashboard/overview/data";
import { ArrowDownUp, Funnel, User, UserPlus } from "lucide-react";
import { useGetTrainerOverviewQuery } from "@/redux/features/api/TrainerDashboard/trainerOverviewApi";

type InviteStep = "email" | "review" | "success" | null;

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const { data: overviewData, isLoading } = useGetTrainerOverviewQuery();
  const apiClients = overviewData?.client_table || [];
  const stats = overviewData?.stats;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState("Most Recent Activity");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const [inviteStep, setInviteStep] = useState<InviteStep>(null);
  const [clientEmail, setClientEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const statusOptions = [
    { value: "all", label: "All Clients" },
    { value: "on-track", label: "On Track" },
    { value: "need-attention", label: "Needs Attention" },
    { value: "inactive", label: "Inactive" },
  ];

  const sortOptions = [
    "Most Recent Activity",
    "Least Recent Activity",
    "Name (A-Z)",
    "Name (Z-A)",
  ];

  // Filter logic
  const filteredClients = apiClients.filter((client) => {
    const matchesSearch =
      client.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.goal || "").toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus =
      statusFilter === "all" || 
      client.status.toLowerCase().replace(/\s+/g, "-").includes(statusFilter);
      
    return matchesSearch && matchesStatus;
  });
  // Sort logic
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortOption === "Name (A-Z)") return a.user_name.localeCompare(b.user_name);
    if (sortOption === "Name (Z-A)") return b.user_name.localeCompare(a.user_name);
    // Activity-based sorting can be extended with real timestamps
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DashboardHeading
          heading="Clients"
          subheading="Manage and monitor your coaching roster"
        />
        <div className="mb-6 flex justify-end items-center">
          <button
            onClick={() => setInviteStep("email")}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            <UserPlus size={18} />
            Invite Client
          </button>
        </div>
      </div>
      {/* Summary cards */}
      <div className="flex flex-wrap gap-4">
        <div className="px-4 py-3 border rounded-lg bg-white">
          Total Clients: {isLoading ? "..." : (stats?.active_clients?.value || apiClients.length)}
        </div>
        <div className="px-4 py-3 border rounded-lg bg-[#C7343405] text-[#C73434]">
          Needs Attention:{" "}
          {isLoading ? "..." : (stats?.needing_attention?.value || apiClients.filter((c) => c.status.toLowerCase().includes("attention")).length)}
        </div>
        <div className="px-4 py-3 border rounded-lg bg-white">
          Active This Week: {isLoading ? "..." : apiClients.length}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 items-center py-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-50 px-4 py-2 border bg-white rounded w-full max-w-sm focus:ring-2 focus:ring-teal-500"
        />

        {/* Status Dropdown */}
        <div className="relative bg-white">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <span className="flex items-center gap-2">
              <Funnel size={16} className="text-[#5F6F73]" />
            </span>
            {statusOptions.find((o) => o.value === statusFilter)?.label}
          </button>

          {showStatusDropdown && (
            <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value);
                    setShowStatusDropdown(false);
                  }}
                  className={`w-full cursor-pointer px-3 py-2 text-left flex justify-between items-center hover:bg-gray-100 ${
                    statusFilter === option.value ? "bg-gray-100" : ""
                  }`}
                >
                  {option.label}
                  {statusFilter === option.value && (
                    <svg
                      className="w-5 h-5 text-[#0D9488]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* sort */}
        <div className="relative bg-white">
          <button
            onClick={() => {
              setShowSortDropdown(!showSortDropdown);
              setShowStatusDropdown(false);
            }}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <ArrowDownUp size={16} className="text-[#5F6F73]" />
            {sortOption}
          </button>

          {showSortDropdown && (
            <div className="absolute mt-2 w-52 bg-white border border-gray-300 rounded-lg shadow-lg z-10 right-0">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortOption(option);
                    setShowSortDropdown(false);
                  }}
                  className="w-full cursor-pointer px-4 py-2.5 text-left text-sm flex justify-between items-center hover:bg-gray-100"
                >
                  {option}
                  {sortOption === option && (
                    <svg
                      className="w-5 h-5 text-[#0D9488]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19l12-12-1.41-1.41z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {inviteStep === "email" && (
        <Modal onClose={() => setInviteStep(null)}>
          <h2 className="text-lg font-semibold mb-3 md:mb-7">Invite Client</h2>

          <label className="text-sm text-black">EMAIL ADDRESS</label>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="client@email.com"
            className="w-full mt-3 md:mt-7 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          />

          <button
            disabled={!clientEmail}
            onClick={() => setInviteStep("review")}
            className="mt-3 md:mt-7 cursor-pointer w-full bg-teal-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            Send Invitation
          </button>

          <p className="text-xs text-gray-500 mt-2">
            Your client will receive an email invite to join and connect with
            you.
          </p>
        </Modal>
      )}
      {inviteStep === "review" && (
        <Modal onClose={() => setInviteStep(null)}>
          <h2 className="text-2xl font-semibold mb-2">Review & Permissions</h2>
          <p className="text-[#5F6F73] text-base mb-3 md:mb-5">
            Confirm invitation details for your new client.
          </p>

          <div className="flex items-center gap-2 bg-[#9AAEB21A] rounded-lg p-4 mb-4">
            <p>
              <User className="text-[#0D9488]" size={32} />
            </p>
            <div>
              <p className="text-sm text-gray-500">{clientEmail}</p>
            </div>
          </div>

          <label className="flex text-[#0D9488] bg-[#9AAEB21A] p-4 items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 "
            />
            I confirm this client has agreed to share wellness data with me for
            coaching purposes.
          </label>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setInviteStep("email")}
              className="flex-1 border py-2 rounded-lg"
            >
              Back
            </button>
            <button
              disabled={!agreed}
              onClick={() => {
                setInviteStep("success");
              }}
              className="flex-1 cursor-pointer bg-[#0FA4A9] text-white py-2 rounded-lg disabled:opacity-50"
            >
              Confirm & Send
            </button>
          </div>
        </Modal>
      )}
      {inviteStep === "success" && (
        <Modal onClose={() => setInviteStep(null)}>
          <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 text-3xl rounded-xl bg-[#3A86FF25] text-[#3A86FF] flex items-center justify-center">
              ✓
            </div>

            <h2 className="text-2xl font-semibold">
              Invitation sent successfully
            </h2>
            <p className="text-sm text-[#8C9094] mt-2">
              The client will appear in your list once they accept the invite.
            </p>

            <button
              onClick={() => setInviteStep(null)}
              className="mt-6 w-full px-6 cursor-pointer bg-[#0FA4A9] text-white py-4 hover:opacity-80 rounded-lg"
            >
              View Clients
            </button>

            <button
              onClick={() => {
                setClientEmail("");
                setAgreed(false);
                setInviteStep("email");
              }}
              className="mt-5 cursor-pointer w-full border border-[#0FA4A9]! px-6 py-4 hover:opacity-80 text-[#0FA4A9] rounded-lg"
            >
              Invite Another Client
            </button>
          </div>
        </Modal>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="py-8 text-center text-gray-500">Loading clients...</div>
      ) : (
        <ClientsTable clients={sortedClients} />
      )}
    </div>
  );
}
