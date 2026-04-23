"use client";

import Image from "next/image";
import { useEffect } from "react";
import {
  X,
  Sparkles,
  CheckCircle2,
  Send,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/redux/features/api/SupplierDashboard/AllUsers";
import {
  useLazyGetSavedMatchQuery,
  MatchedProduct,
  useFindMatchMutation,
  buildFindMatchUserPayload,
  type FindMatchResponse,
} from "@/redux/features/api/SupplierDashboard/FindMatch";
import { useSendMessageMutation } from "@/redux/features/api/userDashboard/messagesApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import { toast } from "sonner";

/** Chat APIs often use limited VARCHAR; long AI text commonly triggers 500 from the main API. */
const MAX_SUGGEST_MESSAGE_CHARS = 100000;

function prepareMessageForChatApi(raw: string): string {
  const cleaned = raw.replace(/\u0000/g, "").trim();
  if (cleaned.length <= MAX_SUGGEST_MESSAGE_CHARS) return cleaned;
  return (
    cleaned.slice(0, MAX_SUGGEST_MESSAGE_CHARS - 100).trim() +
    "\n\n[Message trimmed to fit limits. Please reply for more details.]"
  );
}

function sendErrorToast(err: unknown, fallback: string) {
  let detail = fallback;
  if (typeof err === "object" && err !== null && "data" in err) {
    const data = (err as { data?: unknown }).data;
    if (typeof data === "string") detail = data;
    else if (data && typeof data === "object") {
      const o = data as Record<string, unknown>;
      if (typeof o.message === "string") detail = o.message;
      else if (typeof o.detail === "string") detail = o.detail;
      else if (typeof o.error === "string") detail = o.error;
    }
  }
  const status =
    typeof err === "object" && err !== null && "status" in err
      ? (err as { status?: number }).status
      : undefined;
  if (status === 500 && detail === fallback) {
    detail = `${fallback} The chat server may reject very long messages; this flow now trims content automatically.`;
  }
  toast.error(detail.length > 220 ? `${detail.slice(0, 217)}…` : detail);
}

const getSafeImageSrc = (src: string | null | undefined) => {
  if (!src) return null;
  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    try {
      if (src.startsWith("http")) {
        new URL(src);
      }
      return src;
    } catch (e) {
      return null;
    }
  }
  return null;
};

interface SupplementMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function SupplementMatchModal({
  isOpen,
  onClose,
  user,
}: SupplementMatchModalProps) {
  const currentUser = useSelector(selectCurrentUser);
  const supplier_id = currentUser?.id;

  const [
    triggerGet,
    { data: matchData, isLoading: isMatchLoading, isFetching: isMatchFetching },
  ] = useLazyGetSavedMatchQuery();
  const [findMatch, { isLoading: isMatching }] = useFindMatchMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  useEffect(() => {
    if (isOpen && user && supplier_id) {
      triggerGet({
        user_id: user.id.toString(),
        supplier_id: supplier_id.toString(),
      });
    }
  }, [isOpen, user, supplier_id, triggerGet]);

  if (!isOpen || !user) return null;

  const handleRunAnalysis = async () => {
    if (!supplier_id) {
      toast.error("Supplier ID not found.");
      return;
    }
    try {
      await findMatch({
        user_id: user.id.toString(),
        supplier_id: supplier_id.toString(),
        user_data: buildFindMatchUserPayload(user),
      }).unwrap();
      toast.success("AI Analysis completed and matches updated!");
      triggerGet({
        user_id: user.id.toString(),
        supplier_id: supplier_id.toString(),
      });
    } catch (error) {
      console.error("AI Analysis failed:", error);
      toast.error("Failed to run AI Analysis. Please try again.");
    }
  };

  const buildSupplementMessage = (
    supp: MatchedProduct,
    ctx: FindMatchResponse | undefined,
    options?: { includeOverallSummary?: boolean },
  ): string => {
    const benefits = (supp.health_benefits ?? [])
      .slice(0, 4)
      .map((b) => `✅ ${b}`)
      .join("\n");
    const warnings = (supp.warnings ?? [])
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => `⚠️ ${w}`)
      .join("\n");

    const lines: string[] = [
      `🌟 PERSONALIZED SUPPLEMENT SUGGESTION`,
      ``,
      `📦 Product: ${supp.name}`,
      `🏷️ Category: ${supp.category}`,
      `🎯 Match Score: ${Math.round(supp.match_score)}%`,
      ``,
      `💡 WHY THIS IS RECOMMENDED:`,
      supp.match_reason,
      ``,
    ];
    if (benefits) {
      lines.push(`✨ KEY BENEFITS:`, benefits, ``);
    }
    if (warnings) {
      lines.push(`⚠️ IMPORTANT NOTES:`, warnings, ``);
    }
    if (ctx?.completeness_warning) {
      const pct =
        ctx.profile_completeness != null
          ? Math.round(Number(ctx.profile_completeness))
          : null;
      lines.push(
        `📊 PROFILE STATUS:`,
        pct != null
          ? `${ctx.completeness_warning} (Profile completeness: ${pct}%).`
          : ctx.completeness_warning,
        ``,
      );
    }

    const summary =
      ctx?.recommendation_summary ?? matchData?.recommendation_summary;

    if (options?.includeOverallSummary && summary) {
      lines.push(`📋 OVERALL SUMMARY:`, summary, ``);
    }

    lines.push(`🔗 Product Link:`, supp.redirect_url);
    return lines.join("\n");
  };

  const handleSuggestToUser = async (supp: MatchedProduct) => {
    if (!supplier_id) {
      toast.error("Supplier ID missing");
      return;
    }

    const fullMessage = prepareMessageForChatApi(
      buildSupplementMessage(supp, matchData, {
        includeOverallSummary: true,
      }),
    );

    const compactMessage = prepareMessageForChatApi(
      [
        `🌟 SUGGESTION: ${supp.name}`,
        `🎯 Match: ${Math.round(supp.match_score || 0)}%`,
        ``,
        `💡 Reason:`,
        (supp.match_reason || "").length > 200
          ? `${supp.match_reason.slice(0, 197)}...`
          : supp.match_reason || "",
        ``,
        `🔗 Link: ${supp.redirect_url || ""}`,
      ].join("\n"),
    );

    try {
      await sendMessage({
        receiver_id: Number(user.id),
        email: user.email,
        message: fullMessage,
      }).unwrap();

      toast.success(`Suggestion sent to ${user.name}`);
    } catch (error) {
      console.error(error);
      const status =
        typeof error === "object" && error !== null && "status" in error
          ? (error as { status?: number }).status
          : undefined;
      if (status === 500) {
        try {
          await sendMessage({
            receiver_id: Number(user.id),
            email: user.email,
            message: compactMessage,
          }).unwrap();
          toast.success(`Suggestion sent to ${user.name} (short format)`);
          return;
        } catch (e2) {
          console.error(e2);
          sendErrorToast(e2, "Failed to send suggestion.");
        }
      } else {
        // Fallback for ANY OTHER status code (e.g. 422 Payload Too Large) just in case
        try {
          await sendMessage({
            receiver_id: Number(user.id),
            email: user.email,
            message: compactMessage,
          }).unwrap();
          toast.success(`Suggestion sent to ${user.name} (short format)`);
        } catch (e3) {
          sendErrorToast(e3, "Failed to send suggestion.");
        }
      }
    }
  };

  const handleSuggestAll = async () => {
    if (!matchData?.matched_products?.length || !user || !supplier_id) return;

    try {
      const allSupps = matchData.matched_products;

      // Send one combined message with all supplements in the simplified format
      const fullSummary = matchData?.recommendation_summary;
      const summaryBlock =
        fullSummary != null
          ? `\n\n📋 OVERALL SUMMARY\n${
              fullSummary.length > 400
                ? `${fullSummary.slice(0, 397).trim()}...`
                : fullSummary
            }\n\n`
          : "\n\n";
      const header = `Hi! 👋 I've analysed your profile and have ${allSupps.length} recommendation(s) for you.${summaryBlock}`;

      const sections = allSupps.map(
        (supp, index) =>
          `- Recommendation ${index + 1} -\n` +
          buildSupplementMessage(supp, matchData, {
            includeOverallSummary: false,
          }),
      );

      const message = prepareMessageForChatApi(
        header + sections.join("\n\n" + "-".repeat(28) + "\n\n"),
      );

      await sendMessage({
        receiver_id: Number(user.id),
        email: user.email,
        message,
      }).unwrap();

      toast.success(`All suggestions sent to ${user.name}`);
    } catch (error) {
      console.error(error);

      // Fallback to sending extremely minimal suggestion message if the huge one fails
      try {
        const minimalSummary = matchData?.matched_products
          ?.map((p) => `📦 ${p.name}`)
          .join("\n");
        await sendMessage({
          receiver_id: Number(user.id),
          email: user.email,
          message: `Hi ${user.name} 👋, I've analysed your profile and found ${matchData?.matched_products?.length} match(es) for you:\n\n${minimalSummary}\n\nPlease check my specific suggestions or the AI matching section for details.`,
        }).unwrap();
        toast.success(`Brief match summary sent to ${user.name}`);
      } catch (errFallback) {
        sendErrorToast(errFallback, "Failed to send all suggestions.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-8 bg-linear-to-br from-[#0FA4A9] to-[#0D9488] text-white">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-3xl border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
              {getSafeImageSrc(user.profile_image) ? (
                <Image
                  src={getSafeImageSrc(user.profile_image)!}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl font-bold">
                  {user.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1 tracking-tight">
                {user.name}
              </h2>
              <p className="text-white/80 font-medium">
                AI-Powered Supplement Matching
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-[#0FA4A9]">
              <Sparkles size={20} fill="currentColor" />
              <h3 className="text-lg font-bold uppercase tracking-wider">
                {isMatchLoading || isMatchFetching
                  ? "Fetching..."
                  : isMatching
                    ? "Analysing..."
                    : "Suggested Matches"}
              </h3>
            </div>
            {matchData?.matched_products &&
              matchData.matched_products.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isMatching || isMatchFetching}
                  onClick={handleRunAnalysis}
                  className="text-[#0FA4A9] hover:text-[#0FA4A9] hover:bg-[#0FA4A9]/10 rounded-xl px-4 flex items-center gap-2 font-bold transition-all cursor-pointer"
                >
                  <RefreshCw
                    size={16}
                    className={isMatching ? "animate-spin" : ""}
                  />
                  Regenerate AI
                </Button>
              )}
          </div>

          {matchData?.recommendation_summary && (
            <div className="mb-6 p-5 rounded-2xl bg-[#F8FBFA] border border-[#D9E6FF] text-sm text-[#5F6F73] leading-relaxed">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mb-2">
                Overall summary
              </p>
              <p className="whitespace-pre-wrap">
                {matchData.recommendation_summary}
              </p>
              {matchData.completeness_warning ? (
                <p className="mt-3 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  {matchData.completeness_warning}
                  {matchData.profile_completeness != null
                    ? ` (${Math.round(Number(matchData.profile_completeness))}% profile complete)`
                    : ""}
                </p>
              ) : null}
            </div>
          )}

          {matchData?.matched_products &&
            matchData.matched_products.length > 2 && (
              <Button
                onClick={handleSuggestAll}
                disabled={isSending}
                className="w-full mb-6 bg-[#0FA4A9]/10 hover:bg-[#0FA4A9] text-[#0FA4A9] hover:text-white border border-[#0FA4A9]/20 rounded-2xl py-6 h-auto font-bold flex items-center justify-center gap-3 transition-all cursor-pointer group"
              >
                <Send
                  size={18}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
                {isSending
                  ? "Sending All..."
                  : `Send All ${matchData.matched_products.length} Suggestions at Once`}
              </Button>
            )}

          <div className="space-y-4 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
            {isMatchLoading || (isMatching && !matchData?.matched_products) ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <Loader2 className="w-12 h-12 text-[#0FA4A9] animate-spin" />
                <div>
                  <p className="text-[#041228] font-bold text-lg mb-1">
                    {isMatching
                      ? "AI Intelligence at Work"
                      : "Retrieving Matches"}
                  </p>
                  <p className="text-[#94A3B8] text-sm">
                    Analyzing profile and product inventory...
                  </p>
                </div>
              </div>
            ) : matchData?.matched_products &&
              matchData.matched_products.length > 0 ? (
              matchData.matched_products.map((supp: MatchedProduct) => (
                <div
                  key={supp.product_id}
                  className="group relative p-6 bg-[#F8FBFA] rounded-3xl border border-[#D9E6FF] hover:border-[#0FA4A9] transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-[#041228]">
                          {supp.name}
                        </h4>
                        <span className="px-3 py-1 bg-white border border-[#D9E6FF] rounded-full text-xs font-bold text-[#94A3B8]">
                          {supp.category}
                        </span>
                      </div>
                      <p className="text-sm text-[#5F6F73] mb-4 leading-relaxed line-clamp-2">
                        {supp.match_reason}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-black text-[#0FA4A9] mb-1">
                        {Math.round(supp.match_score)}%
                      </div>
                      <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-widest">
                        Match Score
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#D9E6FF]/50">
                    <div className="flex items-center gap-2 text-[#22C55E]">
                      <CheckCircle2 size={16} />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        In Stock
                      </span>
                    </div>
                    <Button
                      disabled={isSending}
                      onClick={() => handleSuggestToUser(supp)}
                      className="bg-[#0FA4A9] hover:bg-[#0D9488] text-white rounded-xl px-6 h-9 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                      Suggest to User
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                <div className="p-6 bg-[#F8FBFA] rounded-full border-2 border-dashed border-[#D9E6FF]">
                  <Sparkles size={40} className="text-[#94A3B8]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#041228] mb-2">
                    No AI Matches Found
                  </h4>
                  <p className="text-[#94A3B8] max-w-xs mx-auto text-sm font-medium">
                    We haven&apos;t analyzed this user&apos;s profile yet. Click
                    below to run the AI matching engine.
                  </p>
                </div>
                <Button
                  disabled={isMatching}
                  onClick={handleRunAnalysis}
                  className="bg-[#0FA4A9] hover:bg-[#0D9488] text-white rounded-2xl px-10 py-6 h-auto text-sm font-bold flex items-center gap-3 transition-all hover:shadow-lg active:scale-95 cursor-pointer shadow-md"
                >
                  {isMatching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5 fill-white" />
                  )}
                  Run AI Magic
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-xl px-10 border-[#D9E6FF] text-[#94A3B8] hover:bg-[#F8FBFA] cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
