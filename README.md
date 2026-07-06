# outcall.dev

![Outcall Banner](https://raw.githubusercontent.com/outcall-dev/assets/main/banner.png)

## Badges

[![CI](https://github.com/outcall-dev/website/actions/workflows/ci.yml/badge.svg)](https://github.com/outcall-dev/website/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-0.1.17-blue.svg)](https://github.com/outcall-dev/website/releases)
[![Docs](https://img.shields.io/badge/docs-outcall.dev-brightgreen.svg)](https://outcall.dev/docs)

## Overview

Marketing + documentation site for Outcall. Next.js 15 (App Router) +
Fumadocs. Documentation is sourced from external repos at build time, the
same way `laravel.com` builds from `laravel/docs`.

## Stack

| Piece | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Docs | Fumadocs (MDX, sidebar/toc/search) |
| Styling | Tailwind v4 + custom brand tokens |
| Theme | Dark by default, light via `next-themes` |
| Search | Fumadocs static index (`/api/search`) |

## Layout

```
app/
├── (marketing)/           ← landing, /architecture
├── docs/[[...slug]]/      ← all of /docs — built from MDX
└── api/search/route.ts    ← search endpoint
components/
├── marketing/             ← hero, features, architecture, cta, header, footer
└── mdx-components.tsx     ← fumadocs MDX overrides
content/
└── docs/
    ├── index.mdx          ← /docs landing (committed)
    ├── meta.json          ← root sidebar order (committed)
    ├── specs/             ← synced from outcall-dev/specs (gitignored)
    └── guides/            ← synced from outcall-dev/docs  (gitignored)
scripts/
└── sync-docs.mjs          ← clones the docs repos into content/docs
```

## Local development

```sh
pnpm install
pnpm sync:docs              # populates content/docs/specs and /guides
pnpm dev                    # http://localhost:3000
```

`pnpm sync:docs` runs automatically on `pnpm dev` and `pnpm build`.

In auto mode (default), the sync script prefers sibling repos at `../specs`
and `../docs` if they exist (the developer's local working tree). Otherwise
it shallow-clones from GitHub into `.docs-cache/`.

### Force the source

```sh
OUTCALL_DOCS_SOURCE=local  pnpm sync:docs   # always use ../specs and ../docs
OUTCALL_DOCS_SOURCE=remote pnpm sync:docs   # always clone from GitHub
```

### Pin a different ref

```sh
OUTCALL_SPECS_REF=v1.2.0 OUTCALL_DOCS_REF=stable pnpm sync:docs
```

## Production builds

CI clones the docs repos and builds a fully static site. Recommended
deployment surfaces are Vercel (zero config), Cloudflare Pages, or any host
that runs `pnpm build` and serves `.next` / static output.

## Editing content

| What | Where |
|---|---|
| Marketing copy (hero, features) | `components/marketing/*.tsx` in this repo |
| `/docs` landing page | `content/docs/index.mdx` in this repo |
| Operator guides | the [`outcall-dev/docs`](https://github.com/outcall-dev/docs) repo |
| Specifications | the [`outcall-dev/specs`](https://github.com/outcall-dev/specs) repo |

Edit-on-GitHub links and "last updated" timestamps are not wired up yet.
The fumadocs page wrapper at `app/docs/[[...slug]]/page.tsx` renders
title + description + body only; adding them means passing the matching
props to `<DocsPage>` — see the fumadocs docs for the prop shape.

## Theme

Brand variables live in `app/globals.css` under the `:root` and `:root.light`
selectors. Tailwind's `@theme` block defines a small accessible palette used
by Tailwind utilities (`bg-brand-500` etc.).

## Copy left for a contributor

Two marketing components are good candidates for iteration:

- `components/marketing/hero.tsx` — the headline + sub-line. Sharper threat
  model framing would land harder than the current cure-side framing.
- `components/marketing/features.tsx` — six feature card descriptions, each
  one a candidate for a real proof point.

Both are isolated to a single component each and are safe to iterate on.
