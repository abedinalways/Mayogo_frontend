"use client";

import React, { use } from "react";
import DisputeDetailsPage from "@/components/Pages/Disputes/DisputeDetailsPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const resolvedParams = use(params);
  return <DisputeDetailsPage disputeId={resolvedParams.id} />;
}
