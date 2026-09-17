"use client";

import React, { useState } from "react";
import { Plus, Search, ChevronDown, ChevronUp, Edit2, Trash2, HelpCircle } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Billing" | "Experts" | "Clients";
  status: "Published" | "Draft";
  updatedAt: string;
}

const INITIAL_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How do I hire an expert on Mayogo?",
    answer:
      "You can browse expert profiles by category or post a job requirement. Once experts apply or you choose a profile, you can initiate a project proposal and lock escrow payment.",
    category: "Clients",
    status: "Published",
    updatedAt: "Sep 15, 2026",
  },
  {
    id: "faq-2",
    question: "What are the platform fee rates for experts?",
    answer:
      "Mayogo charges a standard 10% platform fee on completed contracts. Premium subscribed experts get reduced fees down to 5%.",
    category: "Billing",
    status: "Published",
    updatedAt: "Sep 12, 2026",
  },
  {
    id: "faq-3",
    question: "How does the dispute resolution system work?",
    answer:
      "If a dispute arises between a client and an expert, either party can raise a ticket. Our admin team reviews project deliverables and communication logs to make a fair determination.",
    category: "General",
    status: "Published",
    updatedAt: "Aug 28, 2026",
  },
  {
    id: "faq-4",
    question: "What identity verification documents are required?",
    answer:
      "Experts must provide a valid government-issued ID (Passport, National ID, or Driving License) and portfolio proof before taking high-tier jobs.",
    category: "Experts",
    status: "Draft",
    updatedAt: "Aug 20, 2026",
  },
];

export function FaqsTab() {
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  const categories = ["All", "General", "Billing", "Experts", "Clients"];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6 font-['Manrope']">
      {/* Search & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E4EBF1] shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="flex h-10 w-64 items-center gap-2 rounded-lg border border-[#E4EBF1] bg-white px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-[#9aaab5]" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#0F3453] placeholder:text-[#9aaab5] outline-none"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#103D5C] text-white"
                    : "bg-[#F1F5F9] text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-lg bg-[#103D5C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0b2841] shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-[#E4EBF1] text-center text-slate-500">
            <HelpCircle className="h-10 w-10 text-slate-300 mb-2" />
            <p className="text-base font-semibold">No FAQs found</p>
            <p className="text-sm text-slate-400">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-[#E4EBF1] overflow-hidden transition-shadow hover:shadow-sm"
              >
                <div
                  onClick={() => toggleExpand(faq.id)}
                  className="flex items-center justify-between p-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#103D5C] font-semibold text-sm">
                      ?
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#103D5C]">
                        {faq.question}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {faq.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            faq.status === "Published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {faq.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          Updated {faq.updatedAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit action
                      }}
                      className="p-1.5 text-slate-400 hover:text-[#103D5C] hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(faq.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default FaqsTab;
