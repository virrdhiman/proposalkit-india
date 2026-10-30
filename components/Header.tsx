import Link from "next/link";
import { Menu } from "lucide-react";

export function Header() {
  return <header className="site-header"><div className="container nav-wrap">
    <Link className="brand-mark" href="/" aria-label="ProposalKit India home"><span className="brand-dot">PK</span><span>ProposalKit <span style={{ color: "var(--teal)" }}>India</span></span></Link>
    <nav className="nav-links" aria-label="Main navigation">
      <Link href="/proposal">Proposals</Link><Link href="/invoice">GST invoices</Link><Link href="/templates">Templates</Link><Link href="/privacy">Privacy</Link>
    </nav>
    <Link className="button button-primary mobile-nav" href="/proposal" aria-label="Open proposal generator"><Menu size={17} /> Start</Link>
  </div></header>;
}
