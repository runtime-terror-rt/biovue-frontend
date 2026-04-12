"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
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
  useUpdateSupplierUserRecommendationsMutation 
} from "@/redux/features/api/recommendation/recommendationApi";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [updateAiSuggestedTarget] = useUpdateAiSuggestedTargetMutation();
  const [updateProfessionalRecommendations] = useUpdateProfessionalRecommendationsMutation();
  const [updateTrainerUserRecommendations] = useUpdateTrainerUserRecommendationsMutation();
  const [updateNutritionistUserRecommendations] = useUpdateNutritionistUserRecommendationsMutation();
  const [updateSupplierUserRecommendations] = useUpdateSupplierUserRecommendationsMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", formData.email);
      const res = await login(formData).unwrap();
      console.log("Login Successful:", res);

      if (res?.success || res?.status === "success") {
        toast.success(res?.message || "Login successful!");
        
        // Save credentials to Redux and localStorage
        dispatch(setCredentials({
          user: res?.data?.user,
          token: res?.data?.token
        }));
        
        // Handle role-based redirection
        const userData = res?.data?.user;
        const userRole = userData?.role;
        const userType = userData?.user_type;
        const professionType = userData?.profession_type;
        const isProfileCompleted = userData?.is_profile_completed;

        console.log("User Data for Routing:", { userRole, userType, professionType, isProfileCompleted });

        if (userRole === "admin") {
          router.push("/admin-dashboard/overview");
        } else if (
          userType === "professional" || 
          userRole === "professional" || 
          (professionType && ["trainer_coach", "supplement_supplier", "nutritionist"].includes(professionType))
        ) {
          const userId = userData?.id || userData?.user_id;
          
          if (professionType === "trainer_coach") {
            updateTrainerUserRecommendations({ trainer_id: userId });
            if (isProfileCompleted === "Your profile is complete.") {
              router.push("/trainer-dashboard/overview");
            } else {
              router.push("/trainer-profile");
            }
          } else if (professionType === "supplement_supplier") {
            updateSupplierUserRecommendations({ supplier_id: userId });
            if (isProfileCompleted === "Your profile is complete.") {
              router.push("/supplier-dashboard");
            } else {
              router.push("/register/business/profile-setup");
            }
          } else if (professionType === "nutritionist") {
            updateNutritionistUserRecommendations({ nutritionist_id: userId });
            router.push("/nutritionist-dashboard/overview");
          } else {
            router.push("/personalize-journey/onboarding");
          }
        } else if (userRole === "individual") {
          const userId = userData?.id || userData?.user_id;
          
          // Trigger AI suggested target update
          updateAiSuggestedTarget({ user_id: userId });
          // Trigger professional recommendations
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
        console.warn("Login failed despite status code:", res);
        toast.error(res?.message || "Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      console.error("Login Error Captured:", err);
      // Show server message if available, else default
      const serverMessage = err?.data?.message || err?.message || "Login failed. Please check your credentials.";
      toast.error(serverMessage);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[500px] mx-auto py-6">
      {/* Logo at the top */}
      <div className="mb-8">
        <Image
          src="/images/logo.png"
          alt="BioVue Logo"
          width={150}
          height={60}
          className="object-contain"
          priority
        />
      </div>

      {/* Main Card */}
      <div className="w-full bg-white rounded-xl p-8 border border-[rgba(58,134,255,0.5)] shadow-[0_4px_24px_rgba(58,134,255,0.04)]">
        {/* Back Button */}
        <div className="flex justify-center mb-10">
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 text-[#3A86FF] hover:opacity-80 transition-opacity font-bold text-[13px] tracking-wider uppercase"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            BACK TO ACCOUNT TYPE
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[32px] font-bold text-[#041228] mb-3">
            Welcome
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#5F6F73] transition-colors"
              >
                {!showPassword ? <EyeOff size={22} strokeWidth={1.5} /> : <Eye size={22} strokeWidth={1.5} />}
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
          <div className="">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0FA4A9] text-white py-3 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#0FA4A9]/10 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? "Logging in..." : "Log In"}
              {!isLoading && <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>

        {/* Footer (Optional, but usually needed) */}
        <div className="mt-6 text-center">
          <p className="text-[#041228] text-sm font-semibold">
            Don't have an account?{" "}
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
