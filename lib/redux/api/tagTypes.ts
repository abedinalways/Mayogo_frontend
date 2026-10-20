
export const TAG_TYPES = [
  "Auth",
  "Admin",
  "Expert",
  "Client",
  "Job",
  "Dispute",
  "Category",
  "Service",
  "Content",
  "Verification",
  "Role",
  "Support",
  "Analytics",
] as const;

export type TagType = (typeof TAG_TYPES)[number];
