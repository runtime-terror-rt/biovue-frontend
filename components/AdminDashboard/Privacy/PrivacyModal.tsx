"use client";

import React from "react";
import { X, Plus } from "lucide-react";
import WordEditor from "@/components/AdminDashboard/WordEditor";
import { SectionItem } from "./types";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onTitleChange: (val: string) => void;
  sections: SectionItem[];
  onAddSection: () => void;
  onRemoveSection: (id: number | string) => void;
  onUpdateSection: (
    id: number | string,
    field: "title" | "content",
    value: string,
  ) => void;
  onSave: () => void;
  isLoading: boolean;
}

export default function PrivacyModal({
  isOpen,
  onClose,
  title,
  onTitleChange,
  sections,
  onAddSection,
  onRemoveSection,
  onUpdateSection,
  onSave,
  isLoading,
}: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Update Privacy Policy</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Page Title
          </label>
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full border p-2 rounded-lg"
            placeholder="Enter page title"
          />
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((sec, index) => (
            <div key={sec.id} className="border p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between gap-2">
                <input
                  placeholder={`Section ${index + 1} Title`}
                  value={sec.title}
                  onChange={(e) =>
                    onUpdateSection(sec.id, "title", e.target.value)
                  }
                  className="w-full border p-2 rounded"
                />
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveSection(sec.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 cursor-pointer shrink-0"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Word-like Customizable Description */}
              <WordEditor
                value={sec.content}
                onChange={(val) => onUpdateSection(sec.id, "content", val)}
                placeholder={`Section ${index + 1} Description`}
                minHeight="140px"
              />
            </div>
          ))}

          {/* Add Section Button */}
          <button
            type="button"
            onClick={onAddSection}
            className="flex items-center gap-2 text-blue-600 font-semibold cursor-pointer"
          >
            <Plus size={16} /> Add Section
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isLoading}
            className="px-4 py-2 bg-[#0FA4A9] text-white rounded-lg cursor-pointer disabled:opacity-50 font-semibold"
          >
            {isLoading ? "Updating..." : "Update Privacy"}
          </button>
        </div>
      </div>
    </div>
  );
}
