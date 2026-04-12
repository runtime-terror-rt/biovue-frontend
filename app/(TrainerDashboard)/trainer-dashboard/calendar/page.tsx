"use client";

import { useGetSchedulesQuery } from "@/redux/features/api/TrainerDashboard/Calendar/GetSchedule";
import FilterDropdown from "@/components/TrainerDashboard/calendar/FilterDropdown";
import WeeklyCalendar from "@/components/TrainerDashboard/calendar/WeeklyCalendar";
import DashboardHeading from "@/components/common/DashboardHeading";
import SendReminderModal from "@/components/TrainerDashboard/calendar/SendReminderModal";
import ScheduleCheckinModal from "@/components/TrainerDashboard/calendar/ScheduleCheckinModal";
import EventDetailsModal from "@/components/TrainerDashboard/calendar/EventDetailsModal";
import RescheduleEventModal from "@/components/TrainerDashboard/calendar/RescheduleEventModal";
import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import { useState } from "react";
import { useUpdateScheduleMutation } from "@/redux/features/api/TrainerDashboard/Calendar/CreateSchedule";

export type CalendarEventStatus = "missed" | "scheduled" | "completed";

export interface CalendarEvent {
  id: number;
  client_id: number;
  name: string;
  title: string;
  time: string;
  status: CalendarEventStatus;
  avatar?: string;
  date?: string;
  privateNote?: string;
}

export default function CalendarPage() {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [openClientFilter, setOpenClientFilter] = useState(false);
  const [openTypeFilter, setOpenTypeFilter] = useState(false);

  const [selectedClient, setSelectedClient] = useState("All Clients");
  const [selectedType, setSelectedType] = useState("All Types");

  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const views: Array<"day" | "week" | "month"> = ["day", "week", "month"];

  // Helpers
  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return { start, end };
  };

  const { start, end } = getWeekRange(currentDate);

  // Format date for API (YYYY-MM-DD)
  const formattedStartDate = formatDateLocal(start);

  const { data: scheduleData, isLoading, isError } = useGetSchedulesQuery();

  const formatRange = (s: Date, e: Date) =>
    `${s.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} ${e.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} -`;

  const changeWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleRescheduleConfirm = () => {
    setIsRescheduleOpen(false);
  };

  const handleSendReminderFromDetails = () => {
    setIsEventDetailsOpen(false);
    setIsReminderOpen(true);
  };

  const handleRescheduleFromDetails = () => {
    setIsEventDetailsOpen(false);
    setIsRescheduleOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <DashboardHeading
          heading="Calendar"
          subheading="Manage check-ins, workouts, and reminders"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsReminderOpen(true)}
            className="flex px-5 py-2.5 text-sm font-medium cursor-pointer border border-[#E2E8F0] bg-white text-[#475569] rounded-xl hover:bg-gray-50 items-center gap-2 transition-all shadow-sm"
          >
            <Plus size={16} /> <span>Add Reminder</span>
          </button>
          <button
            onClick={() => setIsCheckinOpen(true)}
            className="flex px-5 py-2.5 text-sm font-medium cursor-pointer bg-[#0D9488] text-white rounded-xl hover:bg-[#0B7A70] items-center gap-2 transition-all shadow-sm"
          >
            <Plus size={16} /> <span>Schedule Check-in</span>
          </button>
        </div>
      </div>

      {/* Top Controls */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-[#F1F5F9]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2">
          {/* View Toggle */}
          <div className="bg-[#E0F2F1]  flex-1 md:flex-none px-8 py-2.5 text-sm  capitalize transition-all font-semiboldtext-[#64748B] rounded-lg p-1 flex items-center w-full md:w-auto">
            <p>Your Schedules</p>
          </div>

          {/* Date Navigation + Filters */}
          <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
            {/* Date Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeWeek("prev")}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors text-[#64748B]"
              >
                <ChevronLeft className="w-5 h-5 cursor-pointer" />
              </button>

              <span className="text-[15px] font-semibold text-[#1E293B] whitespace-nowrap min-w-50 text-center">
                {formatRange(start, end)}
              </span>

              <button
                onClick={() => changeWeek("next")}
                className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors text-[#64748B]"
              >
                <ChevronRight className="w-5 h-5 cursor-pointer" />
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-3 relative w-full md:w-auto">
              {/* Client Filter */}
              <button
                onClick={() => {
                  setOpenClientFilter((v) => !v);
                  setOpenTypeFilter(false);
                }}
                className="flex flex-1 md:flex-none items-center justify-center gap-2 border border-[#E2E8F0] px-5 py-2.5 rounded-xl bg-white text-sm font-medium text-[#475569] hover:bg-gray-50 transition-all shadow-sm"
              >
                <Filter className="w-4 h-4 text-[#94A3B8]" />
                {selectedClient}
              </button>

              {/* Type Filter */}
              <button
                onClick={() => {
                  setOpenTypeFilter((v) => !v);
                  setOpenClientFilter(false);
                }}
                className="flex flex-1 md:flex-none items-center justify-center gap-2 border border-[#E2E8F0] px-5 py-2.5 rounded-xl bg-white text-sm font-medium text-[#475569] hover:bg-gray-50 transition-all shadow-sm"
              >
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <div className="h-0.5 w-4 bg-[#94A3B8]"></div>
                  <div className="h-0.5 w-4 bg-[#94A3B8]"></div>
                  <div className="h-0.5 w-4 bg-[#94A3B8]"></div>
                </div>
                {selectedType}
              </button>

              {openClientFilter && <FilterDropdown type="client" />}
              {openTypeFilter && <FilterDropdown type="type" />}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#F1F5F9] overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#64748B] font-medium">Loading schedules...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <p className="text-[#EF4444] font-bold text-lg">
              Error loading schedules
            </p>
            <p className="text-[#64748B]">
              Please try refreshing the page or contact support.
            </p>
          </div>
        ) : (
          <WeeklyCalendar
            startDate={start}
            schedules={scheduleData?.data}
            onEventClick={handleEventClick}
            onAddCheckin={() => setIsCheckinOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      <SendReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
      />
      <ScheduleCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
      />
      <EventDetailsModal
        isOpen={isEventDetailsOpen}
        onClose={() => setIsEventDetailsOpen(false)}
        event={selectedEvent}
        onSendReminder={handleSendReminderFromDetails}
        onReschedule={handleRescheduleFromDetails}
      />
      <RescheduleEventModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        event={selectedEvent}
        onConfirm={handleRescheduleConfirm}
      />
    </div>
  );
}
