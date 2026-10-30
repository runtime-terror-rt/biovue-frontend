"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function UserProgramsRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams.toString();
    const target = params
      ? `/user-dashboard/assigned-programs?${params}`
      : `/user-dashboard/assigned-programs`;
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="flex h-[50vh] items-center justify-center gap-3">
      <Loader2 className="h-7 w-7 animate-spin text-[#0FA4A9]" />
      <span className="text-sm font-medium text-[#5F6F73]">
        Redirecting to your assigned programs...
      </span>
    </div>
  );
}

