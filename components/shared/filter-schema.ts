export type FilterOption = {
  label: string;
  value: string;
};

export type FilterFieldType = "checkbox" | "radio" | "chips";

export type FilterField = {
  id: string;
  label: string;
  type: FilterFieldType;
  options: FilterOption[];
  /** Exclusive "All" value. Checking it clears the rest. */
  allValue?: string;
  defaultValue?: string | string[];
};

export type FilterValues = Record<string, string | string[]>;

export const DATE_RANGE_OPTIONS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
];

export const dateRangeField: FilterField = {
  id: "dateRange",
  label: "Date Range",
  type: "radio",
  options: DATE_RANGE_OPTIONS,
  defaultValue: "all",
};

export function getDefaultFilterValues(schema: FilterField[]): FilterValues {
  return Object.fromEntries(
    schema.map((field) => [field.id, getFieldDefault(field)]),
  );
}

export function getFieldDefault(field: FilterField): string | string[] {
  if (field.defaultValue !== undefined) return field.defaultValue;

  if (field.type === "radio") {
    return field.allValue ?? field.options[0]?.value ?? "";
  }

  if (field.allValue) return [field.allValue];
  if (field.options.some((option) => option.value === "all")) return ["all"];
  return [];
}

export function getMultiValue(values: FilterValues, id: string): string[] {
  const value = values[id];
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

export function getSingleValue(values: FilterValues, id: string): string {
  const value = values[id];
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function toggleMultiValue(
  current: string[],
  next: string,
  allValue?: string,
): string[] {
  if (allValue && next === allValue) return [allValue];

  const withoutAll = allValue
    ? current.filter((item) => item !== allValue)
    : current;
  const selected = withoutAll.includes(next)
    ? withoutAll.filter((item) => item !== next)
    : [...withoutAll, next];

  if (selected.length === 0 && allValue) return [allValue];
  return selected;
}
