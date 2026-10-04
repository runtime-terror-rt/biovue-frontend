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

    const { role, profession_type, plan_id, plan_name, plan_type } = user;
    const userRole = String(role || user.user_type || "individual").toLowerCase();

    // Check if the user has an API plan
    const isApiPlan = plan_type === "api" || (typeof plan_name === "string" && plan_name.toLowerCase().includes("api"));

    if (isApiPlan) {
      if (allowedRoles.includes("api-user")) {
        setIsAuthorized(true);
      } else {
        router.replace("/api-user");
      }
      return;
    }

    // Check if the user is a professional user
    const isProfessionalUser = 
      role === "professional" || 
      user.user_type === "professional" ||
      ["trainer_coach", "supplement_supplier", "nutritionist"].includes(role) ||
      ["trainer_coach", "supplement_supplier", "nutritionist"].includes(profession_type);

    // Check if the user's role is allowed
    const isIndividualAllowed = allowedRoles.includes("individual") || allowedRoles.includes("user");
    const isRoleAllowed =
      allowedRoles.includes(role) ||
      allowedRoles.includes(userRole) ||
      (isIndividualAllowed && ["individual", "user", "member", ""].includes(userRole));

    // Check if the user's profession is allowed (if professions are specified)
    const normalizedProfession = profession_type ? String(profession_type).toLowerCase() : null;
    const isProfessionAllowed = allowedProfessions 
      ? allowedProfessions.includes(normalizedProfession) || (isIndividualAllowed && !isProfessionalUser)
      : true;

    // FOR PROFESSIONALS: Ensure they have a plan_id before allowing access to dashboard
    if (isProfessionalUser && !plan_id && isRoleAllowed && isProfessionAllowed) {
      console.log("Professional user missing plan_id, redirecting to choose-plan");
      router.replace("/register/business/choose-plan");
      return;
    }

    if (isRoleAllowed && isProfessionAllowed) {
      setIsAuthorized(true);
    } else {
      // User is logged in but unauthorized for this specific dashboard
      // Redirect them to their proper dashboard based on their role
      if (userRole === "admin") {
        router.replace("/admin-dashboard/overview");
      } else if (userRole === "individual" || userRole === "user" || userRole === "member") {
        router.replace("/user-dashboard");
      } else if (userRole === "api") {
        router.replace("/api-user");
      } else if (isProfessionalUser) {
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
        router.replace("/user-dashboard");
      }
    }
  }, [user, router, allowedRoles, allowedProfessions]);

  if (!isAuthorized) {
    // Return null or a subtle loading skeleton to prevent UI flashes
    return null;
  }

  return <>{children}</>;
}
