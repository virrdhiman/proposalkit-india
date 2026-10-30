export function sanitizeText(input: string, maxLength = 5000): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .slice(0, maxLength)
    .trim();
}

export function safeNumber(value: string | number): number {
  const parsed = typeof value === "number" ? value : Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}
