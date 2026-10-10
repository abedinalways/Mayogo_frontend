"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  SquarePen,
  PlusIcon,
  Loader2,
  AlertCircle,
  RefreshCw,
  Wrench,
} from "lucide-react";
import { Column, DataTable } from "@/components/shared/DataTable";
import AddServiceModal from "./AddServiceModal";
import EditServiceModal from "./EditServiceModal";
import TableToolbar, { DropdownFilter } from "@/components/shared/TableToolbar";
import CustomButton from "@/components/shared/CustomButton";
import {
  useGetServicesQuery,
  useToggleServiceStatusMutation,
  useGetCategoriesQuery,
} from "@/lib/redux/api/categoryApi";
import { usePermissionAction } from "@/lib/permissions";
import { ServiceItem } from "@/types/category.types";

function ToggleSwitch({
  enabled,
  onChange,
  disabled,
  isRestricted,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  isRestricted?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      title={isRestricted ? "View-only access (Click for details)" : undefined}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        isRestricted ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${
        enabled ? "bg-[#F5B517]" : "bg-slate-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function ServiceTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const offset = (page - 1) * pageSize;

  const { data, isLoading, isFetching, error, refetch } = useGetServicesQuery({
    categoryId: categoryFilter || undefined,
    status:
      statusFilter === "active"
        ? "active"
        : statusFilter === "inactive"
        ? "inactive"
        : undefined,
    search: debouncedSearch || undefined,
    limit: pageSize,
    offset,
  });

  const { data: categories } = useGetCategoriesQuery();
  const [toggleStatus] = useToggleServiceStatusMutation();

  const { canManage: canManageServices, executeIfAllowed } = usePermissionAction(
    "platform.configuration.services"
  );

  const handleToggleStatus = async (id: string, value: boolean) => {
    try {
      await toggleStatus({ id, isActive: value }).unwrap();
    } catch {
      // handled via mutation
    }
  };

  const { serviceList, totalCount } = useMemo(() => {
    if (!data) return { serviceList: [], totalCount: 0 };

    let items: ServiceItem[] = [];
    let total = 0;

    const payload = (data as unknown) as Record<string, unknown>;
    if (Array.isArray(payload.services)) {
      items = payload.services as ServiceItem[];
      total = (payload.total as number) ?? items.length;
    } else if (Array.isArray(payload.data)) {
      items = payload.data as ServiceItem[];
      total = (payload.total as number) ?? items.length;
    } else if (Array.isArray(payload.items)) {
      items = payload.items as ServiceItem[];
      total = (payload.total as number) ?? items.length;
    } else if (payload.data && typeof payload.data === "object") {
      const sub = payload.data as Record<string, unknown>;
      items = (sub.services || sub.items || sub.data || []) as ServiceItem[];
      total = (sub.total as number) ?? items.length;
    }

    return { serviceList: items, totalCount: total };
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? serviceList.map((s) => s.id) : []);
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const columns: Column<ServiceItem>[] = [
    {
      key: "checkbox",
      header: (
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedIds.length === serviceList.length && serviceList.length > 0}
          className="h-4 w-4 cursor-pointer rounded border-slate-300"
        />
      ),
      className: "w-12 pl-6 pr-2",
      cell: (item) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(item.id)}
          onChange={() => handleSelectRow(item.id)}
          className="h-4 w-4 cursor-pointer rounded border-slate-300"
        />
      ),
    },
    {
      key: "name",
      header: "Service Name",
      className: "min-w-[200px]",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-[#F5B517]">
            <Image
              src={
                item.imageUrl ||
                item.image ||
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=80&auto=format&fit=crop&q=80"
              }
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium text-primary font-['Manrope']">
            {item.name}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      className: "min-w-[180px]",
      cell: (item) => {
        const catName =
          typeof item.category === "object"
            ? item.category?.name
            : item.category || "General";

        return (
          <span className="text-sm text-[#0777F6] font-['Manrope'] bg-[#EFF9FF] p-1 rounded">
            {catName}
          </span>
        );
      },
    },
    {
      key: "commission",
      header: "Commission",
      className: "min-w-[120px] text-center",
      cell: (item) => (
        <span className="text-sm text-[#5A5A5A] font-['Manrope']">
          {item.commission}%
        </span>
      ),
    },
    {
      key: "totalJobs",
      header: "Total Jobs",
      className: "min-w-[110px] text-center",
      cell: (item) => (
        <span className="text-sm text-[#5A5A5A] font-['Manrope']">
          {String(item.totalJobs || 0).padStart(2, "0")}
        </span>
      ),
    },
    {
      key: "createdBy",
      header: "Created By",
      className: "min-w-[140px]",
      cell: (item) => {
        const creator = item.createdBy || "Admin";
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0a3558] text-xs font-bold text-white border border-[#F5B517]">
              {creator.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-sm text-[#103D5C] font-['Manrope']">
              {creator}
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[100px] text-center",
      cell: (item) => (
        <ToggleSwitch
          enabled={item.isActive ?? (item.status === true)}
          isRestricted={!canManageServices}
          onChange={(v) =>
            executeIfAllowed(
              () => handleToggleStatus(item.id, v),
              "View-Only Mode: You only have view permission for Services. Management permission (Manage / Allow All) is required to change service status."
            )
          }
        />
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "w-20 text-center",
      cell: (item) => (
        <button
          type="button"
          onClick={() =>
            executeIfAllowed(
              () => {
                setSelectedService(item);
                setEditOpen(true);
              },
              "View-Only Mode: You only have view permission for Services. Management permission (Manage / Allow All) is required to edit services."
            )
          }
          title={!canManageServices ? "View-only access (Click for details)" : "Edit service"}
          className={`inline-flex items-center justify-center rounded border border-[#E8E8E8] bg-white p-2 transition-colors ${
            canManageServices
              ? "text-slate-500 hover:bg-slate-50 hover:text-[#0a3558] cursor-pointer"
              : "text-slate-400 opacity-60 cursor-not-allowed hover:bg-amber-50/50"
          }`}
        >
          <SquarePen className={canManageServices ? "text-[#F5B517]" : "text-slate-400"} size={15} />
        </button>
      ),
    },
  ];

  const categoryFilterOptions = [
    { label: "All Categories", value: "" },
    ...(categories || []).map((c) => ({
      label: c.name,
      value: c.id,
    })),
  ];

  const dropdownFilters: DropdownFilter[] = [
    {
      placeholder: "All Status",
      value: statusFilter,
      options: [
        { label: "All Status", value: "" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      onChange: (val) => {
        setStatusFilter(val);
        setPage(1);
      },
    },
    {
      placeholder: "All Categories",
      value: categoryFilter,
      options: categoryFilterOptions,
      onChange: (val) => {
        setCategoryFilter(val);
        setPage(1);
      },
    },
  ];

  return (
    <div className="space-y-4 font-['Manrope']">
      <TableToolbar
        searchQuery={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        dropdownFilters={dropdownFilters}
        actionButton={
          <CustomButton
            onClick={() =>
              executeIfAllowed(
                () => setAddOpen(true),
                "View-Only Mode: You only have view permission for Services. Management permission (Manage / Allow All) is required to add new services."
              )
            }
            size="md"
            leadingIcon={<PlusIcon />}
            className={
              !canManageServices
                ? "opacity-60 cursor-not-allowed hover:bg-[#0a3558] active:scale-100"
                : ""
            }
            title={!canManageServices ? "View-only access (Click for details)" : undefined}
          >
            Add New Service
          </CustomButton>
        }
      />

      {error ? (
        <div className="p-8 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm font-medium text-slate-800">Failed to load services</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Could not retrieve services from the server.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#103D5C] text-white hover:bg-[#0b2b41] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white border border-[#E8E8E8] rounded-b-xl">
          <Loader2 className="h-7 w-7 text-[#103D5C] animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading services...</p>
        </div>
      ) : serviceList.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E8E8E8] rounded-b-xl">
          <Wrench className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-800">No services found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || statusFilter || categoryFilter
              ? "Try adjusting your search query, status, or category filter."
              : "No services have been created yet."}
          </p>
        </div>
      ) : (
        <div className="relative border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
          {isFetching && (
            <div className="absolute top-2 right-4 z-10 flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur rounded shadow-sm border text-[11px] text-slate-600">
              <Loader2 className="h-3 w-3 animate-spin text-[#103D5C]" />
              <span>Updating...</span>
            </div>
          )}
          <DataTable
            columns={columns}
            data={serviceList}
            pagination={true}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
          />
        </div>
      )}

      <AddServiceModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={() => refetch()}
      />
      <EditServiceModal
        open={editOpen}
        onOpenChange={setEditOpen}
        service={selectedService}
        onSaved={() => refetch()}
      />
    </div>
  );
}
