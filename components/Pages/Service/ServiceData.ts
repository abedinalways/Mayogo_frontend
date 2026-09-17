// Service data types and sample data

export interface ServiceRecord {
  id: string;
  image: string;
  name: string;
  category: string;
  commission: string;
  totalJobs: number;
  createdBy: string;
  status: boolean; // true = Active, false = Inactive
}

export const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "" },
  { label: "Home Services", value: "Home Services" },
  { label: "Repair & Diagnostic", value: "Repair & Diagnostic" },
  { label: "Installation", value: "Installation" },
  { label: "Education & Tutoring", value: "Education & Tutoring" },
  { label: "Care Services", value: "Care Services" },
  { label: "Construction & Property", value: "Construction & Property" },
  { label: "Remote Development", value: "Remote Development" },
];

export const CATEGORY_TEMPLATE_FIELDS: Record<string, string[]> = {
  "Home Services": [
    "Job Details",
    "Job Descriptions",
    "Property Size",
    "Frequency",
    "Special Instructions",
    "Upload Images",
  ],
  "Repair & Diagnostic": [
    "Job Details",
    "Job Descriptions",
    "Property Type",
    "Number of Items",
    "Model/Brand Name",
    "Existing Setup Available",
    "Upload Images",
  ],
  Installation: [
    "Job Details",
    "Job Descriptions",
    "Frequency",
    "Upload Images",
  ],
  "Education & Tutoring": [
    "Job Details",
    "Job Descriptions",
    "Subjects",
    "Student's Current Grade",
    "Service Type",
    "Frequency",
    "Special Instructions",
    "Upload Images",
  ],
  "Care Services": [
    "Job Details",
    "Job Descriptions",
    "Duration",
    "Responsibilities",
    "Special Instructions",
    "Upload Images",
  ],
  "Construction & Property": [
    "Job Details",
    "Job Descriptions",
    "Property Size",
    "Material Provided By",
    "Upload Images",
  ],
  "Remote Development": [
    "Job Details",
    "Job Descriptions",
    "Property Size",
    "Frequency",
    "Special Instructions",
    "Upload Images",
  ],
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Home Services": "For general household and home maintenance services.",
  "Repair & Diagnostic": "For repair and diagnostic services.",
  Installation: "For installation and setup services.",
  "Education & Tutoring":
    "For educational and tutoring services across subjects.",
  "Care Services": "For elderly care, childcare and caregiving services.",
  "Construction & Property":
    "For construction and property maintenance services.",
  "Remote Development": "For remote software development services.",
};

export const sampleServices: ServiceRecord[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=80&auto=format&fit=crop&q=80",
    name: "House Cleaning",
    category: "Home Services",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: true,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=80&auto=format&fit=crop&q=80",
    name: "Air Conditioner (AC) Repair",
    category: "Repair & Diagnostic",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: true,
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&auto=format&fit=crop&q=80",
    name: "CCTV Installation & Maintenance",
    category: "Installation",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: false,
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=80&auto=format&fit=crop&q=80",
    name: "Language Learning",
    category: "Education & Tutoring",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: true,
  },
  {
    id: "5",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=80&auto=format&fit=crop&q=80",
    name: "Elderly Care",
    category: "Care Services",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: true,
  },
  {
    id: "6",
    image:
      "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=80&auto=format&fit=crop&q=80",
    name: "Carpentry & Furniture Making",
    category: "Construction & Property",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: false,
  },
  {
    id: "7",
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=80&auto=format&fit=crop&q=80",
    name: "Website Development",
    category: "Remote Development",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: true,
  },
  {
    id: "8",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&auto=format&fit=crop&q=80",
    name: "Gardening & Landscaping",
    category: "Home Services",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: true,
  },
  {
    id: "9",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=80&auto=format&fit=crop&q=80",
    name: "Refrigeration Services",
    category: "Repair & Diagnostic",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: true,
  },
  {
    id: "10",
    image:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=80&auto=format&fit=crop&q=80",
    name: "Video Doorbell Installation",
    category: "Installation",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: false,
  },
  {
    id: "11",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=80&auto=format&fit=crop&q=80",
    name: "Ordinary Level (From 1-4)",
    category: "Education & Tutoring",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: true,
  },
  {
    id: "12",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&auto=format&fit=crop&q=80",
    name: "Home Caretaker",
    category: "Care Services",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: true,
  },
  {
    id: "13",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=80&auto=format&fit=crop&q=80",
    name: "Interior Designing",
    category: "Construction & Property",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: false,
  },
  {
    id: "14",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=80&auto=format&fit=crop&q=80",
    name: "Android App Development",
    category: "Remote Development",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: true,
  },
  {
    id: "15",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&auto=format&fit=crop&q=80",
    name: "Carpet Cleaning",
    category: "Home Services",
    commission: "10%",
    totalJobs: 8,
    createdBy: "Admin",
    status: true,
  },
];
