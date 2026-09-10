"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface ErrorViewProps {
  error: Error & { digest?: string };
  retry: () => void;
  fullPage?: boolean;
}

export function ErrorView({ error, retry, fullPage = false }: ErrorViewProps) {
  return (
    <div
      className={`flex items-center justify-center p-6 ${
        fullPage ? "min-h-screen bg-[#f6f9fc]" : "min-h-[60vh]"
      }`}
    >
      <div className="w-full max-w-md rounded-2xl border border-[#e4ebf1] bg-white px-8 py-10 text-center shadow-[0_1px_2px_rgba(18,62,94,0.04)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff4e8] text-[#c2410c]">
          <AlertTriangle className="h-6 w-6" strokeWidth={1.7} />
        </div>
        <p className="text-sm font-medium tracking-wide text-[#6c8294]">500</p>
        <h1 className="mt-1 text-xl font-semibold text-[#123e5e]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#6c8294]">
          An unexpected error occurred. You can try again or return to the
          dashboard.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-[11px] text-[#9aaab5]">
            Ref: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#123e5e] px-4 text-sm font-medium text-white hover:bg-[#0f334d]"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#e4ebf1] px-4 text-sm font-medium text-[#123e5e] hover:bg-[#f6f9fc]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
