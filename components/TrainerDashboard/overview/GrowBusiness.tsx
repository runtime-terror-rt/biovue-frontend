"use client";

import { Button } from "@/components/ui/button";

export default function GrowBusiness() {
  return (
    <div className="bg-[#0D9488] rounded-lg p-5 text-white">
      <div className="">
        <h3 className="text-2xl font-medium mb-2">Grow your business</h3>
        <p className="text-teal-50 mb-6 text-base leading-relaxed">
          Explore rew wellness programs to your clients and scale your coaching
          practice with proven methodologies.
        </p>
        <Button className="bg-white w-full text-[#0D9488] hover:bg-gray-100 font-medium cursor-pointer">
          Explore Programs
        </Button>
      </div>
    </div>
  );
}
