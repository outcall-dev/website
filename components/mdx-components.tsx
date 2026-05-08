import defaultComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(overrides?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...overrides,
  };
}
