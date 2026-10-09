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
  const clientIdText = job?.client?.id ? `Client ID #${job.client.id.slice(0, 6)}` : "Client ID #CET001";
  const clientAvatar =
    job?.client?.avatar ||
    `https://placehold.co/150x150?text=${encodeURIComponent(clientName.charAt(0))}`;

  const expertName = job?.expert?.fullName || job?.expert?.name || "Unassigned Expert";
  const expertIdText = job?.expert?.id ? `Expert ID #${job.expert.id.slice(0, 6)}` : "Expert ID #EXP001";
  const expertAvatar =
    job?.expert?.avatar ||
    `https://placehold.co/150x150?text=${encodeURIComponent(expertName.charAt(0))}`;

  const amountVal = job?.amount ?? job?.quote ?? job?.totalAmount ?? 0;
  const amountStr = typeof amountVal === "number" ? `$${amountVal.toLocaleString()}` : String(amountVal);

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
        subtitle={job?.service?.category || "Verified Specialist"}
        avatarUrl={expertAvatar}
        isVerified={job?.expert?.isVerified ?? true}
        rating={job?.expert?.rating || "4.8"}
        onViewProfile={() => {
          if (job?.expert?.id) router.push(`/dashboard/experts/${job.expert.id}`);
        }}
      />

      <PaymentSummaryCard
        paymentStatus={job?.paymentStatus || job?.payment || "Paid"}
        quotedAmount={amountStr}
        finalAmount={amountStr}
      />

      <JobStatusTimeline />
    </div>
  );
}
