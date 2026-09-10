import Link from "next/link";
import { FileQuestion } from "lucide-react";

interface NotFoundViewProps {
  fullPage?: boolean;
}

export function NotFoundView({ fullPage = false }: NotFoundViewProps) {
  return (
    <div
      className={`flex items-center justify-center p-6 ${
        fullPage ? "min-h-screen bg-[#f6f9fc]" : "min-h-[60vh]"
      }`}
    >
      <div className="w-full max-w-md rounded-2xl border border-[#e4ebf1] bg-white px-8 py-10 text-center shadow-[0_1px_2px_rgba(18,62,94,0.04)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4ff] text-[#123e5e]">
          <FileQuestion className="h-6 w-6" strokeWidth={1.7} />
        </div>
        <p className="text-sm font-medium tracking-wide text-[#6c8294]">404</p>
        <h1 className="mt-1 text-xl font-semibold text-[#123e5e]">
          Page not found
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#6c8294]">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#123e5e] px-4 text-sm font-medium text-white hover:bg-[#0f334d]"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
