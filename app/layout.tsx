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
    'Host-level firewall daemon for Docker agent containers. Bridge, nftables, DNS filter, and HTTP proxy in one daemon.',
  openGraph: {
    title: 'Outcall',
    description:
      'Decide what your containers can reach. Then prove it. A host-level firewall daemon for agent containers.',
    url: 'https://outcall.dev',
    siteName: 'Outcall',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Outcall',
    description: 'Host-level egress control for agent containers.',
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
