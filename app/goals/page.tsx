"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { Loader2 } from "lucide-react";

export default function GoalsRedirectPage() {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (user?.user_type === "professional") {
      router.replace("/trainer-dashboard/clients");
    } else {
      router.replace("/user-dashboard/goals");
    }
  }, [router, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4FBFA]">
      <Loader2 className="h-8 w-8 animate-spin text-[#0FA4A9]" />
    </div>
  );
}

