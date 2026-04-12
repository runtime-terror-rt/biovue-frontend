"use client";

import { Clock, FileText } from "lucide-react";
import Image from "next/image";

interface Props {
  title: string;
  name: string;
  time: string;
  status: "missed" | "scheduled" | "completed";
  avatar?: string;
  onClick?: () => void;
  date?: string;
  privateNote?: string;
}

export default function CalendarCard({
  title,
  name,
  time,
  date,
  status,
  avatar,
  onClick,
  privateNote,
}: Props) {
  const statusConfig = {
    missed: {
      badge: "bg-[#FEE2E2] text-[#EF4444]",
      label: "Missed",
    },
    scheduled: {
      badge: "bg-[#F3E8FF] text-[#A855F7]",
      label: "Scheduled",
    },
    completed: {
      badge: "bg-[#DCFCE7] text-[#22C55E]",
      label: "Completed",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      onClick={onClick}
      className="rounded-2xl border border-[#CCFBF1] bg-white overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="border-l-[6px] border-[#0FA4A9] p-4 flex flex-col h-full">
        {/* Status Badge */}
        <div className="flex justify-between items-start mb-2">
          <div className="bg-[#F0FDFD] p-2 rounded-lg text-[#0D9488]">
            <Clock size={16} />
          </div>
          <div
            className={`px-3 py-1 rounded-full text-[11px] font-bold ${config.badge}`}
          >
            {config.label}
          </div>
        </div>

        {/* Date */}
        {date && (
          <p className="text-[12px] text-[#64748B] font-medium mb-1">
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        )}

        {/* Title */}
        <h4 className="text-[15px] font-bold text-[#1E293B] mb-2 leading-tight line-clamp-2">
          {title}
        </h4>

        {/* Client Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-7 h-7">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#0FA4A9] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <p className="text-[13px] text-[#475569] font-medium truncate">{name}</p>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between mt-auto gap-2">
          {/* Time */}
          {time && (
            <div className="flex items-center gap-1 text-[12px] text-[#64748B] font-semibold whitespace-nowrap">
              <Clock className="w-3.5 h-3.5" />
              <span>{time}</span>
            </div>
          )}

          {/* Note Indicator */}
          {privateNote && (
            <div className="flex items-center gap-1 text-[11px] bg-[#FFFBEB] text-[#D97706] px-2 py-0.5 rounded-md border border-[#FEF3C7]" title="Has trainer notes">
              <FileText size={12} />
              <span>Note</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
