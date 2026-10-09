"use client";

import React, { use } from "react";
import TicketDetailsPage from "@/components/Pages/SupportTicket/TicketDetailsPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const resolvedParams = use(params);
  return <TicketDetailsPage ticketId={resolvedParams.id} />;
}
