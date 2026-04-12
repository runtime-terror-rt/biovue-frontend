"use client";

import { useGetAllUsersForSupplierQuery } from "@/redux/features/api/SupplierDashboard/AllUsers";
import ClientTable from "@/components/SupplierDashboard/ClientTable";
import { Loader2, Users } from "lucide-react";

export default function SupplierClientPage() {
  const { data, isLoading, isError } = useGetAllUsersForSupplierQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-[#0FA4A9] animate-spin" strokeWidth={1.5} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full border-2 border-[#0FA4A9]/20" />
          </div>
        </div>
        <p className="text-lg font-bold text-[#0FA4A9] animate-pulse">
          Fetching Clients...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="w-24 h-24 bg-red-50 rounded-[32px] flex items-center justify-center border-2 border-red-100 mb-2">
          <Users className="w-10 h-10 text-red-500 opacity-80" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#041228] mb-2">Sync Failed</h2>
          <p className="text-[#94A3B8] max-w-sm mx-auto font-medium">
            We couldn&apos;t load the client directory. Please check your connection or try again later.
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#0FA4A9] hover:bg-[#0D9488] text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#0FA4A9]/20 cursor-pointer active:scale-95"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const users = data ?? [];

  return (
    <div className="mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumb / Section Title */}
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-white rounded-2xl border border-[#D9E6FF] shadow-sm">
          <Users className="text-[#0FA4A9]" size={24} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#041228] tracking-tight">Clients</h1>
          <p className="text-sm font-bold text-[#94A3B8] uppercase tracking-widest">Directory & AI Insights</p>
        </div>
      </div>

      <ClientTable users={users} />
    </div>
  );
}
