import Link from 'next/link';

// TODO(copy): refine the headline and sub-line. The current copy is the
// existing site's working version. Strong candidates for revision:
//   - sub-line could lead with the threat ("LLM agents will exfiltrate or
//     fetch from anywhere by default") rather than the cure.
//   - the "prove it" promise could be backed up with a one-line proof point
//     (e.g. "every allow rule maps to an nftables counter you can read").
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-aura" />
      <div className="shell relative z-10 pt-20 pb-20 md:pt-32 md:pb-28">
        <p className="eyebrow mb-5">Egress control · agent containers</p>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight max-w-4xl">
          Decide what your containers can reach.
          <br />
          <span className="text-[var(--accent)]">Then prove it.</span>
        </h1>
        <p className="mt-7 text-lg md:text-xl text-[var(--muted)] max-w-2xl leading-relaxed">
          Outcall is a host-level firewall daemon for Docker agent containers.
          One bridge, one rule set, one place to say what an agent may talk to —
          enforced by nftables, DNS, and an HTTP proxy your container can't bypass.
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
            className="btn"
          >
            Source on GitHub
          </Link>
        </div>

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
          <span className="ml-3 text-xs text-[var(--muted)] font-mono">/etc/outcall/rules.d/agent.yaml</span>
        </div>
        <pre className="p-5 text-sm leading-relaxed font-mono text-[var(--text)] overflow-x-auto">
{`# /etc/outcall/rules.d/agent.yaml
# Default-block is implicit. Write only what the agent may do.
# HTTPS is matched by hostname (SNI). Method/path are visible
# only for plaintext HTTP — no TLS interception.
version: "1"
rules:
  - id: allow-openai
    description: "agent may call the OpenAI API over HTTPS"
    condition: 'http.host == "api.openai.com"'
    action: allow
    egress:
      mode: proxy

  - id: allow-github-clone
    condition: |
      dns.query == "github.com" ||
      http.host == "github.com"
    action: allow`}
        </pre>
      </div>
    </div>
  );
}
