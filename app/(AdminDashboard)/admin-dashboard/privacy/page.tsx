"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import DashboardHeading from "@/components/common/DashboardHeading";
import { Button } from "@/components/ui/button";
import { useCreatePrivacyMutation } from "@/redux/features/api/adminDashboard/CreatePrivacy";
import { useGetPrivacyQuery } from "@/redux/features/api/adminDashboard/GetPrivacy";

export default function PrivacyPage() {
  const [hasPolicy, setHasPolicy] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([
    { id: Date.now(), title: "", content: "" },
  ]);
  const [createPrivacy, { isLoading }] = useCreatePrivacyMutation();
  const { data, isLoading: isGetting, refetch } = useGetPrivacyQuery();
  useEffect(() => {
    if (data?.data) {
      setHasPolicy(true);

      setTitle(data.data.title);

      setSections(
        data.data.content.map((item) => ({
          id: item.id,
          title: item.heading,
          content: item.content,
        })),
      );
    }
  }, [data]);
  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: "", content: "" }]);
  };

  const updateSection = (id: number | string, field: string, value: string) => {
    setSections(
      sections.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec)),
    );
  };

  const handlePost = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const payload = {
        title,
        is_active: true,
        items: sections.map((sec, index) => ({
          id: index + 1,
          heading: sec.title,
          content: sec.content,
        })),
      };

      const res = await createPrivacy(payload).unwrap();
      if (res.success) {
        toast.success(res.message || "Privacy Policy Posted Successfully");

        setHasPolicy(true);
        setOpenModal(false);

        refetch();

        setTitle("");
        setDescription("");
        setSections([{ id: Date.now(), title: "", content: "" }]);
      }

      //   if (res.success) {
      //     toast.success(res.message || "Privacy Policy Posted Successfully");

      //     setHasPolicy(true);
      //     setOpenModal(false);

      //     setTitle("");
      //     setDescription("");
      //     setSections([{ id: Date.now(), title: "", content: "" }]);
      //   }
      else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Privacy API Error:", error);

      toast.error(error?.data?.message || "Failed to post privacy policy");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <DashboardHeading heading="Privacy Policy" />

        <Button
          onClick={() => setOpenModal(true)}
          className="bg-[#0FA4A9] hover:bg-[#0D8E92] text-white flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} /> Add Privacy Policy
        </Button>
      </div>

      {/* Empty State */}
      {!hasPolicy && !isGetting && (
        <div className="border border-dashed p-10 text-center rounded-xl text-gray-500">
          Add privacy policy for your website
        </div>
      )}
      {hasPolicy && data?.data && (
        <div className="bg-white p-6 rounded-xl border space-y-6">
          {/* Title + Last Updated */}
          <div>
            <h2 className="text-xl font-bold">{data.data.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {new Date(data.data.updated_at).toLocaleString()}
            </p>
          </div>

          {/* Sections */}
          {data.data.content.map((item) => (
            <div key={item.id} className="space-y-1">
              <h3 className="font-semibold text-lg">{item.heading}</h3>
              <p className="text-gray-600 text-sm whitespace-pre-line">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Privacy Policy</h2>
              <button onClick={() => setOpenModal(false)}>
                <X />
              </button>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Page Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded-lg"
                placeholder="Enter page title"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded-lg"
                placeholder="Enter description"
              />
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {sections.map((sec, index) => (
                <div key={sec.id} className="border p-4 rounded-lg">
                  <input
                    placeholder={`Section ${index + 1} Title`}
                    value={sec.title}
                    onChange={(e) =>
                      updateSection(sec.id, "title", e.target.value)
                    }
                    className="w-full border p-2 rounded mb-2"
                  />

                  <textarea
                    placeholder={`Section ${index + 1} Description`}
                    value={sec.content}
                    onChange={(e) =>
                      updateSection(sec.id, "content", e.target.value)
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              ))}

              {/* Add Section Button */}
              <button
                onClick={addSection}
                className="flex items-center gap-2 text-blue-600"
              >
                <Plus size={16} /> Add Section
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handlePost}
                disabled={isLoading}
                className="px-4 py-2 bg-[#0FA4A9] text-white rounded-lg"
              >
                {isLoading ? "Posting..." : "Post Privacy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
