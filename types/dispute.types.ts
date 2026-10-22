export type DisputeTab =
  | "ALL"
  | "OPEN"
  | "UNDER_REVIEW"
  | "AWAITING_CLIENT"
  | "AWAITING_EXPERT"
  | "RESOLVED"
  | "REJECTED"
  | "CLOSED";

export type DisputePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type DisputeCategory =
  | "GENERAL_ISSUE"
  | "RAISE_DISPUTE"
  | "SERVICE_NOT_COMPLETED"
  | "QUALITY_ISSUE"
  | "EXPERT_BEHAVIOR"
  | "SAFETY_CONCERN"
  | "REFUND_REQUEST"
  | "PAYMENT_ISSUE"
  | "OTHER";

export type DisputeSortBy =
  | "NEWEST_FIRST"
  | "OLDEST_FIRST"
  | "TICKET_NUMBER"
  | "PRIORITY_HIGHEST"
  | "PRIORITY_LOWEST";

export interface DisputeAdminInfo {
  id: string;
  fullName: string;
  email?: string;
  avatarUrl?: string | null;
}

export interface DisputeParty {
  id?: string;
  name?: string;
  fullName?: string;
  email?: string | null;
  phone?: string;
  avatar?: string;
  avatarUrl?: string | null;
  rating?: number | string;
  location?: string;
  professionalTitle?: string;
  joinedAt?: string;
}

export interface DisputeService {
  id?: string;
  name: string;
  category?: string;
  image?: string;
  slug?: string;
}

export interface DisputeJobInfo {
  id: string;
  requestNumber?: string;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    id: string;
    name: string;
    slug?: string;
  };
  service?: {
    id: string;
    name: string;
    slug?: string;
  };
  location?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  appointment?: {
    scheduledAt?: string;
    estimatedDuration?: string;
    status?: string;
  };
  payment?: {
    amount?: string | number;
    status?: string;
    paymentType?: string;
  };
  latestQuote?: {
    amount?: string | number;
    status?: string;
  };
  images?: Array<{
    id: string;
    fileUrl: string;
    displayOrder?: number;
  }>;
  dynamicFields?: Array<{
    fieldKey: string;
    values: string[];
  }>;
}

export interface DisputePaymentInfo {
  id?: string;
  amount?: string | number;
  platformFee?: string | number;
  totalAmount?: string | number;
  status?: string;
  paymentMethod?: string;
  paymentType?: string;
  transactionId?: string;
  paidAt?: string;
  escrowStatus?: string;
  disputedAmount?: string | number;
  milestones?: Array<{
    id: string;
    title: string;
    description?: string;
    amount: string | number;
    order: number;
    status: string;
    releasedAt?: string | null;
    completedAt?: string | null;
  }>;
}

export interface DisputeEvidenceFile {
  id: string;
  name: string;
  size?: string;
  type?: "pdf" | "image" | string;
  url?: string;
  fileUrl?: string;
  fileName?: string;
  isDownloaded?: boolean;
}

export interface DisputeMessage {
  id: string;
  senderId?: string;
  senderType?: "CLIENT" | "EXPERT" | "ADMIN" | string;
  senderName?: string;
  senderRole?: "Client" | "Expert" | "Admin" | string;
  avatar?: string;
  text?: string;
  message?: string;
  timestamp?: string;
  createdAt: string;
  isInternal?: boolean;
  attachments?: Array<{
    id: string;
    fileUrl: string;
    fileName?: string;
  }>;
}

export interface DisputeTimelineEvent {
  id?: string | number;
  type?: string;
  title?: string;
  description?: string;
  message?: string;
  timeAgo?: string;
  date?: string;
  status?: "info" | "warning" | "success" | "error";
  createdAt: string;
}

export interface DisputeLastMessage {
  message: string;
  createdAt: string;
  senderType: string;
}

export interface DisputeMetaPagination {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
}

export interface DisputeItem {
  id: string;
  ticketId?: string;
  ticketNumber?: string;
  jobId?: string | null;
  job?: DisputeJobInfo | null;
  client?: DisputeParty | null;
  expert?: DisputeParty | null;
  category: DisputeCategory | string;
  subject?: string;
  description?: string;
  priority: DisputePriority | string;
  status: DisputeTab | string;
  createdAt: string;
  updatedAt?: string;
  assignedAdmin?: DisputeAdminInfo | string | null;
  assignedAdminId?: string;
  lastMessage?: DisputeLastMessage | null;
  messageCount?: number;
  attachmentCount?: number;
  service?: DisputeService;
  disputeReason?: string;
  reason?: string;
  riskLevel?: DisputePriority | string;
  amount?: number | string;
  disputedAmount?: number | string;
  dateOpened?: string;
}

export interface DisputeDetails extends DisputeItem {
  resolvedAt?: string | null;
  resolution?: string | null;
  payment?: DisputePaymentInfo | null;
  completion?: any;
  messages?: DisputeMessage[];
  events?: DisputeTimelineEvent[];
  attachments?: any[];
  totalAmount?: number | string;
  agreedQuote?: number | string;
  paymentType?: string;
  escrowStatus?: string;
  paymentHeld?: number | string;
  payoutFrozen?: boolean;
  refundIssued?: boolean;
  startDate?: string;
  scopeOfWork?: string;
  estDuration?: string;
  clientClaim?: {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    files?: DisputeEvidenceFile[];
  };
  providerResponse?: {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    files?: DisputeEvidenceFile[];
    beforePhotos?: string[];
    afterPhotos?: string[];
  };
  timeline?: DisputeTimelineEvent[];
  internalNotes?: Array<{
    id: string;
    content: string;
    author: string;
    createdAt?: string;
  }>;
}

export interface DisputeListParams {
  tab?: DisputeTab | string;
  priority?: DisputePriority | string;
  category?: DisputeCategory | string;
  assignedAdminId?: string;
  jobId?: string;
  search?: string;
  sortBy?: DisputeSortBy | string;
  limit?: number;
  offset?: number;
}

export interface DisputeListResponseData {
  disputes?: DisputeItem[];
  tickets?: DisputeItem[];
  data?: DisputeItem[];
  items?: DisputeItem[];
  total: number;
  limit: number;
  offset: number;
  page?: number;
  totalPages?: number;
}

export interface DisputeStatsResponseData {
  totalDisputes?: number;
  total?: number;
  open?: number;
  underReview?: number;
  awaitingClient?: number;
  awaitingExpert?: number;
  resolved?: number;
  rejected?: number;
  closed?: number;
  urgentPriority?: number;
  highPriority?: number;
}

export interface UpdateDisputeStatusPayload {
  ticketId: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";
  resolution?: string;
}

export interface AssignDisputePayload {
  ticketId: string;
  adminId: string;
}

export interface AddDisputeMessagePayload {
  ticketId: string;
  message: string;
  isInternal?: boolean;
  attachmentIds?: string[];
}
