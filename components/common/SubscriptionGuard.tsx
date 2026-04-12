"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSubscriptionStatus } from "@/lib/hooks/useSubscriptionStatus";
import { Loader2 } from "lucide-react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const router = useRouter();
  const { restricted, isLoading } = useSubscriptionStatus();

  useEffect(() => {
    if (!isLoading && restricted) {
      router.push("/user-dashboard/upgrade");
    }
  }, [isLoading, restricted, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0FA4A9]" />
      </div>
    );
  }

  // If restricted, return null while redirecting to avoid flickering content
  if (restricted) {
    return null;
  }

  return <>{children}</>;
}
