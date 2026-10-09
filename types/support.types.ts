export type SupportTicketStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "RESOLVED"
  | "CLOSED";

export type SupportTicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type SupportTicketCategory =
  | "GENERAL_ISSUE"
  | "RAISE_DISPUTE"
  | "SERVICE_NOT_COMPLETED"
  | "QUALITY_ISSUE"
  | "EXPERT_BEHAVIOR"
  | "SAFETY_CONCERN"
  | "REFUND_REQUEST"
  | "PAYMENT_ISSUE"
  | "OTHER";

export interface SupportTicketUser {
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
  avatarUrl?: string;
  role?: "Client" | "Expert" | "Admin" | string;
}

export interface SupportTicketAttachment {
  id?: string;
  name: string;
  size?: string;
  type?: "image" | "file" | string;
  url?: string;
}

export interface SupportTicketComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  timestamp: string;
  content: string;
  isInternal?: boolean;
  senderRole?: "Client" | "Expert" | "Admin" | string;
}

export interface SupportTicketItem {
  id: string;
  ticketId?: string;
  ticketNumber?: string;
  subject?: string;
  title?: string;
  description?: string;
  category: SupportTicketCategory | string;
  status: SupportTicketStatus | string;
  priority: SupportTicketPriority | string;
  user?: SupportTicketUser;
  client?: SupportTicketUser;
  expert?: SupportTicketUser;
  role?: "Client" | "Expert" | string;
  reason?: string;
  jobId?: string;
  assignedAdmin?: string;
  assignedAdminId?: string;
  createdAt?: string;
  updatedAt?: string;
  lastActivity?: string;
  serviceValue?: string | number;
}

export interface SupportTicketDetails extends SupportTicketItem {
  attachments?: SupportTicketAttachment[];
  messages?: SupportTicketComment[];
  comments?: SupportTicketComment[];
  job?: {
    id: string;
    requestNumber?: string;
    title?: string;
    service?: { name: string; category?: string };
    amount?: number | string;
  };
}

export interface SupportTicketListParams {
  status?: SupportTicketStatus | string;
  category?: SupportTicketCategory | string;
  priority?: SupportTicketPriority | string;
  search?: string;
  jobId?: string;
  assignedAdminId?: string;
  limit?: number;
  offset?: number;
}

export interface SupportTicketListResponseData {
  tickets?: SupportTicketItem[];
  data?: SupportTicketItem[];
  items?: SupportTicketItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface SupportTicketStatsResponseData {
  total?: number;
  open?: number;
  underReview?: number;
  resolved?: number;
  closed?: number;
  urgent?: number;
}

export interface UpdateSupportTicketStatusPayload {
  ticketId: string;
  status: SupportTicketStatus;
  resolution?: string;
}

export interface AssignSupportTicketPayload {
  ticketId: string;
  adminId: string;
}

export interface AddSupportTicketMessagePayload {
  ticketId: string;
  message: string;
  isInternal?: boolean;
  attachmentIds?: string[];
}
