"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import BackButton from "@/components/shared/BackButton";
import { ClientHeader } from "@/components/Pages/Clients/ClientHeader";
import ClientStatsCard from "@/components/Pages/Clients/ClientStatsCard";
import { JobStatusTable } from "@/components/Pages/Clients/JobStatusTable";
import { TransactionHistoryTable } from "@/components/Pages/Clients/TransactionHistoryTable";
import { ReviewsGivenTable } from "@/components/Pages/Clients/ReviewsGivenTable";
import {
  useGetClientByIdQuery,
  useUpdateClientStatusMutation,
} from "@/lib/redux/api/clientApi";

export default function ClientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? String(params.id) : "";

  const { data, isLoading, error } = useGetClientByIdQuery(id, {
    skip: !id,
  });

  const [updateClientStatus, { isLoading: isUpdating }] = useUpdateClientStatusMutation();

  const client = data?.data;

  const handleToggleStatus = async (newActiveState: boolean) => {
    if (!id) return;
    try {
      await updateClientStatus({
        id,
        isActive: newActiveState,
        reason: newActiveState
          ? "Account activated by administrator"
          : "Account deactivated by administrator",
      }).unwrap();
    } catch {
      // Error is tracked in RTK Query state
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <BackButton onClick={() => router.push("/dashboard/clients")} label="Back to Clients" />
      </div>

      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Loader2 className="h-8 w-8 text-[#103D5C] animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading client details...</p>
        </div>
      ) : error || !client ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" />
          <h3 className="text-base font-semibold text-slate-900">Client Not Found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            The requested client record could not be found or an error occurred.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard/clients")}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-[#103D5C] text-white hover:bg-[#0b2b41] transition-colors"
          >
            Return to Clients List
          </button>
        </div>
      ) : (
        <>
          <ClientHeader
            client={client}
            onToggleStatus={handleToggleStatus}
            isUpdatingStatus={isUpdating}
          />
          <ClientStatsCard client={client} />
          <JobStatusTable />
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div className="col-span-1">
              <TransactionHistoryTable />
            </div>
            <div className="col-span-1">
              <ReviewsGivenTable />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
