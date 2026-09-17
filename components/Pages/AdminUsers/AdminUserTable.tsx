"use client";

import React, { useState } from "react";
import { Column, DataTable } from "../../shared/DataTable";

import TableToolbar from "../../shared/TableToolbar";
import { Edit2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import CustomButton from "@/components/shared/CustomButton";
import CustomModal from "@/components/shared/CustomModal";
import { UserForm, UserFormData } from "./UserForm";
import { DeleteUser } from "./DeleteUser";
import EditIcon from "@/components/Icons/EditIcon";
import DeleteIcon from "@/components/Icons/DeleteIcon";

export interface UserRecord {
    id: string;
    user: {
        name: string;
        email: string;
        avatar: string;
    };
    phone: string;
    role: string;
    lastActivity: string;
    createdDate: string;
    status: string;
}

const sampleUsers: UserRecord[] = [
    {
        id: "1",
        user: {
            name: "Sarah William",
            email: "sarahwilliam@gmail.com",
            avatar: "https://placehold.co/28x28",
        },
        phone: "999-(1234)-555",
        role: "Super Admin",
        lastActivity: "2 mins ago",
        createdDate: "12 Jul, 2026",
        status: "Active",
    },
    {
        id: "2",
        user: {
            name: "Daniel Green",
            email: "danielgreen@gmail.com",
            avatar: "https://placehold.co/28x28",
        },
        phone: "888-(5678)-444",
        role: "Manager",
        lastActivity: "1 hour ago",
        createdDate: "10 Jun, 2026",
        status: "Active",
    },
    {
        id: "3",
        user: {
            name: "Green Goblin",
            email: "danielgreen@gmail.com",
            avatar: "https://placehold.co/28x28",
        },
        phone: "888-(5678)-444",
        role: "Manager",
        lastActivity: "1 hour ago",
        createdDate: "10 Jun, 2026",
        status: "Inactive",
    },
];

const StatusBadge = ({ status }: { status: string }) => {
    const config = {
        Active: {
            bg: "bg-sky-50",
            border: "outline-sky-200",
            text: "text-sky-600",
            dot: "bg-sky-500",
        },
        Inactive: {
            bg: "bg-slate-50",
            border: "outline-slate-200",
            text: "text-slate-600",
            dot: "bg-slate-400",
        },
        Suspended: {
            bg: "bg-rose-50",
            border: "outline-rose-200",
            text: "text-rose-600",
            dot: "bg-rose-500",
        },
    }[status] ?? {
        bg: "bg-slate-50",
        border: "outline-slate-200",
        text: "text-slate-600",
        dot: "bg-slate-400",
    };

    return (
        <div className={`inline-flex h-5 items-center gap-1 rounded-sm px-2 py-0.5 outline outline-1 outline-offset-[-1px] ${config.bg} ${config.border}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            <span className={`font-['Manrope'] text-xs font-medium leading-4 ${config.text}`}>
                {status}
            </span>
        </div>
    );
};


export function FullUsersTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [users, setUsers] = useState<UserRecord[]>(sampleUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);

    const handleOpenAdd = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: UserRecord) => {
        setSelectedUser({
            id: item.id,
            name: item.user.name,
            email: item.user.email,
            phone: item.phone,
            role: item.role,
            status: item.status === "Active",
            avatar: item.user.avatar,
        });
        setIsModalOpen(true);
    };

    const handleOpenDelete = (item: UserRecord) => {
        setUserToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        }
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleSaveUser = (formData: UserFormData) => {
        if (formData.id) {
            // Edit User logic
        } else {
            // Add User logic
        }
        setIsModalOpen(false);
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
                    >
                        <EditIcon />
                    </button>
                    <button
                        onClick={() => handleOpenDelete(item)}
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                        <DeleteIcon />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full font-['Manrope']">
            {/* Top Toolbar with Search and Dropdown Filters */}
            <TableToolbar
                searchQuery={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}

                dropdownFilters={[
                    {
                        placeholder: "All Status",
                        value: statusFilter,
                        options: [
                            { label: "All Status", value: "" },
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                        ],
                        onChange: (val) => setStatusFilter(val),
                    },
                  
                ]}

                onSortClick={() => { }}

                actionButton={<CustomButton onClick={handleOpenAdd} size="md" leadingIcon={<PlusIcon />}> Add New User</CustomButton>}


            />

            {/* Main Data Table */}
            <div className="border-x border-b border-[#E8E8E8] rounded-b-xl overflow-hidden bg-white">
                <DataTable
                    columns={columns}
                    data={users}
                    pagination={true}
                />
            </div>

            {/* add/edit new user */}
            <CustomModal showCloseButton={false} size="xsm" open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
                <UserForm
                    initialData={selectedUser}
                    onCancel={() => setIsModalOpen(false)}
                    onSubmit={handleSaveUser}
                />
            </CustomModal>

            <CustomModal showCloseButton={false} size="xsm" open={isDeleteModalOpen} onOpenChange={() => setIsDeleteModalOpen(false)}>
                <DeleteUser
                    userName={userToDelete?.user.name}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                />
            </CustomModal>
        </div>
    );
}

export default FullUsersTable;


const PlusIcon = () => {
    return (<><svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5 0.5C5 0.223858 4.77614 0 4.5 0C4.22386 0 4 0.223858 4 0.5V4H0.5C0.223857 4 0 4.22386 0 4.5C0 4.77614 0.223857 5 0.5 5H4V8.5C4 8.77614 4.22386 9 4.5 9C4.77614 9 5 8.77614 5 8.5V5H8.5C8.77614 5 9 4.77614 9 4.5C9 4.22386 8.77614 4 8.5 4H5V0.5Z" fill="white" />
    </svg>
    </>)
}