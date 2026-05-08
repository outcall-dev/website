import { createMDX } from 'fumadocs-mdx/next';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const withMDX = createMDX();
const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // Pin Turbopack's workspace root to this app — there's a stray lockfile
  // higher up the tree (~/package-lock.json) that confuses auto-detection.
  turbopack: {
    root: __dirname,
  },
};

export default withMDX(config);
