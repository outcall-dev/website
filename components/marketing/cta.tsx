import Link from 'next/link';

export function CTA() {
  return (
    <section className="shell py-24 md:py-32 border-t border-[var(--border)]">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 md:p-16 text-center relative overflow-hidden">
        <div className="hero-aura" style={{ height: '200%', top: '-50%' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Stop trusting agents.
            <br />
            Start enforcing them.
          </h2>
          <p className="mt-6 text-[var(--muted)] text-lg">
            Outcall is open source. Spec-first, default-deny, and Linux-native.
            If you run agents that touch the network, you owe yourself a look.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/docs/guides/quickstart" className="btn btn-primary">
              Quickstart →
            </Link>
            <Link
              href="https://github.com/outcall-dev/outcall"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Star on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
