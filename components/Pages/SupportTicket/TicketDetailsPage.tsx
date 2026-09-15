"use client";
import React from "react";
import BackButton from "../../shared/BackButton";
import { TicketDetailsHeader } from "./TicketDetailsHeader";
import TicketDetails from "./TicketDetails";
import TicketSidebar from "./TicketSidebar";

export default function TicketDetailsPage() {
  const handleMarkAsSolved = () => {
    // Handle solve logic here
  };

  const ticketDetails = {
    ticketId: "DSP-10482",
    category: "Raise Dispute",
    status: "Open" as const,
    onMarkAsSolved: handleMarkAsSolved,
  };

  return (
    <div className="space-y-5">
      <BackButton />
      <TicketDetailsHeader ticketDetails={ticketDetails} />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <TicketDetails />
        </div>
        <div className="col-span-4">
          <TicketSidebar />
        </div>
      </div>
    </div>
  );
}