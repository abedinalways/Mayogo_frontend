"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import CustomModal from "@/components/shared/CustomModal";
import { CustomInput } from "@/components/shared/CustomInput";
import CustomSelect from "@/components/shared/CustomSelect";
import { cn } from "@/lib/utils";

export interface PlanData {
  id: string;
  name: string;
  monthlyFee: string;
  subscribers: string;
  bestFor: string;
  billingCycle?: string;
  features: string[];
  limitations: string[];
  status?: string;
  isPopular?: boolean;
}

export interface EditPlanModalProps {
  open: boolean;
  onClose: () => void;
  plan: PlanData | null;
  onSave: (updated: PlanData) => Promise<void> | void;
  isSaving?: boolean;
}

export function EditPlanModal({
  open,
  onClose,
  plan,
  onSave,
  isSaving = false,
}: EditPlanModalProps) {
  const [draft, setDraft] = useState<PlanData | null>(plan);
  const [newFeature, setNewFeature] = useState("");
  const [newLimitation, setNewLimitation] = useState("");

  React.useEffect(() => {
    setDraft(
      plan ? { ...plan, billingCycle: plan.billingCycle || "Monthly" } : null
    );
    setNewFeature("");
    setNewLimitation("");
  }, [plan]);

  if (!draft) return null;

  const updateField = <K extends keyof PlanData>(key: K, value: PlanData[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleAddFeature = () => {
    const trimmed = newFeature.trim();
    if (!trimmed) return;
    setDraft((prev) =>
      prev ? { ...prev, features: [...prev.features, trimmed] } : prev
    );
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    setDraft((prev) =>
      prev
        ? { ...prev, features: prev.features.filter((_, i) => i !== index) }
        : prev
    );
  };

  const handleAddLimitation = () => {
    const trimmed = newLimitation.trim();
    if (!trimmed) return;
    setDraft((prev) =>
      prev ? { ...prev, limitations: [...prev.limitations, trimmed] } : prev
    );
    setNewLimitation("");
  };

  const handleRemoveLimitation = (index: number) => {
    setDraft((prev) =>
      prev
        ? { ...prev, limitations: prev.limitations.filter((_, i) => i !== index) }
        : prev
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !draft) return;
    await onSave(draft);
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={(v) => {
        if (!v && !isSaving) onClose();
      }}
      size="sm"
      showCloseButton={false}
    >
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 font-['Manrope']">
        <div>
          <h2 className="text-[color:var(--Deep-Navy-Brand-800,#103D5C)] text-lg font-semibold leading-[100%]">
            Edit Subscription Plan
          </h2>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          {/* Plan Name & Price */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <CustomInput
                label="Plan Name"
                value={draft.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Free"
                isRequired
              />
            </div>
            <div className="flex-1">
              <CustomInput
                label="Price ($)"
                value={draft.monthlyFee}
                onChange={(e) => updateField("monthlyFee", e.target.value)}
                placeholder="0"
                isRequired
              />
            </div>
          </div>

          {/* Billing Cycle */}
          <CustomSelect
            label="Billing Cycle"
            value={draft.billingCycle || "Monthly"}
            onValueChange={(val) => updateField("billingCycle", val)}
            options={[
              { label: "Monthly", value: "Monthly" },
              { label: "Yearly", value: "Yearly" },
            ]}
          />

          {/* Best For / Description */}
          <CustomInput
            label="Description / Best For"
            value={draft.bestFor}
            onChange={(e) => updateField("bestFor", e.target.value)}
            placeholder="e.g. Best for Active experts who want more jobs."
          />

          {/* Features Input & Add Button */}
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <CustomInput
                  label="Features"
                  placeholder="Add feature.."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddFeature}
                disabled={!newFeature.trim()}
                className={cn(
                  "h-10 px-5 rounded-lg font-medium text-sm transition-colors shrink-0 font-['Manrope']",
                  newFeature.trim()
                    ? "bg-[#103D5C] text-white hover:bg-[#0b2841] cursor-pointer"
                    : "bg-[#F1F5F9] text-slate-400 cursor-not-allowed"
                )}
              >
                Add
              </button>
            </div>

            {/* Feature Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {draft.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 bg-[#F1F5F9] rounded-lg flex items-center gap-1.5 text-xs text-[#103D5C] font-medium font-['Manrope']"
                >
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="hover:text-rose-500 text-slate-400 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {draft.features.length === 0 && (
                <p className="text-xs text-slate-400 italic">No features added yet.</p>
              )}
            </div>
          </div>

          {/* Limitations Input & Add Button */}
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <CustomInput
                  label="Limitations"
                  placeholder="Add limitation.."
                  value={newLimitation}
                  onChange={(e) => setNewLimitation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddLimitation();
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddLimitation}
                disabled={!newLimitation.trim()}
                className={cn(
                  "h-10 px-5 rounded-lg font-medium text-sm transition-colors shrink-0 font-['Manrope']",
                  newLimitation.trim()
                    ? "bg-[#103D5C] text-white hover:bg-[#0b2841] cursor-pointer"
                    : "bg-[#F1F5F9] text-slate-400 cursor-not-allowed"
                )}
              >
                Add
              </button>
            </div>

            {/* Limitation Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {draft.limitations.map((lim, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 bg-[#FFF1F2] rounded-lg flex items-center gap-1.5 text-xs text-[#BE123C] font-medium font-['Manrope']"
                >
                  <span>{lim}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLimitation(idx)}
                    className="hover:text-rose-700 text-rose-400 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 py-3 px-6 rounded-lg border border-[#103D5C] text-[#103D5C] font-medium text-sm hover:bg-slate-50 transition-colors cursor-pointer font-['Manrope'] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 py-3 px-6 rounded-lg bg-[#103D5C] text-white font-medium text-sm hover:bg-[#0b2841] transition-colors cursor-pointer font-['Manrope'] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </CustomModal>
  );
}

export default EditPlanModal;
