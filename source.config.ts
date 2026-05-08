import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  // Defaults: remark-gfm, rehype-slug, autolink-headings, shiki for code.
});
