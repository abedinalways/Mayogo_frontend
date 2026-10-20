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

export interface SecuritySettingsData {
  id?: string;
  twoFactorEnabled: boolean;
  sessionTimeoutHours: number;
  warnBeforeLogout: boolean;
  warningMinutes: number;
  ipRestrictionEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface UpdateSecurityDto {
  twoFactorEnabled?: boolean;
  sessionTimeoutHours?: number;
  warnBeforeLogout?: boolean;
  warningMinutes?: number;
  ipRestrictionEnabled?: boolean;
  [key: string]: any;
}

export interface IpRestrictionItem {
  id: string;
  ipAddress?: string;
  ip?: string;
  label?: string;
  status: "ACTIVE" | "DISABLED" | "Active" | "Disabled" | string;
  addedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  [key: string]: any;
}

export interface CreateIpRestrictionDto {
  ipAddress: string;
  label?: string;
}

export interface UpdateIpRestrictionDto {
  ipAddress?: string;
  label?: string;
  status?: "ACTIVE" | "DISABLED" | string;
}

export interface GetIpRestrictionsParams {
  limit?: number;
  offset?: number;
  status?: "ALL" | "ACTIVE" | "DISABLED" | string;
}

export interface ActiveSessionItem {
  id: string;
  sessionId?: string;
  device?: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  location?: string;
  ip?: string;
  ipAddress?: string;
  lastActive?: string;
  createdAt?: string;
  isCurrent?: boolean;
  [key: string]: any;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SystemSettingsData {
  id?: string;
  userRegistration: boolean;
  expertRegistration: boolean;
  subscriptionPlans: boolean;
  referralProgram: boolean;
  reviewsRatings: boolean;
  maintenanceMode: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface UpdateSystemDto {
  userRegistration?: boolean;
  expertRegistration?: boolean;
  subscriptionPlans?: boolean;
  referralProgram?: boolean;
  reviewsRatings?: boolean;
  maintenanceMode?: boolean;
}

export interface MaintenanceStatusResponse {
  maintenanceMode?: boolean;
  status?: boolean | string;
  [key: string]: any;
}
