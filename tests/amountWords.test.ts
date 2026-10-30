import { describe, expect, it } from "vitest";
import { amountInWords } from "@/lib/amountWords";

describe("Indian amount in words", () => {
  it("handles zero and paise", () => { expect(amountInWords(0)).toBe("Zero Rupees Only"); expect(amountInWords(1250.5)).toBe("One Thousand Two Hundred Fifty Rupees and Fifty Paise Only"); });
  it("uses lakh and crore grouping", () => { expect(amountInWords(12345678)).toBe("One Crore Twenty Three Lakh Forty Five Thousand Six Hundred Seventy Eight Rupees Only"); });
});
