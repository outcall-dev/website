import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-[var(--border)]">
      <div className="shell py-14 grid gap-10 md:grid-cols-4 text-sm">
        <div>
          <div className="font-semibold mb-2">Outcall</div>
          <p className="text-[var(--muted)]">
            Host-level egress control for agent containers. Open source.
          </p>
        </div>
        <FooterCol
          title="Documentation"
          links={[
            { href: '/docs', label: 'Overview' },
            { href: '/docs/guides/installation', label: 'Installation' },
            { href: '/docs/guides/quickstart', label: 'Quickstart' },
            { href: '/docs/guides/cli', label: 'CLI reference' },
            { href: '/docs/guides/configuration', label: 'Configuration' },
          ]}
        />
        <FooterCol
          title="Specifications"
          links={[
            { href: '/docs/specs', label: 'Index' },
            { href: '/docs/specs/001-bridge-management', label: 'Bridge management' },
            { href: '/docs/specs/003-rule-engine', label: 'Rule engine' },
            { href: '/docs/specs/006-http-proxy', label: 'HTTP proxy' },
            { href: '/docs/specs/007-dns-filter', label: 'DNS filter' },
          ]}
        />
        <FooterCol
          title="Source"
          links={[
            { href: 'https://github.com/Outcall-dev/outcall', label: 'application' },
            { href: 'https://github.com/Outcall-dev/specs', label: 'specs' },
            { href: 'https://github.com/Outcall-dev/docs', label: 'docs' },
            { href: 'https://github.com/Outcall-dev/website', label: 'website' },
          ]}
        />
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="shell py-6 flex items-center justify-between text-xs text-[var(--muted)]">
          <span>© Outcall</span>
          <span>Built spec-first.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <div className="font-semibold mb-2">{title}</div>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
