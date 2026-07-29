const FEATURES = [
  {
    title: 'Default-deny in the kernel',
    body: 'Each agent host gets one Linux bridge with `policy drop` on FORWARD. Allow rules you write compile to nftables verdicts and hit-counters. Verify any rule is live with `nft list table inet outcall`.',
  },
  {
    title: 'Block agents at the DNS layer',
    body: 'The bridge gateway answers only for hosts in your rule set. Unlisted lookups return NXDOMAIN — agents fail immediately at name resolution, not after a 30-second TCP timeout that taints retries.',
  },
  {
    title: 'See exactly what HTTPS calls were made',
    body: 'A forward proxy on the bridge matches plaintext HTTP on host + method + path, and HTTPS on CONNECT host + TLS SNI — no decryption, by design. A per-rule intercept mode is specified (S011) but intentionally not implemented in v0.1; HTTPS method/path/body is not visible inside the encrypted tunnel.',
  },
  {
    title: 'Agents ask before they reach',
    body: 'A Unix socket inside each container lets the agent ask the daemon via `outcall fetch <url>` (or `outcall exec`, `outcall file`, etc.) before acting, and submit new rule requests for operator approval. The agent never touches host policy directly; rule changes are auditable.',
  },
  {
    title: 'Reload policy without restarting agents',
    body: 'Drop YAML into `/etc/outcall/rules.d` and `outcall rules reload`. Networks and containers outlive the daemon — you can ship a rule change in seconds without rolling a single agent.',
  },
  {
    title: 'One source of truth across CLI, API, and dashboard',
    body: 'The `outcall` CLI, the JSON API on `/tmp/outcall/host.sock`, and the web dashboard all read the same daemon state. What you see in the UI is what `outcall rules list` prints — no separate inventory to drift.',
  },
];

export function Features() {
  return (
    <section className="shell py-24 md:py-32">
      <div className="mb-14 max-w-2xl">
        <p className="eyebrow mb-4">What&apos;s in the box</p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          One daemon. Six surfaces. Same source of truth.
        </h2>
        <p className="mt-4 text-[var(--muted)] text-lg">
          Outcall ships the network plumbing, the policy plane, and the operator
          UX as a single binary. You don&apos;t stand up six tools to enforce egress —
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
