import type { ProposalForm, ProposalSections } from "./types";
import { sanitizeText } from "./sanitize";

export function fallbackProposal(form: ProposalForm): ProposalSections {
  const budget = Number(form.budget || 0).toLocaleString("en-IN");
  return {
    summary: `${form.clientName || "The client"} is looking for a thoughtful ${form.projectType} engagement to move ${form.projectTitle || "the project"} forward. This proposal turns the brief into a practical, measurable delivery plan.`,
    scopeOfWork: sanitizeText(form.scope || "Discovery, planning, production and review of the agreed project scope."),
    deliverables: "• Kick-off and requirements alignment\n• Project plan and working files\n• Review-ready production deliverables\n• Handover notes and launch support",
    timeline: `${form.timeline || "An agreed project timeline"}. Milestones will be confirmed during kick-off, with client review points built into the plan.`,
    pricing: `Project investment: ₹${budget || "To be confirmed"}\nPayment terms: ${form.paymentTerms || "To be agreed before work begins."}`,
    terms: "The scope covers the deliverables listed above. New requirements or additional review rounds can be estimated separately. The client will provide timely feedback, access and approvals needed to keep the timeline on track.",
    nextSteps: "1. Confirm the scope and commercial terms.\n2. Share the required access, content and references.\n3. Book the kick-off and start the first milestone.",
  };
}
