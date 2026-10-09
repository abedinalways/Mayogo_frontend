export interface Client {
  id: string;
  clientId?: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  status?: "Active" | "Inactive" | "Suspended" | "active" | "inactive";
  totalSpent?: number | string;
  jobRequested?: number;
  totalJobs?: number;
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
}

export interface ClientListParams {
  search?: string;
  status?: "all" | "active" | "inactive";
  sortBy?: "createdAt" | "fullName" | "totalSpent" | "jobRequested";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface ClientListResponseData {
  clients?: Client[];
  data?: Client[];
  items?: Client[];
  total: number;
  limit: number;
  offset: number;
  page?: number;
  totalPages?: number;
}

export interface UpdateClientStatusPayload {
  id: string;
  isActive: boolean;
  reason?: string;
}
