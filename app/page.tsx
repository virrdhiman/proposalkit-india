import Link from "next/link";
import { ArrowRight, FileCheck2, FileText, IndianRupee, LockKeyhole, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";

export default function HomePage() {
  const webAppLd = { "@context": "https://schema.org", "@type": "WebApplication", name: "ProposalKit India", url: "https://proposalkit.in", applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: "Free browser-based proposal and GST invoice generator for Indian freelancers and small agencies." };
  return <>
    <JsonLd data={webAppLd} />
    <section className="hero"><div className="container hero-grid">
      <div><div className="eyebrow">Free · private · made for India</div><h1>Look professional. Get paid faster.</h1><p className="lede">ProposalKit India helps freelancers and small agencies create persuasive project proposals and accurate GST invoices — without a sign-in or a database.</p><div className="hero-actions"><Link className="button button-primary" href="/proposal">Create a proposal <ArrowRight size={17} /></Link><Link className="button button-secondary" href="/invoice">Make a GST invoice</Link></div><p className="helper" style={{ marginTop: "1rem" }}>Your documents and branding stay in your browser. AI is optional.</p></div>
      <div className="hero-card" aria-label="Sample proposal preview"><div className="paper-preview"><div className="paper-preview-head"><div><strong>Rohit Verma Studio</strong><div className="helper">Clear work. Clear terms.</div></div><span className="eyebrow" style={{ fontSize: ".64rem" }}>PROPOSAL</span></div><h3 style={{ margin: "1.2rem 0 .3rem", fontSize: "1.35rem" }}>Mango Leaf Foods website</h3><div className="helper">Prepared for Priya Sharma · 26 October 2026</div><div className="paper-lines"><span className="paper-line mid" /><span className="paper-line" /><span className="paper-line short" /><span className="paper-line" /><span className="paper-line mid" /></div><div className="paper-total"><span>Project investment</span><span>₹1,47,500</span></div></div></div>
    </div></section>
    <section className="section"><div className="container"><div className="section-heading"><div className="eyebrow">One calm workspace</div><h2>Everything you need to send the next yes.</h2><p>Simple forms, local-first data and exports that look ready for a client inbox.</p></div><div className="card-grid">
      <article className="feature-card"><span className="icon-bubble"><Sparkles size={20} /></span><h3>AI-assisted proposals</h3><p>Turn a rough scope into clear sections, deliverables, timelines and next steps. Edit everything before you export.</p></article>
      <article className="feature-card"><span className="icon-bubble"><IndianRupee size={20} /></span><h3>GST-ready invoices</h3><p>Automatic CGST + SGST or IGST, Indian number formatting, GSTIN checks and amount in words.</p></article>
      <article className="feature-card"><span className="icon-bubble"><LockKeyhole size={20} /></span><h3>Private by default</h3><p>No account and no server storage. Your logo, clients and saved items live only in this browser.</p></article>
    </div></div></section>
    <section className="section" style={{ paddingTop: 0 }}><div className="container"><div className="panel" style={{ background: "#e9f4ef", borderColor: "#c9e1d7" }}><div className="section-heading" style={{ marginBottom: "1.2rem" }}><div className="eyebrow">Try the live demo</div><h2 style={{ marginBottom: ".5rem" }}>Start with Indian sample data.</h2><p>Priya Sharma, Rohit Verma and Aarav Mehta are already here so you can see the complete flow in under a minute.</p></div><div className="hero-actions"><Link className="button button-primary" href="/proposal"><FileText size={17} /> Open proposal tool</Link><Link className="button button-secondary" href="/invoice"><FileCheck2 size={17} /> Open invoice tool</Link></div></div></div></section>
  </>;
}
