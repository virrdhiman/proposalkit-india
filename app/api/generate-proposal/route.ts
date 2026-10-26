import { NextResponse } from "next/server";
import { z } from "zod";
import { fallbackProposal } from "@/lib/proposal";
import type { ProposalForm, ProposalSections } from "@/lib/types";

const schema = z.object({
  clientName: z.string().trim().min(1).max(120), clientCompany: z.string().trim().max(160), projectTitle: z.string().trim().min(1).max(180), projectType: z.enum(["web design", "app", "SEO", "video", "consulting", "other"]), scope: z.string().trim().min(1).max(3000), timeline: z.string().trim().max(120), budget: z.string().trim().max(40), paymentTerms: z.string().trim().max(1000),
});

type RateRecord = { count: number; resetAt: number };
const rateLimit = new Map<string, RateRecord>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

function getIp(request: Request) { return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous"; }

export async function POST(request: Request) {
  let form: ProposalForm;
  try { form = schema.parse(await request.json()) as ProposalForm; }
  catch { return NextResponse.json({ error: "Please check the proposal fields." }, { status: 400 }); }
  const now = Date.now(); const ip = getIp(request); const previous = rateLimit.get(ip);
  const current = !previous || previous.resetAt <= now ? { count: 0, resetAt: now + WINDOW_MS } : previous;
  if (current.count >= MAX_REQUESTS) return NextResponse.json({ sections: fallbackProposal(form), fallback: true, message: "AI limit reached. We created an editable template instead." }, { status: 429 });
  current.count += 1; rateLimit.set(ip, current);
  const fallback = fallbackProposal(form);
  if (!process.env.GROQ_API_KEY) return NextResponse.json({ sections: fallback, fallback: true, message: "AI is not configured. We created an editable template instead." });

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` }, body: JSON.stringify({ model: "openai/gpt-oss-120b", temperature: .55, response_format: { type: "json_object" }, messages: [{ role: "system", content: "You write concise, warm, commercially clear proposals for Indian freelancers. Return JSON only with these string keys: summary, scopeOfWork, deliverables, timeline, pricing, terms, nextSteps. Use plain text, not markdown tables. Never invent facts beyond the input." }, { role: "user", content: JSON.stringify(form) }] }), cache: "no-store" });
    if (!response.ok) throw new Error("AI provider request failed");
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI response was empty");
    const sections = JSON.parse(content) as ProposalSections;
    const safe: ProposalSections = { summary: String(sections.summary || fallback.summary).slice(0, 2500), scopeOfWork: String(sections.scopeOfWork || fallback.scopeOfWork).slice(0, 3000), deliverables: String(sections.deliverables || fallback.deliverables).slice(0, 2000), timeline: String(sections.timeline || fallback.timeline).slice(0, 1500), pricing: String(sections.pricing || fallback.pricing).slice(0, 1500), terms: String(sections.terms || fallback.terms).slice(0, 2200), nextSteps: String(sections.nextSteps || fallback.nextSteps).slice(0, 1500) };
    return NextResponse.json({ sections: safe, fallback: false });
  } catch { return NextResponse.json({ sections: fallback, fallback: true, message: "AI was unavailable. We created an editable template instead." }); }
}
