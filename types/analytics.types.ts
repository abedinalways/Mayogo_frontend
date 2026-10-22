export type AnalyticsTimeframe =
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "last_6_months"
  | "last_12_months"
  | "this_year"
  | "all_time"
  | "custom";

export interface AnalyticsQueryParams {
  timeframe?: AnalyticsTimeframe;
  startDate?: string;
  endDate?: string;
  limit?: number;
  format?: "csv" | "json";
}

export interface MetricTrendInfo {
  value: string;
  positive: boolean;
}

export interface MetricCardValue {
  value: number;
  formatted?: string;
  changePercentage?: number;
  trend?: MetricTrendInfo;
  subtitle?: string;
}

export interface AnalyticsOverviewData {
  totalRevenue?: number | MetricCardValue;
  platformCommission?: number | MetricCardValue;
  averageTransactionValue?: number | MetricCardValue;
  revenueGrowth?: number | MetricCardValue;
  // Fallbacks and alternatives
  grossRevenue?: number;
  commissionRevenue?: number;
  atv?: number;
  growthRate?: number;
  totalRevenueChange?: number;
  platformCommissionChange?: number;
  atvChange?: number;
  growthChange?: number;
  comparisonPeriod?: string;
  currency?: string;
}

export interface RevenueTrendItem {
  month: string;
  revenue: number;
  commission: number;
  formattedRevenue?: string;
  formattedCommission?: string;
  timestamp?: number;
  [key: string]: unknown;
}

export interface RevenueTrendResponseData {
  trend?: RevenueTrendItem[];
  items?: RevenueTrendItem[];
  data?: RevenueTrendItem[];
  totals?: {
    revenue?: number;
    commission?: number;
  };
  averageMonthlyRevenue?: number;
  peakMonth?: string;
}

export interface CategoryRevenueItem {
  name: string;
  categoryName?: string;
  value: number;
  percentage?: number;
  jobs: number;
  jobCount?: number;
  revenue: string | number;
  color?: string;
  id?: string;
}

export interface RevenueByCategoryResponseData {
  categories?: CategoryRevenueItem[];
  items?: CategoryRevenueItem[];
  data?: CategoryRevenueItem[];
  totalRevenue?: number;
}

export interface JobTrendItem {
  month: string;
  completed: number;
  active: number;
  disputed: number;
  total?: number;
  cancelled?: number;
  [key: string]: unknown;
}

export interface JobTrendResponseData {
  trend?: JobTrendItem[];
  items?: JobTrendItem[];
  data?: JobTrendItem[];
  summary?: {
    totalCompleted?: number;
    totalActive?: number;
    totalDisputed?: number;
  };
}

export interface UserGrowthItem {
  month: string;
  clients: number;
  experts: number;
  total?: number;
  [key: string]: unknown;
}

export interface UserGrowthResponseData {
  growth?: UserGrowthItem[];
  trend?: UserGrowthItem[];
  items?: UserGrowthItem[];
  data?: UserGrowthItem[];
  summary?: {
    totalNewClients?: number;
    totalNewExperts?: number;
  };
}

export interface PopularCategoryItem {
  id: string;
  name: string;
  categoryName?: string;
  percentage: number;
  share?: number;
  demandPercentage?: number;
  jobs?: number;
  jobCount?: number;
  revenue?: number | string;
  colorClass?: string;
}

export interface PopularCategoriesResponseData {
  categories?: PopularCategoryItem[];
  items?: PopularCategoryItem[];
  data?: PopularCategoryItem[];
}

export interface DisputeRateData {
  disputeRate?: number | string;
  rate?: number | string;
  percentage?: number | string;
  totalRaised?: number;
  totalDisputes?: number;
  openDisputes?: number;
  open?: number;
  resolvedDisputes?: number;
  resolved?: number;
  solvedDisputes?: number;
  solved?: number;
  subtitle?: string;
}

export interface VerificationRequestsData {
  totalRequests?: number;
  total?: number;
  approved?: number;
  pending?: number;
  pendingReview?: number;
  rejected?: number;
  approvalRate?: number | string;
  subtitle?: string;
}

export interface FullAnalyticsDashboardData {
  overview?: AnalyticsOverviewData;
  revenueTrend?: RevenueTrendResponseData | RevenueTrendItem[];
  revenueByCategory?: RevenueByCategoryResponseData | CategoryRevenueItem[];
  jobTrend?: JobTrendResponseData | JobTrendItem[];
  userGrowth?: UserGrowthResponseData | UserGrowthItem[];
  popularCategories?: PopularCategoriesResponseData | PopularCategoryItem[];
  disputeRate?: DisputeRateData;
  verificationRequests?: VerificationRequestsData;
}
