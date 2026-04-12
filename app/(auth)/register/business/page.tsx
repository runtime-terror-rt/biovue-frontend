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
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/api/auth/authApi";
import { toast } from "sonner";
import { User } from "lucide-react";

/**
 * BusinessRegister Component
 * Redesigned for a compact, zero-scroll experience with a 2-column grid layout.
 */
const BusinessRegister = () => {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    professionType: "trainer_coach",
    zipcode: "",
    prof_service_type: "local",
    acceptTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
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
      role: "professional",
      terms_accepted: formData.acceptTerms,
      user_type: "professional",
      profession_type: formData.professionType,
      zipcode: formData.zipcode,
      prof_service_type: formData.prof_service_type,
    };

    try {
      const res = await register(payload).unwrap();
      if (res?.success || res?.status === "success") {
        toast.success(
          res?.message || "Registration successful! Please verify your OTP.",
        );
          router.push(`/register-otp-verify?email=${formData.email}`);
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message ??
        "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-150 mx-auto py-3">
      {/* Logo at the top */}
      <div className="mb-2">
        <Image
          src="/images/logo.png"
          alt="BioVue Logo"
          width={120}
          height={50}
          className="object-contain"
          priority
        />
      </div>

      {/* Main Card */}
      <div className="w-full bg-white rounded-3xl p-4 md:p-6 border border-[#D9E6FF] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Back Button */}
        <div className="flex justify-center mb-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-[#3A86FF] hover:opacity-80 transition-opacity font-bold text-sm tracking-wider uppercase"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            Back to account type
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-3xl md:text-[32px] font-bold text-[#041228] mb-2">
            Create Your Account
          </h1>
          <p className="text-[#98A2B3] text-lg">
            Setting up your professional profile.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228] block ml-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                <User size={22} strokeWidth={1.5} />
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#5F6F73] transition-colors cursor-pointer"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#5F6F73] transition-colors cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff size={22} strokeWidth={1.5} />
                ) : (
                  <Eye size={22} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Profession Type */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228] block ml-1">
              Select Profession Type
            </label>
            <div className="relative">
              <select
                name="professionType"
                value={formData.professionType}
                onChange={handleChange}
                className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#98A2B3] font-medium appearance-none cursor-pointer"
              >
                <option value="trainer_coach">trainer_coach</option>
                <option value="nutritionist">nutritionist</option>
                <option value="supplement_supplier">
                  supplement_supplier
                </option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] pointer-events-none">
                <ChevronDown size={22} />
              </span>
            </div>
          </div>

          {/* Zip Code and Service Type Row */}
          <div className="flex gap-4">
            {/* Zip Code */}
            <div className="space-y-2 flex-1">
              <label className="text-sm font-bold text-[#041228] block ml-1">
                Zip Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  placeholder="12345"
                  className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#98A2B3] font-medium"
                  required
                />
              </div>
            </div>

            {/* Service Type */}
            <div className="space-y-2 flex-1">
              <label className="text-sm font-bold text-[#041228] block ml-1">
                Service Type
              </label>
              <div className="relative">
                <select
                  name="prof_service_type"
                  value={formData.prof_service_type}
                  onChange={handleChange}
                  className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#98A2B3] font-medium appearance-none cursor-pointer"
                >
                  <option value="local">Local</option>
                  <option value="remote">Remote</option>
                  <option value="both">Both</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] pointer-events-none">
                  <ChevronDown size={20} />
                </span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-3 mt-2">
            <input
              id="terms"
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-5 h-5 accent-[#0FA4A9] border-[#E5E9EA] rounded-md cursor-pointer"
              required
            />
            <label
              htmlFor="terms"
              className="text-[15px] text-[#041228] font-bold"
            >
              I agree to the{" "}
              <span className="text-[#3A86FF] cursor-pointer hover:underline">
                Terms & Privacy Policy
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#0FA4A9]/10 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? "Creating Account..." : "Continue"}
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
        <div className="mt-2 text-center">
          <p className="text-[#041228] text-[15px] font-bold">
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

export default BusinessRegister;
