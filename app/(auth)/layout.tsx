import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4FBFA] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}
