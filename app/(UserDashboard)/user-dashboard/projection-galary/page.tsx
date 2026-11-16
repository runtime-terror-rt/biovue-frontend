"use client";

import SubscriptionGuard from "@/components/common/SubscriptionGuard";
import ProjectionGallery from "@/components/dashboard/ProjectionGallery";

export default function ProjectionGalleryPage() {
  return (
    <SubscriptionGuard>
      <div className="container mx-auto px-4 md:px-8 py-6">
        <ProjectionGallery />
      </div>
    </SubscriptionGuard>
  );
}
