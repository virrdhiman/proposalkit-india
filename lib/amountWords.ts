const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function underThousand(value: number): string {
  const parts: string[] = [];
  if (value >= 100) {
    parts.push(`${ones[Math.floor(value / 100)]} Hundred`);
    value %= 100;
  }
  if (value >= 20) parts.push(`${tens[Math.floor(value / 10)]}${value % 10 ? ` ${ones[value % 10]}` : ""}`);
  else if (value > 0) parts.push(ones[value]);
  return parts.join(" ");
}

export function amountInWords(amount: number): string {
  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);
  if (rupees === 0 && paise === 0) return "Zero Rupees Only";

  const groups: string[] = [];
  let remaining = rupees;
  const crore = Math.floor(remaining / 10000000);
  if (crore) { groups.push(`${underThousand(crore)} Crore`); remaining %= 10000000; }
  const lakh = Math.floor(remaining / 100000);
  if (lakh) { groups.push(`${underThousand(lakh)} Lakh`); remaining %= 100000; }
  const thousand = Math.floor(remaining / 1000);
  if (thousand) { groups.push(`${underThousand(thousand)} Thousand`); remaining %= 1000; }
  if (remaining) groups.push(underThousand(remaining));
  const rupeeText = `${groups.join(" ")} Rupees`;
  return `${rupeeText}${paise ? ` and ${underThousand(paise)} Paise` : ""} Only`;
}
