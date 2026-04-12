"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { useGetProfileQuery, useCreateUpdateProfileMutation } from "@/redux/features/api/profileApi";
import { User, Plus, Loader2 } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { toast } from "sonner";

export default function ProfilePreferences() {
  const currentUser = useSelector(selectCurrentUser);
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileQuery(currentUser?.id, { skip: !currentUser?.id });
  const [createUpdateProfile, { isLoading: isUpdatingProfile }] = useCreateUpdateProfileMutation();

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (profileData?.data) {
      setName(profileData.data.name || "");
      if (profileData.data.profile?.image) {
        setImagePreview(profileData.data.profile.image);
      }
    }
  }, [profileData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!currentUser?.id) return;

    try {
      const formData = new FormData();
      if (profileData?.data?.profile?.id) {
        formData.append("id", profileData.data.profile.id.toString());
      }
      formData.append("user_id", currentUser.id.toString());
      formData.append("user_type", "professional");
      formData.append("name", name);
      
      if (image) {
        formData.append("image", image);
      }

      const res = await createUpdateProfile(formData).unwrap();
      if (res.success) {
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
      console.error(error);
    }
  };

  return (
    <SettingsSection
      title="Profile & Preferences"
      action={
        <button 
          onClick={handleSaveChanges}
          disabled={isUpdatingProfile}
          className="text-[#8746E7] font-bold text-sm hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-2"
        >
          {isUpdatingProfile && <Loader2 size={14} className="animate-spin" />}
          Save Changes
        </button>
      }
    >
      <div className="flex flex-col gap-8 p-3 md:p-6">
        {/* Trainer Details */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#F1F5F9] bg-gray-50 flex items-center justify-center">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={name || "Trainer"}
                  fill
                  className="object-cover"
                />
              ) : (
                <User size={40} className="text-[#94A3B8]" />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#8746E7] rounded-full border-2 border-white flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
               <Plus size={16} />
               <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#94A3B8]">
              Trainer Details
            </p>
            <h4 className="text-[17px] font-bold text-[#1E293B]">
              {name || "Coach"}
            </h4>
            <p className="text-[13px] text-[#94A3B8] font-medium">
              {currentUser?.email}
            </p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-white border border-[#E2E8F0] px-5 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#8746E7] transition-all"
            />
          </div>
        </div>

        <p className="text-[#8746E7] italic text-[13px] font-medium">
          Note: This information is visible to your clients and helps personalize their coaching experience.
        </p>
      </div>
    </SettingsSection>
  );
}
