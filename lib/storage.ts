import type { BrandSettings, SavedClient, SavedItem } from "./types";
import { defaultBrand } from "./types";

export const STORAGE_KEYS = {
  brand: "proposalkit-branding",
  clients: "proposalkit-clients",
  items: "proposalkit-items",
} as const;

export function loadBrand(): BrandSettings {
  if (typeof window === "undefined") return defaultBrand;
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.brand) ?? "null");
    return { ...defaultBrand, ...(value ?? {}) };
  } catch { return defaultBrand; }
}

export function saveBrand(value: BrandSettings) {
  window.localStorage.setItem(STORAGE_KEYS.brand, JSON.stringify(value));
}

export function loadClients(): SavedClient[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEYS.clients) ?? "[]") as SavedClient[]; }
  catch { return []; }
}

export function saveClients(value: SavedClient[]) {
  window.localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(value));
}

export function loadItems(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEYS.items) ?? "[]") as SavedItem[]; }
  catch { return []; }
}

export function saveItems(value: SavedItem[]) {
  window.localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(value));
}

export function exportData(brand: BrandSettings, clients: SavedClient[], items: unknown[]) {
  const blob = new Blob([JSON.stringify({ version: 1, brand, clients, items }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "proposalkit-india-data.json";
  anchor.click();
  URL.revokeObjectURL(url);
}
