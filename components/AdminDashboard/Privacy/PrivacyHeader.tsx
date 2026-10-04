"use client";

import React from "react";
import { Plus } from "lucide-react";
import DashboardHeading from "@/components/common/DashboardHeading";
import { Button } from "@/components/ui/button";

interface PrivacyHeaderProps {
  hasPolicy: boolean;
  onOpenModal: () => void;
}

export default function PrivacyHeader({
  onOpenModal,
}: PrivacyHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <DashboardHeading heading="Privacy Policy" />

      <Button
        onClick={onOpenModal}
        className="bg-[#0FA4A9] hover:bg-[#0D8E92] text-white flex items-center gap-2 cursor-pointer"
      >
        <Plus size={16} /> Update Privacy Policy
      </Button>
    </div>
  );
}
