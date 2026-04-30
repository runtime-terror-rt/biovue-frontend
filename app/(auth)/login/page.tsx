// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowLeft,
//   ArrowRight,
//   ChevronDown,
//   User,
//   Briefcase,
//   Dumbbell,
//   Apple,
//   ShoppingBag,
//   ShieldCheck,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useLoginMutation } from "@/redux/features/api/auth/authApi";
// import { toast } from "sonner";
// import { useDispatch } from "react-redux";
// import { setCredentials } from "@/redux/features/slice/authSlice";
// import { useUpdateAiSuggestedTargetMutation } from "@/redux/features/api/userDashboard/nutritionAiApi";
// import {
//   useUpdateProfessionalRecommendationsMutation,
//   useUpdateTrainerUserRecommendationsMutation,
//   useUpdateNutritionistUserRecommendationsMutation,
//   useUpdateSupplierUserRecommendationsMutation,
// } from "@/redux/features/api/recommendation/recommendationApi";
// import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
// import { getRecaptchaToken } from "@/lib/recaptcha";

// // ─── Role options ──────────────────────────────────────────────────────────────
// const ROLES = [
//   { value: "individual", label: "Individual User", icon: User, color: "#3A86FF" },
//   { value: "trainer_coach", label: "Trainer / Coach", icon: Dumbbell, color: "#0FA4A9" },
//   { value: "nutritionist", label: "Nutritionist", icon: Apple, color: "#22C55E" },
//   { value: "supplement_supplier", label: "Supplement Supplier", icon: ShoppingBag, color: "#F59E0B" },
//   { value: "admin", label: "Admin", icon: ShieldCheck, color: "#8B5CF6" },
// ];

// // ─── Custom Animated Dropdown ─────────────────────────────────────────────────
// interface RoleDropdownProps {
//   value: string;
//   onChange: (val: string) => void;
// }

// const RoleDropdown = ({ value, onChange }: RoleDropdownProps) => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);
//   const selected = ROLES.find((r) => r.value === value) ?? ROLES[0];
//   const SelectedIcon = selected.icon;

//   // Close on outside click
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   return (
//     <div className="relative" ref={ref}>
//       {/* Trigger */}
//       <button
//         type="button"
//         onClick={() => setOpen((prev) => !prev)}
//         className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 font-medium flex items-center gap-3 cursor-pointer transition-all"
//         aria-haspopup="listbox"
//         aria-expanded={open}
//       >
//         <span
//           className="flex items-center justify-center w-7 h-7 rounded-lg"
//           style={{ backgroundColor: `${selected.color}18` }}
//         >
//           <SelectedIcon size={16} style={{ color: selected.color }} />
//         </span>
//         <span className="flex-1 text-left text-[#041228]">{selected.label}</span>
//         <ChevronDown
//           size={20}
//           className="text-[#98A2B3] transition-transform duration-300"
//           style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
//         />
//       </button>

//       {/* Dropdown panel — CSS-driven open/close animation */}
//       <div
//         className="absolute left-0 right-0 z-50 mt-2 rounded-2xl bg-white border border-[#E8F0FE] shadow-[0_8px_32px_rgba(58,134,255,0.12)] overflow-hidden"
//         style={{
//           maxHeight: open ? "400px" : "0px",
//           opacity: open ? 1 : 0,
//           transform: open ? "translateY(0)" : "translateY(-8px)",
//           transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease, transform 0.25s ease",
//           pointerEvents: open ? "auto" : "none",
//         }}
//         role="listbox"
//       >
//         <div className="p-2">
//           {ROLES.map((role, i) => {
//             const Icon = role.icon;
//             const isSelected = role.value === value;
//             return (
//               <button
//                 key={role.value}
//                 type="button"
//                 role="option"
//                 aria-selected={isSelected}
//                 onClick={() => {
//                   onChange(role.value);
//                   setOpen(false);
//                 }}
//                 className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 text-left"
//                 style={{
//                   backgroundColor: isSelected ? `${role.color}12` : "transparent",
//                   transitionDelay: open ? `${i * 30}ms` : "0ms",
//                   opacity: open ? 1 : 0,
//                   transform: open ? "translateX(0)" : "translateX(-10px)",
//                   transition: `background-color 0.15s, opacity 0.2s ${i * 30}ms, transform 0.2s ${i * 30}ms`,
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isSelected)
//                     (e.currentTarget as HTMLElement).style.backgroundColor = `${role.color}0D`;
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isSelected)
//                     (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
//                 }}
//               >
//                 <span
//                   className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
//                   style={{ backgroundColor: `${role.color}1A` }}
//                 >
//                   <Icon size={17} style={{ color: role.color }} />
//                 </span>
//                 <span
//                   className="font-semibold text-sm"
//                   style={{ color: isSelected ? role.color : "#041228" }}
//                 >
//                   {role.label}
//                 </span>
//                 {isSelected && (
//                   <span
//                     className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
//                     style={{ backgroundColor: role.color }}
//                   />
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Login Page ───────────────────────────────────────────────────────────────
// const LoginPage = () => {
//   const { executeRecaptcha } = useGoogleReCaptcha();
//   const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
//   const useEnterprise =
//     process.env.NEXT_PUBLIC_RECAPTCHA_USE_ENTERPRISE === "true";

//   const router = useRouter();
//   const dispatch = useDispatch();
//   const [login, { isLoading }] = useLoginMutation();
//   const [updateAiSuggestedTarget] = useUpdateAiSuggestedTargetMutation();
//   const [updateProfessionalRecommendations] =
//     useUpdateProfessionalRecommendationsMutation();
//   const [updateTrainerUserRecommendations] =
//     useUpdateTrainerUserRecommendationsMutation();
//   const [updateNutritionistUserRecommendations] =
//     useUpdateNutritionistUserRecommendationsMutation();
//   const [updateSupplierUserRecommendations] =
//     useUpdateSupplierUserRecommendationsMutation();

//   const [showPassword, setShowPassword] = useState(false);
//   const [selectedRole, setSelectedRole] = useState("individual");
//   const [formData, setFormData] = useState({ email: "", password: "" });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const token = await getRecaptchaToken(executeRecaptcha, "login", {
//         siteKey,
//         useEnterprise,
//       });

//       const payload = {
//         ...formData,
//         "g-recaptcha-response": token,
//       };

//       const res = await login(payload).unwrap();

//       if (res?.success || res?.status === "success") {
//         toast.success(res?.message || "Login successful!");

//         dispatch(
//           setCredentials({
//             user: res?.data?.user,
//             token: res?.data?.token,
//           })
//         );

//         const userData = res?.data?.user;
//         const isInvitedAccepted = (() => {
//           const invited = userData?.is_invited;
//           const invitationStatus = userData?.invitation_status;
//           const invitedBool =
//             invited === true || invited === "true" || invited === 1 || invited === "1";
//           const status = (invitationStatus || "").toString().toLowerCase();
//           return invitedBool && status === "accepted";
//         })();
//         const userRole = userData?.role;
//         const userType = userData?.user_type;
//         const professionType = userData?.profession_type;
//         const isProfileCompleted = userData?.is_profile_completed;

//         if (userRole === "admin") {
//           router.push("/admin-dashboard/overview");
//         } else if (
//           userType === "professional" ||
//           userRole === "professional" ||
//           (professionType &&
//             ["trainer_coach", "supplement_supplier", "nutritionist"].includes(
//               professionType
//             ))
//         ) {
//           const userId = userData?.id || userData?.user_id;

//             if (professionType === "trainer_coach") {
//             updateTrainerUserRecommendations({ trainer_id: userId });
//             if (isProfileCompleted === "Your profile is complete.") {
//                 // If no plan, show plans modal before letting them continue
//                 if (!userData?.plan_id && !isInvitedAccepted)
//                   router.push("/trainer-dashboard?showPlans=1");
//                 else router.push("/trainer-dashboard/overview");
//             } else {
//               router.push("/trainer-profile");
//             }
//           } else if (professionType === "supplement_supplier") {
//             updateSupplierUserRecommendations({ supplier_id: userId });
//             if (isProfileCompleted === "Your profile is complete.") {
//                 if (!userData?.plan_id && !isInvitedAccepted)
//                   router.push("/supplier-dashboard?showPlans=1");
//                 else router.push("/supplier-dashboard");
//             } else {
//               router.push("/register/business/profile-setup");
//             }
//           } else if (professionType === "nutritionist") {
//             updateNutritionistUserRecommendations({ nutritionist_id: userId });
//             // Nutritionists should also choose a professional plan before using the dashboard
//                 if (!userData?.plan_id && !isInvitedAccepted)
//                   router.push("/nutritionist-dashboard?showPlans=1");
//                 else router.push("/nutritionist-dashboard/overview");
//           } else {
//             router.push("/personalize-journey/onboarding");
//           }
//         } else if (userRole === "individual") {
//           const userId = userData?.id || userData?.user_id;
//           updateAiSuggestedTarget({ user_id: userId });
//           updateProfessionalRecommendations({ user_id: userId });

//           if (isProfileCompleted === "Your profile is complete.") {
//             router.push("/user-dashboard");
//           } else {
//             router.push(`/welcome?email=${formData.email}`);
//           }
//         } else {
//           router.push("/personalize-journey/onboarding");
//         }
//       } else {
//         toast.error(
//           res?.message || "Login failed. Please check your credentials."
//         );
//       }
//     } catch (err: unknown) {
//       const isScriptUnavailableError =
//         err instanceof Error &&
//         err.message === "RECAPTCHA_SCRIPT_NOT_AVAILABLE";
//       if (isScriptUnavailableError) {
//         toast.error(
//           "Security service is unavailable right now. Please refresh the page or contact support."
//         );
//         return;
//       }

//       const isRecaptchaReadyError =
//         err instanceof Error && err.message === "RECAPTCHA_NOT_READY";
//       if (isRecaptchaReadyError) {
//         toast.error(
//           "Security verification is still loading. Please wait a few seconds and try again."
//         );
//         return;
//       }

//       const serverMessage =
//         (err as { data?: { message?: string }; message?: string })?.data
//           ?.message ||
//         (err as { message?: string })?.message ||
//         "Login failed. Please check your credentials.";
//       toast.error(serverMessage);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center w-full max-w-[480px] mx-auto py-3">
//       {/* Logo */}
//       <div className="mb-2">
//         <Image
//           src="/images/logo.png"
//           alt="BioVue Logo"
//           width={130}
//           height={54}
//           style={{ height: "auto" }}
//           className="object-contain"
//           priority
//         />
//       </div>

//       {/* Main Card */}
//       <div className="w-full bg-white rounded-3xl p-6 md:p-8 border border-[#D9E6FF] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
//         {/* Back Button */}
//         <div className="flex justify-center mb-4">
//           <Link
//             href="/register"
//             className="inline-flex items-center gap-2 text-[#3A86FF] hover:opacity-80 transition-opacity font-bold text-sm tracking-wider uppercase"
//           >
//             <ArrowLeft size={20} strokeWidth={2.5} />
//             Back to account type
//           </Link>
//         </div>

//         {/* Header */}
//         <div className="text-center mb-5">
//           <h1 className="text-3xl md:text-[32px] font-bold text-[#041228] mb-2">
//             Welcome Back
//           </h1>
//           <p className="text-[#98A2B3] text-base">
//             Sign in to continue to your account.
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Role Selector */}
//           <div className="space-y-2">
//             <label className="text-sm font-bold text-[#041228] block ml-1">
//               Login as
//             </label>
//             <RoleDropdown value={selectedRole} onChange={setSelectedRole} />
//           </div>

//           {/* Email */}
//           <div className="space-y-2">
//             <label className="text-sm font-bold text-[#041228] block ml-1">
//               Email address
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
//                 <Mail size={22} strokeWidth={1.5} />
//               </span>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="georgia.young@example.com"
//                 className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#98A2B3] font-medium"
//                 required
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div className="space-y-2">
//             <label className="text-sm font-bold text-[#041228] block ml-1">
//               Password
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
//                 <Lock size={22} strokeWidth={1.5} />
//               </span>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="•••••"
//                 className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#98A2B3] font-medium"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#5F6F73] transition-colors cursor-pointer"
//               >
//                 {showPassword ? (
//                   <Eye size={22} strokeWidth={1.5} />
//                 ) : (
//                   <EyeOff size={22} strokeWidth={1.5} />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Forgot Password */}
//           <div className="flex justify-end pr-1">
//             <Link
//               href="/forgot-password"
//               className="text-[#EF4444] text-sm font-bold hover:underline"
//             >
//               Forgot Password?
//             </Link>
//           </div>

//           {/* Submit Button */}
//           <div className="pt-1">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#0FA4A9]/10 cursor-pointer disabled:opacity-70"
//             >
//               {isLoading ? "Logging in..." : "Log In"}
//               {!isLoading && (
//                 <ArrowRight
//                   size={22}
//                   className="group-hover:translate-x-1 transition-transform"
//                 />
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Footer */}
//         <div className="mt-4 text-center">
//           <p className="text-[#041228] text-[15px] font-bold">
//             Don&apos;t have an account?{" "}
//             <Link href="/register" className="text-[#3A86FF] hover:underline ml-1">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  User,
  Briefcase,
  Dumbbell,
  Apple,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/features/api/auth/authApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/features/slice/authSlice";
import { useUpdateAiSuggestedTargetMutation } from "@/redux/features/api/userDashboard/nutritionAiApi";
import {
  useUpdateProfessionalRecommendationsMutation,
  useUpdateTrainerUserRecommendationsMutation,
  useUpdateNutritionistUserRecommendationsMutation,
  useUpdateSupplierUserRecommendationsMutation,
} from "@/redux/features/api/recommendation/recommendationApi";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { isInvitedAndAccepted } from "@/lib/inviteHelpers";


// ─── Role options ──────────────────────────────────────────────────────────────
const ROLES = [
  { value: "individual", label: "Individual User", icon: User, color: "#3A86FF" },
  { value: "trainer_coach", label: "Trainer / Coach", icon: Dumbbell, color: "#0FA4A9" },
  { value: "nutritionist", label: "Nutritionist", icon: Apple, color: "#22C55E" },
  { value: "supplement_supplier", label: "Supplement Supplier", icon: ShoppingBag, color: "#F59E0B" },
  { value: "admin", label: "Admin", icon: ShieldCheck, color: "#8B5CF6" },
];

// ─── Custom Animated Dropdown ─────────────────────────────────────────────────
interface RoleDropdownProps {
  value: string;
  onChange: (val: string) => void;
}

const RoleDropdown = ({ value, onChange }: RoleDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = ROLES.find((r) => r.value === value) ?? ROLES[0];
  const SelectedIcon = selected.icon;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 font-medium flex items-center gap-3 cursor-pointer transition-all"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className="flex items-center justify-center w-7 h-7 rounded-lg"
          style={{ backgroundColor: `${selected.color}18` }}
        >
          <SelectedIcon size={16} style={{ color: selected.color }} />
        </span>
        <span className="flex-1 text-left text-[#041228]">{selected.label}</span>
        <ChevronDown
          size={20}
          className="text-[#98A2B3] transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Dropdown panel — CSS-driven open/close animation */}
      <div
        className="absolute left-0 right-0 z-50 mt-2 rounded-2xl bg-white border border-[#E8F0FE] shadow-[0_8px_32px_rgba(58,134,255,0.12)] overflow-hidden"
        style={{
          maxHeight: open ? "400px" : "0px",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-8px)",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: open ? "auto" : "none",
        }}
        role="listbox"
      >
        <div className="p-2">
          {ROLES.map((role, i) => {
            const Icon = role.icon;
            const isSelected = role.value === value;
            return (
              <button
                key={role.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(role.value);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 text-left"
                style={{
                  backgroundColor: isSelected ? `${role.color}12` : "transparent",
                  transitionDelay: open ? `${i * 30}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(-10px)",
                  transition: `background-color 0.15s, opacity 0.2s ${i * 30}ms, transform 0.2s ${i * 30}ms`,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLElement).style.backgroundColor = `${role.color}0D`;
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: `${role.color}1A` }}
                >
                  <Icon size={17} style={{ color: role.color }} />
                </span>
                <span
                  className="font-semibold text-sm"
                  style={{ color: isSelected ? role.color : "#041228" }}
                >
                  {role.label}
                </span>
                {isSelected && (
                  <span
                    className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: role.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Login Page ───────────────────────────────────────────────────────────────
const LoginPage = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const useEnterprise =
    process.env.NEXT_PUBLIC_RECAPTCHA_USE_ENTERPRISE === "true";

  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [updateAiSuggestedTarget] = useUpdateAiSuggestedTargetMutation();
  const [updateProfessionalRecommendations] =
    useUpdateProfessionalRecommendationsMutation();
  const [updateTrainerUserRecommendations] =
    useUpdateTrainerUserRecommendationsMutation();
  const [updateNutritionistUserRecommendations] =
    useUpdateNutritionistUserRecommendationsMutation();
  const [updateSupplierUserRecommendations] =
    useUpdateSupplierUserRecommendationsMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("individual");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await getRecaptchaToken(executeRecaptcha, "login", {
        siteKey,
        useEnterprise,
      });

      const payload = {
        ...formData,
        "g-recaptcha-response": token,
      };

      const res = await login(payload).unwrap();

      if (res?.success || res?.status === "success") {
        toast.success(res?.message || "Login successful!");

        dispatch(
          setCredentials({
            user: res?.data?.user,
            token: res?.data?.token,
          })
        );

        const userData = res?.data?.user;
        const invitedAndAccepted = isInvitedAndAccepted(userData);
        const userRole = userData?.role;
        const userType = userData?.user_type;
        const professionType = userData?.profession_type;
        const isProfileCompleted = userData?.is_profile_completed;

        if (userRole === "admin") {
          router.push("/admin-dashboard/overview");
        } else if (
          userType === "professional" ||
          userRole === "professional" ||
          (professionType &&
            ["trainer_coach", "supplement_supplier", "nutritionist"].includes(
              professionType
            ))
        ) {
          const userId = userData?.id || userData?.user_id;

            if (professionType === "trainer_coach") {
            updateTrainerUserRecommendations({ trainer_id: userId });
            if (isProfileCompleted === "Your profile is complete.") {
                // If no plan, show plans modal before letting them continue
                if (!userData?.plan_id && !invitedAndAccepted)
                  router.push("/register/business/choose-plan");
                else router.push("/trainer-dashboard/overview");
            } else {
              router.push("/trainer-profile");
            }
          } else if (professionType === "supplement_supplier") {
            updateSupplierUserRecommendations({ supplier_id: userId });
            if (isProfileCompleted === "Your profile is complete.") {
                if (!userData?.plan_id && !invitedAndAccepted)
                  router.push("/register/business/choose-plan");
                else router.push("/supplier-dashboard");
            } else {
              router.push("/register/business/profile-setup");
            }
          } else if (professionType === "nutritionist") {
            updateNutritionistUserRecommendations({ nutritionist_id: userId });
            // Nutritionists should also choose a professional plan before using the dashboard
                if (!userData?.plan_id && !invitedAndAccepted)
                  router.push("/register/business/choose-plan");
                else router.push("/nutritionist-dashboard/overview");
          } else {
            router.push("/personalize-journey/onboarding");
          }
        } else if (userRole === "individual") {
          const userId = userData?.id || userData?.user_id;
          updateAiSuggestedTarget({ user_id: userId });
          updateProfessionalRecommendations({ user_id: userId });

          if (isProfileCompleted === "Your profile is complete.") {
            router.push("/user-dashboard");
          } else {
            router.push(`/welcome?email=${formData.email}`);
          }
        } else {
          router.push("/personalize-journey/onboarding");
        }
      } else {
        toast.error(
          res?.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err: unknown) {
      const isScriptUnavailableError =
        err instanceof Error &&
        err.message === "RECAPTCHA_SCRIPT_NOT_AVAILABLE";
      if (isScriptUnavailableError) {
        toast.error(
          "Security service is unavailable right now. Please refresh the page or contact support."
        );
        return;
      }

      const isRecaptchaReadyError =
        err instanceof Error && err.message === "RECAPTCHA_NOT_READY";
      if (isRecaptchaReadyError) {
        toast.error(
          "Security verification is still loading. Please wait a few seconds and try again."
        );
        return;
      }

      const serverMessage =
        (err as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (err as { message?: string })?.message ||
        "Login failed. Please check your credentials.";
      toast.error(serverMessage);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[480px] mx-auto py-3">
      {/* Logo */}
      <div className="mb-2">
        <Image
          src="/images/logo.png"
          alt="BioVue Logo"
          width={130}
          height={54}
          style={{ height: "auto" }}
          className="object-contain"
          priority
        />
      </div>

      {/* Main Card */}
      <div className="w-full bg-white rounded-3xl p-6 md:p-8 border border-[#D9E6FF] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Back Button */}
        <div className="flex justify-center mb-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-[#3A86FF] hover:opacity-80 transition-opacity font-bold text-sm tracking-wider uppercase"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            Back to account type
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-3xl md:text-[32px] font-bold text-[#041228] mb-2">
            Welcome Back
          </h1>
          <p className="text-[#98A2B3] text-base">
            Sign in to continue to your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selector */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228] block ml-1">
              Login as
            </label>
            <RoleDropdown value={selectedRole} onChange={setSelectedRole} />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228] block ml-1">
              Email address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                <Mail size={22} strokeWidth={1.5} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="georgia.young@example.com"
                className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#98A2B3] font-medium"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#041228] block ml-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                <Lock size={22} strokeWidth={1.5} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="•••••"
                className="w-full bg-[#F5F5F5] border-none rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#98A2B3] font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#5F6F73] transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <Eye size={22} strokeWidth={1.5} />
                ) : (
                  <EyeOff size={22} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end pr-1">
            <Link
              href="/forgot-password"
              className="text-[#EF4444] text-sm font-bold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#0FA4A9]/10 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Log In"}
              {!isLoading && (
                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-[#041228] text-[15px] font-bold">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#3A86FF] hover:underline ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
