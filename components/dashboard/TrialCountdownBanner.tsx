"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import { useTrialCountdown } from "@/lib/hooks/useTrialCountdown";
import { cn } from "@/lib/utils";

export default function TrialCountdownBanner({
  settingsHref = "/user-dashboard/settings",
}: {
  settingsHref?: string;
}) {
  const { isTrial, remainingDays, totalDays } = useTrialCountdown();

  if (!isTrial || remainingDays === null) return null;

  const progress = Math.min(
    100,
    Math.max(0, ((totalDays - remainingDays) / totalDays) * 100),
  );
  const isUrgent = remainingDays <= 2;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        isUrgent
          ? "bg-[#FFF5F5] border-red-100"
          : "bg-gradient-to-r from-[#E4EFFF] to-[#E6F6F6] border-[#3A86FF]/15",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            isUrgent ? "bg-red-100 text-red-600" : "bg-white text-[#3A86FF]",
          )}
        >
          <Clock3 size={20} />
        </div>
        <div>
          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest mb-1",
              isUrgent ? "text-red-500" : "text-[#3A86FF]",
            )}
          >
            Free trial
          </p>
          <h3 className="text-lg md:text-xl font-bold text-[#1F2D2E]">
            {remainingDays <= 0
              ? "Your trial has ended"
              : `${remainingDays} ${remainingDays === 1 ? "day" : "days"} remaining`}
          </h3>
          <p className="text-sm text-[#5F6F73] mt-0.5">
            After 7 days, your selected plan will be charged to the saved card.
          </p>
          <div className="mt-3 h-1.5 w-48 max-w-full rounded-full bg-white/80 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                isUrgent ? "bg-red-500" : "bg-[#0FA4A9]",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <Link
        href={settingsHref}
        className="bg-[#0FA4A9] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all whitespace-nowrap text-center"
      >
        Manage plan
      </Link>
    </div>
  );
}
