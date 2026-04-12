"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { useGetProfileQuery, useCreateUpdateProfileMutation } from "@/redux/features/api/profileApi";
import { User, Plus, Loader2, X, Check, ChevronDown } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { toast } from "sonner";

export default function ProfilePreferences() {
  const currentUser = useSelector(selectCurrentUser);
  const { data: profileResponse, isLoading: isLoadingProfile } = useGetProfileQuery(currentUser?.id, { skip: !currentUser?.id });
  const [createUpdateProfile, { isLoading: isUpdatingProfile }] = useCreateUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "Male",
    height: "",
    weight: "",
    location: "",
    experience_years: "",
    zipcode: "",
    prof_service_type: "local",
  });

  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newSpecialty, setNewSpecialty] = useState("");
  const [newService, setNewService] = useState("");

  useEffect(() => {
    if (currentUser || profileResponse) {
      const pData = profileResponse?.data?.profile;
      setFormData((prev) => ({
        ...prev,
        name: profileResponse?.data?.name || currentUser?.name || "",
        age: pData?.age || "",
        sex: pData?.sex || "Male",
        height: pData?.height || "",
        weight: pData?.weight || "",
        location: pData?.location || "",
        experience_years: pData?.experience_years || "",
        zipcode: pData?.zipcode || currentUser?.profile?.zipcode || "",
        prof_service_type: pData?.prof_service_type || currentUser?.profile?.prof_service_type || "local",
      }));

      setBio(pData?.bio || "");
      
      if (pData?.specialties && Array.isArray(pData.specialties)) {
        setSpecialties(pData.specialties);
      }
      if (pData?.services && Array.isArray(pData.services)) {
        setServices(pData.services);
      }

      if (pData?.image) {
        setImagePreview(pData.image);
      }
    }
  }, [currentUser, profileResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty("");
    }
  };

  const addService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  };

  const removeSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    if (!currentUser?.id) return;

    try {
      const data = new FormData();
      if (profileResponse?.data?.profile?.id) {
        data.append("id", profileResponse.data.profile.id.toString());
      }
      data.append("user_id", currentUser.id.toString());
      data.append("user_type", "professional");
      data.append("profession_type", "trainer_coach");
      
      if (formData.name) data.append("name", formData.name);
      data.append("age", formData.age);
      data.append("sex", formData.sex);
      data.append("height", formData.height);
      data.append("weight", formData.weight);
      data.append("location", formData.location);
      data.append("experience_years", formData.experience_years);
      data.append("zipcode", formData.zipcode);
      data.append("prof_service_type", formData.prof_service_type);
      data.append("bio", bio);
      
      specialties.forEach((s) => data.append("specialties[]", s));
      services.forEach((s) => data.append("services[]", s));

      if (image) {
        data.append("image", image);
      }

      const res = await createUpdateProfile(data).unwrap();
      if (res.success || (res as any).status === "success") {
        toast.success("Profile updated successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
      console.error(error);
    }
  };

  return (
    <SettingsSection
      title="Profile & Preferences"
      action={
        <button 
          onClick={handleSaveChanges}
          disabled={isUpdatingProfile || isLoadingProfile}
          className="text-[#8746E7] font-bold text-sm hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-2"
        >
          {(isUpdatingProfile || isLoadingProfile) && <Loader2 size={14} className="animate-spin" />}
          Save Changes
        </button>
      }
    >
      <div className="flex flex-col gap-8 p-3 md:p-8">
        
        {/* Basic Information */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#F1F5F9] bg-gray-50 flex items-center justify-center relative">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt={formData.name || "Trainer"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User size={40} className="text-[#94A3B8]" />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                  <Plus className="text-white" size={24} />
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-[#8746E7] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-[#8746E7] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Sex</label>
              <div className="relative">
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium appearance-none focus:outline-none focus:border-[#8746E7] transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="175"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-[#8746E7] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="70"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-[#8746E7] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-[#8746E7] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Experience Years</label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                placeholder="5"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-[#8746E7] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Zip Code</label>
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                placeholder="12345"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-[#8746E7] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">Service Type</label>
              <div className="relative">
                <select
                  name="prof_service_type"
                  value={formData.prof_service_type}
                  onChange={handleChange}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium appearance-none focus:outline-none focus:border-[#8746E7] transition-all"
                >
                  <option value="local">Local</option>
                  <option value="remote">Remote</option>
                  <option value="both">Both</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#98A2B3] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        <div className="pt-4 border-t border-[#F1F5F9]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[17px] font-bold text-[#1E293B]">Short Bio</h3>
            <span className="text-xs font-bold text-[#94A3B8] tracking-widest">{bio.length}/180</span>
          </div>
          <textarea
            className="w-full h-32 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 text-sm font-medium focus:outline-none focus:border-[#8746E7] transition-all resize-none placeholder:text-[#94A3B8]/60"
            placeholder="Introduce yourself and your coaching philosophy..."
            maxLength={180}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Specialties */}
        <div className="pt-4 border-t border-[#F1F5F9]">
          <h3 className="text-[17px] font-bold text-[#1E293B] mb-4">Specialties</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {specialties.map((tag, idx) => (
              <div key={idx} className="bg-[#F0F7FF] border border-[#D1E9FF] text-[#3B82F6] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                {tag}
                <button onClick={() => removeSpecialty(idx)} className="cursor-pointer hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="relative group">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSpecialty()}
              placeholder="Type specialty and press Enter..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium focus:outline-none focus:border-[#D1E9FF] transition-all"
            />
            <Plus className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] cursor-pointer" size={20} onClick={addSpecialty} />
          </div>
        </div>

        {/* What This Coach Will Do */}
        <div className="pt-4 border-t border-[#F1F5F9]">
          <div className="mb-4">
            <h3 className="text-[17px] font-bold text-[#1E293B]">What This Coach Will Do</h3>
            <p className="text-sm text-[#94A3B8] font-medium mt-1">
              List the specific values or services you provide to your clients.
            </p>
          </div>
          <div className="space-y-3 mb-4">
            {services.map((service, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-lg bg-[#E0F2FE] flex items-center justify-center text-[#3B82F6] shrink-0">
                  <Check size={14} />
                </div>
                <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-3 text-sm font-medium">
                  {service}
                </div>
                <button onClick={() => removeService(idx)} className="w-6 h-6 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] hover:text-red-500 transition-colors cursor-pointer shrink-0">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 shrink-0" />
            <input
              type="text"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addService()}
              placeholder="Add new service..."
              className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-[#8746E7] transition-all"
            />
            <button onClick={addService} className="text-[#8746E7] hover:opacity-80 transition-opacity">
              <Plus size={20} />
            </button>
          </div>
        </div>

      </div>
    </SettingsSection>
  );
}
