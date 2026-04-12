"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegisterMutation } from "@/redux/features/api/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const IndividualRegister = () => {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      role: "individual",
      terms_accepted: formData.acceptTerms,
      user_type: "individual",
      profession_type: "",
    };

    try {
      const res = await register(payload).unwrap();
      if (res?.success || res?.status === "success") {
        toast.success(res?.message || "Registration successful! Please verify your OTP.");
        router.push(`/register-otp-verify?email=${formData.email}`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[500px] mx-auto py-5">
      {/* Logo at the top */}
      <div className="mb-8">
        <Image
          src="/images/logo.png"
          alt="BioVue Logo"
          width={150}
          height={60}
          className="object-contain"
          priority
        />
      </div>

      {/* Main Card */}
      <div className="w-full bg-white rounded-xl p-8 border border-[rgba(58,134,255,0.5)] shadow-[0_4px_24px_rgba(58,134,255,0.04)]">
        {/* Back Button */}
        <div className="flex justify-center mb-6">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-[#3A86FF] hover:opacity-80 transition-opacity font-bold text-xs tracking-wider uppercase"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Back to account type
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#041228] mb-3">
            Create Your Account
          </h1>
          <p className="text-[#98A2B3] text-lg font-medium">
            Setting up your individual profile.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228] block ml-1">
              Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                <User size={22} strokeWidth={1.5} />{" "}
                {/* Make sure you import the User icon */}
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Georgia Young"
                className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#98A2B3] font-medium"
                required
              />
            </div>
          </div>
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228] block ml-1">
              Email address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                <Mail size={22} strokeWidth={1.5} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="georgia.young@example.com"
                className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#98A2B3] font-medium"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228] block ml-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                <Lock size={22} strokeWidth={1.5} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="•••••"
                className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#98A2B3] font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#5F6F73] transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={22} strokeWidth={1.5} />
                ) : (
                  <Eye size={22} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228] block ml-1">
              Confirm password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                <Lock size={22} strokeWidth={1.5} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="•••••"
                className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#98A2B3] font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#5F6F73] transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff size={22} strokeWidth={1.5} />
                ) : (
                  <Eye size={22} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-3 ml-1 mt-4">
            <input
              id="terms"
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-4 h-4 text-[#3A86FF] border-[#E5E9EA] rounded-md focus:ring-[#3A86FF] cursor-pointer"
              required
            />
            <label
              htmlFor="terms"
              className="text-sm text-[#041228] font-medium"
            >
              I agree to the{" "}
              <span className="text-[#3A86FF] cursor-pointer hover:underline">
                Terms & Privacy Policy
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#0FA4A9]/10 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registering..." : "Continue"}
              {!isLoading && (
                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-[#041228] text-sm font-semibold">
            Already have an account?{" "}
            <Link href="/login" className="text-[#3A86FF] hover:underline ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndividualRegister;
