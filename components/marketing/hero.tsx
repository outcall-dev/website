import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-aura" />
      <div className="shell relative z-10 pt-20 pb-20 md:pt-32 md:pb-28">
        <p className="eyebrow mb-5">Egress control · agent containers</p>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight max-w-4xl">
          Put Claude Code or Codex
          <br />
          <span className="text-[var(--accent)]">in a default-deny box.</span>
        </h1>
        <p className="mt-7 text-lg md:text-xl text-[var(--muted)] max-w-2xl leading-relaxed">
          Outcall gives new users a one-command run path: install once, verify
          the matching daemon image, then run{' '}
          <code className="text-[var(--text)] font-mono text-base bg-[var(--surface-2)] px-1.5 py-0.5 rounded">
            outcall run codex
          </code>{' '}
          to scaffold one project, stage only the auth/config you intend,
          verify the isolated container path, and launch the real agent
          directly. It runs on Linux or in Docker Desktop's Linux runtime on
          macOS. Network policy is default-deny and enforced by nftables, DNS,
          and an HTTP proxy the container cannot bypass. Use{' '}
          <code className="text-[var(--text)] font-mono text-base bg-[var(--surface-2)] px-1.5 py-0.5 rounded">
            outcall doctor --fix codex
          </code>
          to repair Docker and project prerequisites. Add only named recipe
          grants or exact hosts with{' '}
          <code className="text-[var(--text)] font-mono text-base bg-[var(--surface-2)] px-1.5 py-0.5 rounded">
            outcall allow codex github
          </code>{' '}
          .
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/docs/guides/quickstart" className="btn btn-primary">
            Get started →
          </Link>
          <Link href="/docs" className="btn">
            Read the docs
          </Link>
          <Link
            href="https://github.com/outcall-dev/outcall"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Source on GitHub
          </Link>
        </div>
        <p className="mt-5 text-sm text-[var(--muted)] font-mono">
          curl -fsSL https://outcall.dev/install.sh | sh
        </p>

        <CodePreview />
      </div>
    </section>
  );
}

function CodePreview() {
  return (
    <div className="mt-14 max-w-3xl">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-2xl shadow-black/40">
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-2)]">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 text-xs text-[var(--muted)] font-mono">.outcall/rules/codex.yaml</span>
        </div>
        <pre className="p-5 text-sm leading-relaxed font-mono text-[var(--text)] overflow-x-auto">
{`$ outcall allow codex github
Allowed github for Codex CLI.
  Rules: .outcall/rules/codex.yaml
  Default deny remains active for every other destination.

$ outcall allow codex https://api.sentry.io
Allowed https://api.sentry.io for Codex CLI.

$ outcall policy explain codex
Default: block every destination not listed below.
  codex-openai-api - Codex may call OpenAI and ChatGPT endpoints.
  codex-github - Codex may access GitHub for repository operations.
  codex-host-api-sentry-io - Codex may access api.sentry.io over HTTPS.`}
        </pre>
      </div>
    </div>
  );
}
