// "use client";

// import React, { useState } from "react";
// import { Camera } from "lucide-react";
// import { useChangePasswordMutation } from "@/redux/features/api/SupplierDashboard/ChangePassword";
// import { toast } from "sonner";

// export default function SettingsPage() {
//   const [formData, setFormData] = useState({
//     supplierName: "John Smith",
//     email: "john.smith@example.com",
//     phoneNumber: "+1 (555) 123-4567",
//     businessName: "Premium Supplements Co.",
//     businessAddress: "",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [changePassword, { isLoading }] = useChangePasswordMutation();
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleChangePassword = async () => {
//     if (formData.newPassword !== formData.confirmPassword) {
//       toast.error("New password and confirm password do not match");
//       return;
//     }

//     try {
//       const res = await changePassword({
//         current_password: formData.currentPassword,
//         new_password: formData.newPassword,
//         new_password_confirmation: formData.confirmPassword,
//       }).unwrap();

//       toast.success(res.message);

//       setFormData((prev) => ({
//         ...prev,
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       }));
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to change password");
//     }
//   };
//   return (
//     <div className="max-w-188 mx-auto py-6 flex flex-col gap-10 pb-16">
//       <div className="bg-white rounded-3xl p-10 border border-[#D9E6FF] shadow-[0_8px_40px_rgb(0,0,0,0.03)] space-y-12">
//         {/* Personal Information */}
//         <div className="space-y-10">
//           <h2 className="text-xl font-bold text-[#041228] border-b border-[#F8FBFA] pb-6">
//             Personal Information
//           </h2>

//           {/* Profile Image */}
//           <div className="space-y-5">
//             <label className="text-base font-bold text-[#5F6F73] block">
//               Profile Image
//             </label>
//             <div className="flex items-center gap-8">
//               <div className="relative group cursor-pointer">
//                 <div className="w-32 h-32 rounded-full bg-[#5DA2F0] flex items-center justify-center text-white text-4xl font-bold shadow-sm group-hover:bg-[#4A90E2] transition-colors">
//                   SP
//                 </div>
//                 <div className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#5DA2F0] border-4 border-white flex items-center justify-center text-white group-hover:bg-[#4A90E2] transition-colors shadow-sm">
//                   <Camera size={18} fill="white" />
//                 </div>
//               </div>
//               <div className="flex flex-col gap-1">
//                 <span className="text-[#041228] font-bold text-lg leading-tight">
//                   Upload a new profile image
//                 </span>
//                 <span className="text-[#94A3B8] text-sm font-semibold uppercase tracking-wider">
//                   JPG, PNG (Max 2MB)
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 gap-10">
//             <div className="space-y-4">
//               <label className="text-[16px] font-normal text-[#041228] block leading-6">
//                 Supplier Name
//               </label>
//               <input
//                 type="text"
//                 name="supplierName"
//                 value={formData.supplierName}
//                 onChange={handleChange}
//                 className="w-full bg-white border border-[#E4EFFF] rounded-xl py-4.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] font-normal shadow-sm transition-all text-[16px] leading-6"
//               />
//             </div>

//             <div className="space-y-4">
//               <label className="text-[16px] font-normal text-[#1F2D2E] block leading-6">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full bg-white border border-[#E4EFFF] rounded-xl py-4.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] font-normal shadow-sm transition-all text-[16px] leading-6"
//               />
//             </div>

//             <div className="space-y-4">
//               <label className="text-[16px] font-normal text-[#1F2D2E] block leading-6">
//                 Phone Number
//               </label>
//               <input
//                 type="text"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 className="w-full bg-white border border-[#E4EFFF] rounded-xl py-4.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] font-normal shadow-sm transition-all text-[16px] leading-6"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Business Information */}
//         {/* <div className="space-y-10">
//           <h2 className="text-xl font-normal text-[#041228] border-b border-[#F8FBFA] pb-6">Business Information</h2>
          
//           <div className="space-y-4">
//             <label className="text-[16px] font-normal text-[#1F2D2E] block leading-[24px]">Business Name</label>
//             <input
//               type="text"
//               name="businessName"
//               value={formData.businessName}
//               onChange={handleChange}
//               className="w-full bg-white border border-[#E4EFFF] rounded-xl py-4.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] font-normal shadow-sm transition-all text-[16px] leading-[24px]"
//             />
//           </div>

//           <div className="space-y-4">
//             <label className="text-[16px] font-normal text-[#1F2D2E] block leading-[24px]">Business Address</label>
//             <textarea
//               name="businessAddress"
//               value={formData.businessAddress}
//               onChange={handleChange}
//               placeholder="Enter business address"
//               rows={5}
//               className="w-full bg-white border border-[#E4EFFF] rounded-xl py-4.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#94A3B8] font-normal shadow-sm transition-all resize-none text-[16px] leading-[24px]"
//             />
//           </div>
//         </div> */}

//         {/* Change Password */}
//         <div className="space-y-10">
//           <h2 className="text-xl font-normal text-[#041228] border-b border-[#F8FBFA] pb-6">
//             Change Password
//           </h2>

//           <div className="grid grid-cols-1 gap-10">
//             <div className="space-y-4">
//               <label className="text-[16px] font-normal text-[#1F2D2E] block leading-6">
//                 Current Password
//               </label>
//               <input
//                 type="password"
//                 name="currentPassword"
//                 value={formData.currentPassword}
//                 onChange={handleChange}
//                 placeholder="Enter current password"
//                 className="w-full bg-white border border-[#E4EFFF] rounded-xl py-4.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#94A3B8] font-normal shadow-sm transition-all text-[16px] leading-6"
//               />
//             </div>

//             <div className="space-y-4">
//               <label className="text-[16px] font-normal text-[#1F2D2E] block leading-6">
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 name="newPassword"
//                 value={formData.newPassword}
//                 onChange={handleChange}
//                 placeholder="Enter new password"
//                 className="w-full bg-white border border-[#E4EFFF] rounded-xl py-4.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#94A3B8] font-normal shadow-sm transition-all text-[16px] leading-6"
//               />
//             </div>

//             <div className="space-y-4">
//               <label className="text-[16px] font-normal text-[#1F2D2E] block leading-6">
//                 Confirm New Password
//               </label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="Confirm new password"
//                 className="w-full bg-white border border-[#E4EFFF] rounded-xl py-4.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#94A3B8] font-normal shadow-sm transition-all text-[16px] leading-6"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Save Button */}
//         <div className="pt-6">
//           <button
//             onClick={handleChangePassword}
//             disabled={isLoading}
//             className="w-full bg-[#5DA2F0] text-white py-4.5 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-[#3A86FF]/10 cursor-pointer"
//           >
//             {isLoading ? "Changing..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import { Camera, User, Eye, EyeOff } from "lucide-react";
import { useChangePasswordMutation } from "@/redux/features/api/auth/authApi";
import { useGetProfileQuery, useCreateUpdateProfileMutation } from "@/redux/features/api/profileApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } from "@/redux/features/api/userDashboard/notificationApi";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const currentUser = useSelector(selectCurrentUser);
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileQuery(currentUser?.id, { skip: !currentUser?.id });
  const [createUpdateProfile, { isLoading: isUpdatingProfile }] = useCreateUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  // Notification API
  const { data: notificationSettingsData, isLoading: isLoadingSettings } = useGetNotificationSettingsQuery();
  const [updateNotificationSettings] = useUpdateNotificationSettingsMutation();
  const [localNotificationSettings, setLocalNotificationSettings] = useState<any>(null);

  const [formData, setFormData] = useState({
    supplierName: "",
    email: "",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profile_id: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (profileData?.data) {
      const u = profileData.data;
      const p = u.profile;
      
      setFormData(prev => ({
        ...prev,
        supplierName: u?.name || currentUser?.name || "",
        email: u?.email || currentUser?.email || "",
        phoneNumber: p?.phone || "",
        profile_id: p?.id?.toString() || "",
      }));
      
      if (p?.image) {
        setImagePreview(p.image);
      }
    } else if (currentUser) {
      setFormData(prev => ({
        ...prev,
        supplierName: currentUser.name || "",
        email: currentUser.email || "",
      }));
    }
  }, [profileData, currentUser]);

  // Synchronize local notification settings state
  useEffect(() => {
    if (notificationSettingsData?.data && !localNotificationSettings) {
      setLocalNotificationSettings(notificationSettingsData.data);
    }
  }, [notificationSettingsData, localNotificationSettings]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSaveProfile = async () => {
    if (!currentUser?.id) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    try {
      const data = new FormData();
      // Only include id if it's explicitly needed/available, but user_id is the primary identifier
      if (formData.profile_id) {
        data.append("id", formData.profile_id);
      }
      
      data.append("user_id", currentUser.id.toString());
      data.append("user_type", currentUser.user_type || "professional");
      data.append("profession_type", currentUser.profession_type || "supplement_supplier");
      data.append("name", formData.supplierName);
      
      if (image) {
        data.append("image", image);
      }

      console.log("Updating profile with data:", Object.fromEntries(data.entries()));
      const res = await createUpdateProfile(data).unwrap();
      
      if (res.success) {
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
      console.error(error);
    }
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword) {
      toast.error("Please fill in current and new password");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const res = await changePassword({
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        new_password_confirmation: formData.confirmPassword,
      }).unwrap();

      toast.success(res.message || "Password changed successfully!");

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  const handleNotificationToggle = async (key: string) => {
    // Determine current and new values, defaulting to 0 if null/undefined
    const currentSettings = localNotificationSettings || {};
    const currentValue = currentSettings[key];
    const newValue = currentValue === 1 ? 0 : 1;

    // Optimistically update local state
    setLocalNotificationSettings((prev: any) => ({
      ...(prev || {}),
      [key]: newValue
    }));

    try {
      await updateNotificationSettings({
        [key]: newValue,
      }).unwrap();
      toast.success("Notification updated successfully");
    } catch (error) {
      // Revert if API fails
      setLocalNotificationSettings((prev: any) => ({
        ...prev,
        [key]: currentValue
      }));
      toast.error("Failed to update notification");
    }
  };

  const notificationItems = [
    { 
      label: "Client Messages", 
      sub: "Instant alerts when your clients write or message you.", 
      active: localNotificationSettings?.coach_messages === 1,
      key: "coach_messages"
    },
    // { 
    //   label: "Goal Updates", 
    //   sub: "Alerts when a client updates, edits, or completes their goals.", 
    //   active: localNotificationSettings?.goal_updates === 1,
    //   key: "goal_updates"
    // },
    // { 
    //   label: "Check-in & Reminder Alerts", 
    //   sub: "Reminders for scheduled client check-ins or missed logs.", 
    //   active: localNotificationSettings?.check_in_reminder_alerts === 1,
    //   key: "check_in_reminder_alerts"
    // },
    // { 
    //   label: "AI Insights & Recommendations", 
    //   sub: "Notifications when new AI-generated insights or suggestions are available.", 
    //   active: localNotificationSettings?.ai_insights === 1,
    //   key: "ai_insights"
    // },
    { 
      label: "Subscription & Account Updates", 
      sub: "Billing reminders, order updates, and important account notices.", 
      active: localNotificationSettings?.subscription_updates === 1,
      key: "subscription_updates"
    },
    // { 
    //   label: "Missed Check-in Alerts", 
    //   sub: "Alerts when clients miss their scheduled check-ins.", 
    //   active: localNotificationSettings?.missed_checkin_alerts === 1,
    //   key: "missed_checkin_alerts"
    // },
    // { 
    //   label: "Program Milestone Updates", 
    //   sub: "Notifications about program progress and milestones.", 
    //   active: localNotificationSettings?.program_milestone_updates === 1,
    //   key: "program_milestone_updates"
    // },
    { 
      label: "Weekly Summary Email", 
      sub: "Receive a weekly summary of business performance and engagement.", 
      active: localNotificationSettings?.weekly_summary_email === 1,
      key: "weekly_summary_email"
    },
    // { 
    //   label: "Auto Remind Missed Check-ins", 
    //   sub: "Automatically send reminders to clients when they miss a check-in.", 
    //   active: localNotificationSettings?.auto_remind_missed_checkins === 1,
    //   key: "auto_remind_missed_checkins"
    // },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 flex flex-col gap-10 pb-16">
      {/* Side by Side Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Personal Information */}
        <div className="bg-white rounded-3xl p-10 border border-[#D9E6FF] shadow-[0_8px_40px_rgb(0,0,0,0.03)] flex flex-col h-full">
          <div className="space-y-10 flex-1">
            <h2 className="text-xl font-bold text-[#041228] border-b border-[#F8FBFA] pb-6">
              Personal Information
            </h2>

            {/* Profile Image */}
            <div className="space-y-5">
              <label className="text-base font-bold text-[#5F6F73] block">
                Profile Image
              </label>
              <div className="flex items-center gap-8">
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-full bg-[#3A86FF] flex items-center justify-center text-white text-4xl font-bold shadow-sm group-hover:bg-blue-600 transition-colors overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <User size={48} className="text-white" />
                    )}
                  </div>
                  <label className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#3A86FF] border-4 border-white flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors shadow-sm cursor-pointer border-solid">
                    <Camera size={18} fill="white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#041228] font-bold text-lg leading-tight">
                    Upload a new profile image
                  </span>
                  <span className="text-[#94A3B8] text-sm font-semibold uppercase tracking-wider">
                    JPG, PNG (Max 2MB)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-4">
                <label className="text-[16px] font-normal text-[#041228] block leading-6">
                  Supplier Name
                </label>
                <input
                  type="text"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#E4EFFF] rounded-xl py-4.5 px-6 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] font-normal shadow-sm transition-all text-[16px] leading-6"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[16px] font-normal text-[#1F2D2E] block leading-6">
                  Email <span className="text-sm text-gray-400 ml-2">(Cannot be changed)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full bg-[#F8FAFC] border border-[#E4EFFF] rounded-xl py-4.5 px-6 focus:outline-none text-[#94A3B8] font-normal shadow-sm transition-all text-[16px] leading-6 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-10">
            <button
              onClick={handleSaveProfile}
              disabled={isUpdatingProfile}
              className="w-full bg-[#041228] text-white py-4.5 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg cursor-pointer"
            >
              {isUpdatingProfile ? "Saving Profile..." : "Save Profile Details"}
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-3xl p-10 border border-[#D9E6FF] shadow-[0_8px_40px_rgb(0,0,0,0.03)] flex flex-col h-full">
          <div className="space-y-10 flex-1">
            <h2 className="text-xl font-bold text-[#041228] border-b border-[#F8FBFA] pb-6">
              Change Password
            </h2>

            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-4">
                <label className="text-[16px] font-normal text-[#1F2D2E] block leading-6">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    className="w-full bg-white border border-[#E4EFFF] rounded-xl py-4.5 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#94A3B8] font-normal shadow-sm transition-all text-[16px] leading-6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[16px] font-normal text-[#1F2D2E] block leading-6">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-full bg-white border border-[#E4EFFF] rounded-xl py-4.5 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#94A3B8] font-normal shadow-sm transition-all text-[16px] leading-6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[16px] font-normal text-[#1F2D2E] block leading-6">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className="w-full bg-white border border-[#E4EFFF] rounded-xl py-4.5 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#94A3B8] font-normal shadow-sm transition-all text-[16px] leading-6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10">
            <button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="w-full bg-[#3A86FF] text-white py-4.5 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-[#3A86FF]/10 cursor-pointer"
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>

      </div>

      {/* Notifications Toggle Section */}
      <div className="bg-white rounded-3xl border border-[#D9E6FF] shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-[#F1F5F9]">
          <h3 className="text-xl font-bold text-[#041228]">Notifications</h3>
          <p className="text-sm text-[#5F6F73] mt-1">Manage your alert and notification preferences.</p>
        </div>
        
        <div className="px-10 py-6 divide-y divide-[#F1F5F9]">
          {isLoadingSettings && !localNotificationSettings ? (
            <div className="py-12 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#3A86FF]" size={32} />
            </div>
          ) : (
            notificationItems.map((item) => (
              <div key={item.key} className="py-6 flex items-center justify-between">
                <div className="max-w-[80%]">
                  <h4 className="text-[17px] font-bold text-[#041228]">{item.label}</h4>
                  <p className="text-[14px] text-[#5F6F73] font-medium mt-1 leading-relaxed">{item.sub}</p>
                </div>
                
                <div 
                  onClick={() => handleNotificationToggle(item.key)}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out shrink-0",
                    item.active ? "bg-[#3A86FF]" : "bg-gray-200"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out",
                    item.active ? "translate-x-6" : "translate-x-0"
                  )} />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-10 py-6 bg-[#F8FAFC]/50 border-t border-[#F1F5F9]">
          <p className="text-[13px] text-[#94A3B8] font-medium">
            Stay updated on orders, client interactions, and product feedback.
          </p>
        </div>
      </div>

    </div>
  );
}