import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://outcall.dev'),
  title: {
    default: 'Outcall — host-level egress control for agent containers',
    template: '%s · Outcall',
  },
  description:
    'Install once, then run Claude Code or Codex in a default-deny container with host-level egress control.',
  openGraph: {
    title: 'Outcall',
    description:
      'Install once, then run Claude Code or Codex in a default-deny container with host-level egress control.',
    url: 'https://outcall.dev',
    siteName: 'Outcall',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Outcall',
    description: 'Run Claude Code or Codex in a default-deny container.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider
          theme={{
            attribute: 'class',
            defaultTheme: 'dark',
            enableSystem: true,
            // Use the `light` class (matches our globals.css :root.light selector).
            // Fumadocs uses `dark` class by default; we add `light` to flip.
            disableTransitionOnChange: true,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
