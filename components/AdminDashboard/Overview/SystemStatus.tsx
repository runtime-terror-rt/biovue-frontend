
"use client";

import React from "react";

export default function SystemStatus() {
  return (
    <div className="bg-white rounded-xl border-2 border-[#F3F4F6]! p-6">
      <p className="text-sm font-medium mb-4">System Status</p>

      {[
        "Plan Wise Summary",
        "Subscription Billing",
        "Payments",
        "Data Sync",
      ].map((item) => (
        <div key={item} className="flex justify-between py-2 text-sm">
          <span>{item}</span>
          <span className="text-green-500">OPERATIONAL</span>
        </div>
      ))}
    </div>
  );
}
