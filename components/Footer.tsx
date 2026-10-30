import Link from "next/link";

export function Footer() {
  return <footer className="site-footer"><div className="container footer-wrap">
    <span>© {new Date().getFullYear()} ProposalKit India · Made with Productive IT</span>
    <span className="footer-links"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/templates">Templates</Link></span>
  </div></footer>;
}
