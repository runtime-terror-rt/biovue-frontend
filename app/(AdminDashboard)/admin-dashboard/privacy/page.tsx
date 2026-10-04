"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCreatePrivacyMutation } from "@/redux/features/api/adminDashboard/CreatePrivacy";
import { useGetPrivacyQuery } from "@/redux/features/api/adminDashboard/GetPrivacy";
import { SectionItem } from "@/components/AdminDashboard/Privacy/types";
import PrivacyHeader from "@/components/AdminDashboard/Privacy/PrivacyHeader";
import PrivacyEmptyState from "@/components/AdminDashboard/Privacy/PrivacyEmptyState";
import PrivacyViewCard from "@/components/AdminDashboard/Privacy/PrivacyViewCard";
import PrivacyModal from "@/components/AdminDashboard/Privacy/PrivacyModal";

export default function PrivacyPage() {
  const [hasPolicy, setHasPolicy] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<SectionItem[]>([
    { id: Date.now(), title: "", content: "" },
  ]);

  const [createPrivacy, { isLoading }] = useCreatePrivacyMutation();
  const { data, isLoading: isGetting, refetch } = useGetPrivacyQuery();

  useEffect(() => {
    if (data?.data) {
      setHasPolicy(true);
    }
  }, [data]);

  const resetForm = () => {
    setTitle("");
    setSections([{ id: Date.now(), title: "", content: "" }]);
  };

  const handleOpenModal = () => {
    if (data?.data) {
      setTitle(data.data.title || "");
      if (data.data.content && data.data.content.length > 0) {
        setSections(
          data.data.content.map((item, index) => ({
            id: item.id || Date.now() + index,
            title: item.heading || "",
            content: item.content || "",
          })),
        );
      } else {
        setSections([{ id: Date.now(), title: "", content: "" }]);
      }
    } else {
      resetForm();
    }
    setOpenModal(true);
  };

  const addSection = () => {
    setSections((prev) => [...prev, { id: Date.now(), title: "", content: "" }]);
  };

  const removeSection = (id: number | string) => {
    if (sections.length <= 1) {
      toast.error("You must have at least one section");
      return;
    }
    setSections((prev) => prev.filter((sec) => sec.id !== id));
  };

  const updateSection = (
    id: number | string,
    field: "title" | "content",
    value: string,
  ) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec)),
    );
  };

  const handlePost = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        is_active: true,
        items: sections.map((sec, index) => ({
          id: index + 1,
          heading: sec.title.trim() || `Section ${index + 1}`,
          content: sec.content,
        })),
      };

      const res = await createPrivacy(payload).unwrap();

      if (res.success) {
        toast.success(res.message || "Privacy Policy Updated");
        setHasPolicy(true);
        setOpenModal(false);
        refetch();
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed request");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <PrivacyHeader hasPolicy={hasPolicy} onOpenModal={handleOpenModal} />

      {/* Empty State */}
      {!hasPolicy && !isGetting && <PrivacyEmptyState />}

      {/* Published Policy View */}
      {hasPolicy && data?.data && (
        <PrivacyViewCard
          title={data.data.title}
          updatedAt={data.data.updated_at}
          content={data.data.content}
          onOpenEdit={handleOpenModal}
        />
      )}

      {/* Modal */}
      <PrivacyModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={title}
        onTitleChange={setTitle}
        sections={sections}
        onAddSection={addSection}
        onRemoveSection={removeSection}
        onUpdateSection={updateSection}
        onSave={handlePost}
        isLoading={isLoading}
      />
    </div>
  );
}
