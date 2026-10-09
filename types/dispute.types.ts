export type DisputeTab =
  | "ALL"
  | "OPEN"
  | "UNDER_REVIEW"
  | "AWAITING_CLIENT"
  | "AWAITING_EXPERT"
  | "RESOLVED"
  | "REJECTED";

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

export interface DisputeParty {
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
  avatarUrl?: string;
  rating?: number | string;
}

export interface DisputeService {
  id?: string;
  name: string;
  category?: string;
  image?: string;
}

export interface DisputeEvidenceFile {
  id: string;
  name: string;
  size?: string;
  type?: "pdf" | "image" | string;
  url?: string;
  isDownloaded?: boolean;
}

export interface DisputeMessage {
  id: string;
  senderName: string;
  senderRole: "Client" | "Expert" | "Admin";
  senderId?: string;
  avatar?: string;
  text?: string;
  message?: string;
  timestamp: string;
  createdAt?: string;
  isInternal?: boolean;
}

export interface DisputeTimelineEvent {
  id: string;
  title: string;
  description: string;
  timeAgo?: string;
  date?: string;
  status: "info" | "warning" | "success" | "error";
  createdAt?: string;
}

export interface DisputeItem {
  id: string;
  ticketId?: string;
  ticketNumber?: string;
  jobId?: string;
  subject?: string;
  description?: string;
  service?: DisputeService;
  client?: DisputeParty;
  expert?: DisputeParty;
  disputeReason?: string;
  reason?: string;
  category?: DisputeCategory | string;
  priority?: DisputePriority;
  riskLevel?: DisputePriority | string;
  dateOpened?: string;
  createdAt?: string;
  status: DisputeTab | string;
  assignedAdmin?: string;
  assignedAdminId?: string;
  amount?: number | string;
  disputedAmount?: number | string;
}

export interface DisputeDetails extends DisputeItem {
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
  messages?: DisputeMessage[];
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
  priority?: DisputePriority;
  category?: DisputeCategory | string;
  assignedAdminId?: string;
  jobId?: string;
  search?: string;
  sortBy?: DisputeSortBy;
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
