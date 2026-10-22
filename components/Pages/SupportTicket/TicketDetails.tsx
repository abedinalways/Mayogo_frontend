"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Paperclip, Send, FileText, Loader2 } from "lucide-react";
import { SupportTicketAttachment, SupportTicketComment } from "@/types/support.types";

export interface TicketDetailsProps {
  title?: string;
  categoryTag?: string;
  priorityTag?: string;
  description?: string;
  attachments?: SupportTicketAttachment[];
  comments?: SupportTicketComment[];
  onSendReply?: (replyText: string) => Promise<void> | void;
  isSending?: boolean;
}

export function TicketDetails({
  title = "Service query",
  categoryTag = "General Issue",
  priorityTag = "Medium",
  description = "No description provided.",
  attachments = [],
  comments = [],
  onSendReply,
  isSending = false,
}: TicketDetailsProps) {
  const [replyText, setReplyText] = useState("");

  const handleSend = async () => {
    if (!replyText.trim() || isSending) return;
    if (onSendReply) {
      await onSendReply(replyText.trim());
    }
    setReplyText("");
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] outline outline-1 outline-offset-[-1px] outline-slate-200 font-['Manrope']">
      <div className="flex flex-col gap-1.5 border-b border-slate-200 p-4">
        <h2 className="font-['Manrope'] text-lg font-semibold leading-6 text-[#0a3558]">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-['Manrope'] text-xs font-medium leading-4 text-[#103D5C] outline outline-1 outline-offset-[-1px] outline-slate-200">
            {categoryTag}
          </span>
          <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 font-['Manrope'] text-xs font-medium leading-4 text-rose-500">
            {priorityTag}
          </span>
        </div>
      </div>

      <div className="flex flex-col p-4">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
            <div className="flex flex-col gap-5 rounded-2xl bg-emerald-950/[0.03] p-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-['Manrope'] text-base font-semibold leading-5 text-[#0a3558]">
                  Description
                </h3>
                <p className="font-['Manrope'] text-sm font-normal leading-6 text-slate-600">
                  {description}
                </p>
              </div>

              {attachments.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className="font-['Manrope'] text-base font-semibold leading-5 text-[#0a3558]">
                    Attachment ({attachments.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 outline outline-1 outline-offset-[-1px] outline-slate-200"
                      >
                        {item.type === "image" ? (
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded">
                            <Image
                              src={item.url || "https://placehold.co/36x36"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-rose-100 text-rose-600">
                            <FileText className="h-5 w-5" />
                          </div>
                        )}
                        <div className="flex flex-col justify-center">
                          <span className="line-clamp-1 font-['Manrope'] text-base font-medium leading-5 text-slate-900">
                            {item.name}
                          </span>
                          {item.size && (
                            <span className="font-['Manrope'] text-sm font-normal leading-6 text-slate-500">
                              File size : {item.size}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {comments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-4 rounded-2xl pt-2">
                <div className="flex items-center gap-4">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full outline outline-1 outline-offset-[-1px] outline-amber-400">
                    <img
                      src={
                        comment.authorAvatar ||
                        `https://placehold.co/40x40?text=${encodeURIComponent(
                          comment.authorName.charAt(0)
                        )}`
                      }
                      alt={comment.authorName}
                      className="object-cover h-10 w-10 rounded-full"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-['Manrope'] text-xs font-semibold leading-4 text-slate-900">
                        {comment.authorName}
                      </span>
                      {comment.isInternal && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-1.5 py-0.2 rounded">
                          Internal Note
                        </span>
                      )}
                    </div>
                    <span className="font-['Manrope'] text-xs font-normal leading-4 text-slate-400">
                      {comment.timestamp}
                    </span>
                  </div>
                </div>
                <div className="font-['Manrope'] text-sm font-normal leading-6 text-slate-600">
                  {comment.content}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-lg bg-white p-4 outline outline-1 outline-offset-[-1px] outline-slate-200">
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply to the user…"
              className="w-full resize-none font-['Manrope'] text-sm font-normal leading-6 text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Attach File"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending || !replyText.trim()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0a3558] px-5 py-2.5 font-['Manrope'] text-sm font-medium leading-4 text-white transition-colors hover:bg-[#072742] cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reply</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;