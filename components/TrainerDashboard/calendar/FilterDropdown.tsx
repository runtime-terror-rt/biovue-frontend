"use client";

import { Code2 } from "lucide-react";

export default function FiltersDropdown({
  type,
}: {
  type: "client" | "type";
}) {
  return (
    <div className="absolute top-16 right-0 bg-white border-2 border-[#3B82F6] rounded-xl w-64 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <h3 className="text-[17px] font-bold text-[#3B82F6] capitalize">
            {type === "client" ? "All cleints" : "All Types"}
          </h3>
          <Code2 className="w-5 h-5 text-[#3B82F6]" />
        </div>
        
        {type === "client" ? (
          <ul className="space-y-4">
            {["All Clients", "Alex Johnson", "Sarah Miller", "Marcus Chen", "Elena Rodriguez"].map((client) => (
              <li key={client} className="text-[15px] font-medium text-[#475569] hover:text-[#3B82F6] cursor-pointer transition-colors text-center pb-1">
                {client}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-4">
            {["All Status", "Scheduled", "Completed", "Missed"].map((status) => (
              <li key={status} className="text-[15px] font-medium text-[#475569] hover:text-[#3B82F6] cursor-pointer transition-colors text-center pb-1">
                {status}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-[#3F3A3A] h-8 w-full mt-2"></div>
    </div>
  );
}