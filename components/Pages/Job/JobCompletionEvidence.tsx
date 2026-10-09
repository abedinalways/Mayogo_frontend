import React from "react";

export interface MediaFile {
  id: string | number;
  url: string;
  filename: string;
}

export interface JobCompletionEvidenceProps {
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
  title = "Job Completion Evidence",
  submitterName = "Daniel Green",
  submitterAvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  submittedDate = "Jul 27, 2026",
  beforeFiles = defaultBeforeFiles,
  afterFiles = defaultAfterFiles,
  projectUrl = "https://www.homefixpro.com/projects/ac-repair-job-1024",
  completionNote = "“Replaced the damaged part and tested the system.”",
}: JobCompletionEvidenceProps) {
  return (
    <div className="w-full  overflow-hidden rounded-2xl bg-white border border-[#e4ebf1] shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] font-['Manrope']">
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
              src={submitterAvatarUrl}
              alt={submitterName}
              className="h-10 w-10 rounded-full border border-[#f59e0b] object-cover"
            />
            <div className="flex flex-col justify-center">
              <span className="text-xs font-normal text-[#6c8294]">
                Submitted By
              </span>
              <span className="text-base font-semibold text-[#0f3453]">
                {submitterName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm font-medium text-[#6c8294]">
            <span>Submitted On:</span>
            <span>{submittedDate}</span>
          </div>
        </div>

        {/* Before Photos Section */}
        {beforeFiles.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-[#0f3453]">
              Before Photos/Files
            </h3>
            <div className="flex flex-wrap gap-4">
              {beforeFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex w-36 flex-col items-center gap-1.5 rounded-lg bg-[#f4f7f9] p-2"
                >
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="h-32 w-full rounded-md object-cover"
                  />
                  <span className="text-center text-xs font-normal text-[#0f3453]">
                    {file.filename}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* After Photos Section */}
        {afterFiles.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-[#0f3453]">
              After Photos/Files
            </h3>
            <div className="flex flex-wrap gap-4">
              {afterFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex w-36 flex-col items-center gap-1.5 rounded-lg bg-[#f4f7f9] p-2"
                >
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="h-32 w-full rounded-md object-cover"
                  />
                  <span className="text-center text-xs font-normal text-[#0f3453]">
                    {file.filename}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Link Row */}
        {projectUrl && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-medium text-[#0f3453]">
              Project Link:
            </span>
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-normal text-[#2563eb] underline transition-colors hover:text-blue-700"
            >
              {projectUrl}
            </a>
          </div>
        )}

        {/* Completion Note Section */}
        {completionNote && (
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-[#0f3453]">
              Completion Note
            </h3>
            <div className="rounded-xl bg-[#f4f7f9] p-4 text-sm font-normal leading-relaxed text-[#6c8294]">
              {completionNote}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobCompletionEvidence;