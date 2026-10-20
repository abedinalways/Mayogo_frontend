export type DashboardTimeframe =
  | "last_7_days"
  | "last_30_days"
  | "last_6_months"
  | "last_12_months"
  | "this_year"
  | "all_time";

export interface DashboardMetricTrend {
  value: string;
  positive: boolean;
}

export interface DashboardKpiCardItem {
  title?: string;
  value: string | number;
  subtitle?: string;
  percentage?: number;
  change?: number;
  changePercentage?: number;
  trend?: DashboardMetricTrend;
  period?: string;
  [key: string]: any;
}

export interface KpiCardsResponseData {
  totalRevenue?: DashboardKpiCardItem | number;
  activeJobs?: DashboardKpiCardItem | number;
  activeExperts?: DashboardKpiCardItem | number;
  openDisputes?: DashboardKpiCardItem | number;
  pendingVerifications?: DashboardKpiCardItem | number;
  pendingPayouts?: DashboardKpiCardItem | number;
  completedJobs?: DashboardKpiCardItem | number;
  cards?: DashboardKpiCardItem[];
  [key: string]: any;
}

export interface MonthlyEarningsItem {
  month: string;
  revenue: number;
  commission: number;
  totalRevenue?: number;
  platformCommission?: number;
  formattedRevenue?: string;
  formattedCommission?: string;
  timestamp?: number;
  [key: string]: any;
}

export interface MonthlyEarningsQueryParams {
  timeframe?: DashboardTimeframe;
}

export interface DashboardTopCategoryItem {
  id?: string;
  name: string;
  slug?: string;
  color?: string;
  jobs?: number;
  jobsCount?: number;
  totalJobs?: number;
  revenue?: string | number;
  totalRevenue?: number;
  value?: number;
  percentage?: number;
  marketShare?: number;
  [key: string]: any;
}

export interface DashboardRecentJobItem {
  id: string;
  jobId?: string;
  requestNumber?: string;
  title?: string;
  thumbnailUrl?: string;
  service?:
    | {
        id?: string;
        name: string;
        category?: string;
        image?: string;
      }
    | string;
  category?:
    | {
        name: string;
      }
    | string;
  client?: {
    id?: string;
    name?: string;
    fullName?: string;
    avatar?: string;
    avatarUrl?: string;
  };
  expert?: {
    id?: string;
    name?: string;
    fullName?: string;
    avatar?: string;
    avatarUrl?: string;
  } | null;
  status: string;
  amount?: string | number;
  totalAmount?: number;
  payment?: {
    amount?: number;
    status?: string;
  };
  latestQuote?: {
    amount?: number;
  };
  createdAt?: string;
  [key: string]: any;
}

export interface DashboardRecentActivityItem {
  id: string;
  title: string;
  description: string;
  time?: string;
  type?: "amber" | "blue" | "emerald" | "rose" | string;
  eventType?: string;
  timestamp?: number | string;
  createdAt?: string;
  link?: string;
  [key: string]: any;
}

export interface DashboardTopExpertItem {
  id: string;
  name?: string;
  fullName?: string;
  avatar?: string;
  avatarUrl?: string;
  profession?: string;
  professionalTitle?: string;
  category?:
    | {
        name: string;
      }
    | string;
  jobsCompleted?: number;
  completedJobs?: number;
  totalJobs?: number;
  totalEarnings?: string | number;
  totalEarned?: string | number;
  earnings?: number;
  rating?: number;
  averageRating?: number;
  [key: string]: any;
}

export type DashboardSearchType = "ALL" | "CLIENTS" | "EXPERTS" | "JOBS";

export interface DashboardSearchQueryParams {
  q: string;
  type?: DashboardSearchType;
  limit?: number;
}

export interface DashboardSearchItem {
  id: string;
  type?: "CLIENT" | "EXPERT" | "JOB" | string;
  title?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  avatarUrl?: string;
  professionalTitle?: string;
  category?: string;
  service?: string;
  requestNumber?: string;
  status?: string;
  badge?: string;
  [key: string]: any;
}

export interface DashboardSearchResponseData {
  clients?: DashboardSearchItem[];
  experts?: DashboardSearchItem[];
  jobs?: DashboardSearchItem[];
  results?: DashboardSearchItem[];
  [key: string]: any;
}
