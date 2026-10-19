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

export type JobPaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";

export type JobSortBy =
  | "NEWEST_FIRST"
  | "OLDEST_FIRST"
  | "CLIENT_NAME_A_Z"
  | "CLIENT_NAME_Z_A"
  | "AMOUNT_HIGHEST"
  | "AMOUNT_LOWEST";

export interface JobServiceInfo {
  id?: string;
  name: string;
  category?: string;
  image?: string;
}

export interface JobUserInfo {
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  rating?: string | number;
  isVerified?: boolean;
}

export interface JobAppointmentInfo {
  date?: string;
  time?: string;
  duration?: string;
}

export interface JobLocationInfo {
  address?: string;
  city?: string;
  country?: string;
  mapImageUrl?: string;
}

export interface AdminJobItem {
  id: string;
  jobId?: string;
  requestNumber?: string;
  title?: string;
  description?: string;
  service: JobServiceInfo;
  client: JobUserInfo;
  expert?: JobUserInfo;
  serviceType?: string;
  payment?: string;
  paymentStatus?: JobPaymentStatus | string;
  amount?: number | string;
  quote?: number | string;
  totalAmount?: number | string;
  location?: string | JobLocationInfo;
  date?: string;
  appointment?: JobAppointmentInfo;
  status: string;
  createdAt: string;
  updatedAt?: string;
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
