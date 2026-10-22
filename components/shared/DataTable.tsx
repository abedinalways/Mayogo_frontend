"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// ==========================================
// Types
// ==========================================

export interface Column<T> {
    key: string;
    header: React.ReactNode;
    className?: string;
    cell: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
    title?: string;
    onViewAll?: () => void;
    columns: Column<T>[];
    data: T[];
    pageSize?: number;
    pageSizeOptions?: number[];
    onPageSizeChange?: (size: number) => void;
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    onPageChange?: (page: number) => void;
    pagination?: boolean;
}

// ==========================================
// Helper: calculate dynamic pagination pages
// ==========================================

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
    const validTotal = Math.max(1, totalPages);
    const validCurrent = Math.min(Math.max(1, currentPage), validTotal);

    if (validTotal <= 1) return [1];
    if (validTotal <= 5) {
        return Array.from({ length: validTotal }, (_, i) => i + 1);
    }
    if (validCurrent <= 3) {
        return [1, 2, 3, 4, "...", validTotal];
    }
    if (validCurrent >= validTotal - 2) {
        return [1, "...", validTotal - 3, validTotal - 2, validTotal - 1, validTotal];
    }
    return [1, "...", validCurrent - 1, validCurrent, validCurrent + 1, "...", validTotal];
}

// ==========================================
// Generic Reusable DataTable Component
// ==========================================

export function DataTable<T>({
    columns,
    data,
    pageSize = 25,
    pageSizeOptions = [10, 25, 50, 100],
    onPageSizeChange,
    currentPage = 1,
    totalPages = 1,
    totalItems,
    onPageChange,
    pagination = true,
}: DataTableProps<T>) {
    const [internalPageSize, setInternalPageSize] = useState(pageSize);
    const [internalActivePage, setInternalActivePage] = useState(currentPage);

    const activePage = currentPage !== undefined ? currentPage : internalActivePage;
    const selectedPageSize = pageSize !== undefined ? pageSize : internalPageSize;

    const safeTotalPages = Math.max(1, totalPages);
    const pageNumbers = getPageNumbers(activePage, safeTotalPages);

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = Number(e.target.value);
        setInternalPageSize(val);
        setInternalActivePage(1);
        onPageSizeChange?.(val);
        onPageChange?.(1);
    };

    const handlePageClick = (page: number) => {
        if (page < 1 || page > safeTotalPages || page === activePage) return;
        setInternalActivePage(page);
        onPageChange?.(page);
    };

    const startItem = totalItems !== undefined && totalItems > 0 ? (activePage - 1) * selectedPageSize + 1 : 0;
    const endItem = totalItems !== undefined ? Math.min(activePage * selectedPageSize, totalItems) : 0;

    return (
        <div className="w-full overflow-hidden border border-[#E8E8E8] bg-white shadow-[0_2px_4px_-1px_rgba(13,13,18,0.06)] rounded-b-xl">
            {/* Table Container */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    {/* Table Head */}
                    <thead>
                        <tr className="h-12 border-b border-[#e4ebf1] [background:var(--Card-bg,rgba(16,61,92,0.06))]">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 text-sm font-semibold leading-6 text-[#5A5A5A] ${col.className || ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-[#e4ebf1]">
                        {data.map((row, index) => (
                            <tr
                                key={index}
                                className="h-16 transition-colors hover:bg-slate-50/60"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={`px-4 py-3 ${col.className || ""}`}>
                                        {col.cell(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <>
                    {/* Table Pagination Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e4ebf1] bg-white p-4 rounded-b-xl">
                        {/* Page Size Selector */}
                        <div className="flex items-center gap-3">
                            <span className="text-base font-medium text-[#123e5e]">Show items</span>
                            <div className="relative flex items-center">
                                <select
                                    value={selectedPageSize}
                                    onChange={handlePageSizeChange}
                                    className="h-9 appearance-none rounded-lg border border-[#e4ebf1] bg-white pl-3 pr-8 text-sm font-medium text-[#123e5e] outline-none focus:border-slate-300 cursor-pointer"
                                >
                                    {pageSizeOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-slate-400" />
                            </div>

                            {totalItems !== undefined && totalItems > 0 && (
                                <span className="text-xs text-slate-500 font-medium ml-1">
                                    Showing {startItem}–{endItem} of {totalItems}
                                </span>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                disabled={activePage <= 1}
                                onClick={() => handlePageClick(activePage - 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4ebf1] text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            <div className="flex items-center rounded-lg bg-[#f8fbfd] p-0.5">
                                {pageNumbers.map((page, idx) => {
                                    if (typeof page === "number") {
                                        const isActive = activePage === page;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handlePageClick(page)}
                                                className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isActive
                                                    ? "border border-[#e4ebf1] bg-white font-semibold text-[#123e5e] shadow-sm"
                                                    : "text-[#6c8294] hover:text-[#123e5e]"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    }
                                    return (
                                        <span
                                            key={idx}
                                            className="flex h-9 w-9 items-center justify-center text-sm font-medium text-[#6c8294]"
                                        >
                                            {page}
                                        </span>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                disabled={activePage >= safeTotalPages}
                                onClick={() => handlePageClick(activePage + 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4ebf1] text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
                                aria-label="Next page"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default DataTable;
