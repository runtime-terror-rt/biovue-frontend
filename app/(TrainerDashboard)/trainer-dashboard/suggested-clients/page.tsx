"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/slice/authSlice";
import {
  getClientSuggestions,
  Suggestion,
} from "@/redux/features/api/TrainerDashboard/ClientSuggestion";
import DashboardHeading from "@/components/common/DashboardHeading";
import {
  Loader2,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  User,
  Target,
  ArrowRight,
  BrainCircuit,
  Eye,
  Mail,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSendInvitationMutation } from "@/redux/features/api/TrainerDashboard/SendInvitation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SuggestedClientsPage() {
  const user = useSelector(selectCurrentUser);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMatchReason, setInviteMatchReason] = useState("");
  const [inviteRecommendedActions, setInviteRecommendedActions] = useState<string[]>([]);

  const [sendInvitation, { isLoading: isSending }] =
    useSendInvitationMutation();

  useEffect(() => {
    const fetchSuggestions = async () => {
      // Use user.id or user.user_id depending on how it's stored in your auth state
      const trainerId = user?.id || user?.user_id || "1"; // Fallback for dev if needed

      try {
        setLoading(true);
        const data = await getClientSuggestions(String(trainerId));
        setSuggestions(data);
      } catch (err) {
        setError("Failed to load suggested clients. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSuggestions();
    }
  }, [user]);

  const handleSendInvite = async () => {
    try {
      const res = await sendInvitation({
        email: inviteEmail,
        match_reason: inviteMatchReason,
        recommended_actions: inviteRecommendedActions,
      }).unwrap();
      if (res.success) {
        toast.success(res.message || "Invitation sent successfully");
        setIsInviteModalOpen(false);
        setInviteEmail("");
      } else {
        toast.error(res.message || "Failed to send invitation");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2)
      return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (priority <= 4) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-red-600 bg-red-50 border-red-100";
  };

  const getChurnColor = (possibility: number) => {
    if (possibility >= 70) return "bg-red-500";
    if (possibility >= 40) return "bg-amber-500";
    return "bg-emerald-500";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse text-lg">
          AI is analyzing client data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <DashboardHeading
          heading="Suggested Clients"
          subheading="AI-powered insights to help you prioritize your coaching"
        />
        <div className="bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 flex items-center gap-2">
          <BrainCircuit size={18} className="text-primary" />
          <span className="text-sm font-semibold text-primary">
            AI Engine Active
          </span>
        </div>
      </div>

      <AnimatePresence>
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600">{error}</p>
          </motion.div>
        ) : suggestions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-sm border border-dashed border-[#9AAEB2] rounded-3xl p-16 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center items-center justify-center">
              No suggestions yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto text-center items-center justify-center">
              Our AI engine is still gathering enough data to provide meaningful
              matches. Check back soon as your client pool grows!
            </p>
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#9AAEB2]/30 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="font-bold text-[#041228] py-5 pl-8">
                    CLIENT PROFILE
                  </TableHead>
                  <TableHead className="font-bold text-[#041228] py-5">
                    GOAL
                  </TableHead>
                  <TableHead className="font-bold text-[#041228] py-5">
                    MATCH REASON
                  </TableHead>
                  <TableHead className="font-bold text-[#041228] py-5">
                    CHURN RISK
                  </TableHead>
                  <TableHead className="font-bold text-[#041228] py-5">
                    STATUS
                  </TableHead>
                  <TableHead className="font-bold text-[#041228] py-5 text-right pr-8">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.map((item, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-gray-50/50 transition-colors border-b"
                  >
                    <TableCell className="py-5 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                          <User size={20} className="text-primary/60" />
                        </div>
                        <span className="font-bold text-[#041228]">
                          {item.user_profile.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-100 font-medium"
                      >
                        {item.user_profile.goal}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 max-w-63">
                      <p className="text-sm text-gray-600 truncate">
                        {item.match_reason}
                      </p>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getChurnColor(item.churning_possibility)}`}
                            style={{ width: `${item.churning_possibility}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700">
                          {item.churning_possibility}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          item.status === "On Track" || item.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-5 text-right pr-8">
                      <button
                        onClick={() => setSelectedSuggestion(item)}
                        className="p-2 hover:bg-primary/10 rounded-xl transition-all text-primary group"
                        title="View Details"
                      >
                        <Eye
                          size={20}
                          className="group-hover:scale-110 transition-transform"
                        />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedSuggestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSuggestion(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="absolute top-6 right-6 z-10">
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="p-8">
                <div className="flex items-start gap-6 mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10">
                      <User size={40} className="text-primary/60" />
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-xl flex items-center justify-center border-4 border-white shadow-lg ${selectedSuggestion.status === "On Track" || selectedSuggestion.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`}
                    >
                      {selectedSuggestion.status === "On Track" ||
                      selectedSuggestion.status === "Active" ? (
                        <CheckCircle2 size={16} className="text-white" />
                      ) : (
                        <AlertCircle size={16} className="text-white" />
                      )}
                    </div>
                  </div>
                  <div className="pt-2 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-2xl font-black text-[#041228]">
                          {selectedSuggestion.user_profile.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          {selectedSuggestion.user_profile.email}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(selectedSuggestion.priority)} shadow-sm border`}
                      >
                        Match Score: {10 - selectedSuggestion.priority}/10
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                        <Target size={14} className="text-emerald-500" />
                        <span className="font-semibold">
                          {selectedSuggestion.user_profile.goal}
                        </span>
                      </div>
                      {selectedSuggestion.user_profile.key_health_concerns?.map(
                        (concern, i) => (
                          <div
                            key={i}
                            className="text-[10px] font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100"
                          >
                            {concern.replace(/_/g, ' ')}
                          </div>
                        ),
                      )}
                    </div>
                    {selectedSuggestion.user_profile.goal_description && selectedSuggestion.user_profile.goal_description !== "N/A" && (
                      <p className="mt-4 text-xs text-gray-500 leading-relaxed border-l-2 border-primary/20 pl-3">
                        <span className="font-bold uppercase text-[9px] tracking-wider text-gray-400 block mb-1">Bio / Goal Description</span>
                        {selectedSuggestion.user_profile.goal_description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-6">
                    <div className="bg-[#F4FBFA] p-5 rounded-[24px] border border-primary/10">
                      <div className="flex items-center gap-2 mb-3">
                        <BrainCircuit size={18} className="text-primary" />
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">
                          Match Reason
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed italic">
                        {selectedSuggestion.match_reason}
                      </p>
                    </div>

                    {selectedSuggestion.reason_for_attention && (
                      <div className="bg-amber-50 p-5 rounded-[24px] border border-amber-200/50">
                        <div className="flex items-center gap-2 mb-3 text-amber-600">
                          <AlertCircle size={18} />
                          <span className="text-xs font-bold uppercase tracking-widest">
                            Risk Factor
                          </span>
                        </div>
                        <p className="text-sm text-amber-900 leading-relaxed font-semibold">
                          {selectedSuggestion.reason_for_attention}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="p-5 rounded-[24px] border border-gray-100 bg-gray-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Churn Probability
                        </span>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-gray-100 shadow-sm">
                          <TrendingUp
                            size={14}
                            className={
                              selectedSuggestion.churning_possibility > 40
                                ? "text-red-500"
                                : "text-emerald-500"
                            }
                          />
                          <span className="text-sm font-black text-gray-700">
                            {selectedSuggestion.churning_possibility}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${getChurnColor(selectedSuggestion.churning_possibility)}`}
                          style={{
                            width: `${selectedSuggestion.churning_possibility}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                        Recommended Plan
                      </span>
                      <div className="space-y-2">
                        {selectedSuggestion.recommended_actions.map(
                          (action, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 bg-white border border-gray-100 p-3 rounded-2xl"
                            >
                              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="text-xs font-medium text-gray-600 leading-tight">
                                {action}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <button
                    onClick={() => {
                      setInviteEmail(selectedSuggestion.user_profile.email);
                      setInviteMatchReason(selectedSuggestion.match_reason);
                      setInviteRecommendedActions(selectedSuggestion.recommended_actions);
                      setSelectedSuggestion(null);
                      setIsInviteModalOpen(true);
                    }}
                    className="w-full cursor-pointer bg-[#041228] text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 hover:bg-primary transition-all duration-300 shadow-xl shadow-primary/10"
                  >
                    <Mail size={20} />
                    Send Email Invitation
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invitation Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />

              <div className="relative">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Mail size={32} className="text-primary" />
                </div>
                <h2 className="text-2xl font-black text-[#041228] mb-2">
                  Invite Client
                </h2>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                  Customize the invitation details to help the client understand why they are a great match for your coaching.
                </p>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                      Email Address
                    </label>
                    <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-[#041228] font-medium opacity-80 text-sm">
                      {inviteEmail}
                    </div>
                  </div>

                  {/* Match Reason */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                      Match Reason
                    </label>
                    <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-[#041228] font-medium opacity-80 text-sm leading-relaxed">
                      {inviteMatchReason}
                    </div>
                  </div>

                  {/* Recommended Actions */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">
                      Recommended Actions
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 [scrollbar-width:thin]">
                      {inviteRecommendedActions.map((action, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span className="text-[#041228] text-xs font-medium leading-tight opacity-80">
                            {action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled={!inviteEmail || isSending}
                      onClick={handleSendInvite}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 hover:bg-[#0c8e92] transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                      {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Send Invitation
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsInviteModalOpen(false)}
                      className="w-full mt-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors py-2"
                    >
                      Maybe later
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
