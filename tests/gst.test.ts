import { describe, expect, it } from "vitest";
import { calculateInvoice } from "@/lib/gst";

const line = { id: "1", description: "Design", hsnSac: "998314", quantity: 2, rate: 1000, gstRate: 18 as const };

describe("GST calculations", () => {
  it("splits same-state tax into CGST and SGST", () => {
    const result = calculateInvoice({ sellerState: "Karnataka", buyerState: "Karnataka", lines: [line] });
    expect(result.intraState).toBe(true); expect(result.subtotal).toBe(2000); expect(result.cgst).toBe(180); expect(result.sgst).toBe(180); expect(result.igst).toBe(0); expect(result.grandTotal).toBe(2360);
  });
  it("uses IGST for inter-state supplies", () => {
    const result = calculateInvoice({ sellerState: "Karnataka", buyerState: "Maharashtra", lines: [line] });
    expect(result.intraState).toBe(false); expect(result.cgst).toBe(0); expect(result.sgst).toBe(0); expect(result.igst).toBe(360); expect(result.grandTotal).toBe(2360);
  });
  it("rounds each line and the total to two decimals", () => {
    const result = calculateInvoice({ sellerState: "Delhi", buyerState: "Delhi", lines: [{ ...line, quantity: 3, rate: 333.333, gstRate: 5 }] });
    expect(result.lines[0].taxable).toBe(1000); expect(result.lines[0].tax).toBe(50); expect(result.grandTotal).toBe(1050);
  });
});
