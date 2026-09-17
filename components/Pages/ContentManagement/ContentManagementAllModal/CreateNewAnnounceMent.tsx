"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

export interface AnounceMentFormData {
  id?: string;
  title: string;
  description: string;
  audience?: string;
  status: string;
}

export interface AnnounceMentModalProps {
  initialData?: AnounceMentFormData | null;
  onCancel: () => void;
  onSubmit: (data: AnounceMentFormData) => void;
}

export default function CreateNewAnnounceMent({
  initialData,
  onCancel,
  onSubmit,
}: AnnounceMentModalProps) {
  const isEdit = Boolean(initialData?.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("Clients");
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setAudience(initialData.audience || "Clients");
      setIsLive(initialData.status === "Live");
    } else {
      setTitle("");
      setDescription("");
      setAudience("Clients");
      setIsLive(true);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id,
      title,
      description,
      audience,
      status: isLive ? "Live" : "Draft",
    });
  };

  return (
    <div className="font-['Manrope'] text-[#103D5C]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#F0F4F8]">
        <h3 className="text-[#103D5C] text-[18px] font-semibold leading-6">
          {isEdit ? "Edit Announcement" : "Create New Announcement"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4.5 pt-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#103D5C]">Title</label>
          <input
            type="text"
            placeholder="Write announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full h-11 px-4 bg-white rounded-xl border border-[#E4EBF1] text-sm text-[#103D5C] placeholder:text-[#9AAAB5] outline-none transition-all focus:border-[#103D5C]"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#103D5C]">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Write the details message here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-4 bg-white rounded-xl border border-[#E4EBF1] text-sm text-[#103D5C] placeholder:text-[#9AAAB5] outline-none transition-all focus:border-[#103D5C] resize-none min-h-[95px]"
          />
        </div>

        {/* Choose Audience */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#103D5C]">
            Choose Audience
          </label>
          <div className="relative">
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full h-11 px-4 pr-10 appearance-none bg-white rounded-xl border border-[#E4EBF1] text-sm text-[#103D5C] outline-none cursor-pointer transition-all focus:border-[#103D5C]"
            >
              <option value="All">All Users</option>
              <option value="Clients">Clients</option>
              <option value="Experts">Experts</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
          </div>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-semibold text-[#103D5C]">Status</span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              role="switch"
              aria-checked={isLive}
              onClick={() => setIsLive((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                isLive ? "bg-[#F5B517]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isLive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-[#103D5C] min-w-10">
              {isLive ? "Live" : "Draft"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl border border-[#103D5C] text-[#103D5C] hover:bg-slate-50 font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-11 rounded-xl bg-[#103D5C] hover:bg-[#0c2e46] text-white font-semibold text-sm transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
