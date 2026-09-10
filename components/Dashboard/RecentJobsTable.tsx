"use client"
import { ArrowRight } from "lucide-react";
import { Column, DataTable, StatusBadge, StatusType } from "../shared/DataTable";

export interface JobRecord {
    id: string;
    service: {
        name: string;
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
    status: StatusType;
    amount: string;
}

const sampleJobs: JobRecord[] = [
    {
        id: "#J124",
        service: {
            name: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image: "https://placehold.co/28x28",
        },
        client: { name: "Sarah William", avatar: "https://placehold.co/28x28" },
        expert: { name: "Daniel Green", avatar: "https://placehold.co/28x28" },
        status: "Completed",
        amount: "$120",
    },
    {
        id: "#J125",
        service: {
            name: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image: "https://placehold.co/28x28",
        },
        client: { name: "Sarah William", avatar: "https://placehold.co/28x28" },
        expert: { name: "Daniel Green", avatar: "https://placehold.co/28x28" },
        status: "Pending",
        amount: "$120",
    },
    {
        id: "#J126",
        service: {
            name: "Air Conditioner (AC) Repair",
            category: "Repair & Diagnostic",
            image: "https://placehold.co/28x28",
        },
        client: { name: "Sarah William", avatar: "https://placehold.co/28x28" },
        expert: { name: "Daniel Green", avatar: "https://placehold.co/28x28" },
        status: "In Progress",
        amount: "$120",
    },
];

export function RecentJobsTable() {
    const columns: Column<JobRecord>[] = [
        {
            key: "id",
            header: "Job ID",
            className: "w-36 min-w-[120px]",
            cell: (item) => (
                <span className="text-sm font-normal text-[#123e5e]">{item.id}</span>
            ),
        },
        {
            key: "service",
            header: "Service Name",
            className: "w-64 min-w-[220px]",
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <img
                        src={item.service.image}
                        alt={item.service.name}
                        className="h-7 w-7 rounded-sm border border-slate-200 object-cover"
                    />
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-[#123e5e]">
                            {item.service.name}
                        </span>
                        <span className="text-[10px] font-medium text-[#8a9bab]">
                            {item.service.category}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: "client",
            header: "Client",
            className: "min-w-[180px]",
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <img
                        src={item.client.avatar}
                        alt={item.client.name}
                        className="h-7 w-7 rounded-full border border-slate-200 object-cover"
                    />
                    <span className="text-xs font-medium text-[#123e5e]">
                        {item.client.name}
                    </span>
                </div>
            ),
        },
        {
            key: "expert",
            header: "Expert",
            className: "min-w-[180px]",
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <img
                        src={item.expert.avatar}
                        alt={item.expert.name}
                        className="h-7 w-7 rounded-full border border-slate-200 object-cover"
                    />
                    <span className="text-xs font-medium text-[#123e5e]">
                        {item.expert.name}
                    </span>
                </div>
            ),
        },
        {
            key: "status",
            header: "Status",
            className: "w-36 min-w-[130px]",
            cell: (item) => <StatusBadge status={item.status} />,
        },
        {
            key: "amount",
            header: "Amount",
            className: "w-36 min-w-[100px]",
            cell: (item) => (
                <span className="text-sm font-normal text-[#123e5e]">{item.amount}</span>
            ),
        },
    ];

    const title = "Recent Jobs";
    const onViewAll = () => {
        console.log("Navigate to jobs");
    };

    return (
        <div>
            {/* Table Header / Action */}
            <div className="flex items-center justify-between border-t border-x border-[#E8E8E8] p-4 rounded-t-xl bg-white">
                <h2 className="card-title">{title}</h2>
                {onViewAll && (
                    <button
                        type="button"
                        onClick={onViewAll}
                         className="card-button"
                    >
                        <span>View All</span>
                        <ArrowRight className="h-4 w-4 text-[#123e5e]" />
                    </button>
                )}
            </div>

            <DataTable
                columns={columns}
                data={sampleJobs}
                pagination={false}
            />
        </div>
    );
}

export default RecentJobsTable;