"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, Eye, Trash2, Pencil } from "lucide-react";
import { useState } from "react";

import {
  useDeleteSupplierNoteMutation,
  useGetSupplierNotesQuery,
  useUpsertSupplierNoteMutation,
} from "@/redux/features/api/SupplierDashboard/SupplierNote";
import { toast } from "sonner";

export default function CoachNotes({ userId }: { userId: number }) {
  const [noteText, setNoteText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data, isLoading } = useGetSupplierNotesQuery(userId);

  const [upsertNote, { isLoading: adding }] = useUpsertSupplierNoteMutation();

  const [deleteNote] = useDeleteSupplierNoteMutation();

  const notes = data?.data ?? [];

  const handleSubmit = async () => {
    if (!noteText.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      const payload = {
        ...(editingId && { id: editingId }), // THIS enables update
        user_id: userId,
        note: noteText,
      };

      const res = await upsertNote(payload).unwrap();

      toast.success(
        editingId
          ? res.message || "Note updated successfully"
          : res.message || "Note added successfully",
      );

      setNoteText("");
      setEditingId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };
  //  DELETE
  const handleDelete = async (id: number) => {
    try {
      const res = await deleteNote({ note_id: id, user_id: userId }).unwrap();
      toast.success(res.message || "Note deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  // EDIT
  const handleEdit = (note: any) => {
    setEditingId(note.id);
    setNoteText(note.note);
  };

  return (
    <div className="space-y-4 py-6 rounded-lg bg-white">
      <div className="flex px-6 items-center gap-2 text-[#111827]">
        <FileText size={20} className="text-[#374151]" />
        <h2 className="text-xl font-medium">Internal Coach Notes (Private)</h2>
      </div>

      <Card className="border-none">
        <CardContent className="space-y-6">
          {/*  Input */}

          <div className="space-y-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add observations, preferences..."
              className="w-full h-32 p-4 bg-[#0FA4A91A] rounded-xl resize-none outline-none"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!noteText.trim() || adding}
                className="px-4 py-2 bg-[#0D9488] text-white rounded-lg text-sm font-medium hover:bg-[#0A7A6F] disabled:opacity-50"
              >
                {editingId ? "Update Note" : "Add Note"}
              </button>

              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setNoteText("");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/*  Notes List */}
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : notes.length === 0 ? (
              <p className="text-sm text-gray-500">No notes yet</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-[#0FA4A91A] p-5 rounded-xl space-y-2"
                >
                  <p className="text-sm text-[#374151] font-medium">
                    {note.note}
                  </p>

                  <p className="text-[10px] text-[#9CA3AF] uppercase">
                    {new Date(note.created_at).toLocaleString()}
                  </p>

                  {/*  Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-blue-500"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-[#8B5CF6] pt-2">
            <Eye size={16} />
            <span className="text-[11px] uppercase">Only visible to trainer</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
