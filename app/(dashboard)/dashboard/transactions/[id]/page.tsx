import BackButton from "@/components/shared/BackButton";
import TransactionDetailsPage from "@/components/Pages/Transaction/TransactionDetailsPage";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || "TX-012639";

  return (
    <div className="space-y-4">
      <BackButton />
      <TransactionDetailsPage txId={id} />
    </div>
  );
}
