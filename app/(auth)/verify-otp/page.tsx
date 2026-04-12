"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

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

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Verifying OTP:", otp.join(""));
  // };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Always redirect, no OTP checks
  router.push("/personalize-journey");
};

  return (
    <div>
      {/* Back Button - Top Left */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10">
        <Link
          href="/forgot-password"
          className="w-10 h-10 border border-[rgba(58,134,255,0.5)] rounded-lg flex items-center justify-center  hover:bg-blue-50 transition-all bg-white shadow-sm"
        >
          <ChevronLeft size={24} />
        </Link>
      </div>
      <div className="relative flex flex-col items-center justify-center bg-[#F4FBFA] px-6 overflow-hidden">
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
            <h1 className="text-xl md:text-2xl font-bold text-[#041228] mb-2 px-4">
              Enter the code we sent to <br />
              <span className="text-[#041228]">yourmail@gmail.com</span>
            </h1>
            <p className="text-[#98A2B3] text-sm md:text-base font-medium mb-8">
              We sent 5 digit code to your email address.
            </p>

            {/* Inner OTP Card */}
            <div className="w-full bg-white rounded-xl p-6 md:p-8 border border-[rgba(58,134,255,0.5)] shadow-sm mb-10">
              <h2 className="text-lg font-bold text-[#041228] mb-4">
                OTP Required
              </h2>
              <p className="text-[#98A2B3] text-xs md:text-sm font-medium mb-8 px-2 leading-relaxed">
                Enter the 5 digits OTP code we've sent{" "}
                <br className="hidden md:block" />
                in your number yourmail@gmail.com
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
                    className="w-10 h-10 md:w-14 md:h-14 bg-[#F5F5F5] border-none rounded-lg md:rounded-xl text-center text-base md:text-lg font-bold text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#3A86FF1A] placeholder:text-[#98A2B3]"
                    placeholder={digit === "" ? "-" : ""}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            
            <button
              onClick={handleSubmit}
              className="w-full bg-[#0FA4A9] text-white py-3 md:py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#0FA4A9]/10 cursor-pointer"
            >
              Verify
              <ArrowRight
                size={22}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
