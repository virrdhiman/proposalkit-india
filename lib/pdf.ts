import { jsPDF } from "jspdf";
import { amountInWords } from "./amountWords";
import { calculateInvoice } from "./gst";
import { sanitizeText, safeNumber } from "./sanitize";
import type { BrandSettings, InvoiceDetails, ProposalForm, ProposalSections } from "./types";

const INK = "#18232d";
const MUTED = "#60707a";

function addBrand(doc: jsPDF, brand: BrandSettings, pageWidth: number) {
  const colour = brand.brandColour || "#176b66";
  doc.setFillColor(colour);
  doc.rect(0, 0, pageWidth, 7, "F");
  if (brand.logoDataUrl) {
    try {
      const format = brand.logoDataUrl.startsWith("data:image/png") ? "PNG" : brand.logoDataUrl.startsWith("data:image/svg") ? "SVG" : "JPEG";
      doc.addImage(brand.logoDataUrl, format, 18, 16, 24, 24);
    } catch {
      // A malformed image should never block PDF creation.
    }
  }
  const left = brand.logoDataUrl ? 49 : 18;
  doc.setFont(brand.font === "Georgia" ? "times" : brand.font === "Arial" ? "helvetica" : "helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(INK);
  doc.text(sanitizeText(brand.businessName || "ProposalKit India", 100), left, 25);
  doc.setFont(brand.font === "Georgia" ? "times" : "helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(sanitizeText(brand.tagline || "Clear work. Clear terms.", 120), left, 32);
}

function addFooter(doc: jsPDF, brand: BrandSettings, pageWidth: number, pageHeight: number) {
  doc.setDrawColor("#dce4e1");
  doc.line(18, pageHeight - 20, pageWidth - 18, pageHeight - 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(MUTED);
  if (brand.showProductiveFooter) doc.text("Made with Productive IT · proposalkit.in", 18, pageHeight - 12);
  doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - 35, pageHeight - 12);
}

function section(doc: jsPDF, title: string, value: string, y: number, width: number, colour: string) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(colour);
  doc.text(sanitizeText(title, 120), 18, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(INK);
  const lines = doc.splitTextToSize(sanitizeText(value || "—"), width - 36);
  doc.text(lines, 18, y + 8);
  return y + 8 + lines.length * 5.2 + 9;
}

export function downloadProposalPdf(form: ProposalForm, sections: ProposalSections, brand: BrandSettings) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  addBrand(doc, brand, pageWidth);
  doc.setFont("helvetica", "bold"); doc.setFontSize(23); doc.setTextColor(INK);
  doc.text(sanitizeText(form.projectTitle || "Project proposal", 100), 18, 54);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(MUTED);
  doc.text(`Prepared for ${sanitizeText(form.clientName)} · ${sanitizeText(form.clientCompany)}`, 18, 62);
  let y = 77;
  const colour = brand.brandColour || "#176b66";
  for (const [title, value] of [
    ["Summary", sections.summary], ["Scope of work", sections.scopeOfWork], ["Deliverables", sections.deliverables], ["Timeline", sections.timeline], ["Pricing", sections.pricing], ["Terms", sections.terms], ["Next steps", sections.nextSteps],
  ] as [string, string][]) {
    if (y > pageHeight - 48) { addFooter(doc, brand, pageWidth, pageHeight); doc.addPage(); addBrand(doc, brand, pageWidth); y = 50; }
    y = section(doc, title, value, y, pageWidth, colour);
  }
  addFooter(doc, brand, pageWidth, pageHeight);
  doc.save(`${sanitizeText(form.projectTitle || "proposal", 40).replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

function currency(value: number) { return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`; }

export function downloadInvoicePdf(invoice: InvoiceDetails, brand: BrandSettings) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const totals = calculateInvoice(invoice);
  addBrand(doc, brand, pageWidth);
  const colour = brand.brandColour || "#176b66";
  doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(INK); doc.text("Tax invoice", 18, 54);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(MUTED); doc.text(`Invoice no. ${sanitizeText(invoice.invoiceNumber)} · Date ${sanitizeText(invoice.date)}`, 18, 62);
  doc.setDrawColor("#dce4e1"); doc.line(18, 69, pageWidth - 18, 69);
  doc.setFontSize(9); doc.setTextColor(MUTED); doc.text("BILLED BY", 18, 78); doc.text("BILLED TO", 110, 78);
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(INK); doc.text(sanitizeText(invoice.sellerName), 18, 85); doc.text(sanitizeText(invoice.buyerName), 110, 85);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(MUTED);
  doc.text(doc.splitTextToSize(sanitizeText(`${invoice.sellerAddress}\nGSTIN: ${invoice.sellerGstin}`), 78), 18, 92);
  doc.text(doc.splitTextToSize(sanitizeText(`${invoice.buyerAddress}\nGSTIN: ${invoice.buyerGstin}`), 78), 110, 92);
  let y = 123;
  const cols = [18, 81, 107, 124, 146, 174];
  doc.setFillColor(colour); doc.rect(18, y - 6, pageWidth - 36, 9, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor("#ffffff");
  ["Description", "HSN/SAC", "Qty", "Rate", "GST", "Amount"].forEach((label, index) => doc.text(label, cols[index], y));
  y += 9; doc.setFont("helvetica", "normal"); doc.setTextColor(INK);
  totals.lines.forEach((line) => {
    if (y > pageHeight - 85) { addFooter(doc, brand, pageWidth, pageHeight); doc.addPage(); addBrand(doc, brand, pageWidth); y = 50; }
    doc.text(doc.splitTextToSize(sanitizeText(line.description, 32), 58), cols[0], y);
    doc.text(sanitizeText(line.hsnSac, 12), cols[1], y); doc.text(String(line.quantity), cols[2], y); doc.text(currency(safeNumber(String(line.rate))), cols[3], y); doc.text(`${line.gstRate}%`, cols[4], y); doc.text(currency(line.total), cols[5], y);
    y += 10;
    doc.setDrawColor("#edf0ed"); doc.line(18, y - 5, pageWidth - 18, y - 5);
  });
  y += 3; const summaryX = 125;
  doc.setFontSize(9); doc.setTextColor(MUTED);
  doc.text("Taxable value", summaryX, y); doc.text(currency(totals.subtotal), 174, y, { align: "right" }); y += 6;
  if (totals.intraState) { doc.text("CGST", summaryX, y); doc.text(currency(totals.cgst), 174, y, { align: "right" }); y += 6; doc.text("SGST", summaryX, y); doc.text(currency(totals.sgst), 174, y, { align: "right" }); }
  else { doc.text("IGST", summaryX, y); doc.text(currency(totals.igst), 174, y, { align: "right" }); }
  y += 9; doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(colour); doc.text("Grand total", summaryX, y); doc.text(currency(totals.grandTotal), 174, y, { align: "right" });
  y += 12; doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(INK); doc.text(`Amount in words: ${amountInWords(totals.grandTotal)}`, 18, y);
  y += 13; doc.setTextColor(MUTED); doc.text(doc.splitTextToSize(sanitizeText(`Place of supply: ${invoice.placeOfSupply}\nBank: ${invoice.bankDetails}\nUPI: ${invoice.upiDetails}\n${invoice.notes}`), pageWidth - 36), 18, y);
  addFooter(doc, brand, pageWidth, pageHeight);
  doc.save(`${sanitizeText(invoice.invoiceNumber || "invoice", 40).replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
