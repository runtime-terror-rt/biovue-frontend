"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Star,
  Check,
  Send,
  Heart,
  X,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Moon,
  Target,
  Clock,
  CircleCheck,
  LayoutGrid,
  Info,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useConnectProfessionMutation,
  useGetConnectedProfessionsQuery,
  useUpdateLifestyleImageMutation,
  useGetCurrentImageQuery,
} from "@/redux/features/api/userDashboard/support";
import { useGetAiRecommendedProfessionalsQuery } from "@/redux/features/api/userDashboard/supportAiApi";
import {
  useGetMessagesByUserIdQuery,
  useSendMessageMutation,
} from "@/redux/features/api/userDashboard/messagesApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";
import SubscriptionGuard from "@/components/common/SubscriptionGuard";

// --- Mock Data ---
const RECOMMENDED_COACHES = [
  {
    id: 101,
    name: "Sarah Jenkins, RD",
    role: "NUTRITION COACH",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&auto=format&fit=crop",
    priority: "Already connected",
    priorityColor: "text-[#6B7280] bg-[#F3F4FB]",
    description:
      "Suggested due to irregular micronutrient variety and energy spikes in your nutritional data.",
  },
  {
    id: 102,
    name: "David Aris",
    role: "WELLNESS COACH",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&auto=format&fit=crop",
    priority: "Medium PRIORITY",
    priorityColor: "text-[#F59E0B] bg-[#FFFBEB]",
    description: "Recommended based on decreased deep sleep markers.",
  },
  {
    id: 103,
    name: "Marcus Chen",
    role: "PERSONAL TRAINER",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&auto=format&fit=crop",
    priority: "HIGH PRIORITY",
    priorityColor: "text-[#EF4444] bg-[#FEF2F2]",
    description:
      "Suggested due to low activity levels and a rising weight trend.",
  },
];

const ALL_PROFESSIONALS = [
  {
    id: 201,
    name: "Core Supplements",
    role: "SUPPLEMENT SHOP",
    avatar:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&h=300&auto=format&fit=crop",
    rating: 4.9,
    isShop: true,
  },
  {
    id: 202,
    name: "Sarah Jenkins, RD",
    role: "NUTRITION COACH",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&auto=format&fit=crop",
    rating: 4.9,
  },
  {
    id: 203,
    name: "David Aris",
    role: "WELLNESS COACH",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&auto=format&fit=crop",
    rating: 4.9,
  },
  {
    id: 204,
    name: "Marcus Chen",
    role: "PERSONAL TRAINER",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&auto=format&fit=crop",
    rating: 4.8,
  },
  {
    id: 205,
    name: "Elena Rios",
    role: "YOGA INSTRUCTOR",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&h=300&auto=format&fit=crop",
    rating: 4.7,
  },
  {
    id: 206,
    name: "John Doe",
    role: "THERAPIST",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&h=300&auto=format&fit=crop",
    rating: 4.6,
  },
];

const SHARED_GOALS = [
  {
    id: 1,
    title: "Improve Sleep Consistency",
    category: "SLEEP",
    icon: <Moon className="text-[#3B82F6]" />,
    target: "7.5—8 hours nightly, 5+ days per week",
    timeframe: "Next 30 days",
    progress: 71,
    status: "ON TRACK",
    statusColor: "text-[#10B981] bg-[#ECFDF5]",
    secondaryStatus: "COACH-APPROVED",
    coachNote:
      "Focus on consistent sleep timing before increasing total duration.",
    logCount: "5 / 7 days logged this week",
  },
  {
    id: 2,
    title: "Increase Daily Vegetable Intake",
    category: "NUTRITION",
    icon: <Sparkles className="text-[#3B82F6]" />,
    target: "3+ servings of leafy greens or cruciferous vegetables",
    timeframe: "Ongoing",
    progress: 71,
    status: "IN PROGRESS",
    statusColor: "text-[#3B82F6] bg-[#EFF6FF]",
    secondaryStatus: "COACH-APPROVED",
    coachNote:
      "Try adding one serving to your breakfast to hit your target earlier.",
    logCount: "5 / 7 days logged this week",
  },
  {
    id: 3,
    title: "Improve Sleep Consistency",
    category: "SLEEP",
    icon: <Moon className="text-[#3B82F6]" />,
    target: "7.5—8 hours nightly, 5+ days per week",
    timeframe: "Next 30 days",
    progress: 71,
    status: "ON TRACK",
    statusColor: "text-[#10B981] bg-[#ECFDF5]",
    secondaryStatus: "COACH-APPROVED",
    coachNote:
      "Focus on consistent sleep timing before increasing total duration.",
    logCount: "5 / 7 days logged this week",
  },
];

const LOCAL_PROFESSIONALS = [
  {
    id: 301,
    name: "Rahim Uddin",
    role: "FITNESS TRAINER",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
    rating: 4.8,
  },
  {
    id: 302,
    name: "Nusrat Jahan",
    role: "NUTRITION COACH",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300",
    rating: 4.9,
  },
];

const REMOTE_PROFESSIONALS = [
  {
    id: 401,
    name: "James Carter",
    role: "ONLINE COACH",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
    rating: 4.7,
  },
  {
    id: 402,
    name: "Elena Rios",
    role: "YOGA INSTRUCTOR",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
    rating: 4.8,
  },
];
// --- Sub-components ---

const SafeImage = ({
  src,
  alt,
  width,
  height,
  className,
  fallback = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&auto=format&fit=crop",
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      fill={!width && !height}
      unoptimized
      className={className}
      onError={() => setImgSrc(fallback)}
    />
  );
};

const RecommendationCard = ({
  coach,
  onView,
}: {
  coach: any;
  onView: () => void;
}) => {
  const [imgSrc, setImgSrc] = useState(coach.avatar);

  return (
    <div className="bg-white rounded-[16px] p-6 border border-[#3A86FF]/25 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
          <SafeImage
            src={coach.avatar}
            alt={coach.name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>

        <span
          className={cn(
            "text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider",
            coach.priorityColor,
          )}
        >
          {coach.priority}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[#3A86FF] text-[10px] font-bold uppercase tracking-widest leading-none">
          {coach.role}
        </span>
        <h3 className="text-lg font-bold text-[#1F2D2E]">{coach.name}</h3>
      </div>
      <div className="bg-[#F3F4F6] rounded-xl p-4 min-h-21 flex items-center">
        <p className="text-[#5F6F73] text-[11px] italic leading-relaxed">
          &quot;{coach.description}&quot;
        </p>
      </div>
      <button
        onClick={onView}
        className="w-full mt-auto py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group bg-[#6C91C2] text-white hover:bg-[#5a7da9] text-sm cursor-pointer"
      >
        View Profile
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  );
};

const SupportTeamCard = ({
  member,
  onMessage,
  onGoals,
}: {
  member: any;
  onMessage: () => void;
  onGoals: () => void;
}) => {
  const [imgSrc, setImgSrc] = useState(member.avatar);

  return (
    <div className="bg-white rounded-[16px] p-6 border border-[#3A86FF]/25 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-5 min-w-[320px]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
            <SafeImage
              src={member.avatar}
              alt={member.name}
              width={56}
              height={56}
              className="object-cover"
              fallback="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&auto=format&fit=crop"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[#3A86FF] text-[9px] font-bold uppercase tracking-widest">
              {member.role}
            </span>
            <h3 className="text-base font-bold text-[#1F2D2E]">
              {member.name}
            </h3>
            <p className="text-[#5F6F73] text-[10px] font-medium">
              Currently Support your goal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#10B981]/10 bg-[#ECFDF5] w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span className="text-[10px] font-bold text-[#10B981]">Active</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onMessage}
          className="flex-1 bg-[#0FA4A9] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#0d8d91] transition-all cursor-pointer"
        >
          Message Coach
          <MessageSquare size={14} />
        </button>
        <button className="flex-1 border border-[#0FA4A9]/20 text-[#0FA4A9] bg-[#0FA4A9]/5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-default">
          Connected
          <Check size={14} />
        </button>
      </div>
    </div>
  );
};

const BrowseCard = ({ item, onView }: { item: any; onView: () => void }) => {
  const [imgSrc, setImgSrc] = useState(item.avatar);

  return (
    <div className="bg-white rounded-[16px] p-6 border border-[#3A86FF]/25 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center text-center gap-4 min-w-[280px]">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
        <SafeImage
          src={item.avatar}
          alt={item.name}
          width={64}
          height={64}
          className="object-cover w-full h-full"
          fallback="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&auto=format&fit=crop"
        />
      </div>
      <div className="flex flex-col gap-1 items-center">
        <span className="text-[#3A86FF] text-[10px] font-bold uppercase tracking-widest">
          {item.role}
        </span>
        <h3 className="text-base font-bold text-[#1F2D2E]">{item.name}</h3>
        <div className="flex items-center gap-1 mt-0.5">
          <Star size={14} className="text-orange-400 fill-orange-400" />
          <span className="text-sm font-bold text-[#1F2D2E]">
            {item.rating}
          </span>
        </div>
      </div>
      <button
        onClick={onView}
        className="w-full bg-[#6C91C2] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#5a7da9] transition-all group cursor-pointer"
      >
        {item.isShop ? "View Shop" : "View Profile"}
        <ArrowRight
          size={14}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  );
};

// --- Main Pages ---

const SupportPage = () => {
  const user = useSelector(selectCurrentUser);
  const [nearTab, setNearTab] = useState<"local" | "remote">("local");
  const { data: recommendationsData, isLoading: isLoadingRecommendations } =
    useGetAiRecommendedProfessionalsQuery(user?.id, { skip: !user?.id });

  const { data: connectedData, isLoading: isLoadingConnected } =
    useGetConnectedProfessionsQuery();

  const [supportTeamIndex, setSupportTeamIndex] = useState(0);
  const [browseIndex, setBrowseIndex] = useState(0);

  const getFullImageUrl = (url?: any, defaultUrl?: string) => {
    const fallback =
      defaultUrl ||
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&auto=format&fit=crop";

    if (
      !url ||
      typeof url !== "string" ||
      url === "null" ||
      url === "undefined"
    ) {
      return fallback;
    }

    if (url.startsWith("http")) return url;

    const base = "https://ai.biovuedigitalwellness.com";
    const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
    return `${base}${normalizedUrl}`;
  };

  const sanitizeArrayField = (arr: any) => {
    if (!arr || !Array.isArray(arr)) return [];
    // Handle the case where the array contains stringified JSON or weirdly formatted strings
    return arr
      .map((item) => {
        if (typeof item !== "string") return String(item);
        // Remove characters like [, ], and extra quotes
        return item.replace(/[\[\]"]/g, "").trim();
      })
      .filter((item) => item.length > 0);
  };

  const suggestions = recommendationsData?.suggestions || [];
  const connectedProfessions = connectedData?.data || [];

  const displaySupportTeam = (
    Array.isArray(connectedProfessions) ? connectedProfessions : []
  ).map((item: any) => ({
    id: item.professional_info?.id || item.id,
    name: item.professional_info?.name || item.name,
    role: "COACH",
    avatar: getFullImageUrl(
      item.professional_info?.profile_image || item.image_url,
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&auto=format&fit=crop",
    ),
    status: "Active",
  }));

  const recommendedCoaches = suggestions.slice(0, 3).map((item: any) => ({
    ...item,
    id: item.professional?.id || item.id,
    name: item.professional?.name || item.name,
    role: (
      item.professional_type ||
      item.professional?.profession_type ||
      "coach"
    )
      .replace(/_/g, " ")
      .toUpperCase(),
    avatar: getFullImageUrl(
      item.professional?.profile?.image || item.professional?.profile_image,
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&auto=format&fit=crop",
    ),
    priority:
      item.priority === "High"
        ? "HIGH PRIORITY"
        : item.priority === "Medium"
          ? "MEDIUM PRIORITY"
          : "LOW PRIORITY",
    priorityColor:
      item.priority === "High"
        ? "text-[#EF4444] bg-[#FEF2F2]"
        : item.priority === "Medium"
          ? "text-[#F59E0B] bg-[#FFFBEB]"
          : "text-[#6B7280] bg-[#F3F4FB]",
    description: item.match_reason || "Based on your clinical health data.",
    bio:
      item.professional?.profile?.bio ||
      "Helps busy professionals improve body composition, energy, and consistency through data-driven lifestyle adjustments.",
    specialties: item.professional?.profile?.specialties?.length
      ? sanitizeArrayField(item.professional.profile.specialties)
      : ["Fat loss", "Strength", "Habit building", "Nutrition guidance"],
    services: item.professional?.profile?.services?.length
      ? sanitizeArrayField(item.professional.profile.services)
      : [
          "Set personalized goals",
          "Monitor your progress",
          "Provide weekly guidance",
          "Adjust targets based on your data",
        ],
  }));

  const browseProfessionals = suggestions.slice(3).map((item: any) => ({
    ...item,
    id: item.professional?.id || item.id,
    name: item.professional?.name || item.name,
    role: (
      item.professional_type ||
      item.professional?.profession_type ||
      "coach"
    )
      .replace(/_/g, " ")
      .toUpperCase(),
    avatar: getFullImageUrl(
      item.professional?.profile?.image || item.professional?.profile_image,
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&auto=format&fit=crop",
    ),
    rating: item.relevance_score
      ? (item.relevance_score / 20).toFixed(1)
      : "4.8",
    isShop:
      item.professional_type === "supplement_supplier" ||
      item.professional?.profession_type === "supplement_supplier",
    bio:
      item.professional?.profile?.bio ||
      item.bio ||
      "Quality products tailored to your needs.",
    specialties: item.professional?.profile?.specialties?.length
      ? sanitizeArrayField(item.professional.profile.specialties)
      : ["Supplementation", "Recovery"],
    services: item.professional?.profile?.services?.length
      ? sanitizeArrayField(item.professional.profile.services)
      : ["Provide quality products", "Nutrition advice"],
  }));

  const displayRecommended =
    suggestions.length > 0 ? recommendedCoaches : RECOMMENDED_COACHES;
  const displayBrowse =
    suggestions.length > 0 ? browseProfessionals : ALL_PROFESSIONALS;

  const [view, setView] = useState<
    "dashboard" | "chat" | "goals" | "detail" | "success"
  >("dashboard");
  const [selectedCoach, setSelectedCoach] = useState<any>(
    RECOMMENDED_COACHES[0],
  );
  const [healthImage, setHealthImage] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [updateLifestyleImage, { isLoading: isUploading }] =
    useUpdateLifestyleImageMutation();
  const { data: currentImageData, isLoading: isLoadingImage } =
    useGetCurrentImageQuery();

  useEffect(() => {
    if (currentImageData?.data?.current_image) {
      setHealthImage(currentImageData.data.current_image);
    } else if (currentImageData?.data?.image_url) {
      setHealthImage(currentImageData.data.image_url);
    } else if (currentImageData?.current_image) {
      setHealthImage(currentImageData.current_image);
    } else if (currentImageData?.image_url) {
      setHealthImage(currentImageData.image_url);
    } else if (user?.current_image) {
      setHealthImage(user.current_image);
    }
  }, [currentImageData, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [connectProfession, { isLoading: isConnecting }] =
    useConnectProfessionMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const { data: messagesData, isLoading: isLoadingMessages } =
    useGetMessagesByUserIdQuery(selectedCoach?.id, {
      skip: !selectedCoach?.id || view !== "chat",
    });

  const messages = messagesData || [];

  useEffect(() => {
    if (view === "chat") {
      scrollToBottom();
    }
  }, [messages, view]);

  const handleConnect = async () => {
    if (!selectedCoach?.id) return;
    try {
      await connectProfession({ profession_id: selectedCoach.id }).unwrap();
      setView("success");
    } catch (error) {
      console.error("Failed to connect:", error);
      toast.error("Failed to connect with coach");
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedCoach?.id) return;
    try {
      await sendMessage({
        receiver_id: selectedCoach.id,
        message: messageInput.trim(),
      }).unwrap();
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("current_image", file);

      try {
        const response = await updateLifestyleImage(formData).unwrap();
        if (response.success) {
          setHealthImage(response.image_url);
          toast.success("Health update image uploaded successfully!");
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
        toast.error("Failed to upload image. Please try again.");
      }
    }
  };

  const handleSelectCoach = (coach: any) => {
    setSelectedCoach(coach);
    setView("detail");
  };

  if (view === "chat") {
    return (
      <SubscriptionGuard>
        <div className="flex flex-col h-[calc(100vh-100px)] container mx-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-[32px] font-bold text-[#1F2D2E]">Messages</h1>
              <p className="text-[#5F6F73] text-[15px] font-medium ">
                Communicate with your Trainer
              </p>
            </div>
            <button
              disabled={isConnecting}
              onClick={handleConnect}
              className="bg-[#0FA4A9] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] hover:bg-[#0d8d91] transition-all cursor-pointer shadow-lg shadow-[#0FA4A9]/20 disabled:opacity-50"
            >
              {isConnecting ? "Connecting..." : "Connect With This Coach"}
            </button>
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-[#3A86FF]/25 shadow-sm flex flex-col overflow-hidden relative">
            {/* Coach Meta Bar */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm relative">
                  <SafeImage
                    src={selectedCoach.avatar}
                    alt={selectedCoach.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[15px] font-bold text-[#1F2D2E] leading-tight">
                    {selectedCoach.name}
                  </h3>
                  <span className="text-[11px] font-bold text-[#8B5CF6] uppercase tracking-[0.05em]">
                    {selectedCoach.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-8 bg-[#F8FAFB]/40">
              {/* Date separator */}
              <div className="flex items-center gap-4 py-2">
                <span className="text-[11px] font-bold text-[#9BAFB3] uppercase tracking-widest whitespace-nowrap">
                  Today - 8:30 AM
                </span>
              </div>

              <div className="flex flex-col gap-8">
                {isLoadingMessages ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-[#0FA4A9]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 font-medium">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg: any) => {
                    const isCoach = msg.sender_id === selectedCoach.id;

                    if (isCoach) {
                      return (
                        <div
                          key={msg.id}
                          className="flex flex-col gap-2 max-w-[85%]"
                        >
                          <div className="bg-white text-[#1F2D2E] p-6 rounded-[24px] rounded-tl-none border border-gray-100 shadow-sm text-[16px] leading-[1.6]">
                            {msg.message}
                          </div>
                          <span className="text-[10px] font-bold text-[#9BAFB3] ml-2">
                            Today -{" "}
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className="flex flex-col items-end gap-2 ml-auto max-w-[85%]"
                      >
                        <div className="bg-[#BCF1DD] text-[#1F2D2E] p-6 rounded-[24px] rounded-tr-none text-[16px] leading-[1.6] shadow-sm font-medium">
                          {msg.message}
                        </div>
                        <span className="text-[10px] font-bold text-[#9BAFB3] mr-2">
                          Today -{" "}
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-6 md:p-8 bg-white border-t border-gray-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-center bg-white rounded-2xl px-8 border border-gray-200 group focus-within:border-[#0FA4A9] focus-within:ring-4 focus-within:ring-[#0FA4A9]/5 transition-all shadow-sm"
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent py-6 outline-none text-base text-[#1F2D2E] placeholder:text-[#9BAFB3]"
                />
                <button
                  type="submit"
                  disabled={isSending || !messageInput.trim()}
                  className="text-[#1F2D2E] hover:text-[#0FA4A9] transition-all p-2 cursor-pointer disabled:opacity-30"
                >
                  {isSending ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Send size={28} className="-rotate-12" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </SubscriptionGuard>
    );
  }

  if (view === "goals") {
    return (
      <SubscriptionGuard>
        <div className="flex flex-col gap-8 container mx-auto p-4 md:p-8 pb-20">
          <div className="flex flex-col gap-6">
            <button
              onClick={() => setView("dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-lg text-[#5F6F73] text-xs font-semibold hover:bg-gray-50 transition-all w-fit cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to Support
            </button>

            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-[#1F2D2E]">
                Shared Goals
              </h1>
              <p className="text-[#5F6F73] text-sm font-medium">
                Goals aligned between you and your coach to guide your progress
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {SHARED_GOALS.map((goal, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-[#3A86FF]/25 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col gap-8 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                      {goal.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#5F6F73] text-[9px] font-bold uppercase tracking-widest">
                        {goal.category}
                      </span>
                      <h3 className="text-xl font-bold text-[#1F2D2E]">
                        {goal.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-6 mt-4">
                        <div className="flex items-center gap-3">
                          <Target size={16} className="text-[#9BAFB3]" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#9BAFB3] uppercase tracking-wider">
                              Target
                            </span>
                            <span className="text-sm font-bold text-[#1F2D2E]">
                              {goal.target}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock size={16} className="text-[#9BAFB3]" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#9BAFB3] uppercase tracking-wider">
                              Timeframe
                            </span>
                            <span className="text-sm font-bold text-[#1F2D2E]">
                              {goal.timeframe}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-6 px-3 py-1.5 rounded-lg border border-[#10B981]/10 bg-[#ECFDF5] w-fit">
                        <CircleCheck size={14} className="text-[#10B981]" />
                        <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">
                          {goal.secondaryStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 min-w-70">
                    <div
                      className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider self-end",
                        goal.statusColor,
                      )}
                    >
                      ● {goal.status}
                    </div>
                    <div className="bg-[#F8FAFB] rounded-2xl p-6 border border-gray-50">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold text-[#9BAFB3] uppercase tracking-widest">
                          COACH NOTE
                        </span>
                        <p className="text-[11px] text-[#5F6F73] italic leading-relaxed font-semibold">
                          &quot;{goal.coachNote}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#1F2D2E]">
                    <span className="text-[#9BAFB3] uppercase tracking-widest">
                      Current Progress
                    </span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0FA4A9] rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#1F2D2E] mt-1">
                    {goal.logCount}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <button className="bg-[#0FA4A9] text-white px-6 py-3.5 rounded-xl text-xs hover:bg-[#0d8d91] transition-all shadow-lg shadow-[#0FA4A9]/10 font-bold cursor-pointer">
                    View Habit Progress
                  </button>
                  <button className="border border-gray-200 text-[#1F2D2E] px-6 py-3.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all bg-white cursor-pointer">
                    Log Today&apos;s Habit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#F4FAFB] rounded-3xl p-6 flex gap-5 border border-[#3A86FF]/25 ">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
              <Info size={24} className="text-[#3A86FF]" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-[#1F2D2E]">
                Coach Guidance Note
              </h3>
              <p className="text-[12px] text-[#5F6F73] leading-relaxed">
                Your coach reviews these goals regularly. Adjustments may occur
                as your habits evolve or as your biological markers respond to
                these targets. This is a collaborative roadmap designed for
                sustainable wellness.
              </p>
            </div>
          </div>
        </div>
      </SubscriptionGuard>
    );
  }

  if (view === "detail") {
    return (
      <SubscriptionGuard>
        <div className="flex flex-col gap-8 p-4 md:p-8 container mx-auto pb-20">
          <button
            onClick={() => setView("dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-lg text-[#5F6F73] text-xs font-semibold hover:bg-gray-50 transition-all w-fit cursor-pointer shadow-sm"
          >
            <ArrowLeft size={14} />
            Back to Support
          </button>

          <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#3A86FF]/25 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col items-center text-center gap-8 relative overflow-hidden">
            <div className="relative">
              <div className="w-40 h-40 rounded-[32px] overflow-hidden border-8 border-[#3A86FF]/5 relative">
                <SafeImage
                  src={selectedCoach.avatar}
                  alt={selectedCoach.name}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-[#0FA4A9] flex items-center justify-center text-white border-4 border-white shadow-lg">
                <Check size={20} strokeWidth={3} />
              </div>
            </div>

            <div className="flex flex-col gap-3 items-center">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-[#1F2D2E]">
                  {selectedCoach.name}
                </h1>
                <div className="flex items-center gap-1.5 bg-[#E4EFFF] text-[#3A86FF] px-3 py-1 rounded-lg text-[11px] font-bold border border-[#3A86FF]/10">
                  <Check size={14} strokeWidth={3} />
                  VERIFIED
                </div>
              </div>
              <span className="text-[#3A86FF] font-bold text-base tracking-[0.2em] uppercase">
                {selectedCoach.role}
              </span>
            </div>

            <p className="text-[#5F6F73] text-lg leading-relaxed italic max-w-2xl">
              &quot;
              {selectedCoach.bio ||
                "Helps busy professionals improve body composition, energy, and consistency through data-driven lifestyle adjustments."}
              &quot;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Specialties */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#3A86FF]/25 shadow-sm flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shadow-inner">
                  <Sparkles size={24} className="text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-[#1F2D2E]">
                  Specialties
                </h2>
              </div>
              <div className="flex flex-col gap-5">
                {(
                  selectedCoach.specialties || [
                    "Fat loss",
                    "Strength",
                    "Habit building",
                    "Nutrition guidance",
                  ]
                ).map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-full bg-[#E4EFFF] flex items-center justify-center shrink-0">
                      <Check
                        size={16}
                        className="text-[#3A86FF]"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-[#5F6F73] text-[17px] font-semibold">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* What this coach will do for you */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#3A86FF]/25 shadow-sm flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shadow-inner">
                  <Check size={24} className="text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-[#1F2D2E]">
                  What this coach will do for you
                </h2>
              </div>
              <div className="flex flex-col gap-5">
                {(
                  selectedCoach.services || [
                    "Set personalized goals",
                    "Monitor your progress",
                    "Provide weekly guidance",
                    "Adjust targets based on your data",
                  ]
                ).map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-full bg-[#E4EFFF] flex items-center justify-center shrink-0">
                      <Check
                        size={16}
                        className="text-[#3A86FF]"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-[#5F6F73] text-[17px] font-semibold">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-[#F4FBFA] rounded-3xl p-10 flex flex-col md:flex-row items-center justify-center gap-8 border border-[#3A86FF]/25">
            <div className="flex flex-col items-stretch gap-5 w-full max-w-2xl">
              <button
                disabled={isConnecting}
                onClick={handleConnect}
                className="flex-1 bg-[#0FA4A9] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#0d8d91] transition-all cursor-pointer shadow-xl shadow-[#0FA4A9]/20 disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Connect With This Coach"}
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setView("chat");
                      handleSendMessage();
                    }
                  }}
                  placeholder="Pre-Hire Inquiries"
                  className="w-full h-full bg-white border border-gray-100 rounded-2xl py-5 px-8 text-base md:text-lg outline-none pr-16 shadow-sm"
                />
                <button
                  onClick={() => {
                    setView("chat");
                    handleSendMessage();
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[#1F2D2E] hover:text-[#0FA4A9] transition-all cursor-pointer"
                >
                  <Send size={24} className="rotate-[-30deg]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </SubscriptionGuard>
    );
  }

  if (view === "success") {
    return (
      <SubscriptionGuard>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F4FBFA]/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-10 md:p-14 max-w-xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#3A86FF]/25 flex flex-col items-center text-center gap-8 relative">
            <button
              onClick={() => setView("dashboard")}
              className="absolute top-6 right-6 text-[#1F2D2E] hover:bg-gray-50 p-2 rounded-full transition-all cursor-pointer outline-none"
            >
              <X size={24} />
            </button>

            <div className="w-24 h-24 rounded-full bg-[#E4FBF7] flex items-center justify-center relative">
              <div className="w-20 h-20 rounded-full border-[1.5px] border-[#0FA4A9]/20 flex items-center justify-center animate-pulse">
                <Check size={40} className="text-[#0FA4A9]" strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold text-[#1F2D2E]">
                Connection Secured
              </h2>
              <p className="text-[#5F6F73] text-base leading-relaxed max-w-sm font-medium">
                You are now synced with {selectedCoach.name}. Your projection
                data is being shared securely.
              </p>
            </div>

            <button
              onClick={() => setView("dashboard")}
              className="w-full bg-[#0FA4A9] text-white py-4.5 rounded-2xl font-bold text-lg hover:bg-[#0d8d91] transition-all cursor-pointer shadow-xl shadow-[#0FA4A9]/20"
            >
              Back To Dashboard
            </button>
          </div>
        </div>
      </SubscriptionGuard>
    );
  }

  if (view === "dashboard") {
    const isPageLoading = isLoadingRecommendations || isLoadingConnected;

    return (
      <SubscriptionGuard>
        <div className="flex flex-col gap-12 container mx-auto pb-24 min-h-[95vh]">
          {isPageLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4 animate-in fade-in duration-700">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-[#0FA4A9]/10 border-t-[#0FA4A9] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles
                    size={20}
                    className="text-[#0FA4A9] animate-pulse"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <h3 className="text-lg font-bold text-[#1F2D2E]">
                  Loading Experience
                </h3>
                <p className="text-[#5F6F73] text-sm font-medium">
                  Curating your personalized professional network...
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12">
              {/* Header and Upload Area */}
              <div className="flex flex-col gap-8">
                {/* Navigation & Title */}
                <div className="flex flex-col gap-6">
                  <Link href="/user-dashboard">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-lg text-[#5F6F73] text-xs font-semibold hover:bg-gray-50 transition-all cursor-pointer shadow-sm w-fit">
                      <ArrowLeft size={14} />
                      Back to Dashboard
                    </button>
                  </Link>

                  <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-[#1F2D2E] mb-2">
                      Support
                    </h1>
                    <p className="text-[#5F6F73] text-sm font-medium">
                      Get personalized help based on your health data
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Area */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-[#3A86FF] font-bold text-[11px] tracking-widest uppercase">
                    <Sparkles size={16} className="fill-[#3A86FF]" />
                    Other professionals you may explore
                  </div>
                  <p className="text-[#5F6F73] text-xs font-medium">
                    Based on your health data and projections, these
                    professionals can help you most right now.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayRecommended.map((coach: any) => (
                    <RecommendationCard
                      key={coach.id}
                      coach={coach}
                      onView={() => handleSelectCoach(coach)}
                    />
                  ))}
                </div>
              </div>

              {/* Your Support Team */}
              <div className="flex flex-col gap-6 pt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#1F2D2E]">
                    Your support team
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setSupportTeamIndex((prev) => Math.max(0, prev - 1))
                      }
                      disabled={supportTeamIndex === 0}
                      className="p-2 rounded-full border border-gray-100 bg-white hover:bg-gray-50 transition-all text-[#1F2D2E] cursor-pointer disabled:opacity-30"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setSupportTeamIndex((prev) =>
                          Math.min(
                            Math.max(0, displaySupportTeam.length - 4),
                            prev + 1,
                          ),
                        )
                      }
                      disabled={
                        supportTeamIndex >= displaySupportTeam.length - 4
                      }
                      className="p-2 rounded-full border border-gray-100 bg-white hover:bg-gray-50 transition-all text-[#1F2D2E] cursor-pointer disabled:opacity-30"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                  {displaySupportTeam.length === 0 ? (
                    <div className="w-full text-center py-8 text-gray-400 font-medium">
                      No connected professionals yet.
                    </div>
                  ) : (
                    displaySupportTeam
                      .slice(supportTeamIndex, supportTeamIndex + 4)
                      .map((member: any) => (
                        <SupportTeamCard
                          key={member.id}
                          member={member}
                          onMessage={() => {
                            setSelectedCoach(member);
                            setView("chat");
                          }}
                          onGoals={() => setView("goals")}
                        />
                      ))
                  )}
                </div>
              </div>

              {/* Browse All Professionals */}
              <div className="flex flex-col gap-6 pb-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#1F2D2E]">
                    Browse all professionals
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setBrowseIndex((prev) => Math.max(0, prev - 1))
                      }
                      disabled={browseIndex === 0}
                      className="p-2 rounded-full border border-gray-100 bg-white hover:bg-gray-50 transition-all text-[#1F2D2E] cursor-pointer disabled:opacity-30"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setBrowseIndex((prev) =>
                          Math.min(
                            Math.max(0, displayBrowse.length - 3),
                            prev + 1,
                          ),
                        )
                      }
                      disabled={browseIndex >= displayBrowse.length - 3}
                      className="p-2 rounded-full border border-gray-100 bg-white hover:bg-gray-50 transition-all text-[#1F2D2E] cursor-pointer disabled:opacity-30"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-[#5F6F73] text-[13px] font-medium -mt-4">
                  Discover expert help across the BioVue network.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayBrowse
                    .slice(browseIndex, browseIndex + 3)
                    .map((item: any) => (
                      <BrowseCard
                        key={item.id}
                        item={item}
                        onView={() => handleSelectCoach(item)}
                      />
                    ))}
                </div>
              </div>
              {/* Near You Section */}
              <div className="flex flex-col gap-6 pb-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold text-[#1F2D2E]">
                    See who is near you
                  </h2>
                  <p className="text-[#5F6F73] text-sm">
                    Discover professionals based on your location or work
                    remotely.
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 bg-[#F3F4F6] p-1 rounded-xl w-fit">
                  <button
                    onClick={() => setNearTab("local")}
                    className={cn(
                      "px-4 py-2 rounded-lg cursor-pointer hover:opacity-80 text-xs font-bold transition-all",
                      nearTab === "local"
                        ? "bg-white shadow text-[#0FA4A9]"
                        : "text-[#5F6F73]",
                    )}
                  >
                    Local Professionals
                  </button>

                  <button
                    onClick={() => setNearTab("remote")}
                    className={cn(
                      "px-4 py-2 rounded-lg cursor-pointer hover:opacity-80 text-xs font-bold transition-all",
                      nearTab === "remote"
                        ? "bg-white shadow text-[#0FA4A9]"
                        : "text-[#5F6F73]",
                    )}
                  >
                    Remote Professionals
                  </button>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(nearTab === "local"
                    ? LOCAL_PROFESSIONALS
                    : REMOTE_PROFESSIONALS
                  ).map((item) => (
                    <BrowseCard
                      key={item.id}
                      item={item}
                      onView={() => handleSelectCoach(item)}
                    />
                  ))}
                </div>
              </div>
              {/* Footer Banner */}
              <div className="bg-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 border border-[#3A86FF]/25 relative overflow-hidden">
                <div className="w-16 h-16 rounded-4xl bg-[#0FA4A9] flex items-center justify-center shrink-0 shadow-lg shadow-[#0FA4A920]">
                  <Heart size={32} className="text-white fill-white" />
                </div>
                <div className="flex flex-col gap-2 text-center md:text-left">
                  <h3 className="text-xl font-bold text-[#1F2D2E]">
                    {recommendationsData?.trend?.topic ||
                      "Why professional support matters"}
                  </h3>
                  <p className="text-[#5F6F73] text-[15px] leading-relaxed ">
                    {recommendationsData?.trend?.description ||
                      "Working with a coach or clinic can dramatically improve your progress and long-term outcomes. BioVue data shows users with dedicated support hit their 5-year goals faster."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SubscriptionGuard>
    );
  }

  return null;
};

export default SupportPage;
