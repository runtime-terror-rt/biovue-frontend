"use client";

import { CalendarEvent } from "@/app/(TrainerDashboard)/trainer-dashboard/calendar/page";
import { ScheduleItem } from "@/redux/features/api/TrainerDashboard/Calendar/GetSchedule";
import CalendarCard from "./CalendarCard";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  startDate: Date;
  onEventClick: (event: CalendarEvent) => void;
  onAddCheckin: () => void;
  schedules?: ScheduleItem[];
}

export default function WeeklyCalendar({
  startDate,
  onEventClick,
  onAddCheckin,
  schedules = [],
}: Props) {
  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  // Group schedules by day of the week (0-6)
  const schedulesByDay = dates.map((date) => {
    const dateString = formatDateLocal(date);
    return schedules.filter((s) => {
      if (!s.schedule_date) return false;
      // Handle both "2024-03-15" and "2024-03-15T..." formats
      return s.schedule_date.startsWith(dateString);
    });
  });

  // Find the maximum number of events in any single day to determine how many rows we need
  const maxEvents = Math.max(...schedulesByDay.map((s) => s.length), 1);

  return (
    <div className="border border-[#F1F5F9] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-[#F1F5F9] bg-[#F8FAFC]">
        {days.map((day, i) => (
          <div
            key={day}
            className="py-6 text-center border-r border-[#F1F5F9] last:border-r-0"
          >
            <p className="text-[13px] font-medium text-[#64748B] mb-1">{day}</p>
            <p className="text-xl font-bold text-[#1E293B]">
              {dates[i].getDate()}
            </p>
          </div>
        ))}
      </div>

      {/* Body - Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-[#F1F5F9]">
        {/* Render rows dynamically based on the maximum number of events in a day */}
        {Array.from({ length: maxEvents }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="contents">
            {schedulesByDay.map((daySchedules, colIndex) => {
              const schedule = daySchedules[rowIndex];
              if (schedule) {
                return (
                  <div key={schedule.id} className="bg-white p-4 min-h-55">
                    <CalendarCard
                      title={schedule.check_in_type || "Check-in"}
                      name={schedule.client?.name || "Unknown Client"}
                      date={schedule.schedule_date}
                      time={(schedule.schedule_time || "00:00").slice(0, 5)}
                      privateNote={schedule.private_note || ""}
                      status={
                        (schedule.status.toLowerCase() as
                          | "missed"
                          | "scheduled"
                          | "completed") || "scheduled"
                      }
                      avatar={
                        schedule.client.image_url ||
                        schedule.client.profile?.image ||
                        undefined
                      }
                      onClick={() =>
                        onEventClick({
                          id: schedule.id,
                          client_id: schedule.client_id,
                          name: schedule.client?.name || "Unknown Client",
                          title: schedule.check_in_type || "Check-in",
                          time: (schedule.schedule_time || "00:00").slice(0, 5),
                          date: schedule.schedule_date,
                          privateNote: schedule.private_note || "",
                          status:
                            ((schedule.status || "scheduled").toLowerCase() as
                              | "missed"
                              | "scheduled"
                              | "completed") || "scheduled",
                          avatar:
                            schedule.client?.image_url ||
                            schedule.client?.profile?.image ||
                            undefined,
                        })
                      }
                    />
                  </div>
                );
              }
              return (
                <EmptyCell
                  key={`empty-${colIndex}-${rowIndex}`}
                  onClick={onAddCheckin}
                />
              );
            })}
          </div>
        ))}

        {/* If no schedules at all, ensure at least one empty row shows */}
        {schedules.length === 0 &&
          Array.from({ length: 7 }).map((_, i) => (
            <EmptyCell key={`empty-initial-${i}`} onClick={onAddCheckin} />
          ))}
      </div>
    </div>
  );
}

function EmptyCell({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 min-h-55 flex items-center justify-center text-[#CBD5E1] text-3xl font-light hover:bg-[#F8FAFC] cursor-pointer transition-colors"
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all">
        +
      </div>
    </div>
  );
}
