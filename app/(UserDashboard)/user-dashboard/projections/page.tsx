"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Activity,
  Zap,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Upload,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAppSelector } from "@/redux/store/hooks";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";
import { useCreateFutureGoalMutation } from "@/redux/features/api/userDashboard/Projection/FutureGoal";
import {
  ProjectionResponse,
  useCurrentLifestyleProjectionMutation,
} from "@/redux/features/api/userDashboard/Projection/CurrentProjection";
import { useGetLatestProjectionQuery } from "@/redux/features/api/userDashboard/Projection/GetCurrentProjection";
import { useSaveCurrentProjectionMutation } from "@/redux/features/api/userDashboard/Projection/SaveCurrentProjection";
import { useSaveFutureGoalMutation } from "@/redux/features/api/userDashboard/Projection/SaveFutureGoal";
import { useGetFutureGoalProjectionQuery } from "@/redux/features/api/userDashboard/Projection/GetFutureGoal";
import { 
  useCombinedProjectionMutation,
  CombinedProjectionResponse,
  IndividualProjection 
} from "@/redux/features/api/userDashboard/Projection/CombinedProjection";
import { 
  useUpdateAiCurrentInsightsMutation, 
  useUpdateAiFutureInsightsMutation 
} from "@/redux/features/api/userDashboard/Projection/AIInsightsAPI";
import { useRouter } from "next/navigation";
import ProjectionGallery from "@/components/dashboard/ProjectionGallery";

type Step = "input" | "loading" | "results";
type TimeHorizon = "6 months" | "1 year" | "5 years";

const ProjectionsPage = () => {
  const [step, setStep] = useState<Step>("input");
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>("6 months");
  const [resolution, setResolution] = useState<"1k" | "2k" | "4k">("1k");
  const [quality, setQuality] = useState<"fast" | "ultra">("fast");
  const [projectionImage, setProjectionImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [combinedProjectionData, setCombinedProjectionData] =
    useState<CombinedProjectionResponse | null>(null);


  

  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  const [combinedProjection, { isLoading: isCombinedLoading }] =
    useCombinedProjectionMutation();

  const [updateCurrentInsights, { isLoading: isUpdatingCurrent }] = useUpdateAiCurrentInsightsMutation();
  const [updateFutureInsights, { isLoading: isUpdatingFuture }] = useUpdateAiFutureInsightsMutation();

  const [saveCurrentProjection, { isLoading: isSaveLoading }] =
    useSaveCurrentProjectionMutation();
  const [saveFutureGoal, { isLoading: isSaveFutureLoading }] =
    useSaveFutureGoalMutation();

  const { data: latestProjection } = useGetLatestProjectionQuery(
    user?.id ?? "",
    {
      skip: true, // skip: !user?.id,
    },
  );

  const { data: futureGoalProjection } = useGetFutureGoalProjectionQuery(
    user?.id ?? "",
    {
      skip: true, // skip: !user?.id,
    },
  );

  const getFullProjectionUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const base = "https://ai.biovuedigitalwellness.com";
    const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
    return `${base}${normalizedUrl}`;
  };

  const loadingTexts = [
    "Analyzing habits and routines…",
    " Evaluating diet, activity, and sleep…",
    " Calculating health and risk factors…",
    " Projecting future body and wellness…",
    " Generating photorealistic outcome…",
    " Preparing your personalized report….",
  ];
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProjectionImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Loading text rotation
  useEffect(() => {
    if (step !== "loading") return;

    setLoadingTextIndex(0);

    const textInterval = setInterval(() => {
      setLoadingTextIndex((prev) => {
        if (prev < loadingTexts.length - 1) return prev + 1;
        return prev;
      });
    }, 10000);

    return () => clearInterval(textInterval);
  }, [step]);

  const handleNavigateWithInsights = async (path: string) => {
    if (!user?.id) {
      router.push(path);
      return;
    }
    
    try {
      await Promise.all([
        updateCurrentInsights({ user_id: user.id.toString() }).unwrap(),
        updateFutureInsights({ user_id: user.id.toString(), timeframe: timeHorizon }).unwrap()
      ]);
    } catch (e) {
      console.error("Failed to update insights prior to navigation", e);
    }
    
    router.push(path);
  };

  const handleGenerate = async () => {
    if (!user?.id) {
      toast.error("Please login to generate projection");
      return;
    }

    if (!projectionImage) {
      toast.error("Please upload an image");
      return;
    }

    setStep("loading");

    try {
      const response = await combinedProjection({
        user_id: user.id.toString(),
        image: projectionImage as File,
        timeframe: timeHorizon,
        resolution: resolution.toUpperCase(),
      }).unwrap();

      setCombinedProjectionData(response);

      toast.success("Projections generated successfully!");
      setStep("results");
    } catch (err: any) {
      setStep("input");
      toast.error(err?.data?.message || "Failed to generate projections.");
    }
  };

  const renderInputStep = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Left Column */}
      <div className="space-y-8">
        <div className="space-y-4">
          <Link
            href="/user-dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all w-fit cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-[#041228]">
            Your Future Projection
          </h1>
          <h2 className="text-xl font-bold text-[#041228]">
            Explore how your current habits may shape your future health.
          </h2>
          <p className="text-[#5F6F73] leading-relaxed max-w-xl">
            BioVue uses your lifestyle data and uploaded photos to create visual
            and data-based future projections under different scenarios. These
            insights help you visualize long-term trends in vitality, body
            composition, and aging markers.
          </p>
        </div>

        {/* Time Horizon Selector */}
        <div className="bg-white rounded-xl p-6 border border-[#3A86FF]/25 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E4EFFF] rounded-lg flex items-center justify-center">
              <Calendar className="text-[#3A86FF]" size={20} />
            </div>
            <span className="font-bold text-[#041228]">
              Choose a time horizon
            </span>
          </div>

          <div className="flex p-1 bg-[#F8FAFF] border border-gray-200 rounded-xl w-full">
            {(["6 months", "1 year", "5 years"] as TimeHorizon[]).map(
              (time) => (
                <button
                  key={time}
                  onClick={() => setTimeHorizon(time)}
                  className={cn(
                    "flex-1 py-3 rounded-lg text-sm font-bold transition-all cursor-pointer",
                    timeHorizon === time
                      ? "bg-[#3A86FF]/20 text-[#3A86FF]"
                      : "text-gray-500 hover:text-[#041228]",
                  )}
                >
                  {time}
                </button>
              ),
            )}
          </div>
        </div>


        {/* Render Settings */}
        <div className="bg-white rounded-xl p-6 border border-[#3A86FF]/25 shadow-sm space-y-6">
          <h3 className="font-bold text-[#041228]">Render Settings</h3>

          {/* Resolution */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#5F6F73]">Resolution</p>
            <div
              onClick={() => setResolution("1k")}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                resolution === "1k"
                  ? "border-[#3A86FF] bg-[#F8FAFF]"
                  : "border-gray-100 hover:border-gray-200",
              )}
            >
              <span className="font-semibold text-[#041228]">1K</span>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  resolution === "1k"
                    ? "border-[#3A86FF] bg-[#3A86FF]"
                    : "border-gray-300",
                )}
              >
                {resolution === "1k" && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
            <div
              onClick={() => setResolution("2k")}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                resolution === "2k"
                  ? "border-[#3A86FF] bg-[#F8FAFF]"
                  : "border-gray-100 hover:border-gray-200",
              )}
            >
              <span className="font-semibold text-[#041228]">2K</span>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  resolution === "2k"
                    ? "border-[#3A86FF] bg-[#3A86FF]"
                    : "border-gray-300",
                )}
              >
                {resolution === "2k" && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
              <span className="font-semibold text-gray-400">4K</span>
              <span className="text-xs font-semibold text-gray-400">
                Pro user
              </span>
            </div>
          </div>

          {/* Quality */}
          {/* <div className="space-y-3">
            <p className="text-sm font-semibold text-[#5F6F73]">Quality</p>

            <div
              onClick={() => setQuality("fast")}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                quality === "fast"
                  ? "border-[#3A86FF] bg-[#F8FAFF]"
                  : "border-gray-100 hover:border-gray-200",
              )}
            >
              <span className="font-semibold text-[#041228]">Fast</span>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  quality === "fast"
                    ? "border-[#3A86FF] bg-[#3A86FF]"
                    : "border-gray-300",
                )}
              >
                {quality === "fast" && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
              <span className="font-semibold text-gray-400">Ultra</span>
              <span className="text-xs font-semibold text-gray-400">
                Pro user
              </span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="bg-white rounded-[24px] overflow-hidden border border-[#3A86FF]/20 flex flex-col items-center p-12 text-center shadow-sm">
          <div className="relative w-80 h-[450px] rounded-2xl overflow-hidden mb-6 bg-gray-50 border border-gray-100 shadow-inner">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Baseline"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <Image
                src="/images/projection-img.jpg"
                alt="Baseline"
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
          <h3 className="font-bold text-[#041228] uppercase tracking-wider mb-4">
            {imagePreview
              ? "UPLOADED PHOTO PREVIEW"
              : "VERIFIED BASELINE PHOTO"}
          </h3>
          <label className="flex items-center gap-2 text-[#3A86FF] font-medium hover:text-[#2a6fd9] transition-all cursor-pointer">
            {imagePreview ? <RotateCcw size={18} /> : <Upload size={18} />}
            {imagePreview ? "Replace Photo" : "Upload Your Photo"}
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
          <p className="text-[10px] text-gray-400 mt-6 leading-relaxed bg-[#F8FAFF] py-2 px-4 rounded-lg border border-gray-100">
            Note: For more accurate projections, please upload a photo in a swim
            suit.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={
            isCombinedLoading ||
            isSaveLoading ||
            isSaveFutureLoading
          }
          className="w-full bg-[#0FA4A9] text-white py-5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#0d8d91] transition-all group cursor-pointer shadow-lg shadow-[#0FA4A9]/20 disabled:opacity-50"
        >
          {isCombinedLoading ||
          isSaveLoading ||
          isSaveFutureLoading
            ? "Generating..."
            : "Generate Projection"}
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );

  const renderLoadingStep = () => (
    <div className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-md flex items-center justify-center p-6 overflow-hidden">
      <div className="flex flex-col items-center justify-center py-20 gap-4 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#0FA4A9]/10 border-t-[#0FA4A9] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={20} className="text-[#0FA4A9] animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <h3 className="text-lg font-bold text-[#1F2D2E]">
            Generating Your Projection
          </h3>
          <div className="h-6 flex items-center justify-center">
            <p className="text-[#5F6F73] text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
              {loadingTexts[loadingTextIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultsStep = () => {
    if (!combinedProjectionData?.data) return null;

    const data = combinedProjectionData.data;

    const renderProjectionCard = (projection: IndividualProjection, isFuture: boolean) => {
      const expectedChanges: string[] = Array.isArray(projection?.expected_changes) 
        ? projection.expected_changes 
        : [];

      let goalTitle = `Achieving your goal in ${data.timeframe}`;
      if (isFuture) {
        goalTitle = `Achieving your goal: Reach muscular physique in ${data.timeframe}`; // Fallback
        if (user?.profile?.weight && projection?.est_weight) {
          const currentWeight = parseFloat(user.profile.weight);
          const futureWeightStr = projection.est_weight.toLowerCase().replace(/[^0-9.]/g, '');
          const futureWeight = parseFloat(futureWeightStr);
          if (!isNaN(currentWeight) && !isNaN(futureWeight)) {
            const diff = currentWeight - futureWeight;
            if (diff > 0) {
              goalTitle = `Achieving your goal: Lose ${Math.round(diff)} lbs and reach muscular physique in ${data.timeframe}`;
            } else if (diff < 0) {
              goalTitle = `Achieving your goal: Gain ${Math.round(Math.abs(diff))} lbs and reach muscular physique in ${data.timeframe}`;
            } else {
              goalTitle = `Achieving your goal: Maintain weight and reach muscular physique in ${data.timeframe}`;
            }
          }
        }
      }

      return (
        <div className="bg-white rounded-[24px] border border-[#3A86FF]/10 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 text-center space-y-6 flex-1">
            <h3 className="text-[#8B5CF6] font-bold text-lg min-h-[56px] flex items-center justify-center">
              {(projection as any).label || (isFuture ? goalTitle : `If you continue your current lifestyle without changes for ${data.timeframe}`)}
            </h3>
            <div className="w-full rounded-2xl overflow-hidden bg-gray-50 shadow-inner border border-gray-100">
              {((projection as any).image || projection.projection_url) ? (
                <img
                  key={(projection as any).image || projection.projection_url}
                  src={getFullProjectionUrl((projection as any).image || projection.projection_url)}
                  alt="Projection Result"
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="w-full aspect-[3/4] flex items-center justify-center bg-gray-100">
                  <User size={80} className="text-gray-300" />
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4">
              {[
                {
                  label: "Timeframe",
                  value: data.timeframe,
                  icon: Calendar,
                  color: "text-[#8B5CF6]",
                  bg: "bg-[#F3E8FF]",
                },
                {
                  label: "Est. BMI:",
                  value: projection?.est_bmi,
                  icon: Activity,
                  color: "text-[#10B981]",
                  bg: "bg-[#E1F9F0]",
                },
                {
                  label: "Est. Weight:",
                  value: projection?.est_weight
                    ? projection.est_weight.toLowerCase().includes("lbs")
                      ? projection.est_weight
                      : `${projection.est_weight} lbs`
                    : "N/A",
                  icon: Zap,
                  color: "text-[#3A86FF]",
                  bg: "bg-[#E4EFFF]",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        item.bg,
                      )}
                    >
                      <item.icon className={item.color} size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#041228]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-left py-6 border-t border-gray-50 space-y-4">
              <h4 className="font-bold text-[#041228]">Expected Changes:</h4>
              <div className="space-y-3">
                {expectedChanges.map((text, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-[#0FA4A9] rounded-full flex items-center justify-center mt-0.5 shrink-0">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                    <span className="text-sm text-[#5F6F73]">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-12 pb-12 animate-in fade-in duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#3A86FF]">
            Projection Results
          </h1>
          <p className="text-gray-500">
            Visualizing your trajectory over the next {data.timeframe}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {renderProjectionCard(data.projections_data.current_lifestyle, false)}
          {renderProjectionCard(data.projections_data.future_goal, true)}
        </div>

        {/* Results Actions */}
        <div className="bg-[#E4F4F5] rounded-xl p-6 border border-[#0FA4A9]/20 flex items-start gap-4 max-w-6xl mx-auto">
          <AlertCircle className="text-[#1F2D2E] shrink-0" size={20} />
          <p className="text-xs text-[#1F2D2E] leading-relaxed">
            <span className="font-bold">Illustrative projection:</span> Visuals
            show relative change based on statistical modeling, not exact or
            guaranteed outcomes. This interface is for motivational purposes and
            does not constitute medical advice.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            disabled={isUpdatingCurrent || isUpdatingFuture}
            onClick={() => handleNavigateWithInsights("/user-dashboard/insights")}
            className="bg-[#0FA4A9] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-[#0d8d91] transition-all cursor-pointer w-full md:w-auto shadow-lg shadow-[#0FA4A9]/20 disabled:opacity-50"
          >
            {(isUpdatingCurrent || isUpdatingFuture) ? "Generating Insights..." : "View insights based on this projection"}
            <ArrowRight size={20} />
          </button>
          <button
            disabled={isUpdatingCurrent || isUpdatingFuture}
            onClick={() => handleNavigateWithInsights("/user-dashboard")}
            className="bg-white border border-gray-200 text-[#041228] px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all cursor-pointer w-full md:w-auto disabled:opacity-50"
          >
            <ArrowLeft size={20} />
            {(isUpdatingCurrent || isUpdatingFuture) ? "Saving..." : "Return to Dashboard"}
          </button>
        </div>
      </div>
    );
  };

  const timeframeMap = {
    "6 months": "6 Months",
    "1 year": "1 Year",
    "5 years": "5 Years",
  };

  return (
    <div className="min-h-screen p-6 md:p-10 container mx-auto">
      {step === "loading" && renderLoadingStep()}
      {step === "input" && renderInputStep()}
      {step === "results" && renderResultsStep()}

      {/* Footer Disclaimer for Input Page */}
      {step === "input" && (
        <div className="mt-12 bg-[#E4F4F5] rounded-xl p-6 border border-[#0FA4A9]/20 flex items-start gap-4">
          <AlertCircle className="text-[#1F2D2E] shrink-0" size={20} />
          <p className="text-[10px] text-[#1F2D2E] leading-relaxed">
            <span className="font-bold uppercase tracking-wider">
              Disclaimer:
            </span>{" "}
            Information and projections provided by BioVue Digital Wellness are
            for informational and illustrative purposes only, reflect relative
            changes rather than exact outcomes, and do not constitute medical
            advice. BioVue Digital Wellness is not liable for decisions or
            outcomes based on this information; users should consult a qualified
            medical professional for medical guidance.
          </p>
        </div>
      )}

      {/* <ProjectionGallery /> */}
    </div>
  );
};

export default ProjectionsPage;
