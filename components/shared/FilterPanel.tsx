"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getDefaultFilterValues,
  getMultiValue,
  getSingleValue,
  toggleMultiValue,
  type FilterField,
  type FilterValues,
} from "./filter-schema";
import { defaultFilterSchema } from "./filter-presets";

export interface FilterPanelProps {
  open?: boolean;
  schema?: FilterField[];
  value?: FilterValues;
  onApply: (value: FilterValues) => void;
  onCancel: () => void;
}

function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition-colors",
          checked
            ? "border-[#e9b83f] bg-[#e9b83f]"
            : "border-[#d3dbe3] bg-white",
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </span>
      <span className="text-sm font-normal text-[#123e5e]">{label}</span>
    </label>
  );
}

function RadioOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors",
          checked
            ? "border-[#e9b83f] bg-[#e9b83f]"
            : "border-[#d3dbe3] bg-white",
        )}
      />
      <span className="text-sm font-normal text-[#123e5e]">{label}</span>
    </label>
  );
}

function ChipOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "rounded-lg border border-[#0a3558] px-2.5 py-1 text-xs font-medium transition-colors",
        checked ? "bg-[#0a3558] text-white" : "bg-white text-[#0a3558]",
      )}
    >
      {label}
    </button>
  );
}

function FilterFieldGroup({
  field,
  values,
  onChange,
}: {
  field: FilterField;
  values: FilterValues;
  onChange: (id: string, value: string | string[]) => void;
}) {
  const selected = getMultiValue(values, field.id);
  const selectedSingle = getSingleValue(values, field.id);

  return (
    <div className="space-y-2.5">
      <p className="text-sm font-semibold text-[#123e5e]">{field.label}</p>

      {field.type === "chips" ? (
        <div className="flex flex-wrap gap-2">
          {field.options.map((option) => (
            <ChipOption
              key={option.value}
              label={option.label}
              checked={selected.includes(option.value)}
              onChange={() =>
                onChange(
                  field.id,
                  toggleMultiValue(selected, option.value, field.allValue),
                )
              }
            />
          ))}
        </div>
      ) : field.type === "radio" ? (
        <div className="space-y-2">
          {field.options.map((option) => (
            <RadioOption
              key={option.value}
              label={option.label}
              checked={selectedSingle === option.value}
              onChange={() => onChange(field.id, option.value)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {field.options.map((option) => (
            <CheckOption
              key={option.value}
              label={option.label}
              checked={selected.includes(option.value)}
              onChange={() =>
                onChange(
                  field.id,
                  toggleMultiValue(selected, option.value, field.allValue),
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterPanel({
  open = true,
  schema = defaultFilterSchema,
  value,
  onApply,
  onCancel,
}: FilterPanelProps) {
  const defaults = useMemo(() => getDefaultFilterValues(schema), [schema]);
  const [draftFilter, setDraftFilter] = useState<FilterValues>(
    value ?? defaults,
  );

  useEffect(() => {
    if (open) {
      setDraftFilter(value ?? defaults);
    }
  }, [open, value, defaults]);

  const updateField = (id: string, next: string | string[]) => {
    setDraftFilter((prev) => ({ ...prev, [id]: next }));
  };

  return (
    <div className="flex w-[292px] flex-col rounded-2xl border border-[#e4ebf1] bg-white font-['Manrope'] shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5">
        <h3 className="text-base font-semibold text-[#123e5e]">Filters</h3>
        <button
          type="button"
          onClick={() => setDraftFilter(defaults)}
          className="text-sm font-medium text-[#e9b83f] transition-colors hover:text-[#d4a52e]"
        >
          Reset
        </button>
      </div>

      {/* Checkboxes, Radios, and Chips Area */}
      <div className="mt-4 max-h-[60vh] space-y-5 overflow-y-auto px-5">
        {schema.map((field) => (
          <FilterFieldGroup
            key={field.id}
            field={field}
            values={draftFilter}
            onChange={updateField}
          />
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex items-center gap-3 px-5 pb-5">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 flex-1 rounded-full border border-[#e4ebf1] bg-white text-sm font-medium text-[#123e5e] transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onApply(draftFilter)}
          className="h-10 flex-1 rounded-full bg-[#0a3558] text-sm font-medium text-white transition-colors hover:bg-[#07253e]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;