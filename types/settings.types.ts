export interface CompanySettings {
  id?: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  industry: string;
  logoUrl?: string | null;
  address: string;
  country: string;
  city: string;
  postalCode: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface UpdateCompanySettingsDto {
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  industry?: string;
  logoUrl?: string;
  address?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  timezone?: string;
  currency?: string;
  dateFormat?: string;
  [key: string]: any;
}

export interface CompanyLogoUploadResponse {
  logoUrl?: string;
  url?: string;
  [key: string]: any;
}

export type PlanInterval = "MONTHLY" | "YEARLY" | string;
export type PlanStatus = "ALL" | "ACTIVE" | "INACTIVE" | "ARCHIVED" | string;

export interface PlanItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  interval: PlanInterval;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED" | string;
  includedFeatures?: string[];
  limitations?: string[];
  badgeText?: string;
  isPopular?: boolean;
  sortOrder?: number;
  subscribers?: number | string;
  subscribersCount?: number;
  subscriberCount?: number;
  _count?: {
    subscriptions?: number;
    subscribers?: number;
    users?: number;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface GetPlansQueryParams {
  limit?: number;
  offset?: number;
  status?: PlanStatus;
}

export interface CreatePlanDto {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  interval: PlanInterval;
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  includedFeatures?: string[];
  limitations?: string[];
  badgeText?: string;
  isPopular?: boolean;
  sortOrder?: number;
}

export interface UpdatePlanDto {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  interval?: PlanInterval;
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED" | string;
  includedFeatures?: string[];
  limitations?: string[];
  badgeText?: string;
  isPopular?: boolean;
  sortOrder?: number;
}

