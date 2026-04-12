"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateUpdateProfileMutation } from "@/redux/features/api/profileApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";

const ProfileSetup = () => {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const [createUpdateProfile, { isLoading }] = useCreateUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    location: ""
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("User information not found. Please log in again.");
      return;
    }

    const data = new FormData();
    data.append("user_id", user.id.toString());
    data.append("location", formData.location);
    data.append("user_type", user.user_type || "professional");
    data.append("profession_type", user.profession_type || "supplement_supplier");
    
    // Adding name if needed, though Postman didn't show it explicitly for /profile
    // Most /profile endpoints expect name if it's being updated
    if (formData.name) {
      data.append("name", formData.name);
    }

    if (imageFile) {
      data.append("image", imageFile);
    }
    try {
      const res = await createUpdateProfile(data).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Profile updated successfully!");
        router.push("/supplier-dashboard");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[800px] mx-auto py-4 px-4">
      {/* Logo at the top */}
      <div className="mb-6">
        <Image
          src="/images/logo.png"
          alt="BioVue Logo"
          width={150}
          height={60}
          className="object-contain"
          priority
        />
      </div>

      {/* Back Button */}
      <div className="w-full max-w-[650px] mb-6">
        <Link 
          href="/register/business" 
          className="inline-flex items-center gap-2 text-[#3A86FF] hover:opacity-80 transition-opacity font-bold text-xs tracking-wider uppercase"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          Back to account type
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[650px] bg-white rounded-2xl p-4 md:p-6 border border-[#D9E6FF] shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Information Section */}
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-[#041228]">Personal Information</h2>
            </div>

            {/* Profile Image */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-[#5F6F73] block">
                Profile Image
              </label>
              <div className="flex items-center gap-6">
                <div 
                  className="relative group cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <div className="w-24 h-24 rounded-full bg-[#E4EFFF] flex items-center justify-center text-white text-2xl font-bold shadow-sm group-hover:bg-[#D9E6FF] transition-opacity overflow-hidden">
                    {imagePreview ? (
                      <Image 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <Image 
                        src="/images/user.png" 
                        alt="Default Profile" 
                        fill 
                        className="object-cover" 
                      />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#60A5FA] border-2 border-white flex items-center justify-center text-white group-hover:bg-[#3B82F6] transition-colors">
                    <Camera size={14} fill="white" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#1F2D2E] font-medium text-[15px]">Upload a new profile image</span>
                  <span className="text-[#98A2B3] text-xs font-semibold mt-1">JPG, PNG (Max 2MB)</span>
                </div>
              </div>
            </div>

            {/* Supplier Name (renamed to Full Name for clarity) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F2D2E] block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Smith"
                className="w-full bg-white border border-[#E4EFFF] rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#98A2B3] font-medium transition-all"
                required
              />
            </div>
          </div>

          {/* Business Information Section */}
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-[#041228]">Business Information</h2>
            </div>

            {/* Business Location */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1F2D2E] block">
                Business Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Cumilla, Bangladesh"
                className="w-full bg-white border border-[#E4EFFF] rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]/10 text-[#041228] placeholder:text-[#98A2B3] font-medium transition-all"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0FA4A9] text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg shadow-[#0FA4A9]/10 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-[#041228] text-[15px] font-bold">
          Already have an account?{" "}
          <Link href="/login" className="text-[#3A86FF] hover:underline ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ProfileSetup;
