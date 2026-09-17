"use client";

import React from "react";
import SegmentedControl from "@/components/shared/SegmentedControl";

export type ContentTabType =
  | "faqs"
  | "announcements"
  | "homepage-banner"
  | "static-pages";

export interface ContentTabsProps {
  activeTab?: ContentTabType;
  onTabChange?: (tab: ContentTabType) => void;
  paramKey?: string;
  className?: string;
}

export function ContentTabs({
  activeTab,
  onTabChange,
  paramKey = "tab",
  className = "",
}: ContentTabsProps) {
  const options: { label: string; value: ContentTabType }[] = [
    { label: "FAQs", value: "faqs" },
    { label: "Announcements", value: "announcements" },
    { label: "Homepage Banners", value: "homepage-banner" },
    { label: "Static Pages", value: "static-pages" },
  ];

  return (
    <SegmentedControl
      options={options}
      value={activeTab}
      onChange={onTabChange}
      paramKey={paramKey}
      defaultValue="faqs"
      className={className}
    />
  );
}

export default ContentTabs;
