import { dateRangeField, type FilterField } from "./filter-schema";

export const jobsFilterSchema: FilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "checkbox",
    allValue: "all",
    options: [
      { label: "All", value: "all" },
      { label: "Pending", value: "pending" },
      { label: "In Progress", value: "in-progress" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
      { label: "Disputed", value: "disputed" },
    ],
  },
  dateRangeField,
];

export const verificationFilterSchema: FilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "checkbox",
    allValue: "all",
    options: [
      { label: "All", value: "all" },
      { label: "Pending", value: "pending" },
      { label: "Approved", value: "approved" },
      { label: "Rejected", value: "rejected" },
      { label: "Resubmission Required", value: "resubmission" },
    ],
  },
  dateRangeField,
];

export const expertsFilterSchema: FilterField[] = [
  {
    id: "status",
    label: "Status",
    type: "checkbox",
    allValue: "all",
    options: [
      { label: "All", value: "all" },
      { label: "Active", value: "active" },
      { label: "Busy", value: "busy" },
      { label: "Inactive", value: "inactive" },
      { label: "Suspended", value: "suspended" },
    ],
  },
  {
    id: "verificationStatus",
    label: "Verification Status",
    type: "checkbox",
    defaultValue: ["verified"],
    options: [
      { label: "Verified", value: "verified" },
      { label: "Pending", value: "pending" },
      { label: "Rejected", value: "rejected" },
    ],
  },
  {
    id: "serviceCategory",
    label: "Service Category",
    type: "chips",
    allValue: "all",
    options: [
      { label: "All", value: "all" },
      { label: "Repair & Diagnostic", value: "repair-diagnostic" },
      { label: "Installation", value: "installation" },
      { label: "Home Services", value: "home-services" },
      { label: "Care Services", value: "care-services" },
      { label: "Construction & Property Maintenance", value: "construction" },
      { label: "Remote Development", value: "remote-development" },
      { label: "Education & Tutoring", value: "education" },
    ],
  },
];

export const transactionsFilterSchema: FilterField[] = [
  dateRangeField,
  {
    id: "status",
    label: "Status",
    type: "checkbox",
    allValue: "all",
    options: [
      { label: "All", value: "all" },
      { label: "Pending", value: "pending" },
      { label: "Completed", value: "completed" },
      { label: "Failed", value: "failed" },
      { label: "Refunded", value: "refunded" },
    ],
  },
  {
    id: "escrowStatus",
    label: "Escrow Status",
    type: "checkbox",
    allValue: "all",
    options: [
      { label: "All", value: "all" },
      { label: "Held", value: "held" },
      { label: "Partially Released", value: "partially-released" },
      { label: "Released", value: "released" },
      { label: "Refunded", value: "refunded" },
    ],
  },
  {
    id: "paymentStructure",
    label: "Payment Structure",
    type: "checkbox",
    allValue: "all",
    options: [
      { label: "All", value: "all" },
      { label: "Single", value: "single" },
      { label: "Milestone", value: "milestone" },
    ],
  },
];

export const defaultFilterSchema = jobsFilterSchema;
