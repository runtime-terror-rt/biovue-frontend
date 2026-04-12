"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Target, Dumbbell, Footprints, Moon, Droplets, Calendar, Edit2, Trash2, Plus, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/redux/features/api/SupplierDashboard/AllUsers";
import { 
  useGetSupplierNotesQuery, 
  useAddSupplierNoteMutation, 
  useUpdateSupplierNoteMutation, 
  useDeleteSupplierNoteMutation 
} from "@/redux/features/api/SupplierDashboard/SupplierNote";
import { useGetTargetGoalQuery } from "@/redux/features/api/TrainerDashboard/Clients/TargetGoal/PostTargetGoal";
import { toast } from "sonner";

interface TargetGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const getSafeImageSrc = (src: string | null | undefined) => {
  if (!src) return null;
  if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")) {
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

export default function TargetGoalsModal({
  isOpen,
  onClose,
  user,
}: TargetGoalsModalProps) {
  if (!isOpen || !user) return null;

  return <TargetGoalsModalContent onClose={onClose} user={user} />;
}

// Inner component so hooks are always called after the guard above
function TargetGoalsModalContent({
  onClose,
  user,
}: {
  onClose: () => void;
  user: User;
}) {
  const { data: goals = [], isLoading: goalsLoading } = useGetTargetGoalQuery(user.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-8 bg-linear-to-br from-[#3A86FF] to-[#2563EB] text-white">
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
                Target Goals & Benchmarks
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Goals Section */}
          {goalsLoading ? (
            <div className="flex justify-center py-10 mb-10">
              <Loader2 className="animate-spin text-[#3A86FF]" size={32} />
            </div>
          ) : goals.length > 0 ? (
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Target className="text-[#3A86FF]" size={20} />
                <h3 className="text-xl font-bold text-[#041228]">Target Goals</h3>
              </div>
              {[...goals].reverse().map((goal, index) => (
                <div
                  key={goal.id}
                  className="p-6 bg-[#F8FBFA] rounded-3xl border border-[#D9E6FF] space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-[#D9E6FF] pb-4">
                    <div className="flex items-center gap-2 text-[#3A86FF]">
                      <Calendar size={18} />
                      <span className="font-bold text-sm uppercase tracking-wider">
                        Goal Period {goals.length - index}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#94A3B8]">
                      {new Date(goal.start_date).toLocaleDateString()} – {new Date(goal.end_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#94A3B8] mb-1">
                        <Target size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Target Weight</span>
                      </div>
                      <p className="text-xl font-bold text-[#041228]">{goal.target_weight}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#94A3B8] mb-1">
                        <Dumbbell size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Weekly Workouts</span>
                      </div>
                      <p className="text-xl font-bold text-[#041228]">{goal.weekly_workout_goal} sessions</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#94A3B8] mb-1">
                        <Footprints size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Daily Steps</span>
                      </div>
                      <p className="text-xl font-bold text-[#041228]">{goal.daily_step_goal.toLocaleString()}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#94A3B8] mb-1">
                        <Moon size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Sleep Target</span>
                      </div>
                      <p className="text-xl font-bold text-[#041228]">{goal.sleep_target}</p>
                    </div>

                    {goal.water_target != null && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#94A3B8] mb-1">
                          <Droplets size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Water Target</span>
                        </div>
                        <p className="text-xl font-bold text-[#10B981]">{goal.water_target} ml</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center space-y-4 mb-10 border-b border-[#D9E6FF]">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                <Target size={30} className="text-gray-200" />
              </div>
              <p className="text-gray-400 font-medium">No target goals set for this user yet.</p>
            </div>
          )}

          {/* Supplier Notes Section */}
          <SupplierNotesSection userId={user.id} />
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-[#3A86FF] hover:bg-[#2563EB] text-white rounded-xl px-10 h-11 font-bold transition-all cursor-pointer shadow-lg shadow-[#3A86FF]/20"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function SupplierNotesSection({ userId }: { userId: number }) {
  const { data: notesData, isLoading } = useGetSupplierNotesQuery(userId);
  const [addNote, { isLoading: isAdding }] = useAddSupplierNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateSupplierNoteMutation();
  const [deleteNote, { isLoading: isDeleting }] = useDeleteSupplierNoteMutation();

  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;
    try {
      await addNote({ user_id: userId, note: newNoteText }).unwrap();
      setNewNoteText("");
      toast.success("Note added successfully");
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  const handleUpdateNote = async (noteId: number) => {
    if (!editingNoteText.trim()) return;
    try {
      await updateNote({ note_id: noteId, note: editingNoteText, user_id: userId }).unwrap();
      setEditingNoteId(null);
      toast.success("Note updated successfully");
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      await deleteNote({ note_id: noteId, user_id: userId }).unwrap();
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const notes = notesData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Edit2 className="text-[#0FA4A9]" size={20} />
          <h3 className="text-xl font-bold text-[#041228]">Supplier Notes</h3>
        </div>
        <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">{notes.length} Notes</span>
      </div>

      {/* Add Note Input */}
      <div className="bg-[#F8FBFA] p-6 rounded-3xl border border-[#D9E6FF] shadow-sm">
        <textarea
          placeholder="Type a new note here..."
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          className="w-full bg-white border border-[#D9E6FF] rounded-2xl p-4 text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 transition-all min-h-[100px] resize-none"
        />
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleAddNote}
            disabled={isAdding || !newNoteText.trim()}
            className="bg-[#0FA4A9] hover:bg-[#0D9488] text-white rounded-xl px-6 h-10 font-bold transition-all cursor-pointer flex items-center gap-2"
          >
            {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Add Note
          </Button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4 mt-8">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#0FA4A9]" size={32} />
          </div>
        ) : notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="bg-white p-6 rounded-3xl border border-[#D9E6FF] group transition-all hover:shadow-md">
              {editingNoteId === note.id ? (
                <div className="space-y-4">
                  <textarea
                    value={editingNoteText}
                    onChange={(e) => setEditingNoteText(e.target.value)}
                    className="w-full bg-[#F8FBFA] border border-[#D9E6FF] rounded-2xl p-4 text-sm text-[#041228] focus:outline-none focus:ring-2 focus:ring-[#0FA4A9]/20 transition-all min-h-[100px] resize-none"
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={() => setEditingNoteId(null)}
                      variant="ghost"
                      className="text-gray-400 hover:text-gray-600 font-bold"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleUpdateNote(note.id)}
                      disabled={isUpdating}
                      className="bg-[#3A86FF] hover:bg-[#2563EB] text-white rounded-xl px-6 h-10 font-bold transition-all flex items-center gap-2"
                    >
                      {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-[#5F6F73] whitespace-pre-wrap leading-relaxed">
                      {note.note}
                    </p>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingNoteId(note.id);
                          setEditingNoteText(note.note);
                        }}
                        className="p-2 text-gray-400 hover:text-[#3A86FF] hover:bg-[#3A86FF]/10 rounded-lg transition-all cursor-pointer"
                        title="Edit note"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        disabled={isDeleting}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest border-t border-[#F8FBFA] pt-4">
                    <Calendar size={12} />
                    {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-10 text-center bg-[#F8FBFA] rounded-3xl border border-dashed border-[#D9E6FF]">
            <p className="text-gray-400 text-sm italic font-medium">No supplier notes recorded for this client.</p>
          </div>
        )}
      </div>
    </div>
  );
}

