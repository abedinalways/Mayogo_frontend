export type ExpertAccountStatus =
  | "active"
  | "busy"
  | "inactive"
  | "suspended"
  | "Active"
  | "Busy"
  | "Inactive"
  | "Suspended";

export type ExpertVerificationLevel =
  | "UNVERIFIED"
  | "LEVEL_1"
  | "LEVEL_2"
  | "LEVEL_3"
  | "LEVEL_4"
  | string;

export interface Expert {
  id: string;
  expertId?: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  businessName?: string;
  category?: string | { id: string; name: string };
  categoryId?: string;
  status: ExpertAccountStatus;
  verificationStatus?: string;
  verificationLevel?: ExpertVerificationLevel;
  totalJobs?: number;
  jobs?: number;
  earnings?: number | string;
  availableBalance?: number | string;
  totalPending?: number | string;
  jobsCancelled?: number;
  disputesRaised?: number;
  location?: string;
  city?: string;
  country?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
  verificationProgress?: {
    currentStep: number;
    totalSteps: number;
    label: string;
  };
  subscription?: {
    plan: string;
    startedOn: string;
    nextRenewal: string;
  };
}

export interface ExpertListParams {
  search?: string;
  status?: "all" | "active" | "busy" | "inactive" | "suspended";
  verificationStatus?: "all" | "verified" | "pending" | "rejected";
  categoryId?: string;
  sortBy?: "createdAt" | "fullName" | "totalJobs" | "earnings" | "verificationLevel";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface ExpertListResponseData {
  experts?: Expert[];
  data?: Expert[];
  items?: Expert[];
  total: number;
  limit: number;
  offset: number;
  page?: number;
  totalPages?: number;
}

export type ExpertStatusAction =
  | "activate"
  | "deactivate"
  | "suspend"
  | "unsuspend"
  | "mark_busy"
  | "mark_available";

export interface UpdateExpertStatusPayload {
  id: string;
  action: ExpertStatusAction;
  reason?: string;
}

export interface ReviewVerificationPayload {
  id: string;
  level: "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "LEVEL_4";
  status: "APPROVED" | "REJECTED" | "NEEDS_RESUBMISSION";
  rejectionReason?: string;
  notes?: string;
}

export interface VerificationRequestItem {
  id: string;
  expertId: string;
  expert: {
    name: string;
    avatar?: string;
  };
  contact: {
    phone?: string;
    email?: string;
  };
  documentsSubmitted?: number;
  documentsCount?: number;
  pendingReviews?: number;
  submissionDate?: string;
  submittedAt?: string;
  status: "PENDING" | "RESUBMISSION_REQUIRED" | "APPROVED" | "REJECTED" | string;
}

export interface VerificationDecisionPayload {
  expertId: string;
  level: "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "LEVEL_4";
  decision: "APPROVED" | "REJECTED" | "NEEDS_RESUBMISSION";
  note?: string;
}
