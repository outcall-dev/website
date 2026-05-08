import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <span className="font-semibold tracking-tight">Outcall</span>
        ),
      }}
      links={[
        { text: 'Architecture', url: '/architecture' },
        { text: 'GitHub', url: 'https://github.com/outcall-dev', external: true },
      ]}
      sidebar={{
        defaultOpenLevel: 1,
      }}
    >
      {children}
    </DocsLayout>
  );
}
