"use client";

import { Download, Upload, UserPlus } from "lucide-react";
import { useRef } from "react";
import { exportData, loadClients, saveBrand, saveClients, saveItems } from "@/lib/storage";
import type { BrandSettings, SavedClient, SavedItem } from "@/lib/types";

type Props = { brand: BrandSettings; onImported: (payload: { brand?: BrandSettings; clients?: SavedClient[]; items?: SavedItem[] }) => void; client?: SavedClient; items?: SavedItem[]; onClientSaved?: (client: SavedClient) => void };

export function DataControls({ brand, onImported, client, items = [], onClientSaved }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const saveClient = () => {
    if (!client?.name.trim()) return window.alert("Add a client name before saving.");
    const clients = loadClients().filter((item) => item.id !== client.id);
    saveClients([...clients, client]);
    onClientSaved?.(client);
    window.alert("Client saved locally.");
  };
  const importData = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result)) as { brand?: BrandSettings; clients?: SavedClient[]; items?: SavedItem[] };
        if (payload.brand) saveBrand(payload.brand);
        if (payload.clients) saveClients(payload.clients);
        if (payload.items) saveItems(payload.items);
        onImported(payload);
        window.alert("Data imported to this browser.");
      } catch { window.alert("That file is not a valid ProposalKit export."); }
    };
    reader.readAsText(file);
  };
  return <div className="actions-row" style={{ marginTop: 0 }}><button className="button button-secondary" type="button" onClick={saveClient}><UserPlus size={15} /> Save client</button><button className="button button-secondary" type="button" onClick={() => exportData(brand, loadClients(), items)}><Download size={15} /> Export data</button><button className="button button-secondary" type="button" onClick={() => fileRef.current?.click()}><Upload size={15} /> Import data</button><input ref={fileRef} type="file" accept="application/json" className="sr-only" onChange={(event) => importData(event.target.files?.[0])} /></div>;
}
