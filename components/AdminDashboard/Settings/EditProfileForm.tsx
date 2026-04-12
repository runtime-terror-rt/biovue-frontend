"use client";

import Image from "next/image";
import { User, Mail, Lock, Camera, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useChangePasswordMutation } from "@/redux/features/api/auth/authApi";
import { useCreateUpdateProfileMutation, useGetProfileQuery } from "@/redux/features/api/profileApi";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, updateUser } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";

export default function EditProfileForm() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectCurrentUser);
  
  // Use the Redux session ID to fetch detailed profile data
  const effectiveUserId = loggedInUser?.id;
  
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(effectiveUserId || "", {
    skip: !effectiveUserId
  });
  console.log("profileData", profileData);
  const [createUpdateProfile, { isLoading: isUpdatingProfile }] = useCreateUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return "/images/avatar.png";
    if (imagePath.startsWith("http") || imagePath.startsWith("/")) return imagePath;
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${imagePath}`;
  };

  useEffect(() => {
    // If we've already initialized using the best available data (profileData), don't overwrite user edits
    if (hasInitialized && profileData?.data) return;

    // Prioritize specific profile data, then Redux
    const sourceData = profileData?.data || loggedInUser;
    
    if (sourceData) {
      const userObj = sourceData.user || sourceData;
      const profileObj = sourceData.profile || sourceData;
      
      const newName = userObj.name || "";
      const newEmail = userObj.email || "";
      const newImage = profileObj.image || sourceData.image_url || sourceData.image || null;
      
      // Only update fields if they haven't been manually touched or if we're getting fresh profile data
      if (!hasInitialized || profileData?.data) {
        setName(newName);
        setEmail(newEmail);
        setImagePreview(getImageUrl(newImage));
      }
      
      // Mark as fully initialized only when we have the specific profile data 
      // or if we have Redux data and the profile fetch is definitely not happening
      if (profileData?.data || (loggedInUser && !isProfileLoading && !effectiveUserId)) {
        setHasInitialized(true);
      }
    }
  }, [profileData, loggedInUser, hasInitialized, isProfileLoading, effectiveUserId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    const user = loggedInUser;
    if (!user?.id) {
      toast.error("User ID not found");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user.id.toString());
    formData.append("user_type", user.user_type || "admin");
    formData.append("name", name);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const res = await createUpdateProfile(formData).unwrap();
      if (res.success) {
        toast.success(res.message || "Profile updated successfully");
        
        // Correctly handle the nested response data
        const updatedUserRaw = res.data?.user || res.data;
        const profileDataRaw = res.data?.profile || res.data;
        
        const finalizedName = updatedUserRaw.name || name;
        const finalizedImage = profileDataRaw.image || updatedUserRaw.image_url || updatedUserRaw.image;

        if (finalizedName) setName(finalizedName);
        if (finalizedImage) {
          setImagePreview(getImageUrl(finalizedImage));
        }

        const userDataToStore = {
          ...updatedUserRaw,
          image: finalizedImage
        };
        dispatch(updateUser(userDataToStore));
        
        setSelectedFile(null); // Clear selected file after success
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const res = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      }).unwrap();
      
      if (res.success) {
        toast.success(res.message || "Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  const handleSaveChanges = async () => {
    const user = loggedInUser;
    const isProfileChanged = name !== user?.name || selectedFile !== null;
    const isPasswordAttempted = !!(currentPassword || newPassword || confirmPassword);

    if (isProfileChanged) {
      await handleUpdateProfile();
    }
    
    if (isPasswordAttempted) {
      await handleChangePassword();
    }

    if (!isProfileChanged && !isPasswordAttempted) {
      toast.info("No changes to save");
    }
  };

  if (isProfileLoading && !hasInitialized) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-[#4F46E5]" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#F1F5F9] p-8 md:p-12 mb-8">
      <h3 className="text-lg md:text-2xl font-bold text-[#1E293B] mb-10">
        Edit Profile
      </h3>

      <div className="flex flex-col items-center mb-12">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
            <Image
              src={imagePreview || "/images/avatar.png"}
              alt="Admin Profile"
              width={128}
              height={128}
              className="object-cover w-full h-full"
              unoptimized={true}
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 bg-[#4F46E5] text-white p-2 rounded-full border-4 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer"
          >
            <Camera size={18} />
          </button>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 text-[#4F46E5] font-bold text-sm hover:underline cursor-pointer"
        >
          Upload New Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#374151] uppercase tracking-wide">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <User size={18} />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Anderson"
              className="w-full bg-slate-50 border border-slate-200 cursor-not-allowed text-[#1E293B] pl-12 pr-4 py-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-not focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#374151] uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={email}
              readOnly
              placeholder="john.anderson@example.com"
              className="w-full bg-slate-100 border border-slate-200 text-[#64748B] pl-12 pr-4 py-4 rounded-xl text-sm font-medium focus:outline-none cursor-not-allowed transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#374151] uppercase tracking-wide">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <Lock size={18} />
            </div>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full bg-slate-50 border border-slate-200 text-[#1E293B] pl-12 pr-4 py-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#374151] uppercase tracking-wide">
            New Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <Lock size={18} />
            </div>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-slate-50 border border-slate-200 text-[#1E293B] pl-12 pr-4 py-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#374151] uppercase tracking-wide">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <Lock size={18} />
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-slate-50 border border-slate-200 text-[#1E293B] pl-12 pr-4 py-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button 
          onClick={() => {
            const sourceData = profileData?.data || loggedInUser;
            const profileObj = sourceData?.profile || sourceData;
            setName(sourceData?.name || "");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setImagePreview(getImageUrl(profileObj?.image));
            setSelectedFile(null);
          }}
          disabled={isUpdatingProfile || isChangingPassword}
          className="px-8 py-3.5 rounded-xl border border-slate-200 text-[#1E293B] font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleSaveChanges}
          disabled={isUpdatingProfile || isChangingPassword}
          className="px-8 py-3.5 rounded-xl bg-linear-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-80 text-white font-bold text-sm shadow-md active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {(isUpdatingProfile || isChangingPassword) && <Loader2 size={16} className="animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
