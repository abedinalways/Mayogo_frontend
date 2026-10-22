export type JobTab =
  | "ALL"
  | "PENDING"
  | "QUOTE_SENT"
  | "QUOTE_ACCEPTED"
  | "PAYMENT_COMPLETED"
  | "IN_PROGRESS"
  | "WAITING_FOR_CLIENT_CONFIRM"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED"
  | "REJECTED";

export type JobPaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED" | "COMPLETED";

export type JobSortBy =
  | "NEWEST_FIRST"
  | "OLDEST_FIRST"
  | "CLIENT_NAME_A_Z"
  | "CLIENT_NAME_Z_A"
  | "AMOUNT_HIGHEST"
  | "AMOUNT_LOWEST";

export interface JobCategoryInfo {
  id: string;
  name: string;
  slug?: string;
}

export interface JobServiceInfo {
  id?: string;
  name: string;
  slug?: string;
  category?: string;
  image?: string;
}

export interface JobLocationInfo {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  mapImageUrl?: string;
}

export interface JobUserInfo {
  id?: string;
  name?: string;
  fullName?: string;
  email?: string | null;
  phone?: string;
  avatarUrl?: string | null;
  avatar?: string;
  rating?: string | number;
  isVerified?: boolean;
  professionalTitle?: string;
  location?: string | JobLocationInfo;
  joinedAt?: string;
}

export interface JobAppointmentInfo {
  scheduledAt?: string;
  estimatedDuration?: string;
  status?: string;
  date?: string;
  time?: string;
  duration?: string;
}

export interface JobPaymentInfo {
  id?: string;
  amount?: string | number;
  platformFee?: string | number;
  totalAmount?: string | number;
  status?: string;
  paymentMethod?: string;
  paymentType?: string;
  transactionId?: string;
  paidAt?: string;
  milestones?: {
    id: string;
    title: string;
    description?: string;
    amount: string | number;
    order: number;
    status: string;
    releasedAt?: string | null;
    completedAt?: string | null;
  }[];
}

export interface JobQuoteInfo {
  id?: string;
  amount: string | number;
  message?: string;
  status?: string;
  isCounterOffer?: boolean;
  createdAt?: string;
  respondedAt?: string;
  expert?: JobUserInfo;
}

export interface JobImageInfo {
  id: string;
  fileUrl: string;
  displayOrder?: number;
}

export interface JobDynamicFieldInfo {
  fieldKey: string;
  label: string;
  fieldType: string;
  values: string[];
}

export interface JobEventInfo {
  type: string;
  message: string;
  createdAt: string;
}

export interface JobTrackerInfo {
  id?: string;
  jobRequestId?: string;
  requestReceivedAt?: string | null;
  quoteSentAt?: string | null;
  paymentCompletedAt?: string | null;
  jobScheduledAt?: string | null;
  workInProgressAt?: string | null;
  awaitingConfirmationAt?: string | null;
  markCompleteAt?: string | null;
  currentStage?: number;
  stage0_locked?: boolean;
  stage1_locked?: boolean;
  stage2_locked?: boolean;
  stage3_locked?: boolean;
  stage4_locked?: boolean;
  stage5_locked?: boolean;
  stage6_locked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobSupportTicketInfo {
  id: string;
  ticketNumber?: string;
  category?: string;
  subject?: string;
  status?: string;
  priority?: string;
  createdAt?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  assignedAdmin?: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
  };
}

export interface AdminJobItem {
  id: string;
  requestNumber?: string;
  jobId?: string;
  title?: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;
  client: JobUserInfo;
  expert?: JobUserInfo;
  category?: JobCategoryInfo;
  service: JobServiceInfo;
  location?: string | JobLocationInfo;
  appointment?: JobAppointmentInfo;
  payment?: string | JobPaymentInfo;
  paymentStatus?: JobPaymentStatus | string;
  payments?: JobPaymentInfo[];
  latestQuote?: JobQuoteInfo;
  quotations?: JobQuoteInfo[];
  thumbnailUrl?: string;
  hasOpenTicket?: boolean;
  openTicketsCount?: number;
  images?: JobImageInfo[];
  dynamicFields?: JobDynamicFieldInfo[];
  events?: JobEventInfo[];
  tracker?: JobTrackerInfo;
  completion?: any;
  supportTickets?: JobSupportTicketInfo[];
  review?: any;
  metadata?: any;
  amount?: number | string;
  quote?: number | string;
  totalAmount?: number | string;
  serviceType?: string;
  date?: string;
}

export interface JobListParams {
  tab?: JobTab | string;
  paymentStatus?: JobPaymentStatus | string;
  categoryId?: string;
  serviceId?: string;
  expertId?: string;
  clientId?: string;
  search?: string;
  sortBy?: JobSortBy;
  limit?: number;
  offset?: number;
}

export interface JobMetaPagination {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
}

export interface JobListResponseData {
  jobs?: AdminJobItem[];
  data?: AdminJobItem[];
  items?: AdminJobItem[];
  total: number;
  limit: number;
  offset: number;
  page?: number;
  totalPages?: number;
}

export interface JobStatsResponseData {
  totalJobs: number;
  pending: number;
  inProgress: number;
  completed: number;
  disputed: number;
  cancelled: number;
  totalRevenue?: number;
}

export interface JobCategoryOption {
  id: string;
  name: string;
  services?: { id: string; name: string }[];
}
