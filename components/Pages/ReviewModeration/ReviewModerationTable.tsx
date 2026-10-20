"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Star, MoreVertical, Loader2 } from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomModal from "@/components/shared/CustomModal";
import ReviewDetails from "./ReviewDetails";
import { TableToolbar } from "@/components/shared/TableToolbar";
import {
  useGetReviewsQuery,
  useModerateReviewMutation,
} from "@/lib/redux/api/reviewApi";
import { ReviewStatus as ApiReviewStatus } from "@/types/review.types";

export type ReviewStatus = "Visible" | "Hidden" | "Flagged" | "Rejected";

const RATING_OPTIONS = [
  { label: "All Ratings", value: "" },
  { label: "5 Stars (Excellent)", value: "5" },
  { label: "4 Stars (Very Good)", value: "4" },
  { label: "3 Stars (Good)", value: "3" },
  { label: "2 Stars (Fair)", value: "2" },
  { label: "1 Star (Poor)", value: "1" },
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Visible", value: "VISIBLE" },
  { label: "Hidden", value: "HIDDEN" },
  { label: "Flagged", value: "FLAGGED" },
  { label: "Rejected", value: "REJECTED" },
];

export interface ReviewRecord {
  id: string;
  jobId: string;
  service: {
    title: string;
    category: string;
    image: string;
  };
  client: {
    name: string;
    avatar: string;
  };
  expert: {
    name: string;
    avatar: string;
  };
  rating: number; // 1 to 5
  ratingLabel: string;
  comment: string;
  status: ReviewStatus;
  rawStatus: string;
  date: string;
}

function getRatingLabel(rating: number): string {
  if (rating >= 5) return "Excellent";
  if (rating >= 4) return "Very Good";
  if (rating >= 3) return "Good";
  if (rating >= 2) return "Fair";
  return "Poor";
}

function parseRatingValue(val: string): number | undefined {
  if (!val) return undefined;
  if (val === "5" || val === "excellent") return 5;
  if (val === "4" || val === "very_good") return 4;
  if (val === "3" || val === "good") return 3;
  if (val === "2" || val === "fair") return 2;
  if (val === "1" || val === "poor") return 1;
  const num = parseInt(val, 10);
  return isNaN(num) ? undefined : num;
}

export function ReviewModerationTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State
  const [isViewReviewModalOpen, setIsViewReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewRecord | null>(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const queryParams = useMemo(() => {
    const numericRating = parseRatingValue(rating);
    const offset = (page - 1) * pageSize;
    return {
      status: status || undefined,
      rating: numericRating,
      search: debouncedSearch.trim() || undefined,
      limit: pageSize,
      offset,
    };
  }, [status, rating, debouncedSearch, page, pageSize]);

  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetReviewsQuery(queryParams);

  const [moderateReview, { isLoading: isModerating }] =
    useModerateReviewMutation();

  const { reviewList, totalCount, totalPages } = useMemo(() => {
    const rawItems = responseData?.data || [];
    const meta = responseData?.meta;

    const total =
      meta?.total ?? (Array.isArray(rawItems) ? rawItems.length : 0);
    const pages =
      meta?.totalPages ?? Math.max(1, Math.ceil(total / (pageSize || 10)));

    const mapped: ReviewRecord[] = rawItems.map((item, index) => {
      const clientName =
        item.client?.fullName || item.client?.name || "Client User";
      const expertName =
        item.expert?.fullName || item.expert?.name || "Expert User";

      const clientAvatar =
        item.client?.avatarUrl ||
        item.client?.avatar ||
        `https://placehold.co/80x80?text=${encodeURIComponent(clientName.charAt(0))}`;

      const expertAvatar =
        item.expert?.avatarUrl ||
        item.expert?.avatar ||
        `https://placehold.co/80x80?text=${encodeURIComponent(expertName.charAt(0))}`;

      const serviceTitle =
        item.service?.title ||
        item.service?.name ||
        item.job?.service?.title ||
        item.job?.service?.name ||
        item.job?.title ||
        "Service Job";

      const serviceCategory =
        item.service?.category ||
        item.job?.category?.name ||
        "General Service";

      const serviceImage =
        item.service?.image ||
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&auto=format&fit=crop&q=80";

      const displayJobId =
        item.job?.requestNumber ||
        (item.jobId
          ? item.jobId.startsWith("#")
            ? item.jobId
            : `#${item.jobId.slice(0, 8)}`
          : `#JB${String(index + 1).padStart(3, "0")}`);

      const ratingNum = Math.min(Math.max(Number(item.rating || 5), 1), 5);
      const ratingLabel = getRatingLabel(ratingNum);

      let formattedDate = "Recently";
      if (item.createdAt) {
        try {
          formattedDate = new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(item.createdAt));
        } catch {
          formattedDate = String(item.createdAt);
        }
      }

      const rawStatusStr = String(item.status || "VISIBLE").toUpperCase();
      let displayStatus: ReviewStatus = "Visible";
      if (rawStatusStr === "HIDDEN") displayStatus = "Hidden";
      else if (rawStatusStr === "FLAGGED") displayStatus = "Flagged";
      else if (rawStatusStr === "REJECTED") displayStatus = "Rejected";

      return {
        id: item.id,
        jobId: displayJobId,
        service: {
          title: serviceTitle,
          category: serviceCategory,
          image: serviceImage,
        },
        client: {
          name: clientName,
          avatar: clientAvatar,
        },
        expert: {
          name: expertName,
          avatar: expertAvatar,
        },
        rating: ratingNum,
        ratingLabel,
        comment: item.review || item.comment || "No comment provided.",
        status: displayStatus,
        rawStatus: rawStatusStr,
        date: formattedDate,
      };
    });

    return { reviewList: mapped, totalCount: total, totalPages: pages };
  }, [responseData, pageSize]);

  useEffect(() => {
    if (totalPages && page > totalPages) {
      setPage(1);
    }
  }, [totalPages, page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(reviewList.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleStatus = async (review: ReviewRecord) => {
    const isCurrentlyHidden = review.status === "Hidden";
    const nextStatus: ApiReviewStatus = isCurrentlyHidden ? "VISIBLE" : "HIDDEN";

    try {
      await moderateReview({
        reviewId: review.id,
        status: nextStatus,
        moderationNote: isCurrentlyHidden
          ? "Made visible by admin moderation"
          : "Hidden by admin moderation",
      }).unwrap();

      // Update selected review if modal is open
      if (selectedReview && selectedReview.id === review.id) {
        setSelectedReview((prev) =>
          prev
            ? {
                ...prev,
                status: isCurrentlyHidden ? "Visible" : "Hidden",
                rawStatus: nextStatus,
              }
            : null
        );
      }
    } catch (err) {
      console.error("Failed to moderate review:", err);
    }
  };

  const renderStars = (ratingVal: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= ratingVal
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );

  const columns: Column<ReviewRecord>[] = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={
            selectedIds.length === reviewList.length && reviewList.length > 0
          }
          className="h-4 w-4 rounded border-slate-300 accent-amber-500 cursor-pointer"
        />
      ),
      className: "w-12 pl-6 pr-2",
      cell: (item) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(item.id)}
          onChange={() => handleSelectRow(item.id)}
          className="h-4 w-4 rounded border-slate-300 accent-amber-500 cursor-pointer"
        />
      ),
    },
    {
      key: "jobId",
      header: "Job ID",
      className: "min-w-[100px]",
      cell: (item) => (
        <span className="text-xs font-normal text-[#103D5C] font-['Manrope']">
          {item.jobId}
        </span>
      ),
    },
    {
      key: "service",
      header: "Service Name",
      className: "min-w-[220px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Image
            src={item.service.image}
            alt={item.service.title}
            width={28}
            height={28}
            className="h-7 w-7 rounded-md border border-slate-200 object-cover shrink-0"
            unoptimized
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#103D5C] font-['Manrope'] truncate max-w-[180px]">
              {item.service.title}
            </span>
            <span className="text-[10px] text-slate-400 font-['Manrope'] truncate max-w-[180px]">
              {item.service.category}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "client",
      header: "Client Name",
      className: "min-w-[160px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Image
            src={item.client.avatar}
            alt={item.client.name}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full border border-slate-200 object-cover shrink-0"
            unoptimized
          />
          <span className="text-xs font-medium text-slate-700 font-['Manrope'] truncate max-w-[120px]">
            {item.client.name}
          </span>
        </div>
      ),
    },
    {
      key: "expert",
      header: "Expert Name",
      className: "min-w-[160px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Image
            src={item.expert.avatar}
            alt={item.expert.name}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full border border-slate-200 object-cover shrink-0"
            unoptimized
          />
          <span className="text-xs font-medium text-slate-700 font-['Manrope'] truncate max-w-[120px]">
            {item.expert.name}
          </span>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      className: "min-w-[120px] text-center",
      cell: (item) => (
        <div className="flex flex-col items-center justify-center gap-1">
          {renderStars(item.rating)}
          <span className="text-[11px] font-medium text-amber-500 font-['Manrope']">
            {item.ratingLabel}
          </span>
        </div>
      ),
    },
    {
      key: "comment",
      header: "Review",
      className: "min-w-[220px]",
      cell: (item) => (
        <p className="line-clamp-2 text-xs font-normal leading-4 text-slate-600 font-['Manrope']">
          {item.comment}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[120px]",
      cell: (item) => {
        if (item.status === "Visible") {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 outline outline-1 outline-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Visible
            </span>
          );
        }
        if (item.status === "Hidden") {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-600 outline outline-1 outline-rose-200">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Hidden
            </span>
          );
        }
        if (item.status === "Flagged") {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 outline outline-1 outline-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Flagged
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 outline outline-1 outline-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            {item.status}
          </span>
        );
      },
    },
    {
      key: "action",
      header: "Action",
      className: "min-w-[80px] text-center relative pr-6",
      cell: (item) => (
        <CustomDropdown
          align="end"
          ariaLabel="Review actions"
          triggerClassName="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 cursor-pointer"
          trigger={<MoreVertical className="h-4 w-4" />}
          contentClassName="w-40 rounded-xl border border-slate-100 bg-[#f8fbfd] p-2 shadow-lg"
        >
          {({ close }) => (
            <div className="flex w-full flex-col gap-2">
              <button
                onClick={() => {
                  setSelectedReview(item);
                  setIsViewReviewModalOpen(true);
                  close();
                }}
                type="button"
                className="inline-flex h-10 w-full items-center justify-start gap-2.5 rounded-lg bg-[#0a3558] px-2 py-3 cursor-pointer hover:bg-[#07243b] transition-colors"
              >
                <span className="text-sm font-medium leading-4 text-white font-['Manrope']">
                  View Review
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleToggleStatus(item);
                  close();
                }}
                className="flex h-10 w-full items-center gap-2 rounded-lg px-2 py-3 text-sm font-medium text-[#103D5C] hover:bg-slate-200/50 font-['Manrope'] cursor-pointer transition-colors"
              >
                {item.status === "Visible" ? "Hide Review" : "Make Visible"}
              </button>
            </div>
          )}
        </CustomDropdown>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Table Top Controls */}
      <TableToolbar
        searchQuery={searchTerm}
        onSearchChange={handleSearchChange}
        dropdownFilters={[
          {
            placeholder: "All Ratings",
            value: rating,
            options: RATING_OPTIONS,
            onChange: (val) => {
              setRating(val);
              setPage(1);
            },
          },
          {
            placeholder: "All Status",
            value: status,
            options: STATUS_OPTIONS,
            onChange: (val) => {
              setStatus(val);
              setPage(1);
            },
          },
        ]}
      />

      {/* Main Data Table */}
      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white rounded-xl border border-slate-200">
          <Loader2 className="h-8 w-8 text-[#103D5C] animate-spin" />
          <p className="text-xs text-slate-500 font-medium font-['Manrope']">
            Loading reviews...
          </p>
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute top-2 right-4 z-10 flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur rounded shadow-sm border text-[11px] text-slate-600">
              <Loader2 className="h-3 w-3 animate-spin text-[#103D5C]" />
              <span>Updating...</span>
            </div>
          )}

          <DataTable
            columns={columns}
            data={reviewList}
            pagination={true}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
          />
        </div>
      )}

      {/* Modal for view review */}
      <CustomModal
        size="sm"
        showCloseButton={false}
        open={isViewReviewModalOpen}
        onOpenChange={() => setIsViewReviewModalOpen(false)}
      >
        <div className="p-1">
          {selectedReview && (
            <ReviewDetails
              jobId={selectedReview.jobId}
              serviceTitle={selectedReview.service.title}
              serviceCategory={selectedReview.service.category}
              serviceImage={selectedReview.service.image}
              clientName={selectedReview.client.name}
              clientAvatar={selectedReview.client.avatar}
              rating={selectedReview.rating}
              date={selectedReview.date}
              comment={selectedReview.comment}
              expertName={selectedReview.expert.name}
              expertAvatar={selectedReview.expert.avatar}
              status={selectedReview.status}
              isLoading={isModerating}
              onClose={() => setIsViewReviewModalOpen(false)}
              onToggleStatus={() => handleToggleStatus(selectedReview)}
            />
          )}
        </div>
      </CustomModal>
    </div>
  );
}

export default ReviewModerationTable;