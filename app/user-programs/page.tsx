"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function UserProgramsRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams?.toString();
    const target = params
      ? `/user-dashboard/assigned-programs?${params}`
      : `/user-dashboard/assigned-programs`;
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4FBFA]">
      <Loader2 className="h-8 w-8 animate-spin text-[#0FA4A9]" />
    </div>
  );
}

export default function UserProgramsRedirectPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#F4FBFA]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0FA4A9]" />
      </div>
    }>
      <UserProgramsRedirectContent />
    </Suspense>
  );
}

