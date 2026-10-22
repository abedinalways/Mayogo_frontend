"use client";

import React from "react";
import { useRouter } from "next/navigation";
import JobDetatilsPage from "@/components/Pages/Job/JobDetatilsPage";
import BackButton from "@/components/shared/BackButton";

export default function JobDetailsRoute() {
  const router = useRouter();

  return (
    <div className="space-y-5">
      <BackButton
        onClick={() => router.push("/dashboard/jobs")}
        label="Back to Jobs"
      />
      <JobDetatilsPage />
    </div>
  );
}
