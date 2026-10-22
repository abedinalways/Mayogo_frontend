"use client";

import React, { useState } from "react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar from "../../shared/TableToolbar";
import { Eye, Loader2 } from "lucide-react";
import CustomModal from "@/components/shared/CustomModal";
import EditIcon from "@/components/Icons/EditIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import EditStaticContent, {
  StaticContentFormData,
} from "./ContentManagementAllModal/EditStaticContent";
import PreviewStaticContent from "./ContentManagementAllModal/PreviewStaticContent";
import DeleteAnnouncement from "./ContentManagementAllModal/DeleteAnnouncement";
import {
  useGetStaticPagesQuery,
  useUpdateStaticPageMutation,
  useDeleteStaticPageMutation,
} from "@/lib/redux/api/contentApi";
import { StaticPageItem } from "@/types/content.types";

export interface StaticPageRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  status: string;
  updateBy: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const isLive = status.toLowerCase() === "live";
  const config = isLive
    ? {
        bg: "bg-sky-50",
        border: "outline-sky-200",
        text: "text-[#0777F6]",
        dot: "bg-[#0777F6]",
      }
    : {
        bg: "bg-[#FEF4DC]",
        border: "outline-[#F8B500]",
        text: "text-[#F8B500]",
        dot: "bg-[#F8B500]",
      };

  return (
    <div
      className={`inline-flex h-5 items-center gap-1 rounded-sm px-2 py-0.5 outline outline-1 outline-offset-[-1px] ${config.bg} ${config.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span
        className={`font-['Manrope'] text-xs font-medium leading-4 ${config.text}`}
      >
        {isLive ? "Live" : "Draft"}
      </span>
    </div>
  );
};

export function StaticPagesTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const {
    data: rawPages = [],
    isLoading,
    isFetching,
  } = useGetStaticPagesQuery({
    search: searchTerm || undefined,
    status: statusFilter ? statusFilter.toUpperCase() : undefined,
  });

  const [updateStaticPage] = useUpdateStaticPageMutation();
  const [deleteStaticPage, { isLoading: isDeleting }] =
    useDeleteStaticPageMutation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] =
    useState<StaticContentFormData | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<StaticPageRecord | null>(
    null
  );

  const pages: StaticPageRecord[] = rawPages.map((item: StaticPageItem) => {
    return {
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: `URL: /${item.slug}`,
      content: item.content,
      status: item.status?.toUpperCase() === "LIVE" ? "Live" : "Draft",
      updateBy: "Admin",
    };
  });

  const handleUpdatePage = async (data: StaticContentFormData) => {
    if (!data.id) return;
    try {
      const payloadStatus =
        data.status.toLowerCase() === "live" ? "LIVE" : "DRAFT";

      await updateStaticPage({
        pageId: data.id,
        title: data.title,
        content: data.content,
        status: payloadStatus,
      }).unwrap();

      setIsEditModalOpen(false);
      setSelectedPage(null);
    } catch {
      // Handled by mutation
    }
  };

  const handleConfirmDelete = async () => {
    if (pageToDelete) {
      try {
        await deleteStaticPage(pageToDelete.id).unwrap();
        setPageToDelete(null);
        setIsDeleteModalOpen(false);
      } catch {
        setIsDeleteModalOpen(false);
      }
    }
  };

  const columns: Column<StaticPageRecord>[] = [
    {
      key: "title",
      header: "Page Title",
      className: "w-64 min-w-[220px]",
      cell: (item) => (
        <span className="text-[#103D5C] text-sm font-medium leading-[22.4px]">
          {item.title}
        </span>
      ),
    },
    {
      key: "description",
      header: "Slug / Route",
      className: "min-w-[200px]",
      cell: (item) => (
        <span className="text-[#475569] text-xs font-mono leading-[19.2px]">
          {item.description}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[100px]",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "updateBy",
      header: "Updated By",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="text-xs font-medium text-slate-600">
          {item.updateBy}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "w-24 min-w-[96px] text-center",
      cell: (item) => (
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() => {
              setSelectedPage({
                id: item.id,
                title: item.title,
                content: item.content,
                status: item.status,
              });
              setIsPreviewModalOpen(true);
            }}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
            aria-label="Preview page"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedPage({
                id: item.id,
                title: item.title,
                content: item.content,
                status: item.status,
              });
              setIsEditModalOpen(true);
            }}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
            aria-label="Edit page"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => {
              setPageToDelete(item);
              setIsDeleteModalOpen(true);
            }}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            aria-label="Delete page"
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        searchQuery={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        dropdownFilters={[
          {
            placeholder: "All Status",
            value: statusFilter,
            options: [
              { label: "All Status", value: "" },
              { label: "Live", value: "live" },
              { label: "Draft", value: "draft" },
            ],
            onChange: (val) => setStatusFilter(val),
          },
        ]}
        onSortClick={() => {}}
      />

      <div className="border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#0f3453]" />
          </div>
        ) : pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <p className="text-base font-semibold text-slate-700">
              No static pages found
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Add your terms, privacy policy, or legal guidelines.
            </p>
          </div>
        ) : (
          <DataTable columns={columns} data={pages} pagination={true} />
        )}
      </div>

      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isEditModalOpen}
        onOpenChange={() => {
          setIsEditModalOpen(false);
          setSelectedPage(null);
        }}
      >
        <EditStaticContent
          initialData={selectedPage}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedPage(null);
          }}
          onSubmit={handleUpdatePage}
        />
      </CustomModal>

      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isPreviewModalOpen}
        onOpenChange={() => {
          setIsPreviewModalOpen(false);
          setSelectedPage(null);
        }}
      >
        <PreviewStaticContent
          title={selectedPage?.title}
          content={selectedPage?.content}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedPage(null);
          }}
        />
      </CustomModal>

      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(false)}
      >
        <DeleteAnnouncement
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </CustomModal>
    </div>
  );
}

export default StaticPagesTab;
