"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn, X } from "lucide-react";

export interface ComparisonImage {
  id: "id-photo" | "selfie";
  title: string;
  url: string;
}

export interface FaceVerificationProps {
  idPhotoUrl?: string;
  selfieUrl?: string;
  onPreview?: (image: ComparisonImage) => void;
}

export default function FaceVerification({
  idPhotoUrl = "https://placehold.co/208x171",
  selfieUrl = "https://placehold.co/208x175",
  onPreview,
}: FaceVerificationProps) {
  const [activePreview, setActivePreview] = useState<ComparisonImage | null>(null);

  const images: ComparisonImage[] = [
    { id: "id-photo", title: "ID Photo", url: idPhotoUrl },
    { id: "selfie", title: "Selfie", url: selfieUrl },
  ];

  const handleZoomClick = (img: ComparisonImage) => {
    setActivePreview(img);
    onPreview?.(img);
  };

  return (
    <>
      <div className="flex flex-col gap-5 rounded-2xl bg-white p-4 outline outline-1 outline-offset-[-1px] outline-slate-200 font-['Manrope']">
        <h3 className="text-lg font-medium leading-6 text-[#103D5C]">
          Face Verification Comparison
        </h3>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative flex h-[240px] w-full flex-col items-center justify-end gap-4 rounded-xl bg-slate-50 p-3 outline outline-1 outline-offset-[-1px] outline-slate-100 sm:w-60"
            >
              {/* Zoom Trigger Button */}
              <button
                type="button"
                onClick={() => handleZoomClick(img)}
                className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-500 border border-amber-200 transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                aria-label={`Preview ${img.title}`}
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>

              {/* Image Box */}
              <div className="relative h-[172px] w-[208px] overflow-hidden rounded-sm bg-white">
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Caption */}
              <span className="text-center text-sm font-medium leading-5 text-[#103D5C]">
                {img.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Lightbox Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] max-w-xl flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-xl font-['Manrope']">
            <button
              type="button"
              onClick={() => setActivePreview(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
            <h4 className="text-lg font-semibold text-[#103D5C]">
              {activePreview.title}
            </h4>
            <div className="relative h-[360px] w-[420px] max-w-full overflow-hidden rounded-lg">
              <Image
                src={activePreview.url}
                alt={activePreview.title}
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