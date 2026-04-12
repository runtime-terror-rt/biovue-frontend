"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, Eye } from "lucide-react";

export default function CoachNotes({ notes }: { notes: string[] }) {
  // Mocking dates for the notes based on the screenshot
  const mockNotes = [
    {
      text: "Discussed caloric deficit during last check-in. Alex prefers morning workouts.",
      date: "OCT 24, 2023 - 10:15 AM",
    },
    {
      text: "Lower body recovery seems slower than expected. Might need to adjust volume.",
      date: "OCT 25, 2023, 12:15 AM",
    }
  ];

  return (
    <div className="space-y-4 py-6 rounded-lg bg-white">
      <div className="flex px-6 items-center gap-2 text-[#111827]">
        <FileText size={20} className="text-[#374151]" />
        <h2 className="text-xl  font-medium text-[#111827]">Internal Coach Notes (Private)</h2>
      </div>

      <Card className="border-none">
        <CardContent className="space-y-6">
          {/* New Note Input */}
          <div className="relative">
            <textarea 
              placeholder="Add observations, preferences, or follow-up reminders..."
              className="w-full h-32 p-4 bg-[#0FA4A91A] border-none rounded-xl resize-none outline-none text-sm placeholder:text-[#9CA3AF] text-[#374151]"
            />
            <button className="absolute bottom-4 right-4 p-2 bg-[#0D9488] text-white rounded-lg hover:bg-[#0A7A6F] transition-colors">
              <Plus size={20} />
            </button>
          </div>

          {/* Previous Notes */}
          <div className="space-y-4">
            {mockNotes.map((note, index) => (
              <div
                key={index}
                className="bg-[#0FA4A91A] p-5 rounded-xl space-y-2"
              >
                <p className="text-sm text-[#374151] leading-relaxed font-medium">
                  {note.text}
                </p>
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                  {note.date}
                </p>
              </div>
            ))}
          </div>

          {/* Visibility Disclaimer */}
          <div className="flex items-center gap-2 text-[#8B5CF6] pt-2">
            <Eye size={16} />
            <span className="text-[11px] font-medium opacity-80 uppercase tracking-tight">Clients cannot see this section. Only visible to BioVue staff.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
