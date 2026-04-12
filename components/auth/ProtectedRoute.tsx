"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  allowedProfessions?: (string | null)[];
}

export default function ProtectedRoute({ children, allowedRoles, allowedProfessions }: ProtectedRouteProps) {
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // If there's no user in Redux, redirect to login
    if (!user) {
      router.replace("/login");
      return;
    }

    const { role, profession_type } = user;

    // Check if the user's role is allowed
    const isRoleAllowed = allowedRoles.includes(role);

    // Check if the user's profession is allowed (if professions are specified)
    const isProfessionAllowed = allowedProfessions 
      ? allowedProfessions.includes(profession_type ?? null)
      : true;

    if (isRoleAllowed && isProfessionAllowed) {
      setIsAuthorized(true);
    } else {
      // User is logged in but unauthorized for this specific dashboard
      // Redirect them to their proper dashboard based on their role
      if (role === "admin") {
        router.replace("/admin-dashboard/overview");
      } else if (role === "individual") {
        router.replace("/user-dashboard");
      } else if (role === "professional" || user.user_type === "professional") {
        if (profession_type === "trainer_coach") {
          router.replace("/trainer-dashboard/overview");
        } else if (profession_type === "supplement_supplier") {
          router.replace("/supplier-dashboard");
        } else if (profession_type === "nutritionist") {
          router.replace("/nutritionist-dashboard/overview");
        } else {
          router.replace("/login");
        }
      } else {
        router.replace("/login");
      }
    }
  }, [user, router, allowedRoles, allowedProfessions]);

  if (!isAuthorized) {
    // Return null or a subtle loading skeleton to prevent UI flashes
    return null;
  }

  return <>{children}</>;
}
