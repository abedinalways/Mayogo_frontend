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
