"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { Ad, AdFormData } from "./data";
import { useCreateAdMutation, useUpdateAdMutation } from "@/redux/features/api/adminDashboard/ads";
import { toast } from "sonner";

interface AddEditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDone: () => void;
  existingBanner?: Ad | null;
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#0FA4A9]" : "bg-gray-300"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

const defaultForm: AdFormData = {
  ads_title: "",
  ads_type: "Banner",
  image: null,
  placement: [],
  start_date: "",
  end_date: "",
  status: true,
};

export default function AddEditBannerModal({
  isOpen,
  onClose,
  onSaveDone,
  existingBanner,
}: AddEditBannerModalProps) {
  const isEdit = !!existingBanner;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createAd, { isLoading: isCreating }] = useCreateAdMutation();
  const [updateAd, { isLoading: isUpdating }] = useUpdateAdMutation();

  const [formData, setFormData] = useState<AdFormData>(defaultForm);
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    if (existingBanner) {
      setFormData({
        ads_title: existingBanner.ads_title,
        ads_type: existingBanner.ads_type || "Banner",
        placement: existingBanner.placement ? existingBanner.placement.split(",").map(s => s.trim()) : [],
        start_date: existingBanner.start_date,
        end_date: existingBanner.end_date,
        status: existingBanner.status === 1 || existingBanner.status === true,
        image: null,
      });
      setPreviewImage(existingBanner.image || "");
    } else {
      setFormData(defaultForm);
      setPreviewImage("");
    }
  }, [existingBanner, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const togglePlacement = (place: string) => {
    setFormData((prev) => ({
      ...prev,
      placement: prev.placement.includes(place)
        ? prev.placement.filter((p) => p !== place)
        : [...prev.placement, place],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEdit && !formData.image) {
      toast.error("Please upload an image for the banner.");
      return;
    }

    const fd = new FormData();
    fd.append("ads_title", formData.ads_title);
    fd.append("ads_type", formData.ads_type);
    if (formData.image) {
      if (formData.image.size > 2 * 1024 * 1024) {
        toast.error("Image size exceeds 2MB limit. Please choose a smaller file.");
        return;
      }
      fd.append("image", formData.image, formData.image.name);
    }
    fd.append("placement", formData.placement.length > 0 ? formData.placement.join(", ") : "Home Screen Top");
    fd.append("start_date", formData.start_date);
    fd.append("end_date", formData.end_date);
    // Explicitly leaving out "status" as it's not in the Postman payload and could be failing validation

    try {
      if (isEdit && existingBanner) {
        // Just standard POST with ID
        fd.append("id", existingBanner.id.toString());
        await updateAd({ id: existingBanner.id, formData: fd }).unwrap();
        toast.success("Ad updated successfully");
      } else {
        await createAd(fd).unwrap();
        toast.success("Ad created successfully");
      }
      onSaveDone();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data?.errors?.image?.[0] || "Failed to save ad");
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#9AAEB2]">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Banner" : "Add New Banner"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6 ">
          {/* BASIC INFO */}
          <div>
            <p className="text-base font-semibold tracking-widest text-[#5E5E5E] uppercase mb-3">
              Basic Info
            </p>

            {/* Title */}
            <div className="mb-4">
              <div className="flex items-center gap-1 mb-1">
                <h2 className="text-sm">Banner Title</h2>
              </div>
              <input
                type="text"
                value={formData.ads_title}
                onChange={(e) =>
                  setFormData({ ...formData, ads_title: e.target.value })
                }
                placeholder="e.g. Summer Wellness Campaign 2024"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0FA4A9] bg-[#F9F5FE]"
                required
              />
            </div>

            {/* Banner Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Type
              </label>
              <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded-lg overflow-hidden">
                {(["Banner", "Internal Fallback"] as const).map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, ads_type: type })}
                      className={`py-2.5 text-sm cursor-pointer font-medium transition-colors ${
                        formData.ads_type === type
                          ? "bg-[#0FA4A926] text-black border border-[#0FA4A9]"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-[#0FA4A9]"
                      }`}
                    >
                      {type}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* MEDIA UPLOAD */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-[#99A1AF] uppercase mb-3">
              Media Upload
            </p>
            <div
              className="border-2 border-[#46ECD5] rounded-xl overflow-hidden cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Upload prompt */}
              <div className="flex flex-col items-center justify-center py-4 gap-1">
                <div className="w-10 h-10 rounded-full bg-[#0FA4A9] flex items-center justify-center">
                  <Upload size={18} className="text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-400">
                  SVG, PNG, JPG or MP4 (max. 10Mb)
                </p>
              </div>

              {/* Preview */}
              {previewImage && (
                <div className="mx-3 mb-3 rounded-lg overflow-hidden h-36">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/mp4"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* PLACEMENT */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#99A1AF] uppercase mb-3">
              Placement
            </p>
            <div className="space-y-2.5">
              {["Home Screen Top", "Free Dashboard"].map((place) => (
                <label
                  key={place}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.placement.includes(place)}
                    onChange={() => togglePlacement(place)}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                      formData.placement.includes(place)
                        ? "bg-[#a10fa9] border-[#0FA4A9]"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {formData.placement.includes(place) && (
                      <svg
                        className="w-3 h-3 text-[#a10fa9]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{place}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SCHEDULE */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Schedule
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0FA4A9] bg-[#F9F5FE]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0FA4A9] bg-[#F9F5FE]"
                  required
                />
              </div>
            </div>
          </div>

          {/* SETTINGS */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Settings
            </p>

            {/* Active Status */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Active Status
                </p>
                <p className="text-xs text-gray-400">
                  Enable or disable this banner immediately
                </p>
              </div>
              <Toggle
                checked={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t border-[#9AAEB2]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-5 py-2 flex items-center gap-2 bg-[#0FA4A9] text-white rounded-lg text-sm hover:bg-[#0d9297] transition-colors font-medium disabled:opacity-70"
            >
              {(isCreating || isUpdating) && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Update Banner" : "Save Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
