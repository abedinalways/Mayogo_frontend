"use client";

import React, { useState } from "react";
import { Download, CheckCircle, FileText, Image as ImageIcon } from "lucide-react";

export interface EvidenceFile {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "image";
  isDownloaded?: boolean;
}

export interface ClaimCardProps {
  type: "client" | "provider";
  date: string;
  time: string;
  title: string;
  description: string;
  files?: EvidenceFile[];
  beforePhotos?: string[];
  afterPhotos?: string[];
  onDownloadAll?: () => void;
  onDownloadFile?: (fileId: string) => void;
}

export function ClaimCard({
  type,
  date,
  time,
  title,
  description,
  files = [],
  beforePhotos = [],
  afterPhotos = [],
  onDownloadAll,
  onDownloadFile,
}: ClaimCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isClient = type === "client";
  const maxCharLength = 220;

  const shouldTruncate = description.length > maxCharLength;
  const displayedText =
    shouldTruncate && !isExpanded
      ? `${description.slice(0, maxCharLength)}...`
      : description;

  return (
    <div className="flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between gap-6 font-['Manrope']">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        {/* Type Badge */}
        <span
          className={`px-3 py-1 rounded-sm text-sm font-medium border ${
            isClient
              ? "bg-rose-50 text-rose-500 border-rose-100"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}
        >
          {isClient ? "Client Claim" : "Provider Response"}
        </span>

        {/* Timestamp Badges */}
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-sky-50 text-sky-600 border border-sky-100 rounded-sm text-xs font-medium">
            {date}
          </span>
          <span className="px-2 py-0.5 bg-sky-50 text-sky-600 border border-sky-100 rounded-sm text-xs font-medium">
            {time}
          </span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col justify-between gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[#0a3558] leading-5">
            {title}
          </h2>
          <p className="text-base text-slate-600 leading-6">
            {displayedText}{" "}
            {shouldTruncate && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#0a3558] font-semibold hover:underline cursor-pointer ml-1 inline"
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            )}
          </p>
        </div>

        {/* Evidence Section */}
        <div className="p-4 rounded-2xl border border-slate-200 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-base font-normal text-slate-600">
              Evidence
            </span>
            <button
              type="button"
              onClick={onDownloadAll}
              className="text-base font-semibold text-[#0a3558] underline hover:text-[#07253e] cursor-pointer"
            >
              Download all
            </button>
          </div>

          {/* Downloadable Files List */}
          {files.length > 0 && (
            <div className="flex flex-col gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="pl-3 pr-4 py-3 bg-slate-50 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`h-10 w-10 rounded-md flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                        file.type === "pdf" ? "bg-red-500" : "bg-amber-500"
                      }`}
                    >
                      {file.type.toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-base font-medium text-slate-800 truncate leading-5">
                        {file.name}
                      </span>
                      <span className="text-sm font-normal text-slate-500 leading-6">
                        File size : {file.size}
                      </span>
                    </div>
                  </div>

                  {file.isDownloaded ? (
                    <div className="h-10 px-3 py-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2 text-emerald-600 text-sm font-medium shrink-0">
                      <CheckCircle className="h-4 w-4" />
                      <span>Downloaded</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onDownloadFile?.(file.id)}
                      className="h-10 w-10 bg-white rounded-lg border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
                    >
                      <Download className="h-5 w-5 text-amber-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Photos Grid (Before & After) */}
          {(beforePhotos.length > 0 || afterPhotos.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {beforePhotos.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-medium text-slate-800">
                    Before Photos
                  </span>
                  <div className="flex items-center gap-3">
                    {beforePhotos.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Before ${idx + 1}`}
                        className="h-28 flex-1 rounded-lg border border-slate-200 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}

              {afterPhotos.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-medium text-slate-800">
                    After Photos
                  </span>
                  <div className="flex items-center gap-3">
                    {afterPhotos.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`After ${idx + 1}`}
                        className="h-28 flex-1 rounded-lg border border-slate-200 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DisputeClaimsComparison() {
  const clientFiles: EvidenceFile[] = [
    {
      id: "1",
      name: "Project Brief.pdf",
      size: "10,21 MB",
      type: "pdf",
      isDownloaded: true,
    },
    {
      id: "2",
      name: "Ac Unit.jpg",
      size: "9,11 MB",
      type: "image",
      isDownloaded: false,
    },
  ];

  const providerFiles: EvidenceFile[] = [
    {
      id: "3",
      name: "Project Brief.pdf",
      size: "10,21 MB",
      type: "pdf",
      isDownloaded: true,
    },
  ];

  const beforePhotos = [
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80",
  ];

  const afterPhotos = [
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&auto=format&fit=crop&q=80",
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch gap-5">
      <ClaimCard
        type="client"
        date="Jul 27, 2026"
        time="11:00 AM"
        title="Service quality was not as expected"
        description="I hired the expert to repair my AC unit because it was not cooling properly. The expert visited the location and marked the job as completed, but the cooling issue was not resolved. Within two days, the AC started showing the same problem again. I contacted the expert several times for a follow-up inspection, but I did not receive any clear response. Since the issue remains unresolved, I am requesting a review of the completed work and a partial refund."
        files={clientFiles}
      />

      <ClaimCard
        type="provider"
        date="Jul 28, 2026"
        time="02:00 PM"
        title="Service quality was not as expected"
        description="I inspected the AC unit and identified a faulty capacitor, which was replaced during the service visit. After completing the repair, the AC was tested and was cooling normally before I left the location. The issue reported later appears to be related to a separate internal compressor standard decay."
        files={providerFiles}
        beforePhotos={beforePhotos}
        afterPhotos={afterPhotos}
      />
    </div>
  );
}