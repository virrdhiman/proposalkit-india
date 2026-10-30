import { describe, expect, it } from "vitest";
import { isValidGstin } from "@/lib/gstin";

describe("GSTIN validation", () => {
  it("accepts a standard GSTIN structure", () => { expect(isValidGstin("29ABCDE1234F1Z5")).toBe(true); });
  it("rejects malformed GSTIN values", () => { expect(isValidGstin("29ABCDE1234F1Z")).toBe(false); expect(isValidGstin("29ABCDE1234F1A5")).toBe(false); });
});
