"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSubscriptionStatus } from "@/lib/hooks/useSubscriptionStatus";
import { Loader2 } from "lucide-react";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const router = useRouter();
  const { restricted, isLoading, projection_limit, hasExpiry, expiryOver, projectionZero } = useSubscriptionStatus();
  const pathname = usePathname();

  useEffect(() => {
    // Only fully redirect if account is fully restricted (trial ended)
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

  // Helper to detect projection-related routes
  const isProjectionRoute = (p?: string | null) => {
    if (!p) return false;
    return (
      p.includes("/user-dashboard/projections") ||
      p.includes("/user-dashboard/projection-galary") ||
      p.includes("/projections") ||
      p.includes("projection-galary")
    );
  };

  

  // If fully restricted (trial ended), we already redirected above.
  // For partial restrictions we render the page but blur/disable interaction.

  // Case A: expiry over -> only allow dashboard and settings
  if (expiryOver) {
    const allowed =
      pathname === "/user-dashboard" || pathname?.includes("/user-dashboard/settings");
    if (allowed) return <>{children}</>;

    return (
      <div className="relative">
        <div className="pointer-events-none select-none opacity-40 blur-sm">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 p-4 rounded shadow text-center">
            <div className="mb-2 font-semibold">Subscription expired</div>
            <div className="text-sm mb-3">Only Dashboard and Settings are available.</div>
            <div className="flex gap-2 justify-center">
              <Link href="/user-dashboard/upgrade" className="btn btn-sm">
                Upgrade
              </Link>
              <Link href="/user-dashboard/settings" className="btn btn-ghost btn-sm">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case B: projection credits zero and expiry present -> only projection routes disabled
  if (projectionZero && hasExpiry && isProjectionRoute(pathname)) {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none opacity-40 blur-sm">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 p-4 rounded shadow text-center">
            <div className="mb-2 font-semibold">Projection unavailable</div>
            <div className="text-sm mb-3">You have no projection credits. Upgrade to continue.</div>
            <div className="flex gap-2 justify-center">
              <Link href="/user-dashboard/upgrade" className="btn btn-sm">
                Upgrade
              </Link>
              <Link href="/user-dashboard" className="btn btn-ghost btn-sm">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: allow access
  return <>{children}</>;
}
