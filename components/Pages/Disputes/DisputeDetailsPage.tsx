"use client";

import React from "react";
import DisputeJobDetails from "./DisputeJobDetails";
import DisputeClaimsComparison from "./ClaimCard";
import InternalNotes from "./InternalNotes";
import RelatedJobSummary from "./RelatedJobSummary";
import EscrowPayment from "./EscrowPayment";
import DisputeJobTimeline, { TimelineEvent } from "./DisputeJobTimeline";
import AdminDecisionPanel from "./AdminDecisionPanel";
import DisputeHeader from "./DisputeHeader";
import BackButton from "../../shared/BackButton";
import {
  useGetDisputeByIdQuery,
  useUpdateDisputeStatusMutation,
  useAddDisputeMessageMutation,
} from "@/lib/redux/api/disputeApi";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";

interface DisputeDetailsPageProps {
  disputeId?: string;
}

export default function DisputeDetailsPage({ disputeId }: DisputeDetailsPageProps) {
  const adminUser = useAppSelector((state) => state.auth.user);

  const {
    data: dispute,
    isLoading,
    error,
    refetch,
  } = useGetDisputeByIdQuery(disputeId || "", {
    skip: !disputeId,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateDisputeStatusMutation();
  const [addMessage, { isLoading: isAddingMessage }] = useAddDisputeMessageMutation();

  if (!disputeId) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm font-medium text-slate-800">Invalid Dispute ID</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-slate-200">
        <Loader2 className="h-8 w-8 text-[#103D5C] animate-spin" />
        <p className="text-sm text-slate-500">Loading dispute details...</p>
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
        <p className="text-base font-semibold text-slate-800">Dispute Not Found</p>
        <p className="text-xs text-slate-500">
          We could not find the requested dispute case or the server returned an error.
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

  const rawStatus = (dispute.status || "OPEN").toUpperCase();
  let statusText = "Open";
  if (rawStatus === "UNDER_REVIEW") statusText = "Under Review";
  else if (rawStatus === "AWAITING_CLIENT") statusText = "Awaiting Client";
  else if (rawStatus === "AWAITING_EXPERT") statusText = "Awaiting Expert";
  else if (rawStatus === "RESOLVED") statusText = "Resolved";
  else if (rawStatus === "REJECTED" || rawStatus === "CLOSED") statusText = "Rejected";

  const clientName = dispute.client?.fullName || dispute.client?.name || "Sarah William";
  const expertName = dispute.expert?.fullName || dispute.expert?.name || "Daniel Green";

  const totalAmountNum = typeof dispute.totalAmount === "number"
    ? dispute.totalAmount
    : typeof dispute.agreedQuote === "number"
    ? dispute.agreedQuote
    : typeof dispute.amount === "number"
    ? dispute.amount
    : parseFloat(String(dispute.totalAmount || dispute.agreedQuote || dispute.amount || 500));

  const disputedAmountNum = typeof dispute.disputedAmount === "number"
    ? dispute.disputedAmount
    : parseFloat(String(dispute.disputedAmount || 0)) || totalAmountNum;

  const timelineEvents: TimelineEvent[] = (dispute.timeline || []).map((ev, idx) => ({
    id: ev.id || String(idx),
    title: ev.title,
    description: ev.description,
    timeAgo: ev.timeAgo || ev.date || "Recently",
    status: ev.status || "info",
  }));

  const initialNotesList = (dispute.internalNotes || []).map((n) => ({
    id: n.id,
    content: n.content,
    author: n.author,
    createdAt: n.createdAt,
  }));

  const handleDecisionSubmit = async (decision: {
    type: string;
    status: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";
    refundAmount: number;
    reason: string;
    notes: string;
  }) => {
    await updateStatus({
      ticketId: dispute.id,
      status: decision.status,
      resolution: decision.notes
        ? `${decision.reason}: ${decision.notes} (Refund: $${decision.refundAmount.toFixed(2)})`
        : `${decision.reason} - Refund: $${decision.refundAmount.toFixed(2)}`,
    }).unwrap();
  };

  const handleAddNote = async (content: string) => {
    await addMessage({
      ticketId: dispute.id,
      message: content,
      isInternal: true,
    }).unwrap();
  };

  return (
    <div className="space-y-5 font-['Manrope']">
      <BackButton />

      {/* Top Header */}
      <DisputeHeader
        ticketId={dispute.ticketId || dispute.ticketNumber || `#DSP-${dispute.id.slice(0, 6)}`}
        status={statusText}
        category={dispute.service?.category || dispute.category || "General Issue"}
        serviceName={dispute.service?.name || dispute.subject || "Service Dispute"}
        messages={dispute.messages || []}
      />

      {/* Overview Details Cards */}
      <DisputeJobDetails
        jobId={dispute.jobId ? (dispute.jobId.startsWith("#") ? dispute.jobId : `#${dispute.jobId}`) : "#JB001"}
        startDate={dispute.startDate || dispute.dateOpened || "Jul 27, 2026"}
        reason={dispute.disputeReason || dispute.reason || "Quality Issues"}
        paymentType={dispute.paymentType || "Milestone Based"}
        escrowStatus={dispute.escrowStatus || "Partially Released"}
        disputedAmount={`$${disputedAmountNum.toFixed(2)}`}
        assignedAdmin={dispute.assignedAdmin || "Unassigned"}
      />

      {/* Claims Comparison (Client claim vs Provider response) */}
      <DisputeClaimsComparison
        clientClaim={
          dispute.clientClaim
            ? {
                type: "client",
                date: dispute.clientClaim.date || "Jul 27, 2026",
                time: dispute.clientClaim.time || "11:00 AM",
                title: dispute.clientClaim.title || "Service quality was not as expected",
                description: dispute.clientClaim.description || dispute.description || "",
                files: dispute.clientClaim.files || [],
              }
            : undefined
        }
        providerResponse={
          dispute.providerResponse
            ? {
                type: "provider",
                date: dispute.providerResponse.date || "Jul 28, 2026",
                time: dispute.providerResponse.time || "02:00 PM",
                title: dispute.providerResponse.title || "Provider response to dispute",
                description: dispute.providerResponse.description || "",
                files: dispute.providerResponse.files || [],
                beforePhotos: dispute.providerResponse.beforePhotos,
                afterPhotos: dispute.providerResponse.afterPhotos,
              }
            : undefined
        }
      />

      {/* Main Grid: Left summary/escrow/timeline, Right decision/notes */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <RelatedJobSummary
              hiredDate={dispute.startDate || "Jul 27, 2026"}
              client={{
                name: clientName,
                id: `Client ID #${(dispute.client?.id || "CET001").slice(0, 6)}`,
                avatarUrl:
                  dispute.client?.avatar ||
                  dispute.client?.avatarUrl ||
                  `https://placehold.co/150x150?text=${encodeURIComponent(clientName.charAt(0))}`,
                profileId: dispute.client?.id,
                role: "client",
              }}
              expert={{
                name: expertName,
                id: `Expert ID #${(dispute.expert?.id || "EXP001").slice(0, 6)}`,
                avatarUrl:
                  dispute.expert?.avatar ||
                  dispute.expert?.avatarUrl ||
                  `https://placehold.co/150x150?text=${encodeURIComponent(expertName.charAt(0))}`,
                profileId: dispute.expert?.id,
                role: "expert",
              }}
              scopeOfWork={
                dispute.scopeOfWork ||
                "Inspect the unit, perform diagnostic tests, verify all electrical connections, and complete necessary service repairs."
              }
              agreedQuote={`$${totalAmountNum.toFixed(2)}`}
              estDuration={dispute.estDuration || "2 Days"}
            />

            <EscrowPayment
              paymentHeld={
                dispute.paymentHeld !== undefined
                  ? typeof dispute.paymentHeld === "number"
                    ? `$${dispute.paymentHeld.toFixed(2)}`
                    : String(dispute.paymentHeld)
                  : `$${totalAmountNum.toFixed(2)}`
              }
              payoutFrozen={dispute.payoutFrozen ?? true}
              refundIssued={dispute.refundIssued ?? (rawStatus === "RESOLVED")}
            />

            <DisputeJobTimeline
              events={timelineEvents.length > 0 ? timelineEvents : undefined}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <AdminDecisionPanel
              ticketId={dispute.id}
              totalAmount={totalAmountNum}
              currentStatus={statusText}
              onSubmitDecision={handleDecisionSubmit}
              isLoading={isUpdatingStatus}
            />

            <InternalNotes
              initialNotes={initialNotesList}
              currentUser={adminUser?.fullName || "Admin"}
              onAddNote={handleAddNote}
              isLoading={isAddingMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
