"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PrivacyItem } from "@/redux/features/api/adminDashboard/GetPrivacy";

interface PrivacyViewCardProps {
  title: string;
  updatedAt: string;
  content: PrivacyItem[];
  onOpenEdit: () => void;
}

export default function PrivacyViewCard({
  title,
  updatedAt,
  content,
  onOpenEdit,
}: PrivacyViewCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border space-y-6">
      {/* Title + Last Updated */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {updatedAt ? new Date(updatedAt).toLocaleString() : "—"}
          </p>
        </div>
        {/* <Button
          onClick={onOpenEdit}
          className="bg-[#0FA4A9] hover:bg-[#0D8E92] text-white cursor-pointer"
        >
          Update Privacy Policy
        </Button> */}
      </div>

      {/* Sections */}
      {content.map((item) => (
        <div key={item.id} className="space-y-1">
          <h3 className="font-semibold text-lg">{item.heading}</h3>
          <div
            className="text-gray-600 text-sm whitespace-pre-line [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#0FA4A9] [&_blockquote]:pl-3 [&_blockquote]:italic"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </div>
      ))}
    </div>
  );
}
