import type { Metadata } from "next";
import { InvoiceBuilder } from "@/components/InvoiceBuilder";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = { title: "GST invoice generator for Indian freelancers", description: "Create GST-compliant invoices with CGST, SGST, IGST, GSTIN validation and Indian amount formatting.", alternates: { canonical: "https://proposalkit.in/invoice" } };

export default function InvoicePage() {
  const faq = [{ "@type": "Question", name: "Does the invoice calculate CGST and SGST?", acceptedAnswer: { "@type": "Answer", text: "Yes. Matching seller and buyer states split each line's GST equally into CGST and SGST." } }, { "@type": "Question", name: "When does the invoice use IGST?", acceptedAnswer: { "@type": "Answer", text: "Different seller and buyer states use IGST for the total GST amount." } }, { "@type": "Question", name: "Which GST rates are available?", acceptedAnswer: { "@type": "Answer", text: "0%, 5%, 12%, 18% and 28% per line item." } }, { "@type": "Question", name: "Does it validate GSTIN?", acceptedAnswer: { "@type": "Answer", text: "The form checks the standard 15-character GSTIN structure and checksum marker format." } }, { "@type": "Question", name: "Can I add UPI details?", acceptedAnswer: { "@type": "Answer", text: "Yes. Add bank, UPI and notes in the invoice details section." } }, { "@type": "Question", name: "Is my invoice data uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Invoice data remains in your browser and the PDF is generated on your device." } }];
  return <><JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq }} /><JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://proposalkit.in" }, { "@type": "ListItem", position: 2, name: "GST invoice generator", item: "https://proposalkit.in/invoice" }] }} /><InvoiceBuilder /></>;
}
