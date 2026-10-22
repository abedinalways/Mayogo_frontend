"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { ExpertProfileHeader } from "./ExpertProfileHeader";
import { TransactionHistoryTable } from "../Clients/TransactionHistoryTable";
import { ReviewsGivenTable } from "../Clients/ReviewsGivenTable";
import ClientStatsCard from "../Clients/ClientStatsCard";
import { JobStatusTable } from "../Clients/JobStatusTable";
import BackButton from "../../shared/BackButton";
import {
  useGetExpertByIdQuery,
  useUpdateExpertStatusMutation,
} from "@/lib/redux/api/expertApi";
import { ExpertStatusAction } from "@/types/expert.types";

export function ExpertDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? String(params.id) : "";

  const { data, isLoading, error } = useGetExpertByIdQuery(id, {
    skip: !id,
  });

  const [updateExpertStatus, { isLoading: isUpdating }] =
    useUpdateExpertStatusMutation();

  const expert = data?.data;

  const handleUpdateStatus = async (
    action: ExpertStatusAction,
    reason?: string
  ) => {
    if (!id) return;
    try {
      await updateExpertStatus({ id, action, reason }).unwrap();
    } catch {
      // Error is tracked in RTK Query state
    }
  };

  const clientAdapter = expert
    ? {
        id: expert.id,
        fullName: expert.fullName,
        email: expert.email,
        phone: expert.phone,
        avatar: expert.avatar,
        isActive: expert.status?.toLowerCase() === "active",
        jobRequested: expert.totalJobs ?? expert.jobs ?? 0,
        totalSpent: expert.earnings ?? 0,
        availableBalance: expert.availableBalance ?? 0,
        totalPending: expert.totalPending ?? 0,
        jobsCancelled: expert.jobsCancelled ?? 0,
        disputesRaised: expert.disputesRaised ?? 0,
        createdAt: expert.createdAt,
      }
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <BackButton
          onClick={() => router.push("/dashboard/experts")}
          label="Back to Experts"
        />
      </div>

      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Loader2 className="h-8 w-8 text-[#103D5C] animate-spin" />
          <p className="text-sm text-slate-500 font-medium">
            Loading expert profile...
          </p>
        </div>
      ) : error || !expert ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" />
          <h3 className="text-base font-semibold text-slate-900">
            Expert Not Found
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            The requested expert profile could not be found or an error occurred.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard/experts")}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-[#103D5C] text-white hover:bg-[#0b2b41] transition-colors"
          >
            Return to Experts List
          </button>
        </div>
      ) : (
        <>
          <ExpertProfileHeader
            expert={expert}
            onUpdateStatus={handleUpdateStatus}
            isUpdatingStatus={isUpdating}
          />

          <ClientStatsCard client={clientAdapter} />
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

export default ExpertDetailsPage;
