export function Architecture() {
  return (
    <section className="shell py-24 md:py-32 border-t border-[var(--border)]">
      <div className="mb-12 max-w-2xl">
        <p className="eyebrow mb-4">How it fits together</p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          One bridge. One source of truth.
        </h2>
        <p className="mt-4 text-[var(--muted)] text-lg">
          The daemon is the only thing on the host that can change policy. Operators
          talk to the host socket. Containers talk to the agent socket. Neither
          side reaches the other.
        </p>
      </div>
      <DiagramSVG />
    </section>
  );
}

function DiagramSVG() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-10 overflow-x-auto">
      <svg
        viewBox="0 0 880 460"
        className="w-full h-auto"
        role="img"
        aria-label="Outcall architecture: operator and agent containers connect to outcalld through separate Unix sockets; outcalld runs the rule engine, bridge, nftables, DNS filter, HTTP proxy, agent API, and docker manager."
      >
        <defs>
          <linearGradient id="daemonGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.04" />
          </linearGradient>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 Z" fill="var(--muted)" />
          </marker>
        </defs>

        {/* Operator */}
        <Box x={40} y={40} w={200} h={70} title="Operator" sub="outcall CLI · UI" />
        {/* Agent container */}
        <Box x={640} y={40} w={200} h={70} title="Agent container" sub="outcall-agent shim" />

        {/* Sockets */}
        <Label x={140} y={140} text="host.sock" />
        <Label x={740} y={140} text="agent.sock" />

        {/* Daemon block */}
        <rect x={40} y={170} width={800} height={130} rx={14} fill="url(#daemonGrad)" stroke="var(--accent)" strokeOpacity="0.5" />
        <text x={440} y={200} textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--text)">
          outcalld
        </text>
        <Pill x={45} y={222} label="rule engine" />
        <Pill x={171} y={222} label="bridge" />
        <Pill x={262} y={222} label="nftables" />
        <Pill x={367} y={222} label="DNS filter" />
        <Pill x={486} y={222} label="HTTP proxy" />
        <Pill x={605} y={222} label="agent API" />
        <Pill x={717} y={222} label="docker manager" />

        {/* Bridge interface */}
        <Box x={340} y={345} w={200} h={50} title="outcall0 bridge" sub="" />
        {/* Internet */}
        <Box x={340} y={420} w={200} h={36} title="" sub="Internet (filtered)" />

        {/* Lines: operator → daemon */}
        <Arrow x1={140} y1={110} x2={140} y2={170} />
        <Arrow x1={740} y1={110} x2={740} y2={170} />
        <Arrow x1={440} y1={300} x2={440} y2={345} />
        <Arrow x1={440} y1={395} x2={440} y2={420} />
      </svg>
    </div>
  );
}

function Box({ x, y, w, h, title, sub }: { x: number; y: number; w: number; h: number; title: string; sub: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="var(--surface-2)" stroke="var(--border)" />
      {title && (
        <text x={x + w / 2} y={y + (sub ? 28 : h / 2 + 5)} textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--text)">
          {title}
        </text>
      )}
      {sub && (
        <text x={x + w / 2} y={y + (title ? 50 : h / 2 + 5)} textAnchor="middle" fontSize="12" fill="var(--muted)">
          {sub}
        </text>
      )}
    </g>
  );
}

function Pill({ x, y, label }: { x: number; y: number; label: string }) {
  const w = label.length * 7 + 22;
  return (
    <g>
      <rect x={x} y={y} width={w} height={32} rx={16} fill="var(--surface)" stroke="var(--border)" />
      <text x={x + w / 2} y={y + 21} textAnchor="middle" fontSize="12" fill="var(--text)">
        {label}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted)" strokeWidth={1.5} markerEnd="url(#arrow)" />;
}

function Label({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="var(--muted)">
      {text}
    </text>
  );
}
