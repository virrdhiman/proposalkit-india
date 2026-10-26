"use client";

import { ImagePlus, ShieldCheck, Trash2 } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";
import type { BrandSettings, FontChoice } from "@/lib/types";

type Props = { brand: BrandSettings; onChange: (brand: BrandSettings) => void };

export function BrandingPanel({ brand, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<BrandSettings>) => onChange({ ...brand, ...patch });
  const uploadLogo = (file?: File) => {
    if (!file) return;
    if (!file.type.match(/image\/(png|jpeg|jpg|svg\+xml)/i) || file.size > 2 * 1024 * 1024) {
      window.alert("Please choose a PNG, JPG or SVG logo under 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set({ logoDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return <aside className="panel brand-panel" aria-label="Branding settings">
    <h2>Logo & branding</h2>
    <p className="helper">Your brand settings are saved only in this browser.</p>
    <div className="brand-preview" style={{ borderTop: `3px solid ${brand.brandColour}` }}>
      <div className="brand-logo">{brand.logoDataUrl ? <Image src={brand.logoDataUrl} alt="Your uploaded logo preview" width={48} height={48} unoptimized /> : <ImagePlus size={20} />}</div>
      <div><div className="brand-name">{brand.businessName || "Your business name"}</div><div className="brand-tagline">{brand.tagline || "Your tagline"}</div></div>
    </div>
    <div className="field"><label htmlFor="businessName">Business name</label><input id="businessName" className="input" value={brand.businessName} onChange={(event) => set({ businessName: event.target.value })} /></div>
    <div className="field" style={{ marginTop: ".8rem" }}><label htmlFor="tagline">Tagline</label><input id="tagline" className="input" value={brand.tagline} onChange={(event) => set({ tagline: event.target.value })} /></div>
    <div className="field" style={{ marginTop: ".8rem" }}><label htmlFor="brandColour">Brand colour</label><input id="brandColour" className="input" type="color" value={brand.brandColour} onChange={(event) => set({ brandColour: event.target.value })} /></div>
    <div className="field" style={{ marginTop: ".8rem" }}><label htmlFor="brandFont">Font</label><select id="brandFont" className="select" value={brand.font} onChange={(event) => set({ font: event.target.value as FontChoice })}><option>Inter</option><option>Georgia</option><option>Arial</option><option>Trebuchet MS</option></select></div>
    <div className="actions-row"><button type="button" className="button button-secondary" onClick={() => inputRef.current?.click()}><ImagePlus size={16} /> Upload logo</button>{brand.logoDataUrl && <button type="button" className="button button-danger" onClick={() => set({ logoDataUrl: undefined })}><Trash2 size={15} /> Remove logo</button>}</div>
    <input ref={inputRef} className="sr-only" type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={(event) => uploadLogo(event.target.files?.[0])} />
    <label className="check-row" style={{ marginTop: "1rem" }}><input type="checkbox" checked={brand.showProductiveFooter} onChange={(event) => set({ showProductiveFooter: event.target.checked })} /> Show “Made with Productive IT” in exported PDFs</label>
    <div className="privacy-note"><ShieldCheck size={17} aria-hidden="true" /><span>Your logo never leaves your device. It is stored locally and embedded directly into your PDF.</span></div>
  </aside>;
}
