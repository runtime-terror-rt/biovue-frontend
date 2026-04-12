"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { useGetProfileQuery, useCreateUpdateProfileMutation } from "@/redux/features/api/profileApi";
import { User, Plus, Loader2, Camera, Mail } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
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
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

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

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[#0FA4A9]" size={32} />
      </div>
    );
  }

  return (
    <SettingsSection
      title="Profile & Preferences"
      description="Manage your professional identity and coaching details."
      action={
        <button 
          onClick={handleSaveChanges}
          disabled={isUpdatingProfile}
          className="bg-[#0FA4A9] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-opacity-90 transition-all cursor-pointer flex items-center gap-2 shadow-sm shadow-[#0FA4A9]/20"
        >
          {isUpdatingProfile && <Loader2 size={16} className="animate-spin" />}
          {isUpdatingProfile ? "Saving..." : "Save Changes"}
        </button>
      }
    >
      <div className="flex flex-col gap-10 p-6 md:p-10">
        {/* Profile Identity Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="relative group self-start">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] overflow-hidden border-4 border-white ring-1 ring-gray-100 shadow-lg bg-gray-50 flex items-center justify-center transition-transform hover:scale-[1.02]">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={name || "Nutritionist"}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              ) : (
                <User size={48} className="text-[#94A3B8]" />
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0FA4A9] rounded-2xl border-4 border-white flex items-center justify-center text-white cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-md">
               <Camera size={20} />
               <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-bold text-[#1F2D2E]">
                {name || "Professional"}
              </h4>
              <span className="bg-[#F0FDFA] text-[#0FA4A9] text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                Nutritionist
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#5F6F73] font-medium">
              <Mail size={16} />
              <p className="text-sm">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
          <div className="space-y-3">
            <label className="text-[14px] font-bold text-[#1E293B] block">
              Full Name
            </label>
            <div className="relative group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] px-6 py-4 rounded-2xl text-[15px] font-medium focus:outline-none focus:border-[#0FA4A9] focus:bg-white focus:ring-4 focus:ring-[#0FA4A9]/5 transition-all outline-none"
              />
            </div>
            <p className="text-[12px] text-[#94A3B8] font-medium">
              This name will be visible to your clients and on your profile reports.
            </p>
          </div>
        </div>

        {/* Help Tip */}
        <div className="bg-[#F0FDFA] p-5 rounded-2xl border border-[#CCFBF1] flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#0FA4A9] shadow-sm shrink-0">
             <Plus size={18} className="rotate-45" />
          </div>
          <p className="text-[#0D9488] text-[13px] font-medium leading-relaxed">
            Personalizing your profile helps build trust with your clients. Make sure to use a clear, professional photo for your avatar.
          </p>
        </div>
      </div>
    </SettingsSection>
  );
}
