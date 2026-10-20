"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InfoCard } from "./InfoCard";
import { PaymentSummaryCard } from "../Dashboard/PaymentSummaryCard";
import JobStatusTimeline from "./JobStatusTimeline";
import { AdminJobItem } from "@/types/job.types";

interface RightSideProps {
  job?: AdminJobItem | null;
}

export default function RightSide({ job }: RightSideProps) {
  const router = useRouter();

  const clientName = job?.client?.fullName || job?.client?.name || "Client Name";
  const clientIdText = job?.client?.id
    ? `Client ID #${job.client.id.slice(0, 6)}`
    : "Client ID #CET001";
  const clientAvatar =
    job?.client?.avatarUrl ||
    job?.client?.avatar ||
    `https://placehold.co/150x150?text=${encodeURIComponent(clientName.charAt(0))}`;

  const expertName = job?.expert?.fullName || job?.expert?.name || "Unassigned Expert";
  const expertIdText = job?.expert?.id
    ? `Expert ID #${job.expert.id.slice(0, 6)}`
    : "Expert ID #EXP001";
  const expertAvatar =
    job?.expert?.avatarUrl ||
    job?.expert?.avatar ||
    `https://placehold.co/150x150?text=${encodeURIComponent(expertName.charAt(0))}`;

  const paymentObj = (job as any)?.payment || (job as any)?.payments?.[0];
  const quoteObj = (job as any)?.latestQuote || (job as any)?.quotations?.[0];
  const rawQuoted = quoteObj?.amount ?? job?.quote ?? 0;
  const rawFinal =
    paymentObj?.totalAmount ??
    paymentObj?.amount ??
    job?.amount ??
    job?.totalAmount ??
    rawQuoted;

  const quotedAmount =
    typeof rawQuoted === "number"
      ? `$${rawQuoted.toLocaleString()}`
      : `$${(parseFloat(String(rawQuoted || 0)) || 0).toLocaleString()}`;
  const finalAmount =
    typeof rawFinal === "number"
      ? `$${rawFinal.toLocaleString()}`
      : `$${(parseFloat(String(rawFinal || 0)) || 0).toLocaleString()}`;

  let paymentStatusStr = "Pending";
  if (typeof job?.payment === "object" && job?.payment !== null) {
    const s = String((job.payment as any).status || "").toUpperCase();
    if (s === "COMPLETED" || s === "PAID") paymentStatusStr = "Paid";
    else if (s === "PENDING") paymentStatusStr = "Pending";
    else if (s === "FAILED") paymentStatusStr = "Failed";
    else if (s === "REFUNDED") paymentStatusStr = "Refunded";
    else if (s) paymentStatusStr = s;
  } else if (typeof job?.paymentStatus === "string") {
    paymentStatusStr = job.paymentStatus;
  }

  const timelineItems =
    job?.events && job.events.length > 0
      ? job.events.map((evt, idx) => {
          let dateStr = evt.createdAt;
          try {
            dateStr = new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(evt.createdAt));
          } catch {
            dateStr = evt.createdAt;
          }
          const t = evt.type.toUpperCase();
          const variant = (
            t.includes("COMPLETE") || t.includes("ACCEPT")
              ? "success"
              : t.includes("PROGRESS") || t.includes("SENT")
              ? "info"
              : "warning"
          ) as "info" | "success" | "warning";

          return {
            id: idx + 1,
            title: evt.type.replace(/_/g, " "),
            timestamp: dateStr,
            description: evt.message,
            variant,
          };
        })
      : undefined;

  return (
    <div className="flex flex-col gap-4 w-full">
      <InfoCard
        title="Client Information"
        name={clientName}
        idText={clientIdText}
        avatarUrl={clientAvatar}
        phone={job?.client?.phone || "N/A"}
        onViewProfile={() => {
          if (job?.client?.id) router.push(`/dashboard/clients/${job.client.id}`);
        }}
      />

      <InfoCard
        title="Expert Information"
        name={expertName}
        idText={expertIdText}
        subtitle={
          job?.expert?.professionalTitle ||
          job?.category?.name ||
          job?.service?.category ||
          "Verified Specialist"
        }
        avatarUrl={expertAvatar}
        isVerified={job?.expert?.isVerified ?? true}
        rating={job?.expert?.rating || "4.8"}
        onViewProfile={() => {
          if (job?.expert?.id) router.push(`/dashboard/experts/${job.expert.id}`);
        }}
      />

      <PaymentSummaryCard
        paymentStatus={paymentStatusStr}
        quotedAmount={quotedAmount}
        finalAmount={finalAmount}
      />

      <JobStatusTimeline items={timelineItems} />
    </div>
  );
}
