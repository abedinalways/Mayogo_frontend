export interface CategoryItem {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  color?: string;
  isActive?: boolean;
  displayOrder?: number;
  isFeatured?: boolean;
  servicesCount?: number;
  jobsCount?: number;
  _count?: {
    services?: number;
    jobs?: number;
  };
}

export interface CategoryListParams {
  includeInactive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CategoryListResponseData {
  categories?: CategoryItem[];
  data?: CategoryItem[];
  items?: CategoryItem[];
  total?: number;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  color?: string;
  isActive?: boolean;
  displayOrder?: number;
  isFeatured?: boolean;
}

export interface UpdateCategoryPayload {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  color?: string;
  isActive?: boolean;
  displayOrder?: number;
  isFeatured?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  commission: number | string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  } | string;
  isActive: boolean;
  status?: boolean;
  totalJobs?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceListParams {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  status?: "active" | "inactive" | "all";
  sortBy?: "name" | "createdAt" | "totalJobs";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface ServiceListResponseData {
  services?: ServiceItem[];
  data?: ServiceItem[];
  items?: ServiceItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  imageUrl?: string;
  commission: number;
  categoryId: string;
  isActive?: boolean;
}

export interface UpdateServicePayload {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  commission?: number;
  categoryId?: string;
  isActive?: boolean;
}

export interface ToggleServiceStatusPayload {
  id: string;
  isActive: boolean;
}
