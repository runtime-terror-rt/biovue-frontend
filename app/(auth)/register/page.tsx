"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SelectAccountTypeContent = () => {
  const [selectedType, setSelectedType] = useState<"individual" | "business" | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan_id");

  const handleNext = () => {
    const query = planId ? `?plan_id=${planId}` : "";
    if (selectedType === "individual") {
      router.push(`/register/individual${query}`);
    } else if (selectedType === "business") {
      router.push(`/register/business${query}`);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      {/* Logo */}
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

      {/* Title */}
      <h1 className="text-3xl md:text-[32px] font-bold text-[#041228] mb-3">
        How will you use BioVue?
      </h1>
      <p className="text-[#98A2B3] text-lg mb-12">
        Choose the account type that best fits your needs.
      </p>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
        {/* Individual Card */}
        <div
          onClick={() => setSelectedType("individual")}
          className={cn(
            "cursor-pointer bg-white rounded-xl p-8 border-2 transition-all duration-200 flex flex-col items-center",
            selectedType === "individual"
              ? "border-[#3A86FF] shadow-[0_0_20px_rgba(58,134,255,0.1)]"
              : "border-transparent hover:border-gray-200"
          )}
        >
          <div className="w-14 h-14 rounded-xl bg-[#E4EFFF] flex items-center justify-center mb-6">
            <User className="text-[#3A86FF]" size={28} />
          </div>
          <h3 className="text-xl font-bold text-[#041228] mb-2">Individual</h3>
          <p className="text-[#98A2B3] text-center leading-relaxed">
            I want to track my wellness and improve my health
          </p>
        </div>

        {/* Business Card */}
        <div
          onClick={() => setSelectedType("business")}
          className={cn(
            "cursor-pointer bg-white rounded-xl p-8 border-2 transition-all duration-200 flex flex-col items-center",
            selectedType === "business"
              ? "border-[#3A86FF] shadow-[0_0_20px_rgba(58,134,255,0.1)]"
              : "border-transparent hover:border-gray-200"
          )}
        >
          <div className="w-14 h-14 rounded-xl bg-[#E4EFFF] flex items-center justify-center mb-6">
            <Building2 className="text-[#3A86FF]" size={28} />
          </div>
          <h3 className="text-xl font-bold text-[#041228] mb-2">Business</h3>
          <p className="text-[#98A2B3] text-center leading-relaxed">
            I&apos;m a coach, trainer, or wellness professional
          </p>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!selectedType}
        className={cn(
          "flex items-center gap-2 bg-[#0FA4A9] text-white px-16 py-4 rounded-xl font-bold transition-all cursor-pointer",
          !selectedType ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90 shadow-lg hover:shadow-xl"
        )}
      >
        Next
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default function SelectAccountType() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectAccountTypeContent />
    </Suspense>
  );
}
