import { poppins } from "@/app/font";
import Sidebar from "@/components/Sidebar";
import TrainerNavbar from "@/components/TrainerDashboard/TrainerNavbar";
import { Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function TrainerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["professional"]} allowedProfessions={["trainer_coach"]}>
      <div className={`flex min-h-screen bg-[#F4FBFA] ${poppins.className}`}>
        {/* Sidebar */}
        <Suspense fallback={<div className="w-20 md:w-65 border-r border-gray-200" />}>
        <Sidebar role="trainer" />
      </Suspense>

      {/* Right side */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar */}
        <TrainerNavbar />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
