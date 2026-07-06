import { poppins } from "@/app/font";
import Sidebar from "@/components/Sidebar";
import NutritionistNavbar from "@/components/NutritionistDashboard/NutritionistNavbar";
import { Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NutritionistDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["professional"]} allowedProfessions={["nutritionist"]}>
      <div className={`flex min-h-screen bg-[#F4FBFA] ${poppins.className}`}>
        {/* Sidebar */}
        <Suspense fallback={<div className="w-20 md:w-65 border-r border-gray-200" />}>
        <Sidebar role="nutritionist" />
      </Suspense>

      {/* Right side */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar */}
        <NutritionistNavbar />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
