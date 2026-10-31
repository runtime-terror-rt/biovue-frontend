"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProgramDetailsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user-dashboard/goals");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4FBFA]">
      <Loader2 className="h-8 w-8 animate-spin text-[#0FA4A9]" />
    </div>
  );
}

