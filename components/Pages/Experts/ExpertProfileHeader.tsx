"use client";

import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import CustomButton from "../../shared/CustomButton";

export interface ExpertProfileHeaderProps {
    expert?: {
        id: string;
        name: string;
        avatar: string;
        status: "Active" | "Busy" | "Inactive";
        verificationLevel: string;
        phone: string;
        email: string;
        location: string;
        joinedDate: string;
        verificationProgress: {
            currentStep: number; // 1 to 4
            totalSteps: number;
            label: string;
        };
        subscription: {
            plan: string;
            startedOn: string;
            nextRenewal: string;
        };
    };
    onManageVerification?: () => void;
    onSuspendAccount?: () => void;
}

const DEFAULT_EXPERT = {
    id: "#E123",
    name: "Daniel Green",
    avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    status: "Active" as const,
    verificationLevel: "Level 1 Verified",
    phone: "999-(1234)-546",
    email: "danielgreen@gmail.com",
    location: "Mikocheni, Dar es Salaam",
    joinedDate: "21 Jul, 2026",
    verificationProgress: {
        currentStep: 3,
        totalSteps: 4,
        label: "Level 3 - Face ID Verified",
    },
    subscription: {
        plan: "Premium",
        startedOn: "Jul 27, 2026",
        nextRenewal: "Aug 27, 2026",
    },
};

export function ExpertProfileHeader({
    expert = DEFAULT_EXPERT,
    onManageVerification,
    onSuspendAccount,
}: ExpertProfileHeaderProps) {
    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                {/* Main Info Section */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    {/* Avatar */}
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-amber-400">
                        <Image
                            src={expert.avatar}
                            alt={expert.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-4 font-['Manrope']">
                        {/* Header / Badges */}
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-xl font-semibold text-[#103D5C]">
                                    {expert.name}
                                </h1>

                                {/* Status Badge */}
                                <span className="inline-flex h-5 items-center gap-1 rounded bg-sky-50 px-2 text-xs font-medium text-sky-600 outline outline-1 outline-offset-[-1px] outline-sky-200">
                                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                                    {expert.status}
                                </span>

                                {/* Verification Badge */}
                                <span className="inline-flex h-5 items-center rounded bg-emerald-50 px-2 text-xs font-medium text-emerald-700 outline outline-1 outline-offset-[-1px] outline-emerald-200">
                                    {expert.verificationLevel}
                                </span>
                            </div>

                            <span className="text-sm text-slate-500">
                                Expert ID {expert.id}
                            </span>
                        </div>

                        {/* Contact & Meta Info Grid */}
                        <div className="flex flex-col gap-2.5 text-sm text-slate-600">
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 min-w-[180px]">
                                    <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                                    <span>{expert.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                                    <span>{expert.email}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 min-w-[180px]">
                                    <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
                                    <span>{expert.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-amber-500 shrink-0" />
                                    <span>{expert.joinedDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Verification Progress Bar */}
                        <div className="flex items-center gap-3 pt-1">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <div className="flex w-44 items-center gap-1">
                                {Array.from({ length: expert.verificationProgress.totalSteps }).map(
                                    (_, idx) => {
                                        const isCompleted =
                                            idx < expert.verificationProgress.currentStep;
                                        return (
                                            <div
                                                key={idx}
                                                className={`h-1 flex-1 rounded-full ${isCompleted ? "bg-emerald-600" : "bg-[#103D5C]"
                                                    }`}
                                            />
                                        );
                                    }
                                )}
                            </div>
                            <span className="text-xs text-emerald-600">
                                {expert.verificationProgress.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Top Right Action Buttons */}
                <div className="flex items-center gap-3 self-start">

                    <CustomButton
                        onClick={onManageVerification}
                        className="h-10 rounded-lg bg-[#103D5C] px-4 py-2 font-['Manrope'] text-sm font-medium text-white transition-colors hover:bg-[#0c2f47]"
                    >
                        <span>Manage Verification</span>
                    </CustomButton>

                    <CustomButton
                        variant="tertiary"
                        onClick={onManageVerification}
                        className="h-10 border border-rose-500 text-rose-500"
                    >

                        <span>Suspend Account</span>
                    </CustomButton>


                </div>
            </div>

            {/* Bottom Subscription Info Bar */}
            <div className="mt-6 border-t border-slate-100 pt-4 font-['Manrope'] text-sm text-slate-600">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-1.5">
                        <span>Current Plan:</span>
                        <span className="font-semibold text-slate-900">
                            {expert.subscription.plan}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span>Started On:</span>
                        <span className="font-semibold text-slate-900">
                            {expert.subscription.startedOn}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span>Next Renewal:</span>
                        <span className="font-semibold text-slate-900">
                            {expert.subscription.nextRenewal}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpertProfileHeader;