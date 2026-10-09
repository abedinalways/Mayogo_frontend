"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Column, DataTable } from "../../shared/DataTable";
import TableToolbar from "../../shared/TableToolbar";
import CustomButton from "@/components/shared/CustomButton";
import CustomModal from "@/components/shared/CustomModal";
import { UserForm, UserFormData } from "./UserForm";
import { DeleteUser } from "./DeleteUser";
import EditIcon from "@/components/Icons/EditIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";
import {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useGetRolesQuery,
} from "@/lib/redux/api/adminApi";
import { AdminUserItem } from "@/types/admin.types";

export interface UserRecord {
  id: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  phone: string;
  role: string;
  roleId?: string;
  lastActivity: string;
  createdDate: string;
  status: string;
  isActive: boolean;
  rawItem: AdminUserItem;
}

const StatusBadge = ({ status }: { status: string }) => {
  const config =
    status === "Active"
      ? {
          bg: "bg-sky-50",
          border: "outline-sky-200",
          text: "text-sky-600",
          dot: "bg-sky-500",
        }
      : {
          bg: "bg-slate-50",
          border: "outline-slate-200",
          text: "text-slate-600",
          dot: "bg-slate-400",
        };

  return (
    <div
      className={`inline-flex h-5 items-center gap-1 rounded-sm px-2 py-0.5 outline outline-1 outline-offset-[-1px] ${config.bg} ${config.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span
        className={`font-['Manrope'] text-xs font-medium leading-4 ${config.text}`}
      >
        {status}
      </span>
    </div>
  );
};

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return "Recently";
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } catch {
    return "Recently";
  }
}

export function FullUsersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: roles = [] } = useGetRolesQuery();

  const isActiveParam =
    statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined;

  const {
    data: adminsResponse,
    isLoading,
    isFetching,
  } = useGetAdminsQuery({
    search: searchTerm || undefined,
    isActive: isActiveParam,
    roleId: roleFilter || undefined,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);

  const rawAdmins: AdminUserItem[] =
    adminsResponse?.admins ||
    adminsResponse?.data ||
    adminsResponse?.items ||
    [];

  const users: UserRecord[] = rawAdmins.map((item) => {
    const roleName =
      typeof item.role === "object"
        ? item.role?.name
        : item.role || item.roleName || (item.isSuperAdmin ? "Super Admin" : "Admin");

    const roleId =
      typeof item.role === "object" ? item.role?.id : item.roleId;

    return {
      id: item.id,
      user: {
        name: item.fullName || item.name || "Admin User",
        email: item.email,
        avatar: item.avatar || item.avatarUrl || "https://placehold.co/28x28",
      },
      phone: item.phone || "N/A",
      role: roleName,
      roleId,
      lastActivity: formatRelativeTime(item.lastActivityAt || item.lastLoginAt),
      createdDate: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
      status: item.isActive ? "Active" : "Inactive",
      isActive: item.isActive,
      rawItem: item,
    };
  });

  const total = adminsResponse?.total ?? users.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleOpenAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: UserRecord) => {
    setSelectedUser({
      id: item.id,
      name: item.user.name,
      email: item.user.email,
      phone: item.phone === "N/A" ? "" : item.phone,
      roleId: item.roleId || "",
      roleName: item.role,
      status: item.isActive,
      avatar: item.user.avatar,
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (item: UserRecord) => {
    setUserToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteAdmin(userToDelete.id).unwrap();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch {
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveUser = async (formData: UserFormData) => {
    try {
      const fd = new FormData();
      fd.append("fullName", formData.name);
      fd.append("email", formData.email);
      if (formData.phone) fd.append("phone", formData.phone);
      if (formData.roleId) fd.append("roleId", formData.roleId);
      if (formData.password) fd.append("password", formData.password);
      fd.append("isActive", String(formData.status));
      if (formData.avatarFile) {
        fd.append("avatar", formData.avatarFile);
      }

      if (formData.id) {
        await updateAdmin({ id: formData.id, formData: fd }).unwrap();
      } else {
        await createAdmin(fd).unwrap();
      }
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch {
      // Error handled by mutation
    }
  };

  const columns: Column<UserRecord>[] = [
    {
      key: "user",
      header: "User Name",
      className: "w-64 min-w-[256px]",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <img
            src={item.user.avatar}
            alt={item.user.name}
            className="h-7 w-7 rounded-full border border-slate-200 object-cover shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/28x28";
            }}
          />
          <div className="flex flex-col justify-center">
            <span className="text-xs font-medium leading-4 text-[#103D5C]">
              {item.user.name}
            </span>
            <span className="text-[10px] font-medium leading-[10px] text-slate-400">
              {item.user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone Number",
      className: "w-48 min-w-[192px]",
      cell: (item) => (
        <span className="text-xs font-medium text-slate-600">
          {item.phone}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="text-xs font-medium text-slate-600">
          {item.role}
        </span>
      ),
    },
    {
      key: "lastActivity",
      header: "Last Activity",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="text-xs font-medium text-slate-600">
          {item.lastActivity}
        </span>
      ),
    },
    {
      key: "createdDate",
      header: "Created Date",
      className: "min-w-[140px]",
      cell: (item) => (
        <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
          {item.createdDate}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "min-w-[120px]",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "action",
      header: "Action",
      className: "w-24 min-w-[96px] text-center",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(item)}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
            aria-label="Edit user"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => handleOpenDelete(item)}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            aria-label="Delete user"
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full font-['Manrope']">
      <TableToolbar
        searchQuery={searchTerm}
        onSearchChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1);
        }}
        dropdownFilters={[
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
          ...(roles.length > 0
            ? [
                {
                  placeholder: "All Roles",
                  value: roleFilter,
                  options: [
                    { label: "All Roles", value: "" },
                    ...roles.map((r) => ({ label: r.name, value: r.id })),
                  ],
                  onChange: (val: string) => {
                    setRoleFilter(val);
                    setPage(1);
                  },
                },
              ]
            : []),
        ]}
        onSortClick={() => {}}
        actionButton={
          <CustomButton
            onClick={handleOpenAdd}
            size="md"
            leadingIcon={<PlusIcon />}
          >
            Add New User
          </CustomButton>
        }
      />

      <div className="border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#0f3453]" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <p className="text-base font-semibold text-slate-700">No admins found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            pagination={true}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
      >
        <UserForm
          initialData={selectedUser}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleSaveUser}
          isSubmitting={isCreating || isUpdating}
        />
      </CustomModal>

      <CustomModal
        showCloseButton={false}
        size="xsm"
        open={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(false)}
      >
        <DeleteUser
          userName={userToDelete?.user.name}
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </CustomModal>
    </div>
  );
}

export default FullUsersTable;

const PlusIcon = () => {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 0.5C5 0.223858 4.77614 0 4.5 0C4.22386 0 4 0.223858 4 0.5V4H0.5C0.223857 4 0 4.22386 0 4.5C0 4.77614 0.223857 5 0.5 5H4V8.5C4 8.77614 4.22386 9 4.5 9C4.77614 9 5 8.77614 5 8.5V5H8.5C8.77614 5 9 4.77614 9 4.5C9 4.22386 8.77614 4 8.5 4H5V0.5Z"
        fill="white"
      />
    </svg>
  );
};