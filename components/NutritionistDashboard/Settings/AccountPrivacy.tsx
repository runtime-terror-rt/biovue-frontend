"use client";

import { useState } from "react";
import { User, LogOut, Loader2, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useChangePasswordMutation, useLogoutMutation } from "@/redux/features/api/auth/authApi";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/slice/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import SettingsSection from "./SettingsSection";

export default function AccountPrivacy() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [logoutMutation] = useLogoutMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
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
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all password fields");
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
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="flex flex-col gap-10 mb-12">
      {/* Account Management: Change Password */}
      <SettingsSection
        title="Account Security"
        description="Manage your password and session preferences."
        action={
          <button 
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className="bg-[#0FA4A9] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-opacity-90 transition-all cursor-pointer flex items-center gap-2 shadow-sm shadow-[#0FA4A9]/20"
          >
            {isChangingPassword && <Loader2 size={16} className="animate-spin" />}
            {isChangingPassword ? "Saving..." : "Save Password"}
          </button>
        }
      >
        <div className="flex flex-col gap-10 p-6 md:p-10">
          <div className="grid grid-cols-1 gap-8">
            {/* Current Password Field */}
            <div className="space-y-3">
              <label className="text-[14px] font-bold text-[#1E293B] block">Current Password</label>
              <div className="relative group max-w-xl">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl py-4 pl-5 pr-12 text-[15px] outline-none focus:border-[#0FA4A9] focus:bg-white focus:ring-4 focus:ring-[#0FA4A9]/5 transition-all group-hover:border-[#CBD5E1]"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#94A3B8] hover:text-[#0FA4A9] transition-colors"
                  aria-label={showPasswords.current ? "Hide password" : "Show password"}
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* New Password Field */}
              <div className="space-y-3">
                <label className="text-[14px] font-bold text-[#1E293B] block">New Password</label>
                <div className="relative group">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl py-4 pl-5 pr-12 text-[15px] outline-none focus:border-[#0FA4A9] focus:bg-white focus:ring-4 focus:ring-[#0FA4A9]/5 transition-all group-hover:border-[#CBD5E1]"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#94A3B8] hover:text-[#0FA4A9] transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Field */}
              <div className="space-y-3">
                <label className="text-[14px] font-bold text-[#1E293B] block">Confirm New Password</label>
                <div className="relative group">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl py-4 pl-5 pr-12 text-[15px] outline-none focus:border-[#0FA4A9] focus:bg-white focus:ring-4 focus:ring-[#0FA4A9]/5 transition-all group-hover:border-[#CBD5E1]"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#94A3B8] hover:text-[#0FA4A9] transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0FA4A9] shadow-sm shrink-0">
               <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[#1E293B] mb-1">Password Requirements</h4>
              <p className="text-[13px] text-[#94A3B8] font-medium leading-relaxed">
                Use at least 8 characters with a mix of letters, numbers, and symbols for best security. Avoid using simple or common words.
              </p>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Danger Zone: Sign Out */}
      <div className="bg-[#FFF1F2] w-full rounded-3xl border border-red-100 shadow-sm p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-red-500 shadow-sm shrink-0">
            <LogOut size={28} />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[#1F2D2E]">Session Management</h3>
            <p className="text-sm text-red-600/70 font-medium leading-relaxed max-w-sm">
              End your current session across all devices. This will require you to log in again.
            </p>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="w-full sm:w-fit bg-white text-red-500 border border-red-200 font-bold py-3.5 px-10 rounded-2xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer shadow-sm active:scale-95">
          Sign Out
        </button>
      </div>
    </div>
  );
}
