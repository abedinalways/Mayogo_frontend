import React from "react";
import { AdminJobItem } from "@/types/job.types";

export interface MediaFile {
  id: string | number;
  url: string;
  filename: string;
}

export interface JobCompletionEvidenceProps {
  job?: AdminJobItem | null;
  title?: string;
  submitterName?: string;
  submitterAvatarUrl?: string;
  submittedDate?: string;
  beforeFiles?: MediaFile[];
  afterFiles?: MediaFile[];
  projectUrl?: string;
  completionNote?: string;
}

const defaultBeforeFiles: MediaFile[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80",
    filename: "Image1.jpg",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80",
    filename: "Image2.jpg",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80",
    filename: "Image3.jpg",
  },
];

const defaultAfterFiles: MediaFile[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80",
    filename: "Image1.jpg",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80",
    filename: "Image1.jpg",
  },
];

export function JobCompletionEvidence({
  job,
  title = "Job Completion Evidence",
  submitterName,
  submitterAvatarUrl,
  submittedDate,
  beforeFiles,
  afterFiles,
  projectUrl,
  completionNote,
}: JobCompletionEvidenceProps) {
  const expertName =
    submitterName ||
    job?.expert?.fullName ||
    job?.expert?.name ||
    "Daniel Green";

  const expertAvatar =
    submitterAvatarUrl ||
    job?.expert?.avatarUrl ||
    job?.expert?.avatar ||
    `https://placehold.co/150x150?text=${encodeURIComponent(expertName.charAt(0))}`;

  let displayDate = submittedDate || "Jul 27, 2026";
  if (job?.submittedAt || job?.createdAt) {
    try {
      const dt = new Date(job.submittedAt || job.createdAt);
      displayDate = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(dt);
    } catch {
      displayDate = String(job.submittedAt || job.createdAt);
    }
  }

  // Parse completion files if present on job
  let parsedBeforeFiles = beforeFiles || defaultBeforeFiles;
  let parsedAfterFiles = afterFiles || defaultAfterFiles;
  let parsedProjectUrl = projectUrl || "https://www.homefixpro.com/projects/ac-repair-job-1024";
  let parsedCompletionNote =
    completionNote || "“Replaced the damaged part and tested the system.”";

  if (job?.completion) {
    const comp = job.completion as any;
    if (comp.projectUrl) parsedProjectUrl = comp.projectUrl;
    if (comp.notes || comp.completionNote)
      parsedCompletionNote = comp.notes || comp.completionNote;

    if (Array.isArray(comp.media)) {
      const befores = comp.media
        .filter((m: any) => m.role === "BEFORE")
        .map((m: any, idx: number) => ({
          id: m.id || idx,
          url: m.fileUrl || m.url,
          filename: m.fileName || `Before_${idx + 1}.jpg`,
        }));
      const afters = comp.media
        .filter((m: any) => m.role === "AFTER")
        .map((m: any, idx: number) => ({
          id: m.id || idx,
          url: m.fileUrl || m.url,
          filename: m.fileName || `After_${idx + 1}.jpg`,
        }));
      if (befores.length > 0) parsedBeforeFiles = befores;
      if (afters.length > 0) parsedAfterFiles = afters;
    }
  } else if (job?.images && job.images.length > 0) {
    parsedBeforeFiles = job.images.map((img, idx) => ({
      id: img.id || idx,
      url: img.fileUrl,
      filename: `Image_${idx + 1}.jpg`,
    }));
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white border border-[#e4ebf1] shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] font-['Manrope']">
      {/* Header Section */}
      <div className="border-b border-[#e4ebf1] px-5 py-4">
        <h2 className="text-lg font-semibold text-[#0f3453]">{title}</h2>
      </div>

      {/* Body Content */}
      <div className="flex flex-col gap-6 p-5">
        {/* User Info & Date Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={expertAvatar}
              alt={expertName}
              className="h-10 w-10 rounded-full border border-[#f59e0b] object-cover"
            />
            <div className="flex flex-col justify-center">
              <span className="text-xs font-normal text-[#6c8294]">
                Submitted By
              </span>
              <span className="text-base font-semibold text-[#0f3453]">
                {expertName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm font-medium text-[#6c8294]">
            <span>Submitted On:</span>
            <span>{displayDate}</span>
          </div>
        </div>

        {/* Before Photos Section */}
        {parsedBeforeFiles.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-[#0f3453]">
              Before Photos/Files
            </h3>
            <div className="flex flex-wrap gap-4">
              {parsedBeforeFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex w-36 flex-col items-center gap-1.5 rounded-lg bg-[#f4f7f9] p-2"
                >
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="h-32 w-full rounded-md object-cover"
                  />
                  <span className="text-center text-xs font-normal text-[#0f3453] truncate w-full">
                    {file.filename}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* After Photos Section */}
        {parsedAfterFiles.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-[#0f3453]">
              After Photos/Files
            </h3>
            <div className="flex flex-wrap gap-4">
              {parsedAfterFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex w-36 flex-col items-center gap-1.5 rounded-lg bg-[#f4f7f9] p-2"
                >
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="h-32 w-full rounded-md object-cover"
                  />
                  <span className="text-center text-xs font-normal text-[#0f3453] truncate w-full">
                    {file.filename}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Link Row */}
        {parsedProjectUrl && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-medium text-[#0f3453]">
              Project Link:
            </span>
            <a
              href={parsedProjectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-normal text-[#2563eb] underline transition-colors hover:text-blue-700"
            >
              {parsedProjectUrl}
            </a>
          </div>
        )}

        {/* Completion Note Section */}
        {parsedCompletionNote && (
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-[#0f3453]">
              Completion Note
            </h3>
            <div className="rounded-xl bg-[#f4f7f9] p-4 text-sm font-normal leading-relaxed text-[#6c8294]">
              {parsedCompletionNote}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobCompletionEvidence;