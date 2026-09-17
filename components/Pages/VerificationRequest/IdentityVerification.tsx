"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn, X } from "lucide-react";

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  previewUrls: string[];
}

export interface IdentityVerificationProps {
  documents?: DocumentItem[];
  onPreview?: (doc: DocumentItem) => void;
}

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: "nid",
    title: "NID Document",
    fileName: "NID_image.jpg",
    previewUrls: ["https://placehold.co/142x84", "https://placehold.co/142x90"],
  },
  {
    id: "passport",
    title: "Passport Document",
    fileName: "Passport_image.jpg",
    previewUrls: ["https://placehold.co/142x175"],
  },
  {
    id: "driving-license",
    title: "Driving License Document",
    fileName: "Driving License_image.jpg",
    previewUrls: ["https://placehold.co/142x175"],
  },
];

export default function IdentityVerification({
  documents = DEFAULT_DOCUMENTS,
  onPreview,
}: IdentityVerificationProps) {
  const [activePreviewDoc, setActivePreviewDoc] = useState<DocumentItem | null>(null);

  const handleZoomClick = (doc: DocumentItem) => {
    setActivePreviewDoc(doc);
    onPreview?.(doc);
  };

  return (
    <>
      <div className="flex flex-col gap-5 rounded-2xl p-4 outline outline-1 outline-offset-[-1px] outline-slate-200 font-['Manrope'] bg-white">
        <h3 className="text-lg font-medium leading-6 text-[#103D5C]">
          Attached Government Documents
        </h3>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group relative flex flex-1 flex-col items-center justify-between gap-4 rounded-xl bg-slate-50 p-3 outline outline-1 outline-offset-[-1px] outline-slate-100 min-h-[236px]"
            >
              {/* Zoom Trigger Button */}
              <button
                type="button"
                onClick={() => handleZoomClick(doc)}
                className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-500 border border-amber-200 transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                aria-label={`Preview ${doc.fileName}`}
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>

              {/* Document Image Container */}
              <div className="flex h-44 w-full flex-col items-center justify-center gap-[1.54px] overflow-hidden rounded-sm">
                {doc.previewUrls.map((url, idx) => {
                  const isMulti = doc.previewUrls.length > 1;
                  return (
                    <div
                      key={idx}
                      className="relative w-[142px] overflow-hidden rounded-sm bg-white"
                      style={{
                        height: isMulti ? (idx === 0 ? "80px" : "90px") : "175px",
                      }}
                    >
                      <Image
                        src={url}
                        alt={`${doc.fileName} preview ${idx + 1}`}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  );
                })}
              </div>

              {/* Document Title */}
              <span className="text-center text-sm font-medium leading-5 text-[#103D5C]">
                {doc.fileName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Image Preview Lightbox Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] max-w-2xl flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-xl font-['Manrope']">
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
            <div className="flex flex-col items-center gap-2 overflow-y-auto max-h-[70vh]">
              {activePreviewDoc.previewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Full size ${index + 1}`}
                  className="max-w-full rounded-lg object-contain"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}