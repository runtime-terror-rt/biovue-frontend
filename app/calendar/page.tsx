"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Loader2 } from "lucide-react";

export default function CalendarRedirectPage() {
  const router = useRouter();
  const authUser = useSelector((state: RootState) => (state as any).auth?.user);

  useEffect(() => {
    let role = authUser?.role || authUser?.profession_type;
    if (!role && typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          role = parsed?.role || parsed?.profession_type;
        }
      } catch (e) {
        // ignore
      }
    }

    if (role === "trainer_coach" || role === "trainer") {
      router.replace("/trainer-dashboard/calendar");
    } else {
      router.replace("/user-dashboard/schedule");
    }
  }, [router, authUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-[#0FA4A9]" />
    </div>
  );
}
