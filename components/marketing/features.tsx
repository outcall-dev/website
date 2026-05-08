// TODO(copy): the feature deck is the second-most-important piece of copy
// after the hero. Each card answers "why does this exist?" Worth a careful
// pass — a future contributor (you?) should validate that:
//   1. each title states what it gives the operator (not the implementation)
//   2. each description names a concrete thing the operator can verify

const FEATURES = [
  {
    title: 'Bridge + nftables',
    body: 'An isolated L2 segment per host. Default-deny in the kernel. Allow rules compile to nftables verdicts you can read with `nft list table`.',
  },
  {
    title: 'DNS filter',
    body: 'The bridge gateway runs a DNS resolver that only answers for hosts in the rule set. Blocked queries return NXDOMAIN — agents fail at name lookup, not after a TCP timeout.',
  },
  {
    title: 'HTTP proxy',
    body: 'A forward proxy on the bridge gateway. Plaintext HTTP is matched on host, method, and path. HTTPS is matched on the CONNECT host and the TLS SNI — no decryption by default. An optional, per-rule intercept mode (S011) lets you decrypt with a CA you provision, when L7 enforcement of HTTPS method/path/body is worth the trade-offs.',
  },
  {
    title: 'Agent API',
    body: 'A Unix socket inside each container. The agent shim asks "may I reach X?" before egress, and submits rule requests to the operator for review. No agent ever touches the host policy directly.',
  },
  {
    title: 'Dynamic rules',
    body: 'Drop YAML into /etc/outcall/rules.d and reload. Rules survive daemon restarts; networks and containers outlive the daemon, so you can ship rule changes without rolling agents.',
  },
  {
    title: 'CLI + dashboard',
    body: 'One outcall CLI talks to the host socket — bridge, DNS, proxy, networks, containers. A web dashboard renders the same data for operators who prefer panes over panes.',
  },
];

export function Features() {
  return (
    <section className="shell py-24 md:py-32">
      <div className="mb-14 max-w-2xl">
        <p className="eyebrow mb-4">What's in the box</p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          One daemon. Six surfaces. Same source of truth.
        </h2>
        <p className="mt-4 text-[var(--muted)] text-lg">
          Outcall ships the network plumbing, the policy plane, and the operator
          UX as a single binary. You don't stand up six tools to enforce egress —
          you stand up one.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--accent)]/50 transition-colors"
          >
            <div className="font-semibold mb-2">{f.title}</div>
            <p className="text-sm leading-relaxed text-[var(--muted)]">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
