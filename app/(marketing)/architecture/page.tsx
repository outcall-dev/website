import type { Metadata } from 'next';
import { Architecture } from '@/components/marketing/architecture';

export const metadata: Metadata = {
  title: 'Architecture',
  description: 'How outcalld assembles the bridge, rule engine, DNS filter, HTTP proxy, and agent API.',
};

export default function ArchitecturePage() {
  return (
    <div className="shell pt-12 pb-8">
      <p className="eyebrow mb-3">Architecture</p>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Anatomy of the daemon
      </h1>
      <p className="mt-5 text-[var(--muted)] text-lg max-w-2xl">
        outcalld is one binary made of seven Tokio tasks. The bridge is the
        chokepoint; everything else exists to decide what may pass through it.
      </p>
      <Architecture />
    </div>
  );
}
