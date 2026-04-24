"use client";

import { CalendarEvent } from "@/app/(TrainerDashboard)/trainer-dashboard/calendar/page";
import { ScheduleItem } from "@/redux/features/api/TrainerDashboard/Calendar/GetSchedule";
import Image from "next/image";
import { Calendar as CalendarIcon, Plus } from "lucide-react";

interface Props {
  currentDate: Date;
  onEventClick: (event: CalendarEvent) => void;
  onAddCheckin: (date: string) => void;
  schedules?: ScheduleItem[];
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthlyCalendar({
  currentDate,
  onEventClick,
  onAddCheckin,
  schedules = [],
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Create array of days to display (including padding from prev/next months)
  const days = [];
  
  // Padding for previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      month: month - 1,
      year: year,
      isCurrentMonth: false,
    });
  }

  // Days for current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true,
    });
  }

  // Padding for next month to complete the row
  const remainingDays = 42 - days.length; // 6 rows of 7
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      month: month + 1,
      year: year,
      isCurrentMonth: false,
    });
  }

  const formatDateLocal = (y: number, m: number, d: number) => {
    const formattedDate = new Date(y, m, d);
    const YY = formattedDate.getFullYear();
    const MM = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const DD = String(formattedDate.getDate()).padStart(2, '0');
    return `${YY}-${MM}-${DD}`;
  };

  const isToday = (y: number, m: number, d: number) => {
    const today = new Date();
    return today.getDate() === d && today.getMonth() === m && today.getFullYear() === y;
  };

  return (
    <div className="flex flex-col h-full border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
        {dayNames.map((day) => (
          <div key={day} className="py-4 text-center border-r border-gray-100 last:border-r-0">
            <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">{day}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 flex-1 bg-gray-100/30">
        {days.map((dateObj, i) => {
          const dateString = formatDateLocal(dateObj.year, dateObj.month, dateObj.day);
          const daySchedules = schedules.filter(s => s.schedule_date?.startsWith(dateString));
          
          return (
            <div
              key={i}
              className={`min-h-32 p-2 border-r border-b border-gray-100 bg-white group hover:bg-gray-50/50 transition-colors relative ${
                !dateObj.isCurrentMonth ? "bg-gray-50/20" : ""
              }`}
            >
              {/* Day Number */}
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                  isToday(dateObj.year, dateObj.month, dateObj.day)
                    ? "bg-[#0D9488] text-white"
                    : dateObj.isCurrentMonth
                      ? "text-gray-700"
                      : "text-gray-300"
                }`}>
                  {dateObj.day}
                </span>
                <button
                  onClick={() => onAddCheckin(dateString)}
                  className="opacity-0 group-hover:opacity-100 p-1 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Events List */}
              <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                {daySchedules.slice(0, 3).map((schedule) => (
                  <button
                    key={schedule.id}
                    onClick={() => onEventClick({
                      id: schedule.id,
                      client_id: schedule.client_id,
                      name: schedule.client?.name || "Unknown Client",
                      title: schedule.check_in_type || "Check-in",
                      time: (schedule.schedule_time || "00:00").slice(0, 5),
                      date: schedule.schedule_date,
                      privateNote: schedule.private_note || "",
                      status: ((schedule.status || "scheduled").toLowerCase() as any),
                      avatar: schedule.client?.image_url || schedule.client?.profile?.image || undefined
                    })}
                    className={`w-full text-left px-2 py-1 rounded text-[10px] font-bold truncate transition-all border ${
                      schedule.status.toLowerCase() === 'missed'
                        ? "bg-red-50 text-red-600 border-red-100"
                        : schedule.status.toLowerCase() === 'completed'
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100 font-extrabold"
                          : "bg-[#F3E8FF] text-[#A855F7] border-[#E9D5FF]"
                    } hover:scale-105 active:scale-95`}
                  >
                    <span className="mr-1 opacity-60">{(schedule.schedule_time || "").slice(0, 5)}</span>
                    {schedule.check_in_type || "Check-in"}
                  </button>
                ))}
                {daySchedules.length > 3 && (
                  <p className="text-[9px] font-bold text-gray-400 text-center mt-1">
                    + {daySchedules.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
