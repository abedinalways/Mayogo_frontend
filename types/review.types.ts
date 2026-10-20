export type ReviewStatus = "VISIBLE" | "HIDDEN" | "REJECTED" | "FLAGGED";

export interface ReviewQueryParams {
  status?: ReviewStatus | string;
  rating?: number;
  expertId?: string;
  clientId?: string;
  jobId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ReviewUserInfo {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  avatar?: string;
  avatarUrl?: string | null;
  role?: string;
}

export interface ReviewJobInfo {
  id?: string;
  requestNumber?: string;
  title?: string;
  service?: {
    id?: string;
    name?: string;
    title?: string;
    category?: string;
    image?: string;
  };
  category?: {
    id?: string;
    name?: string;
  };
}

export interface AdminReviewItem {
  id: string;
  jobId?: string;
  rating: number;
  review?: string;
  comment?: string;
  status: ReviewStatus | string;
  moderationNote?: string | null;
  createdAt?: string;
  updatedAt?: string;
  client?: ReviewUserInfo | null;
  expert?: ReviewUserInfo | null;
  job?: ReviewJobInfo | null;
  service?: {
    id?: string;
    title?: string;
    name?: string;
    category?: string;
    image?: string;
  } | null;
  metadata?: Record<string, unknown>;
}

export interface ReviewMetaPagination {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ReviewsApiResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data: AdminReviewItem[];
  meta?: ReviewMetaPagination;
}

export interface ReviewStatsResponseData {
  totalReviews?: number;
  total?: number;
  visible?: number;
  visibleReviews?: number;
  hidden?: number;
  hiddenReviews?: number;
  rejected?: number;
  rejectedReviews?: number;
  flagged?: number;
  flaggedReviews?: number;
  averageRating?: number;
  avgRating?: number;
  [key: string]: unknown;
}

export interface ModerateReviewPayload {
  reviewId: string;
  status: ReviewStatus;
  moderationNote?: string;
}
