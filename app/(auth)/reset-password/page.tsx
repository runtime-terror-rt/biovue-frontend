"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useResetPasswordMutation } from "@/redux/features/api/auth/authApi";
import { toast } from "sonner";

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  
  const [formData, setFormData] = useState({
    new_password: "",
    new_password_confirmation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.new_password_confirmation) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await resetPassword({
        email,
        new_password: formData.new_password,
        new_password_confirmation: formData.new_password_confirmation,
      }).unwrap();
      
      if (res?.success || res?.status === "success") {
        toast.success(res?.message || "Password reset successfully!");
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[500px] mx-auto py-10">
      {/* Logo Container */}
      <div className="mb-12">
        <Image
          src="/images/logo.png"
          alt="BioVue Logo"
          width={150}
          height={60}
          className="object-contain"
          priority
        />
      </div>

      <div className="w-full bg-white rounded-xl p-8 border border-[rgba(58,134,255,0.5)] shadow-[0_4px_24px_rgba(58,134,255,0.04)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#041228] mb-3">
            Reset Password
          </h1>
          <p className="text-[#98A2B3] text-lg font-medium">
            Set your new password for <br />
            <span className="text-[#041228] font-bold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228] block ml-1">
              New Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                <Lock size={22} strokeWidth={1.5} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#5F6F73] transition-colors"
              >
                {showPassword ? <EyeOff size={22} strokeWidth={1.5} /> : <Eye size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228] block ml-1">
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                <Lock size={22} strokeWidth={1.5} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="new_password_confirmation"
                value={formData.new_password_confirmation}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#5F6F73] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={22} strokeWidth={1.5} /> : <Eye size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0FA4A9] text-white py-3 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#0FA4A9]/10 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
              {!isLoading && <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F4FBFA]">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
