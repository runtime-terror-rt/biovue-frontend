"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  sub: string;
}

export default function StatCard({ title, value, sub }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-[#F3F4F6]! space-y-3 p-5">
      <p className="text-base text-[#8C9094]">{title}</p>
      <p className="text-2xl font-semibold ">{value}</p>
      <p className="text-sm text-[#5F6F73] ">{sub}</p>
    </div>
  );
}
