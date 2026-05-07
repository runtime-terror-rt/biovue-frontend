"use client";

import React, { useState } from "react";
import { useGetMySchedulesQuery, Schedule } from "@/redux/features/api/userDashboard/GetMySchedules";
import { useGetRemindersQuery, Reminder } from "@/redux/features/api/TrainerDashboard/Calendar/GetReminder";
import {
  Calendar,
  Clock,
  Bell,
  AlertCircle,
  Loader2,
  Quote,
  Activity,
  User,
  CalendarDays,
  X,
  Eye,
  CalendarCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatDate = (
  date: string | Date,
  formatStr: "EEEE, MMM d" | "MMM d" | "full",
) => {
  const d = new Date(date);
  if (formatStr === "EEEE, MMM d") {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }
  if (formatStr === "full") {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const SchedulePage = () => {
  const { data: schedulesData, isLoading: isSchedulesLoading } = useGetMySchedulesQuery();
  const { data: remindersData, isLoading: isRemindersLoading } = useGetRemindersQuery();

  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const schedules = schedulesData?.data || [];
  const reminders = (remindersData?.data || []).slice(-5).reverse();

  const getReminderIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "habit":
        return <Activity className="w-5 h-5 text-blue-500" />;
      case "motivation":
        return <Quote className="w-5 h-5 text-[#0FA4A9]" />;
      default:
        return <Bell className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
            Completed
          </Badge>
        );
      case "scheduled":
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none">
            Scheduled
          </Badge>
        );
      case "missed":
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">
            Missed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">
            {status}
          </Badge>
        );
    }
  };

  if (isSchedulesLoading || isRemindersLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#0FA4A9]" />
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[#1F2D2E]">
          Your Schedule & Reminders
        </h2>
        <p className="text-[#5F6F73]">
          Keep track of your training sessions and daily reminders.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Upcoming Schedules Table Section */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-[#0FA4A9]" />
            <h3 className="text-xl font-bold text-[#1F2D2E]">
              Upcoming Check-ins
            </h3>
          </div>

          <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
            {schedules.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                    <Calendar size={40} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[#1F2D2E]">
                      No upcoming schedules
                    </h4>
                    <p className="text-[#5F6F73]">
                      Your trainer hasn&apos;t scheduled any check-ins yet.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-[#F8FBFA]">
                  <TableRow className="border-b border-gray-50 hover:bg-transparent">
                    <TableHead className="font-bold text-[#1F2D2E] h-14">Date</TableHead>
                    <TableHead className="font-bold text-[#1F2D2E] h-14">Time</TableHead>
                    <TableHead className="font-bold text-[#1F2D2E] h-14">Status</TableHead>
                    <TableHead className="font-bold text-[#1F2D2E] h-14">Scheduled By</TableHead>
                    <TableHead className="font-bold text-[#1F2D2E] h-14 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id} className="border-b border-gray-50 hover:bg-[#F8FBFA]/50 transition-colors">
                      <TableCell className="py-4 font-medium text-[#1F2D2E]">
                        {formatDate(schedule.schedule_date, "MMM d")}
                      </TableCell>
                      <TableCell className="py-4 text-[#5F6F73] font-medium">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[#0FA4A9]" />
                          {schedule.schedule_time}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(schedule.status)}
                      </TableCell>
                      <TableCell className="py-4 text-[#5F6F73] font-medium">
                        <div className="flex items-center gap-2">
                        
                          {schedule.trainer.name}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <button
                          onClick={() => setSelectedSchedule(schedule)}
                          className="p-2 cursor-pointer hover:bg-[#0FA4A9]/10 rounded-full text-[#0FA4A9] transition-all"
                        >
                          <Eye size={18} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Reminders Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#0FA4A9]" />
            <h3 className="text-xl font-bold text-[#1F2D2E]">
              Last 5 Reminders
            </h3>
          </div>

          {reminders.length === 0 ? (
            <Card className="border-none shadow-sm bg-white p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-gray-50 rounded-full text-gray-400">
                  <Bell size={24} />
                </div>
                <p className="text-[#5F6F73] text-sm font-medium">
                  No active reminders
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  onClick={() => setSelectedReminder(reminder)}
                  className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#0FA4A9]/30 transition-all group cursor-pointer"
                >
                  <div className="shrink-0 p-3 bg-[#E4FBFA] rounded-xl group-hover:scale-110 transition-transform h-fit">
                    {getReminderIcon(reminder.reminder_type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#9AAEB2] uppercase tracking-widest">
                        {reminder.reminder_type}
                      </span>
                      <span className="text-[10px] text-[#9AAEB2]">
                        {formatDate(reminder.created_at, "MMM d")}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#1F2D2E] leading-relaxed">
                      {reminder.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          
        </div>
      </div>

      {/* Reminder Details Modal */}
      {selectedReminder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-[#F8FBFA]/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-[#0FA4A9]">
                  {getReminderIcon(selectedReminder.reminder_type)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1F2D2E]">
                    Reminder Details
                  </h3>
                  <p className="text-xs text-[#9AAEB2] font-bold uppercase tracking-widest">
                    {selectedReminder.reminder_type}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReminder(null)}
                className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9AAEB2] uppercase tracking-[0.2em]">
                  Message from Trainer
                </label>
                <p className="text-lg font-medium text-[#1F2D2E] leading-relaxed italic">
                  "{selectedReminder.message}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#9AAEB2] uppercase tracking-[0.2em]">
                    Sent On
                  </label>
                  <p className="text-sm font-bold text-[#5F6F73]">
                    {formatDate(selectedReminder.created_at, "full")}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#9AAEB2] uppercase tracking-[0.2em]">
                    Delivery
                  </label>
                  <div className="flex gap-2 mt-1">
                    {selectedReminder.in_app === 1 && (
                      <Badge className="bg-blue-50 text-blue-600 border-none px-2 py-0 text-[10px]">
                        IN-APP
                      </Badge>
                    )}
                    {selectedReminder.push_notification === 1 && (
                      <Badge className="bg-purple-50 text-purple-600 border-none px-2 py-0 text-[10px]">
                        PUSH
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedReminder(null)}
                className="w-full bg-[#1F2D2E] cursor-pointer hover:opacity-80 text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-gray-200 mt-4"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Details Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-[#F8FBFA]/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl shadow-sm text-[#0FA4A9]">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1F2D2E]">Schedule Details</h3>
                  <p className="text-xs text-[#9AAEB2] font-bold uppercase tracking-widest">
                    {selectedSchedule.check_in_type}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#9AAEB2] uppercase tracking-[0.2em]">Date</label>
                  <p className="text-base font-bold text-[#1F2D2E]">
                    {formatDate(selectedSchedule.schedule_date, "EEEE, MMM d")}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#9AAEB2] uppercase tracking-[0.2em]">Time</label>
                  <p className="text-base font-bold text-[#1F2D2E]">
                    {selectedSchedule.schedule_time}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#9AAEB2] uppercase tracking-[0.2em]">Status</label>
                  <div>{getStatusBadge(selectedSchedule.status)}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#9AAEB2] uppercase tracking-[0.2em]">Trainer</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
                      {selectedSchedule.trainer.profile?.image ? (
                        <Image
                          src={selectedSchedule.trainer.profile.image}
                          alt={selectedSchedule.trainer.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <User className="text-gray-400" size={20} />
                      )}
                    </div>
                    <p className="text-base font-bold text-[#1F2D2E]">
                      {selectedSchedule.trainer.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#9AAEB2] uppercase tracking-[0.2em]">Check-in Type</label>
                <p className="text-sm font-medium text-[#5F6F73] capitalize">
                  {selectedSchedule.check_in_type.replace(/_/g, ' ')}
                </p>
              </div>

              <button
                onClick={() => setSelectedSchedule(null)}
                className="w-full cursor-pointer hover:opacity-80 bg-[#0FA4A9] text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-[#0FA4A9]/20 mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
