export type ContentStatus = "DRAFT" | "LIVE" | "draft" | "live";
export type ContentAudience =
  | "ALL"
  | "CLIENTS"
  | "EXPERTS"
  | "all"
  | "clients"
  | "experts";

export interface FaqItem {
  id: string;
  title: string;
  description: string;
  status: ContentStatus | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqListParams {
  status?: "DRAFT" | "LIVE" | string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateFaqPayload {
  title: string;
  description: string;
  status: "DRAFT" | "LIVE";
}

export interface UpdateFaqPayload {
  faqId: string;
  title?: string;
  description?: string;
  status?: "DRAFT" | "LIVE";
}

export interface AnnouncementItem {
  id: string;
  title: string;
  description: string;
  audience: ContentAudience | string;
  status: ContentStatus | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnnouncementListParams {
  status?: "DRAFT" | "LIVE" | string;
  audience?: "ALL" | "CLIENTS" | "EXPERTS" | string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateAnnouncementPayload {
  title: string;
  description: string;
  audience: "ALL" | "CLIENTS" | "EXPERTS";
  status: "DRAFT" | "LIVE";
}

export interface UpdateAnnouncementPayload {
  announcementId: string;
  title?: string;
  description?: string;
  audience?: "ALL" | "CLIENTS" | "EXPERTS";
  status?: "DRAFT" | "LIVE";
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  audience: ContentAudience | string;
  status: ContentStatus | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerListParams {
  status?: "DRAFT" | "LIVE" | string;
  audience?: "ALL" | "CLIENTS" | "EXPERTS" | string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateBannerPayload {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  audience: "ALL" | "CLIENTS" | "EXPERTS";
  status: "DRAFT" | "LIVE";
}

export interface UpdateBannerPayload {
  bannerId: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  audience?: "ALL" | "CLIENTS" | "EXPERTS";
  status?: "DRAFT" | "LIVE";
}

export interface StaticPageItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: ContentStatus | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaticPageListParams {
  status?: "DRAFT" | "LIVE" | string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateStaticPagePayload {
  slug: string;
  title: string;
  content: string;
  status: "DRAFT" | "LIVE";
}

export interface UpdateStaticPagePayload {
  pageId: string;
  title?: string;
  content?: string;
  status?: "DRAFT" | "LIVE";
}

export interface ContentStatsResponseData {
  faqs?: { total: number; live: number; draft: number };
  announcements?: { total: number; live: number; draft: number };
  banners?: { total: number; live: number; draft: number };
  pages?: { total: number; live: number; draft: number };
}
