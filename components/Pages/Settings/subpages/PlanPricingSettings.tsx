"use client";

import React, { useState } from "react";
import { Zap, Crown, CheckCircle2, XCircle } from "lucide-react";
import LeftsideTitleSubtitle from "../LeftsideTitleSubtitle";
import EditPlanModal, { PlanData } from "./EditPlanModal";
import {
  useGetPlansQuery,
  useUpdatePlanMutation,
} from "@/lib/redux/api/settingsApi";
import { useToast } from "@/components/shared/Toast/ToastContext";
import { PlanItem } from "@/types/settings.types";

// ─── Initial Fallback Data ───────────────────────────────────────────────────
const INITIAL_PLANS: PlanData[] = [
  {
    id: "free",
    name: "Free",
    monthlyFee: "0",
    subscribers: "124",
    bestFor: "New experts, testing the platform",
    billingCycle: "Monthly",
    features: [
      "Basic profile visibility",
      "Standard response time",
      "Receive standard job requests",
      "In-app messaging",
      "10% commission per job",
    ],
    limitations: [
      "Lower priority in job matching",
      "Standard payout timing",
      "Basic performance insights",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    monthlyFee: "19",
    subscribers: "59",
    bestFor: "Active experts who want more jobs and better margins.",
    billingCycle: "Monthly",
    features: [
      "Priority job matching",
      "High profile visibility",
      "Faster job notifications",
      "Basic performance insights",
      "Full access to standard jobs/urgent jobs",
    ],
    limitations: [],
  },
];

// ─── Plan Card ────────────────────────────────────────────────────────────────
function PlanCard({
  plan,
  onEdit,
}: {
  plan: PlanData;
  onEdit: (plan: PlanData) => void;
}) {
  const isPremium =
    plan.name.toLowerCase().includes("premium") ||
    plan.name.toLowerCase().includes("pro") ||
    plan.id === "premium";
  const Icon = isPremium ? Crown : Zap;

  return (
    <div className="w-full p-4 bg-white rounded-2xl border border-[#E4EBF1] flex flex-col justify-center items-center gap-4 overflow-hidden">
      {/* Header Row */}
      <div className="self-stretch pb-4 border-b border-[#F1F5F9] flex justify-between items-center gap-5">
        <div className="flex-1 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#103D5C]">
            <Icon className="h-5 w-5 fill-[#103D5C] text-[#103D5C]" />
          </div>
          <div className="text-xl font-medium text-[#103D5C] leading-7">
            {plan.name}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onEdit(plan)}
          className="h-10 px-6 py-2.5 bg-[#103D5C] hover:bg-[#0b2841] text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          Edit Plan
        </button>
      </div>

      {/* Fee & Subscribers */}
      <div className="self-stretch pb-4 border-b border-[#F1F5F9] flex flex-col justify-center items-start gap-1.5">
        <div>
          <span className="text-[#475569] text-2xl font-medium leading-7">
            Monthly Fee:
          </span>
          <span className="text-[#103D5C] text-2xl font-medium leading-7">
            {" "}${plan.monthlyFee}
          </span>
        </div>
        <div className="text-[#F59E0B] text-base font-medium leading-5">
          {plan.subscribers} Subscribers
        </div>
        <div className="text-[#475569] text-sm font-normal leading-4">
          Best for: {plan.bestFor}
        </div>
      </div>

      {/* Included Features */}
      {plan.features.length > 0 && (
        <div
          className={`self-stretch flex flex-col justify-start items-start gap-3 ${
            plan.limitations.length > 0 ? "pb-4 border-b border-[#F1F5F9]" : ""
          }`}
        >
          <div className="text-[#103D5C] text-base font-medium leading-4">
            Included:
          </div>
          <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 gap-2">
            {plan.features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm font-medium text-[#475569]"
              >
                <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Limitations */}
      {plan.limitations.length > 0 && (
        <div className="self-stretch flex flex-col justify-start items-start gap-3">
          <div className="text-[#103D5C] text-base font-medium leading-4">
            Limitations:
          </div>
          <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 gap-2">
            {plan.limitations.map((l, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm font-medium text-[#475569]"
              >
                <XCircle className="h-4 w-4 text-slate-300 shrink-0" />
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Plan Card Skeleton ───────────────────────────────────────────────────────
function PlanCardSkeleton() {
  return (
    <div className="w-full p-4 bg-white rounded-2xl border border-[#E4EBF1] flex flex-col justify-center items-center gap-4 animate-pulse">
      <div className="self-stretch pb-4 border-b border-[#F1F5F9] flex justify-between items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200" />
          <div className="h-6 w-24 rounded bg-slate-200" />
        </div>
        <div className="h-10 w-24 rounded-lg bg-slate-100" />
      </div>
      <div className="self-stretch pb-4 border-b border-[#F1F5F9] flex flex-col gap-2">
        <div className="h-7 w-36 rounded bg-slate-200" />
        <div className="h-4 w-28 rounded bg-slate-100" />
        <div className="h-3.5 w-64 rounded bg-slate-100" />
      </div>
      <div className="self-stretch flex flex-col gap-2 pt-2">
        <div className="h-4 w-20 rounded bg-slate-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="h-4 w-44 rounded bg-slate-100" />
          <div className="h-4 w-40 rounded bg-slate-100" />
          <div className="h-4 w-48 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function PlanPricingSettings() {
  const { data: plansData, isLoading } = useGetPlansQuery();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();
  const { success, error } = useToast();

  const [editingPlan, setEditingPlan] = useState<PlanData | null>(null);

  const displayPlans: PlanData[] = React.useMemo(() => {
    if (Array.isArray(plansData) && plansData.length > 0) {
      return plansData.map((item: PlanItem) => {
        const subs =
          item.subscribersCount ??
          item.subscriberCount ??
          item.subscribers ??
          item._count?.subscriptions ??
          item._count?.subscribers ??
          "0";

        const cycle =
          item.interval === "YEARLY"
            ? "Yearly"
            : item.interval === "QUARTERLY"
            ? "Quarterly"
            : "Monthly";

        return {
          id: item.id,
          name: item.name || "Plan",
          monthlyFee: String(item.price ?? 0),
          subscribers: String(subs),
          bestFor:
            item.description ||
            item.badgeText ||
            "Active experts on the platform",
          billingCycle: cycle,
          features: Array.isArray(item.includedFeatures)
            ? item.includedFeatures
            : [],
          limitations: Array.isArray(item.limitations) ? item.limitations : [],
          status: item.status,
          isPopular: item.isPopular,
        };
      });
    }
    return INITIAL_PLANS;
  }, [plansData]);

  const handleSavePlan = async (updated: PlanData) => {
    const isBackendPlan =
      Array.isArray(plansData) &&
      plansData.some((p: PlanItem) => p.id === updated.id);

    try {
      if (isBackendPlan) {
        await updatePlan({
          id: updated.id,
          name: updated.name.trim(),
          description: updated.bestFor.trim(),
          price: parseFloat(updated.monthlyFee) || 0,
          interval:
            updated.billingCycle?.toUpperCase() === "YEARLY"
              ? "YEARLY"
              : "MONTHLY",
          includedFeatures: updated.features,
          limitations: updated.limitations,
        }).unwrap();
      } else {
        // If updating a fallback plan or demo plan, also attempt update by id or name
        await updatePlan({
          id: updated.id,
          name: updated.name.trim(),
          description: updated.bestFor.trim(),
          price: parseFloat(updated.monthlyFee) || 0,
          interval:
            updated.billingCycle?.toUpperCase() === "YEARLY"
              ? "YEARLY"
              : "MONTHLY",
          includedFeatures: updated.features,
          limitations: updated.limitations,
        }).unwrap();
      }

      success("Subscription plan updated successfully");
      setEditingPlan(null);
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Failed to update plan";
      error(msg);
    }
  };

  return (
    <div className="w-full p-5 flex flex-col lg:flex-row justify-between items-start gap-12 font-['Manrope']">
      {/* Left Column */}
      <LeftsideTitleSubtitle
        title="Plan & Pricing"
        subtitle="Manage your subscription plans."
        subtitleWidth="max-w-[280px]"
      />

      {/* Right Column */}
      <div className="w-full lg:w-[840px] flex flex-col justify-center items-center gap-5">
        {isLoading && !plansData ? (
          <>
            <PlanCardSkeleton />
            <PlanCardSkeleton />
          </>
        ) : (
          displayPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onEdit={setEditingPlan} />
          ))
        )}
      </div>

      {/* Edit Plan Modal */}
      <EditPlanModal
        open={editingPlan !== null}
        onClose={() => setEditingPlan(null)}
        plan={editingPlan}
        onSave={handleSavePlan}
        isSaving={isUpdating}
      />
    </div>
  );
}

export default PlanPricingSettings;
