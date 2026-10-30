export type ProjectType = "web design" | "app" | "SEO" | "video" | "consulting" | "other";
export type FontChoice = "Inter" | "Georgia" | "Arial" | "Trebuchet MS";

export type BrandSettings = {
  businessName: string;
  tagline: string;
  brandColour: string;
  font: FontChoice;
  logoDataUrl?: string;
  showProductiveFooter: boolean;
};

export type ProposalForm = {
  clientName: string;
  clientCompany: string;
  projectTitle: string;
  projectType: ProjectType;
  scope: string;
  timeline: string;
  budget: string;
  paymentTerms: string;
};

export type ProposalSections = {
  summary: string;
  scopeOfWork: string;
  deliverables: string;
  timeline: string;
  pricing: string;
  terms: string;
  nextSteps: string;
};

export type SavedClient = {
  id: string;
  name: string;
  company: string;
  email?: string;
  gstin?: string;
};

export type InvoiceLine = {
  id: string;
  description: string;
  hsnSac: string;
  quantity: number;
  rate: number;
  gstRate: 0 | 5 | 12 | 18 | 28;
};

export type SavedItem = Omit<InvoiceLine, "id"> & { id: string };

export type InvoiceDetails = {
  invoiceNumber: string;
  date: string;
  sellerName: string;
  sellerAddress: string;
  sellerGstin: string;
  sellerState: string;
  buyerName: string;
  buyerAddress: string;
  buyerGstin: string;
  buyerState: string;
  placeOfSupply: string;
  bankDetails: string;
  upiDetails: string;
  notes: string;
  lines: InvoiceLine[];
};

export const defaultBrand: BrandSettings = {
  businessName: "Your business name",
  tagline: "Clear work. Clear terms.",
  brandColour: "#176b66",
  font: "Inter",
  showProductiveFooter: true,
};

export const defaultProposal: ProposalForm = {
  clientName: "Priya Sharma",
  clientCompany: "Mango Leaf Foods",
  projectTitle: "A conversion-focused website refresh",
  projectType: "web design",
  scope: "A faster, warmer website with a clear menu, online enquiry flow and mobile-first experience.",
  timeline: "6 weeks",
  budget: "125000",
  paymentTerms: "50% to start, 30% after design approval, 20% on launch.",
};

export const defaultInvoice: InvoiceDetails = {
  invoiceNumber: "PKI-2026-001",
  date: "26-10-2026",
  sellerName: "Rohit Verma Studio",
  sellerAddress: "14, Indiranagar, Bengaluru, Karnataka 560038",
  sellerGstin: "29ABCDE1234F1Z5",
  sellerState: "Karnataka",
  buyerName: "Aarav Mehta",
  buyerAddress: "22, Koregaon Park, Pune, Maharashtra 411001",
  buyerGstin: "27AAECA1234F1Z2",
  buyerState: "Maharashtra",
  placeOfSupply: "Maharashtra",
  bankDetails: "HDFC Bank · A/C ending 2468 · IFSC HDFC0001234",
  upiDetails: "rohitverma@upi",
  notes: "Thank you for partnering with us.",
  lines: [
    { id: "line-1", description: "Website strategy and design sprint", hsnSac: "998314", quantity: 1, rate: 85000, gstRate: 18 },
    { id: "line-2", description: "Launch support", hsnSac: "998313", quantity: 1, rate: 25000, gstRate: 18 },
  ],
};
