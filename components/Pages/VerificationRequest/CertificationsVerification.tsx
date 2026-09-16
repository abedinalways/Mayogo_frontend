"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn, X } from "lucide-react";

export interface CertificationDoc {
  id: string;
  title: string;
  fileName: string;
  previewUrl: string;
}

export interface CertificationsVerificationProps {
  academicDocs?: CertificationDoc[];
  otherDocs?: CertificationDoc[];
  onPreview?: (doc: CertificationDoc) => void;
}

const DEFAULT_ACADEMIC_DOCS: CertificationDoc[] = [
  {
    id: "academic-1",
    title: "Academic Certificate",
    fileName: "Academic-certificate.pdf",
    previewUrl: "https://placehold.co/208x142",
  },
];

const DEFAULT_OTHER_DOCS: CertificationDoc[] = [
  {
    id: "trade-1",
    title: "Trade License",
    fileName: "Trade-license.pdf",
    previewUrl: "https://placehold.co/142x175",
  },
];

export default function CertificationsVerification({
  academicDocs = DEFAULT_ACADEMIC_DOCS,
  otherDocs = DEFAULT_OTHER_DOCS,
  onPreview,
}: CertificationsVerificationProps) {
  const [activePreviewDoc, setActivePreviewDoc] = useState<CertificationDoc | null>(null);

  const handleZoomClick = (doc: CertificationDoc) => {
    setActivePreviewDoc(doc);
    onPreview?.(doc);
  };

  const renderDocCard = (doc: CertificationDoc) => (
    <div
      key={doc.id}
      className="group relative flex h-[220px] w-60 flex-col items-center justify-between gap-4 rounded-xl bg-slate-50 p-3 outline outline-1 outline-offset-[-1px] outline-slate-100"
    >
      {/* Zoom Trigger Button */}
      <button
        type="button"
        onClick={() => handleZoomClick(doc)}
        className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-500 transition-transform hover:scale-105 active:scale-95 focus:outline-none"
        aria-label={`Preview ${doc.fileName}`}
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </button>

      {/* Image Preview Area */}
      <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-sm bg-white">
        <Image
          src={doc.previewUrl}
          alt={doc.fileName}
          fill
          className="object-contain p-1"
          unoptimized
        />
      </div>

      {/* File Label */}
      <span className="text-center text-sm font-medium leading-5 text-[#103D5C]">
        {doc.fileName}
      </span>
    </div>
  );

  return (
    <>
      <div className="flex flex-col gap-5 font-['Manrope']">
        {/* Academic Certificates Section */}
        <div className="flex flex-col gap-5 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
          <h3 className="text-lg font-medium leading-6 text-[#103D5C]">
            Academic Certificate
          </h3>
          <div className="flex flex-wrap items-start gap-5">
            {academicDocs.map(renderDocCard)}
          </div>
        </div>

        {/* Others Section */}
        <div className="flex flex-col gap-5 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
          <h3 className="text-lg font-medium leading-6 text-[#103D5C]">
            Others
          </h3>
          <div className="flex flex-wrap items-start gap-5">
            {otherDocs.map(renderDocCard)}
          </div>
        </div>
      </div>

      {/* Image Preview Lightbox Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] max-w-xl flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-xl font-['Manrope']">
            <button
              type="button"
              onClick={() => setActivePreviewDoc(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
            <h4 className="text-lg font-semibold text-[#103D5C]">
              {activePreviewDoc.fileName}
            </h4>
            <div className="relative h-[380px] w-full overflow-hidden rounded-lg">
              <Image
                src={activePreviewDoc.previewUrl}
                alt={activePreviewDoc.fileName}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}