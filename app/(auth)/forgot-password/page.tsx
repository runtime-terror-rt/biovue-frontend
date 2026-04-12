"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ChevronLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/redux/features/api/auth/authApi";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      if (res?.success || res?.status === "success") {
        toast.success(res?.message || "Password reset link sent to your email!");
        router.push(`/reset-password?email=${email}`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send reset link. Please try again.");
    }
  };

  return (

    <div>

      <div className="absolute top-6 left-6 md:top-10 md:left-10">
        <Link 
          href="/login" 
          className="w-10 h-10 border border-[#3A86FF40] rounded-md flex items-center justify-center  hover:bg-blue-50 transition-all bg-white shadow-sm"
        >
          <ChevronLeft size={24} />
        </Link>
      </div>

      <div className="relative  flex flex-col items-center justify-center bg-[#F4FBFA] px-6 overflow-hidden">
      {/* Back Button - Top Left */}
      

      <div className="w-full max-w-[500px] flex flex-col items-center">
        {/* Logo Container */}
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
        <div className="w-full bg-white rounded-xl p-8 md:p-10 border border-[rgba(58,134,255,0.2)] shadow-[0_4px_24px_rgba(58,134,255,0.04)]">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#041228] mb-4">
              Recover Password
            </h1>
            <p className="text-[#98A2B3] text-sm md:text-base leading-relaxed font-medium">
              Once verified, the next time you log in, you'll be required to enter the verification code.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-3">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="georgia.young@example.com"
                  className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#98A2B3] font-medium"
                  required
                />
              </div>
            </div>

            {/* Verify Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0FA4A9] text-white py-3 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#0FA4A9]/10 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Verify"}
                {!isLoading && <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default ForgotPasswordPage;
