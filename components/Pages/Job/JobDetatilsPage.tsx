"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { JobHeader } from "./JobHeader";
import RightSide from "./RightSide";
import JobCompletionEvidence from "./JobCompletionEvidence";
import JobDetails from "./JobDetails";
import { useGetJobByIdQuery } from "@/lib/redux/api/jobApi";

export default function JobDetatilsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? String(params.id) : "";

  const { data, isLoading, error } = useGetJobByIdQuery(id, {
    skip: !id,
  });

  const job = data?.data;

  if (isLoading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <Loader2 className="h-8 w-8 text-[#103D5C] animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" />
        <h3 className="text-base font-semibold text-slate-900">Job Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested job record could not be found or an error occurred.
        </p>
        <button
          type="button"
          onClick={() => router.push("/dashboard/jobs")}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-[#103D5C] text-white hover:bg-[#0b2b41] transition-colors"
        >
          Return to Jobs List
        </button>
      </div>
    );
  }

  return (
    <div className="card-container grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
      <div className="flex flex-col gap-5">
        <JobHeader job={job} />
        <JobDetails job={job} />
        <JobCompletionEvidence job={job} />
      </div>

      <RightSide job={job} />
    </div>
  );
}