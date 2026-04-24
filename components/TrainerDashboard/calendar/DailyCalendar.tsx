"use client";

import { CalendarEvent } from "@/app/(TrainerDashboard)/trainer-dashboard/calendar/page";
import { ScheduleItem } from "@/redux/features/api/TrainerDashboard/Calendar/GetSchedule";
import CalendarCard from "./CalendarCard";
import { Calendar, Clock } from "lucide-react";

interface Props {
  date: Date;
  onEventClick: (event: CalendarEvent) => void;
  schedules?: ScheduleItem[];
}

export default function DailyCalendar({
  date,
  onEventClick,
  schedules = [],
}: Props) {
  const formatDateLocal = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateString = formatDateLocal(date);
  const todaysSchedules = schedules.filter((s) => {
    if (!s.schedule_date) return false;
    return s.schedule_date.startsWith(dateString);
  }).sort((a, b) => (a.schedule_time || "00:00").localeCompare(b.schedule_time || "00:00"));

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
        <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
          <Calendar size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">
             Schedule for {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h3>
        <span className="ml-auto text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            {todaysSchedules.length} {todaysSchedules.length === 1 ? 'Event' : 'Events'}
        </span>
      </div>

      {todaysSchedules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysSchedules.map((schedule) => (
            <CalendarCard
              key={schedule.id}
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
                schedule.client?.image_url ||
                schedule.client?.profile?.image ||
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
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                <Clock size={32} />
            </div>
            <h4 className="text-lg font-semibold text-gray-600 mb-1">No schedules for today</h4>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Take a break or schedule a new check-in using the buttons above.
            </p>
        </div>
      )}
    </div>
  );
}
