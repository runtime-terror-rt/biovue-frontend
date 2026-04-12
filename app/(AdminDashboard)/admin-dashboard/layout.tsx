import { poppins } from "@/app/font";
import AdminNavbar from "@/components/AdminDashboard/AdminNavbar";
import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]} allowedProfessions={[null]}>
      <div className={`flex min-h-screen bg-[#F4FBFA] ${poppins.className}`}>
        {/* Sidebar */}
        <Suspense fallback={<div className="w-20 md:w-65 border-r border-gray-200" />}>
        <Sidebar role="admin" />
      </Suspense>

      {/* Right side */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
