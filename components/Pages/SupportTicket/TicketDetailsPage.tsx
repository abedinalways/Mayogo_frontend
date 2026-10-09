"use client";

import React from "react";
import BackButton from "../../shared/BackButton";
import { TicketDetailsHeader } from "./TicketDetailsHeader";
import TicketDetails from "./TicketDetails";
import TicketSidebar from "./TicketSidebar";
import {
  useGetSupportTicketByIdQuery,
  useUpdateSupportTicketStatusMutation,
  useAddSupportTicketMessageMutation,
} from "@/lib/redux/api/supportApi";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { SupportTicketComment, SupportTicketAttachment } from "@/types/support.types";

interface TicketDetailsPageProps {
  ticketId?: string;
}

export default function TicketDetailsPage({ ticketId }: TicketDetailsPageProps) {
  const {
    data: ticket,
    isLoading,
    error,
    refetch,
  } = useGetSupportTicketByIdQuery(ticketId || "", {
    skip: !ticketId,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateSupportTicketStatusMutation();
  const [addMessage, { isLoading: isSendingMessage }] =
    useAddSupportTicketMessageMutation();

  if (!ticketId) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm font-medium text-slate-800">Invalid Ticket ID</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-slate-200">
        <Loader2 className="h-8 w-8 text-[#103D5C] animate-spin" />
        <p className="text-sm text-slate-500">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
        <p className="text-base font-semibold text-slate-800">Ticket Not Found</p>
        <p className="text-xs text-slate-500">
          We could not find the requested support ticket or an error occurred.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-[#103D5C] text-white hover:bg-[#0a273b] transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const rawStatus = (ticket.status || "OPEN").toUpperCase();
  let headerStatus: "Open" | "In Progress" | "Resolved" | "Closed" = "Open";
  if (rawStatus === "UNDER_REVIEW") headerStatus = "In Progress";
  else if (rawStatus === "RESOLVED") headerStatus = "Resolved";
  else if (rawStatus === "CLOSED") headerStatus = "Closed";

  const handleMarkAsSolved = async () => {
    try {
      await updateStatus({
        ticketId: ticket.id,
        status: "RESOLVED",
        resolution: "Issue resolved by Admin.",
      }).unwrap();
    } catch {
      // handled via mutation
    }
  };

  const handleSendReply = async (replyText: string) => {
    try {
      await addMessage({
        ticketId: ticket.id,
        message: replyText,
        isInternal: false,
      }).unwrap();
    } catch {
      // handled via mutation
    }
  };

  const userName =
    ticket.user?.fullName ||
    ticket.user?.name ||
    ticket.client?.fullName ||
    ticket.client?.name ||
    ticket.expert?.fullName ||
    ticket.expert?.name ||
    "User";

  const commentsList: SupportTicketComment[] = (
    ticket.messages ||
    ticket.comments ||
    []
  ).map((c, idx) => ({
    id: c.id || String(idx),
    authorName: c.authorName || "Participant",
    authorAvatar: c.authorAvatar,
    timestamp: c.timestamp || "Recently",
    content: c.content,
    isInternal: c.isInternal,
    senderRole: c.senderRole,
  }));

  const attachmentsList: SupportTicketAttachment[] = (ticket.attachments || []).map(
    (att, idx) => ({
      id: att.id || String(idx),
      name: att.name,
      size: att.size || "File",
      type: att.type || (att.name.endsWith(".jpg") || att.name.endsWith(".png") ? "image" : "file"),
      url: att.url,
    })
  );

  let formattedDate = "N/A";
  if (ticket.createdAt) {
    try {
      formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(ticket.createdAt));
    } catch {
      formattedDate = ticket.createdAt;
    }
  }

  const sidebarDetails = {
    userId: ticket.user?.id ? `#USR-${ticket.user.id.slice(0, 6)}` : "#USR-8042",
    requestedBy: userName,
    role: ticket.role || (ticket.user?.role?.includes("EXPERT") ? "Expert" : "Client"),
    createdOn: formattedDate,
    lastActivity: ticket.lastActivity || formattedDate,
    jobId: ticket.jobId
      ? ticket.jobId.startsWith("#")
        ? ticket.jobId
        : `#${ticket.jobId}`
      : undefined,
    serviceValue: ticket.serviceValue
      ? typeof ticket.serviceValue === "number"
        ? `$${ticket.serviceValue}`
        : String(ticket.serviceValue)
      : undefined,
  };

  return (
    <div className="space-y-5 font-['Manrope']">
      <BackButton />

      <TicketDetailsHeader
        ticketDetails={{
          ticketId: ticket.ticketId || ticket.ticketNumber || ticket.id.slice(0, 8),
          category: ticket.category || "General Issue",
          status: headerStatus,
          onMarkAsSolved: handleMarkAsSolved,
          isLoading: isUpdatingStatus,
        }}
      />

      <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-12 lg:col-span-8">
          <TicketDetails
            title={ticket.subject || ticket.title || "Support Request"}
            categoryTag={ticket.category || "General Issue"}
            priorityTag={`${ticket.priority || "Medium"} Priority`}
            description={ticket.description || "No description provided."}
            attachments={attachmentsList}
            comments={commentsList}
            onSendReply={handleSendReply}
            isSending={isSendingMessage}
          />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <TicketSidebar details={sidebarDetails} />
        </div>
      </div>
    </div>
  );
}