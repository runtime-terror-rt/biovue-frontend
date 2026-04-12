"use client";

import { useState, useRef } from "react";
import { X, Upload, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { useBulkUploadProductsMutation } from "@/redux/features/api/SupplierDashboard/Product/BulkProduct";

interface BulkUploadModalProps {
  onClose: () => void;
}

export function BulkUploadModal({ onClose }: BulkUploadModalProps) {
  const [bulkUploadProducts, { isLoading }] = useBulkUploadProductsMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".xlsx")) {
        toast.error("Please select a valid XLSX file.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.name.endsWith(".xlsx")) {
        toast.error("Please select a valid XLSX file.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an XLSX file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await bulkUploadProducts(formData).unwrap();
      toast.success("Products uploaded successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Bulk upload failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-[480px] relative flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 text-[#94A3B8] hover:text-[#041228] transition-colors bg-[#F8FBFA] p-2 rounded-full cursor-pointer"
          onClick={onClose}
          type="button"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-[#041228]">
            Bulk Upload Products
          </h2>
          <p className="text-sm text-[#94A3B8]">
            Upload an XLSX file to add multiple products at once
          </p>
        </div>

        {/* Drop Zone */}
        <div
          className="border-2 border-dashed border-[#D9E6FF] rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#14A4A9] hover:bg-[#F0FAFA] transition-all"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-[#E6F7F7] flex items-center justify-center">
                <FileSpreadsheet size={28} className="text-[#14A4A9]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#041228]">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-xs text-red-500 hover:underline cursor-pointer"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-[#E4F0FF] flex items-center justify-center">
                <Upload size={28} className="text-[#3A86FF]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#041228]">
                  Drop your XLSX file here, or{" "}
                  <span className="text-[#14A4A9]">browse</span>
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Supports .xlsx files only
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-white border border-[#E4EFFF] text-[#041228] py-3.5 rounded-xl font-medium text-sm hover:bg-[#F8FBFA] transition-all cursor-pointer disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isLoading || !selectedFile}
            className="flex-1 bg-[#14A4A9] text-white py-3.5 rounded-xl font-medium text-sm hover:bg-[#129399] transition-all shadow-lg shadow-[#14A4A9]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
