"use client";

import Image from "next/image";
import { ChevronLeft, Plus, X, Check, Save, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateUpdateProfileMutation } from "@/redux/features/api/profileApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";
import Link from "next/link";

export default function TrainerProfile() {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const [createUpdateProfile, { isLoading }] = useCreateUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "Male",
    height: "",
    weight: "",
    location: "",
    experience_years: "",
  });

  const [specialties, setSpecialties] = useState<string[]>([
    "Fat Loss",
    "Strength",
    "Habit Building",
  ]);
  const [services, setServices] = useState<string[]>([
    "Set personalized goals",
    "Monitor your progress",
    "Provide weekly guidance",
  ]);
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newSpecialty, setNewSpecialty] = useState("");
  const [newService, setNewService] = useState("");

  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      setImageFile(file);
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

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error("User information not found. Please log in again.");
      return;
    }

    const data = new FormData();
    data.append("user_id", user.id.toString());
    data.append("age", formData.age);
    data.append("sex", formData.sex);
    data.append("height", formData.height);
    data.append("weight", formData.weight);
    data.append("location", formData.location);
    data.append("experience_years", formData.experience_years);
    data.append("bio", bio);
    data.append("user_type", "professional");
    data.append("profession_type", "trainer_coach");

    specialties.forEach((s) => data.append("specialties[]", s));
    services.forEach((s) => data.append("services[]", s));

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      const res = await createUpdateProfile(data).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Profile created successfully!");
        router.push("/trainer-dashboard/overview");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to create profile. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4">
      {/* Logo */}
      <div className="mb-10">
        <Image
          src="/images/logo.png"
          alt="BioVue Logo"
          width={120}
          height={40}
          priority
        />
      </div>

      <div className="w-full max-w-3xl">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#3B82F6] text-sm font-semibold mb-6 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <ChevronLeft size={18} />
          BACK TO ACCOUNT TYPE
        </button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2">
            Trainer Profile
          </h1>
          <p className="text-[#64748B] text-sm font-medium">
            Update your public profile information
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-3xl border border-[#F1F5F9] shadow-sm p-8">
            <h3 className="text-[17px] font-bold text-[#1E293B] mb-6">
              Basic Information
            </h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#F1F5F9] relative cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
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
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Plus className="text-white" size={24} />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium text-[#1E293B]">
                    {formData.name || "Alex Thompson"}
                  </div>
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                    Sex
                  </label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6] appearance-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="175"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="70"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                    Experience Years
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    placeholder="5"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Short Bio */}
          <div className="bg-white rounded-3xl border border-[#F1F5F9] shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[17px] font-bold text-[#1E293B]">
                Short Bio
              </h3>
              <span className="text-xs font-bold text-[#94A3B8] tracking-widest">
                {bio.length}/180
              </span>
            </div>
            <textarea
              className="w-full h-32 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 text-sm font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all resize-none placeholder:text-[#94A3B8]/60"
              placeholder="Introduce yourself and your coaching philosophy..."
              maxLength={180}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Specialties */}
          <div className="bg-white rounded-3xl border border-[#F1F5F9] shadow-sm p-8">
            <h3 className="text-[17px] font-bold text-[#1E293B] mb-6">
              Specialties
            </h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {specialties.map((tag, idx) => (
                <div
                  key={idx}
                  className="bg-[#F0F7FF] border border-[#D1E9FF] text-[#3B82F6] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => removeSpecialty(idx)}
                    className="cursor-pointer hover:text-red-500 transition-colors"
                  >
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
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4 text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#D1E9FF] transition-all"
              />
              <Plus
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] cursor-pointer"
                size={20}
                onClick={addSpecialty}
              />
            </div>
          </div>

          {/* Value Proposition */}
          <div className="bg-white rounded-3xl border border-[#F1F5F9] shadow-sm p-8">
            <h3 className="text-[17px] font-bold text-[#1E293B]">
              What This Coach Will Do
            </h3>
            <p className="text-sm text-[#64748B] font-medium mt-1 mb-8">
              List the specific values or services you provide to your clients.
            </p>

            <div className="space-y-4 mb-6">
              {services.map((service, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-lg bg-[#E0F2FE] flex items-center justify-center text-[#3B82F6]">
                    <Check size={14} />
                  </div>
                  <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-3 text-sm font-medium text-[#1E293B]">
                    {service}
                  </div>
                  <button
                    onClick={() => removeService(idx)}
                    className="w-6 h-6 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-6 h-6" />
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addService()}
                placeholder="Add new service..."
                className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-3 text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#3B82F6]"
              />
              <button
                onClick={addService}
                className="text-[#3B82F6] hover:opacity-80 transition-opacity"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto px-12 py-4 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#0B7A70] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save size={20} />
                Save & Continue
              </>
            )}
          </button>
          <p className="text-sm font-medium text-[#475569]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#3B82F6] font-bold hover:underline cursor-pointer">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
