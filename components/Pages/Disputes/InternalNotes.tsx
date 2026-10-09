"use client";

import React, { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import CustomButton from "../../shared/CustomButton";

export interface NoteItem {
  id: string;
  content: string;
  author: string;
  createdAt?: string;
}

export interface InternalNotesProps {
  initialNotes?: NoteItem[];
  currentUser?: string;
  maxLength?: number;
  onAddNote?: (content: string) => Promise<void> | void;
  isLoading?: boolean;
}

export function InternalNotes({
  initialNotes = [],
  currentUser = "Admin",
  maxLength = 200,
  onAddNote,
  isLoading = false,
}: InternalNotesProps) {
  const [localNotes, setLocalNotes] = useState<NoteItem[]>([]);
  const [noteText, setNoteText] = useState("");

  const displayNotes = [...localNotes, ...initialNotes];

  const handleAddNote = async () => {
    const text = noteText.trim();
    if (!text) return;

    if (onAddNote) {
      await onAddNote(text);
    }

    const newNote: NoteItem = {
      id: Date.now().toString(),
      content: text,
      author: currentUser,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setLocalNotes((prev) => [newNote, ...prev]);
    setNoteText("");
  };

  return (
    <div className="w-full rounded-xl bg-white p-3 border border-slate-200 shadow-[0px_2px_4px_-1px_rgba(13,13,18,0.06)] flex flex-col justify-start items-start gap-5 font-['Manrope']">
      <h3 className="text-xl font-semibold text-[#0a3558] leading-5">
        Internal Notes
      </h3>

      <div className="w-full flex flex-col gap-1.5">
        <label
          htmlFor="admin-notes-textarea"
          className="text-sm font-normal text-slate-600 leading-6"
        >
          Admin Notes
        </label>
        <div className="w-full p-3 bg-white rounded-lg border border-slate-200 focus-within:border-[#0a3558] focus-within:ring-1 focus-within:ring-[#0a3558] transition-all flex flex-col gap-2">
          <textarea
            id="admin-notes-textarea"
            rows={3}
            maxLength={maxLength}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add internal observations, notes or decisions for admins..."
            className="w-full text-sm font-normal text-slate-800 placeholder-slate-400 focus:outline-hidden resize-none leading-6 bg-transparent"
          />
          <div className="text-right text-xs font-normal text-slate-400 leading-5 select-none">
            {noteText.length}/{maxLength}
          </div>
        </div>
      </div>

      <CustomButton
        variant="primary"
        size="md"
        onClick={handleAddNote}
        disabled={!noteText.trim() || isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            <span>Posting...</span>
          </>
        ) : (
          <span>Add Note</span>
        )}
      </CustomButton>

      <div className="w-full flex flex-col gap-3">
        {displayNotes.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No internal notes yet.</p>
        ) : (
          displayNotes.map((note) => (
            <div
              key={note.id}
              className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5"
            >
              <div className="pt-0.5 shrink-0 text-slate-400">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                <p className="text-sm font-normal text-slate-800 leading-6 break-words">
                  {note.content}
                </p>
                <div className="flex items-center gap-2 text-xs font-normal text-slate-500 leading-3">
                  <span>Note added by {note.author}</span>
                  {note.createdAt && (
                    <>
                      <span>•</span>
                      <span>{note.createdAt}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default InternalNotes;