import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://proposalkit.in"),
  title: { default: "ProposalKit India — Proposals and GST invoices, made simple", template: "%s | ProposalKit India" },
  description: "Free proposal and GST invoice generator for Indian freelancers and small agencies. No sign-in, no data storage.",
  alternates: { canonical: "https://proposalkit.in" },
  openGraph: { type: "website", siteName: "ProposalKit India", title: "ProposalKit India", description: "Create polished proposals and GST invoices in minutes." },
  twitter: { card: "summary_large_image", title: "ProposalKit India", description: "Free proposal and GST invoice generator for India." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><div className="site-shell"><Header /><main className="site-main">{children}</main><Footer /></div></body></html>;
}
