"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ContentTabs, { ContentTabType } from "./ContentTabs";
import FaqsTab from "./FaqsTab";
import AnnouncementsTab from "./AnnouncementsTab";
import HomepageBannerTab from "./HomepageBannerTab";
import StaticPagesTab from "./StaticPagesTab";

export function ContentManagementContainer() {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") as ContentTabType | null;

  const activeTab: ContentTabType =
    rawTab === "announcements" ||
    rawTab === "homepage-banner" ||
    rawTab === "static-pages"
      ? rawTab
      : "faqs";

  return (
    <div className="w-full space-y-4 font-['Manrope']  bg-[#F8FAFC] min-h-screen">
      {/* Top Segmented Tab Switcher */}
      <div>
        <ContentTabs />
      </div>

      {/* Dynamic Tab Content */}
      <div>
        {activeTab === "faqs" && <FaqsTab />}
        {activeTab === "announcements" && <AnnouncementsTab />}
        {activeTab === "homepage-banner" && <HomepageBannerTab />}
        {activeTab === "static-pages" && <StaticPagesTab />}
      </div>
    </div>
  );
}

export default ContentManagementContainer;
