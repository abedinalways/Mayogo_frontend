"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  Link as LinkIcon,
} from "lucide-react";
import CustomButton from "@/components/shared/CustomButton";

export interface StaticContentFormData {
  id?: string;
  title: string;
  subtitle?: string;
  content: string;
  status: string;
  lastUpdated?: string;
}

export interface EditStaticContentProps {
  initialData?: StaticContentFormData | null;
  onCancel: () => void;
  onSubmit: (data: StaticContentFormData) => void;
}

const defaultContent = `
<h4 style="font-weight: 600; color: #103D5C; margin-bottom: 4px;">1. Acceptance of Terms</h4>
<p style="color: #4A5568; font-size: 13px; line-height: 1.6; margin-bottom: 16px;">
By accessing or using Nepotech ("Platform"), you agree to be bound by these Terms & Conditions ("Terms"). If you do not agree, you may not use the Platform.
</p>

<h4 style="font-weight: 600; color: #103D5C; margin-bottom: 4px;">2. Platform Role</h4>
<p style="color: #4A5568; font-size: 13px; line-height: 1.6; margin-bottom: 16px;">
Nepotech is a technology marketplace that connect customers with independent service providers ("Providers"). Nepotech does not provide services directly and is not an employer, agent, or representative of any Provider.
</p>

<h4 style="font-weight: 600; color: #103D5C; margin-bottom: 4px;">3. Independent Contractors</h4>
<p style="color: #4A5568; font-size: 13px; line-height: 1.6; margin-bottom: 16px;">
Providers operate as independent contractors. Nepotech does not control how services are performed and does not guarantee outcomes, workmanship, or results.
</p>

<h4 style="font-weight: 600; color: #103D5C; margin-bottom: 4px;">4. Eligibility</h4>
<p style="color: #4A5568; font-size: 13px; line-height: 1.6;">
You must be at least 18 years old and legally capable of entering into binding contracts under applicable law to use our Platform.
</p>
`;

export default function EditStaticContent({
  initialData,
  onCancel,
  onSubmit,
}: EditStaticContentProps) {
  const [title, setTitle] = useState(
    initialData?.title || "Nepotech Terms & Conditions",
  );
  const [content, setContent] = useState(
    initialData?.content || defaultContent,
  );
  const [isLive, setIsLive] = useState(
    initialData ? initialData.status === "Live" : true,
  );

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "Nepotech Terms & Conditions");
      if (initialData.content) {
        setContent(initialData.content);
        if (editorRef.current) {
          editorRef.current.innerHTML = initialData.content;
        }
      }
      setIsLive(initialData.status === "Live");
    } else {
      if (editorRef.current && !editorRef.current.innerHTML) {
        editorRef.current.innerHTML = defaultContent;
      }
    }
  }, [initialData]);

  // Execute rich formatting commands
  const executeCommand = (
    command: string,
    value: string | undefined = undefined,
  ) => {
    if (typeof document !== "undefined") {
      document.execCommand(command, false, value);
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    }
  };

  const handleLink = () => {
    const url = prompt("Enter link URL:", "https://");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id,
      title,
      content,
      status: isLive ? "Live" : "Draft",
      lastUpdated: "July 2026",
    });
  };

  return (
    <div className="w-full bg-white font-['Manrope']">
      {/* Modal Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#103D5C]">Edit Content</h2>
          <p className="text-sm font-semibold text-[#103D5C] mt-1">{title}</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSave} className="mt-4 space-y-6">
        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Rich Text Editor with Formatting Toolbar */}
          <div className="flex flex-col">
            <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F1F4F6] border border-slate-200 rounded-lg mb-3">
                {/* Bold */}
                <button
                  type="button"
                  onClick={() => executeCommand("bold")}
                  className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white font-bold text-slate-700 hover:border-[#F5B517] hover:text-[#F5B517] transition-all shadow-xs text-sm"
                  title="Bold"
                >
                  <span className="font-extrabold text-[#F5B517]">B</span>
                </button>

                {/* Italic */}
                <button
                  type="button"
                  onClick={() => executeCommand("italic")}
                  className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white italic text-slate-600 hover:border-[#F5B517] hover:text-[#F5B517] transition-all shadow-xs text-sm"
                  title="Italic"
                >
                  <span className="font-semibold italic text-[#F5B517]">I</span>
                </button>

                {/* Underline */}
                <button
                  type="button"
                  onClick={() => executeCommand("underline")}
                  className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white underline text-slate-600 hover:border-[#F5B517] hover:text-[#F5B517] transition-all shadow-xs text-sm"
                  title="Underline"
                >
                  <span className="font-semibold underline text-[#F5B517]">
                    U
                  </span>
                </button>

                {/* Heading 1 */}
                <button
                  type="button"
                  onClick={() => executeCommand("formatBlock", "<h4>")}
                  className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white font-bold text-slate-600 hover:border-[#F5B517] hover:text-[#F5B517] transition-all shadow-xs text-xs"
                  title="Heading 1"
                >
                  <span className="font-bold text-[#F5B517]">H₁</span>
                </button>

                {/* Heading 2 */}
                <button
                  type="button"
                  onClick={() => executeCommand("formatBlock", "<h5>")}
                  className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white font-bold text-slate-600 hover:border-[#F5B517] hover:text-[#F5B517] transition-all shadow-xs text-xs"
                  title="Heading 2"
                >
                  <span className="font-bold text-[#F5B517]">H₂</span>
                </button>

                {/* Bullet List */}
                <button
                  type="button"
                  onClick={() => executeCommand("insertUnorderedList")}
                  className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:border-[#F5B517] hover:text-[#F5B517] transition-all shadow-xs"
                  title="Bullet List"
                >
                  <ListIcon className="w-4 h-4 text-[#F5B517]" />
                </button>

                {/* Numbered List */}
                <button
                  type="button"
                  onClick={() => executeCommand("insertOrderedList")}
                  className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:border-[#F5B517] hover:text-[#F5B517] transition-all shadow-xs"
                  title="Numbered List"
                >
                  <ListOrderedIcon className="w-4 h-4 text-[#F5B517]" />
                </button>

                {/* Link */}
                <button
                  type="button"
                  onClick={handleLink}
                  className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:border-[#F5B517] hover:text-[#F5B517] transition-all shadow-xs"
                  title="Add Link"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-[#F5B517]" />
                </button>
              </div>

              {/* Editable Area */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: defaultContent }}
                className="w-full min-h-[300px] max-h-[400px] overflow-y-auto p-3 border border-slate-100 rounded-lg text-slate-700 text-sm outline-none focus:border-slate-300 transition-colors leading-relaxed"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              This will be displayed on the Nepotech mobile app.
            </p>
          </div>

          {/* Right Column: Live Preview */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Live Preview
            </h3>
            <div className="bg-[#F4F9FD] border border-slate-100 rounded-2xl p-4 flex-1">
              <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-100 max-h-[420px] overflow-y-auto">
                <h2 className="text-lg font-bold text-[#103D5C]">{title}</h2>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Last Updated, July 2026
                </p>

                {/* Rendered HTML */}
                <div
                  className="text-xs md:text-sm text-slate-600 leading-relaxed space-y-3 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar: Status Switch & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          {/* Status Switch */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#103D5C]">Status</span>
            <button
              type="button"
              role="switch"
              aria-checked={isLive}
              onClick={() => setIsLive((prev) => !prev)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                isLive ? "bg-[#F5B517]" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isLive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-[#103D5C] min-w-10">
              {isLive ? "Live" : "Draft"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <CustomButton
              type="button"
              variant="tertiary"
              size="md"
              className="h-10 rounded-xl border border-[#103D5C] text-[#103D5C] hover:bg-slate-50 font-semibold px-5 text-sm"
              onClick={onCancel}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              size="md"
              className="h-10 rounded-xl bg-[#103D5C] hover:bg-[#0c2e46] text-white font-semibold px-5 text-sm"
            >
              Save Changes
            </CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
}
