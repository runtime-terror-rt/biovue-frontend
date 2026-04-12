"use client";

import React, { useState, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/redux/features/api/auth/authApi";
import { toast } from "sonner";

const RegisterOTPVerifyContent = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "yourmail@gmail.com";
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [resendCooldown, setResendCooldown] = useState(0);

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    try {
      const res = await resendOtp({ email }).unwrap();
      toast.success(res?.message || "OTP resent successfully!");
      setResendCooldown(60);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    // Get pasted data, keep only digits, slice to 5
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 5);

    if (!pastedData) return;

    const newOtp = [...otp];
    const pasteChars = pastedData.split("");

    pasteChars.forEach((char, index) => {
      if (index < 5) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);

    // Focus the last index that was filled
    const lastPastedIndex = Math.min(pasteChars.length - 1, 4);
    inputRefs.current[lastPastedIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 5) {
      toast.error("Please enter the 5-digit code.");
      return;
    }

    try {
      const res = await verifyOtp({ email, otp: otpValue }).unwrap();
      if (res?.success || res?.status === "success") {
        toast.success(res?.message || "Verification successful!");
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      {/* Back Button - Top Left */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10">
        <Link
          href="/register"
          className="w-10 h-10 border border-[rgba(58,134,255,0.5)] rounded-lg flex items-center justify-center hover:bg-blue-50 transition-all bg-white shadow-sm"
        >
          <ChevronLeft size={24} />
        </Link>
      </div>
      <div className="relative flex flex-col items-center justify-center bg-[#F4FBFA] px-6 min-h-screen py-12 overflow-hidden">
        <div className="w-full max-w-[550px] flex flex-col items-center">
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

          {/* Outer White Card */}
          <div className="w-full bg-white rounded-2xl p-8 md:p-12 shadow-[0_4px_24px_rgba(58,134,255,0.04)] text-center">
            <h1 className="text-xl md:text-2xl font-bold text-[#041228] mb-2 px-4 leading-tight">
              Enter the code we sent to <br />
              <span className="text-[#041228]">{email}</span>
            </h1>
            <p className="text-[#98A2B3] text-sm md:text-base font-medium mb-8">
              We sent 5 digit code to your email address.
            </p>

            {/* Inner OTP Card */}
            <div className="w-full bg-white rounded-xl p-6 md:p-8 border border-[rgba(58,134,255,0.5)] shadow-sm mb-10 text-center">
              <h2 className="text-lg font-bold text-[#041228] mb-4">
                OTP Required
              </h2>
              <p className="text-[#98A2B3] text-xs md:text-sm font-medium mb-8 px-2 leading-relaxed">
                Enter the 5 digits OTP code we've sent{" "}
                <br className="hidden md:block" />
                in your email address
              </p>

              {/* OTP Inputs */}
              <div className="flex justify-center gap-2 md:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    onPaste={handlePaste}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-10 md:w-14 md:h-14 bg-[#F5F5F5] border-none rounded-lg md:rounded-xl text-center text-lg md:text-xl font-bold text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#3A86FF1A] placeholder:text-[#98A2B3]"
                    placeholder={digit === "" ? "-" : ""}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-[#0FA4A9] text-white py-3 md:py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#0FA4A9]/10 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify"}
              {!isLoading && (
                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </button>

            {/* Resend OTP */}
            <p className="text-[#98A2B3] text-sm mt-6">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isResending}
                className="text-[#0FA4A9] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isResending
                  ? "Sending..."
                  : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend OTP"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegisterOTPVerifyPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F4FBFA]">Loading...</div>}>
      <RegisterOTPVerifyContent />
    </Suspense>
  );
};

export default RegisterOTPVerifyPage;
