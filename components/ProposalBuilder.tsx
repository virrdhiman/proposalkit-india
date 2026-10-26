"use client";

import { useEffect, useMemo, useState } from "react";
import { FileDown, LoaderCircle, Sparkles } from "lucide-react";
import { BrandingPanel } from "@/components/BrandingPanel";
import { DataControls } from "@/components/DataControls";
import { downloadProposalPdf } from "@/lib/pdf";
import { fallbackProposal } from "@/lib/proposal";
import { loadBrand, loadClients, saveBrand } from "@/lib/storage";
import { defaultBrand, defaultProposal, type BrandSettings, type ProposalForm, type ProposalSections, type ProjectType, type SavedClient } from "@/lib/types";

const sectionFields: Array<[keyof ProposalSections, string]> = [["summary", "Summary"], ["scopeOfWork", "Scope of work"], ["deliverables", "Deliverables"], ["timeline", "Timeline"], ["pricing", "Pricing"], ["terms", "Terms"], ["nextSteps", "Next steps"]];

export function ProposalBuilder() {
  const [form, setForm] = useState<ProposalForm>(defaultProposal);
  const [sections, setSections] = useState<ProposalSections>(() => fallbackProposal(defaultProposal));
  const [brand, setBrand] = useState<BrandSettings>(defaultBrand);
  const [savedClients, setSavedClients] = useState<SavedClient[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => { setBrand(loadBrand()); setSavedClients(loadClients()); setReady(true); }, []);
  useEffect(() => { if (ready) saveBrand(brand); }, [brand, ready]);
  const client = useMemo(() => ({ id: `client-${form.clientName.toLowerCase().replace(/\W+/g, "-")}`, name: form.clientName, company: form.clientCompany }), [form.clientName, form.clientCompany]);
  const update = (key: keyof ProposalForm, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const generate = async () => {
    setLoading(true); setStatus("");
    try {
      const response = await fetch("/api/generate-proposal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const payload = await response.json() as { sections?: ProposalSections; fallback?: boolean; message?: string };
      if (!response.ok || !payload.sections) throw new Error(payload.message || "Could not create proposal");
      setSections(payload.sections); setStatus(payload.message || (payload.fallback ? "Editable template ready — AI was not used." : "AI draft ready. Edit every section before exporting."));
    } catch (error) { setSections(fallbackProposal(form)); setStatus(error instanceof Error ? `${error.message}. A local template is ready.` : "A local template is ready."); }
    finally { setLoading(false); }
  };
  return <>
    <section className="tool-hero"><div className="container"><div className="eyebrow">Proposal generator</div><h1>Turn a rough brief into a confident proposal.</h1><p>Use the optional AI draft, then edit the actual document in the browser. Nothing is sent until you press Generate.</p></div></section>
    <div className="container tool-layout"><div className="form-panel">
      <div className="form-section" style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}><h2>1. Project brief</h2><div className="field-grid">
        <div className="field"><label htmlFor="clientName">Client name</label><input id="clientName" className="input" value={form.clientName} onChange={(e) => update("clientName", e.target.value)} /></div>
        <div className="field"><label htmlFor="clientCompany">Client company</label><input id="clientCompany" className="input" value={form.clientCompany} onChange={(e) => update("clientCompany", e.target.value)} /></div>
        <div className="field field-full"><label htmlFor="projectTitle">Project title</label><input id="projectTitle" className="input" value={form.projectTitle} onChange={(e) => update("projectTitle", e.target.value)} /></div>
        <div className="field"><label htmlFor="projectType">Project type</label><select id="projectType" className="select" value={form.projectType} onChange={(e) => update("projectType", e.target.value as ProjectType)}>{["web design", "app", "SEO", "video", "consulting", "other"].map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></div>
        <div className="field"><label htmlFor="timeline">Timeline</label><input id="timeline" className="input" value={form.timeline} onChange={(e) => update("timeline", e.target.value)} placeholder="e.g. 6 weeks" /></div>
        <div className="field"><label htmlFor="budget">Budget (INR)</label><input id="budget" className="input" inputMode="decimal" value={form.budget} onChange={(e) => update("budget", e.target.value)} /></div>
        <div className="field"><label htmlFor="paymentTerms">Payment terms</label><input id="paymentTerms" className="input" value={form.paymentTerms} onChange={(e) => update("paymentTerms", e.target.value)} /></div>
        <div className="field field-full"><label htmlFor="scope">Scope in a few lines</label><textarea id="scope" className="textarea" value={form.scope} onChange={(e) => update("scope", e.target.value)} /></div>
      </div>{savedClients.length > 0 && <div className="field" style={{ maxWidth: "460px", marginTop: "1rem" }}><label htmlFor="savedClient">Reuse a saved client</label><select id="savedClient" className="select" defaultValue="" onChange={(e) => { const saved = savedClients.find((item) => item.id === e.target.value); if (saved) setForm((current) => ({ ...current, clientName: saved.name, clientCompany: saved.company })); e.currentTarget.value = ""; }}><option value="">Choose a saved client…</option>{savedClients.map((saved) => <option key={saved.id} value={saved.id}>{saved.name}{saved.company ? ` · ${saved.company}` : ""}</option>)}</select></div>}<div className="actions-row"><button className="button button-primary" type="button" onClick={generate} disabled={loading}>{loading ? <LoaderCircle size={17} className="animate-spin" /> : <Sparkles size={17} />} {loading ? "Writing draft…" : "Generate draft"}</button><span className="status" role="status">{status}</span></div></div>
      <div className="form-section"><div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}><h2>2. Edit your proposal</h2><span className="helper">Every section is editable</span></div><div className="field-grid">{sectionFields.map(([key, label]) => <div className="field field-full" key={key}><label htmlFor={`section-${key}`}>{label}</label><textarea id={`section-${key}`} className="textarea" value={sections[key]} onChange={(e) => setSections((current) => ({ ...current, [key]: e.target.value }))} /></div>)}</div><div className="actions-row"><button className="button button-primary" type="button" onClick={() => downloadProposalPdf(form, sections, brand)}><FileDown size={17} /> Download proposal PDF</button><DataControls brand={brand} client={client} onClientSaved={(saved) => setSavedClients((current) => [...current.filter((item) => item.id !== saved.id), saved])} onImported={(payload) => { if (payload.brand) setBrand({ ...defaultBrand, ...payload.brand }); if (payload.clients) setSavedClients(payload.clients); }} /></div></div>
    </div><BrandingPanel brand={brand} onChange={setBrand} /></div>
  </>;
}
