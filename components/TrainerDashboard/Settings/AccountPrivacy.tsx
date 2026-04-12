"use client";

import { useState } from "react";
import { Shield, User, LogOut, CheckCircle2 } from "lucide-react";
import { useChangePasswordMutation, useLogoutMutation } from "@/redux/features/api/auth/authApi";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/slice/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AccountPrivacy() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [logoutMutation] = useLogoutMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignOut = async () => {
    try {
      await logoutMutation({}).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(logout());
      router.push("/login");
    }
  };

  const handleChangePassword = async () => {
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
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-12">
      {/* Privacy & Data */}
      <div className="bg-white w-full md:w-1/3 rounded-3xl border border-[#F1F5F9] shadow-sm p-8 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#8B5CF6]">
            <Shield size={24} />
          </div>
          <h3 className="text-[18px] font-bold text-[#1E293B]">Privacy & Data</h3>
        </div>

        <div className="space-y-5 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#EAFAF1] flex items-center justify-center text-[#22C55E]">
              <CheckCircle2 size={16} />
            </div>
            <span className="text-[14px] font-medium text-[#475569]">Client data is private and encrypted</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#EAFAF1] flex items-center justify-center text-[#22C55E]">
              <CheckCircle2 size={16} />
            </div>
            <span className="text-[14px] font-medium text-[#475569]">Wellness-only (non-medical) usage</span>
          </div>
        </div>

        <div className="mt-8">
           <button 
             onClick={handleSignOut}
             className="w-full bg-[#0D9488] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
              <LogOut size={20} />
              Sign Out
           </button>
        </div>
      </div>

      {/* Account Management: Change Password */}
      <div className="bg-white w-full md:w-2/3 rounded-3xl border border-[#F1F5F9] shadow-sm p-8 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#E0F2F1] flex items-center justify-center text-[#0D9488]">
            <User size={24} />
          </div>
          <h3 className="text-[18px] font-bold text-[#1E293B]">Change Password</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 flex-1">
          <div className="space-y-3">
            <label className="text-[14px] font-bold text-[#1E293B] block">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full bg-transparent border border-[#E2E8F0] rounded-xl py-4 px-5 text-[15px] outline-none focus:border-[#0D9488] hover:border-[#CBD5E1] transition-all"
              placeholder="Enter current password"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[14px] font-bold text-[#1E293B] block">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full bg-transparent border border-[#E2E8F0] rounded-xl py-4 px-5 text-[15px] outline-none focus:border-[#0D9488] hover:border-[#CBD5E1] transition-all"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[14px] font-bold text-[#1E293B] block">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-transparent border border-[#E2E8F0] rounded-xl py-4 px-5 text-[15px] outline-none focus:border-[#0D9488] hover:border-[#CBD5E1] transition-all"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 pt-8 border-t border-[#F1F5F9]">
          <p className="text-[13px] text-[#94A3B8] font-medium flex-1">
             Ensure your new password uses a strong combination of letters, numbers, and symbols.
          </p>
          <button 
             onClick={handleChangePassword}
             disabled={isChangingPassword}
             className="w-full sm:w-fit bg-[#F8FAFC] text-[#0D9488] font-bold py-4 px-8 rounded-2xl border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-all cursor-pointer whitespace-nowrap">
            {isChangingPassword ? "Saving..." : "Save Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
