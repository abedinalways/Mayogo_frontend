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

export interface EscrowSettings {
  id?: string;
  escrowReleaseDays: number;
  escrowHoldDuration?: number;
  escrowHoldDays?: number;
  minWithdrawalAmount: number;
  withdrawalProcessingDays: number;
  refundProcessingDays: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface UpdateEscrowDto {
  escrowReleaseDays?: number;
  escrowHoldDuration?: number;
  escrowHoldDays?: number;
  minWithdrawalAmount?: number;
  withdrawalProcessingDays?: number;
  refundProcessingDays?: number;
  [key: string]: any;
}

export type NotificationTargetType = "CLIENT" | "EXPERT";

export interface NotificationSettingItem {
  id?: string;
  category: string;
  title?: string;
  name?: string;
  description?: string;
  enabled: boolean;
  targetType?: NotificationTargetType;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface UpdateNotificationDto {
  targetType: NotificationTargetType;
  category: string;
  enabled: boolean;
}

export interface ToggleAllNotificationsDto {
  targetType: NotificationTargetType;
  enabled: boolean;
}

export interface NotificationCategoryItem {
  id?: string;
  key?: string;
  name?: string;
  category?: string;
  targetType?: NotificationTargetType;
  description?: string;
  [key: string]: any;
}



