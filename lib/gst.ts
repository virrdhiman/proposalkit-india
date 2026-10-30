import type { InvoiceDetails, InvoiceLine } from "./types";

export type LineCalculation = InvoiceLine & {
  taxable: number;
  tax: number;
  total: number;
};

export type InvoiceTotals = {
  lines: LineCalculation[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
  intraState: boolean;
};

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateInvoice(invoice: Pick<InvoiceDetails, "sellerState" | "buyerState" | "lines">): InvoiceTotals {
  const intraState = invoice.sellerState.trim().toLowerCase() === invoice.buyerState.trim().toLowerCase();
  const lines = invoice.lines.map((line) => {
    const taxable = round2(Math.max(0, Number(line.quantity) || 0) * Math.max(0, Number(line.rate) || 0));
    const tax = round2(taxable * (Number(line.gstRate) || 0) / 100);
    return { ...line, taxable, tax, total: round2(taxable + tax) };
  });
  const subtotal = round2(lines.reduce((sum, line) => sum + line.taxable, 0));
  const totalTax = round2(lines.reduce((sum, line) => sum + line.tax, 0));
  const cgst = intraState ? round2(totalTax / 2) : 0;
  const sgst = intraState ? round2(totalTax - cgst) : 0;
  const igst = intraState ? 0 : totalTax;
  return { lines, subtotal, cgst, sgst, igst, grandTotal: round2(subtotal + totalTax), intraState };
}
