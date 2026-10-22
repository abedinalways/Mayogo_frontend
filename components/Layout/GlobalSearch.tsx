"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, X, User, Briefcase, UserCheck } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetDashboardSearchQuery } from "@/lib/redux/api/dashboardApi";
import { DashboardSearchType } from "@/types/dashboard.types";
import { StatusBadge, type StatusType } from "@/components/shared/StatusBadge";

const FILTER_TABS: { label: string; value: DashboardSearchType }[] = [
  { label: "All", value: "ALL" },
  { label: "Clients", value: "CLIENTS" },
  { label: "Experts", value: "EXPERTS" },
  { label: "Jobs", value: "JOBS" },
];

const mapJobStatus = (status?: string): StatusType => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "Completed";
    case "IN_PROGRESS":
    case "ACCEPTED":
    case "QUOTED":
      return "In Progress";
    case "PENDING":
      return "Pending";
    case "DISPUTED":
      return "Disputed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Pending";
  }
};

export function GlobalSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<DashboardSearchType>("ALL");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchTerm.trim(), 350);

  const shouldQuery = debouncedSearch.length >= 2;

  const { data: searchResults, isFetching } = useGetDashboardSearchQuery(
    {
      q: debouncedSearch,
      type: filterType,
      limit: 8,
    },
    { skip: !shouldQuery }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (url: string) => {
    setIsOpen(false);
    setSearchTerm("");
    router.push(url);
  };

  const rawClients =
    searchResults?.clients ||
    (searchResults?.results?.filter(
      (r: any) =>
        r.type === "CLIENT" || (!r.type && (r.phone || r.email) && !r.professionalTitle)
    ) as any[]) ||
    [];

  const rawExperts =
    searchResults?.experts ||
    (searchResults?.results?.filter(
      (r: any) =>
        r.type === "EXPERT" || (!r.type && r.professionalTitle)
    ) as any[]) ||
    [];

  const rawJobs =
    searchResults?.jobs ||
    (searchResults?.results?.filter(
      (r: any) =>
        r.type === "JOB" || (!r.type && (r.requestNumber || r.jobId))
    ) as any[]) ||
    [];

  const hasAnyResults =
    rawClients.length > 0 || rawExperts.length > 0 || rawJobs.length > 0;

  return (
    <div className="relative font-['Manrope']" ref={containerRef}>
      <div className="relative hidden h-9 w-56 md:w-64 items-center rounded-lg border border-[#e4ebf1] bg-white px-3 py-2.5 shadow-sm transition-all focus-within:border-slate-300 md:flex">
        <span className="sr-only">Search</span>
        <Search className="h-4 w-4 shrink-0 text-[#9aaab5]" />
        <input
          type="search"
          placeholder="Type to search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (searchTerm.trim().length > 0) setIsOpen(true);
          }}
          className="ml-2 w-full bg-transparent text-xs font-normal text-[#0f3453] placeholder:text-[#9aaab5] outline-none"
        />
        {isFetching ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-amber-500" />
        ) : searchTerm ? (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setIsOpen(false);
            }}
            className="p-0.5 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {isOpen && shouldQuery && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 max-h-[460px] overflow-y-auto">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2 px-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilterType(tab.value)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors ${
                  filterType === tab.value
                    ? "bg-[#0f3453] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isFetching && !hasAnyResults ? (
            <div className="flex items-center justify-center py-8 text-xs text-slate-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-amber-500" />
              Searching across platform...
            </div>
          ) : !hasAnyResults ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No results found for &quot;{debouncedSearch}&quot;
            </div>
          ) : (
            <div className="space-y-3">
              {/* Clients Section */}
              {(filterType === "ALL" || filterType === "CLIENTS") &&
                rawClients.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <User className="h-3 w-3" />
                      Clients ({rawClients.length})
                    </div>
                    <div className="mt-1 space-y-1">
                      {rawClients.map((client: any) => {
                        const name = client.fullName || client.name || "Client";
                        const sub = client.phone || client.email || "";
                        const avatar =
                          client.avatarUrl ||
                          client.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            name
                          )}&background=0F3453&color=fff`;

                        return (
                          <button
                            key={client.id}
                            type="button"
                            onClick={() =>
                              handleSelectResult(`/dashboard/clients/${client.id}`)
                            }
                            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50"
                          >
                            <img
                              src={avatar}
                              alt={name}
                              className="h-7 w-7 rounded-full object-cover border border-slate-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  name
                                )}&background=0F3453&color=fff`;
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-xs font-semibold text-[#0f3453]">
                                {name}
                              </p>
                              {sub && (
                                <p className="truncate text-[10px] text-slate-400">
                                  {sub}
                                </p>
                              )}
                            </div>
                            {client.badge && (
                              <span className="shrink-0 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {client.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Experts Section */}
              {(filterType === "ALL" || filterType === "EXPERTS") &&
                rawExperts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <UserCheck className="h-3 w-3" />
                      Experts ({rawExperts.length})
                    </div>
                    <div className="mt-1 space-y-1">
                      {rawExperts.map((exp: any) => {
                        const name = exp.fullName || exp.name || "Expert";
                        const profession =
                          exp.professionalTitle ||
                          (typeof exp.category === "object"
                            ? exp.category?.name
                            : exp.category) ||
                          "Certified Expert";
                        const avatar =
                          exp.avatarUrl ||
                          exp.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            name
                          )}&background=f2ad1b&color=fff`;

                        return (
                          <button
                            key={exp.id}
                            type="button"
                            onClick={() =>
                              handleSelectResult(`/dashboard/experts/${exp.id}`)
                            }
                            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50"
                          >
                            <img
                              src={avatar}
                              alt={name}
                              className="h-7 w-7 rounded-full object-cover border border-amber-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  name
                                )}&background=f2ad1b&color=fff`;
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-xs font-semibold text-[#0f3453]">
                                {name}
                              </p>
                              <p className="truncate text-[10px] text-slate-400">
                                {profession}
                              </p>
                            </div>
                            {exp.badge && (
                              <span className="shrink-0 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                {exp.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Jobs Section */}
              {(filterType === "ALL" || filterType === "JOBS") &&
                rawJobs.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <Briefcase className="h-3 w-3" />
                      Jobs ({rawJobs.length})
                    </div>
                    <div className="mt-1 space-y-1">
                      {rawJobs.map((job: any) => {
                        const title =
                          job.title ||
                          (typeof job.service === "object"
                            ? job.service?.name
                            : job.service) ||
                          "Service Request";
                        const reqNo =
                          job.requestNumber ||
                          job.jobId ||
                          `#${(job.id || "").slice(0, 8)}`;
                        const category =
                          typeof job.category === "object"
                            ? job.category?.name
                            : job.category;

                        return (
                          <button
                            key={job.id}
                            type="button"
                            onClick={() =>
                              handleSelectResult(`/dashboard/jobs/${job.id}`)
                            }
                            className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold text-[#123e5e]">
                                  {reqNo}
                                </span>
                                <span className="truncate text-xs font-medium text-[#0f3453]">
                                  {title}
                                </span>
                              </div>
                              {category && (
                                <p className="truncate text-[10px] text-slate-400">
                                  {category}
                                </p>
                              )}
                            </div>
                            {job.status && (
                              <div className="shrink-0 scale-90 origin-right">
                                <StatusBadge
                                  status={mapJobStatus(job.status)}
                                />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
