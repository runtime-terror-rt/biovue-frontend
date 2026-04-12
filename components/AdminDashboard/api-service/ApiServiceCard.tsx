"use client";

import React from "react";
import { Zap, Key} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiServiceCardProps {
  api: {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    status: "Active" | "Maintenance";
  };
  onGetKey: (id: string) => void;
}

const ApiServiceCard: React.FC<ApiServiceCardProps> = ({ api, onGetKey }) => {
  const Icon = api.icon;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-100/50 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${api.color.concat("15")} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-8 h-8 ${api.color.replace("bg-", "text-")}`} />
        </div>
        <div className="flex items-center gap-2">
          {api.status === "Active" ? (
             <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               Live
             </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
               <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
               Maint
             </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
          {api.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {api.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex -space-x-2">
           <Zap className="w-4 h-4 text-amber-400 opacity-50" />
        </div>
        <Button
          onClick={() => onGetKey(api.id)}
          disabled={api.status !== "Active"}
          className="h-9 px-4 cursor-pointer bg-[#0FA4A9] hover:bg-[#0FA4A9] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-teal-600/20 active:scale-95 transition-all"
        >
          <Key className="w-3.5 h-3.5" />
          Get Key
        </Button>
      </div>

      {/* Background Glow */}
      <div className={`absolute -z-10 inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl rounded-2xl ${api.color}`}></div>
    </div>
  );
};

export default ApiServiceCard;
