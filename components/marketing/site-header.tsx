import Link from 'next/link';

const NAV = [
  { href: '/docs', label: 'Docs' },
  { href: '/docs/guides', label: 'Guides' },
  { href: '/docs/specs', label: 'Specs' },
  { href: '/architecture', label: 'Architecture' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] backdrop-blur-md bg-[color-mix(in_oklab,var(--bg)_85%,transparent)]">
      <div className="shell flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <LogoMark className="h-6 w-6" />
          <span>Outcall</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/outcall-dev"
            className="text-sm text-[var(--muted)] hover:text-[var(--text)]"
            aria-label="GitHub organisation"
          >
            GitHub →
          </Link>
        </div>
      </div>
    </header>
  );
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="6" fill="var(--accent)" />
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        fontSize="18"
        fill="var(--accent-fg)"
      >
        O
      </text>
    </svg>
  );
}
