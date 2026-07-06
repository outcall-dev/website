#!/usr/bin/env node
// Pulls documentation from external repos at build time, just like Laravel.
//
//   marketing site (this repo) ─── pulls ───▶ outcall-dev/specs   (S000–S015)
//                                  pulls ───▶ outcall-dev/docs    (guides)
//
// Local dev: if a sibling directory exists at ../specs or ../docs (the layout
//   in the developer's monorepo working tree), we copy from there. Faster, no
//   network, lets you preview unpushed spec changes.
//
// CI / production: clones from GitHub via shallow git clone.
//
// Override via env:
//   OUTCALL_DOCS_SOURCE=local|remote   (default: auto)
//   OUTCALL_SPECS_REPO=https://...     (default: github.com/outcall-dev/specs)
//   OUTCALL_DOCS_REPO=https://...      (default: github.com/outcall-dev/docs)
//   OUTCALL_SPECS_REF=branch|sha       (default: main)
//   OUTCALL_DOCS_REF=branch|sha        (default: main)

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const CONFIG = {
  mode: process.env.OUTCALL_DOCS_SOURCE ?? 'auto', // auto | local | remote
  specs: {
    repo: process.env.OUTCALL_SPECS_REPO ?? 'https://github.com/outcall-dev/specs.git',
    ref: process.env.OUTCALL_SPECS_REF ?? 'main',
    localPath: join(ROOT, '..', 'specs'),
    target: join(ROOT, 'content', 'docs', 'specs'),
    cacheDir: join(ROOT, '.docs-cache', 'specs'),
  },
  guides: {
    repo: process.env.OUTCALL_DOCS_REPO ?? 'https://github.com/outcall-dev/docs.git',
    ref: process.env.OUTCALL_DOCS_REF ?? 'main',
    localPath: join(ROOT, '..', 'docs'),
    target: join(ROOT, 'content', 'docs', 'guides'),
    cacheDir: join(ROOT, '.docs-cache', 'guides'),
  },
};

const SPEC_TITLES = {
  '000-workspace': 'S000 · Workspace Structure',
  '001-bridge-management': 'S001 · Bridge Management',
  '002-network-management': 'S002 · Network Management',
  '003-rule-engine': 'S003 · Rule Engine',
  '004-agent-api': 'S004 · Agent API',
  '005-agent-shim': 'S005 · Agent Shim',
  '006-http-proxy': 'S006 · HTTP Proxy',
  '007-dns-filter': 'S007 · DNS Filter',
  '008-docker-manager': 'S008 · Docker Manager',
  '009-dynamic-rules': 'S009 · Dynamic Rules',
  '010-dashboard': 'S010 · Dashboard',
  '011-tls-interception': 'S011 · TLS Interception (optional)',
  '012-test-coverage': 'S012 · Test Coverage',
  '013-agent-name-context': 'S013 · Agent-Name Rule Context',
  '014-agent-boot': 'S014 · Agent Boot Command',
  '015-security-boundary': 'S015 · Security Boundary and Rule Enforcement',
};

const SUBPAGE_ORDER = [
  // The sidebar follows this order. Re-order to taste.
  // WHAT IT DOES → HOW YOU TALK TO IT → HOW WE PROVED IT → WHERE IT BREAKS.
  { file: 'functional-requirements.md', title: 'Functional requirements' },
  { file: 'interface-requirements.md', title: 'Interface requirements' },
  { file: 'acceptance-scenarios.md', title: 'Acceptance scenarios' },
  { file: 'success-criteria.md', title: 'Success criteria' },
  { file: 'edge-cases.md', title: 'Edge cases' },
];

// Preferred order for the operator-guides sidebar. Files not listed here are
// appended in alphabetical order. Mirrors a "you read this top-to-bottom"
// onboarding flow: install → run it → tune it → fix it.
const GUIDE_ORDER = [
  'installation',
  'quickstart',
  'configuration',
  'cli',
  'rules',
  'container-guide',
  'troubleshooting',
  'testing',
];

function log(...args) {
  console.log('[sync-docs]', ...args);
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim();
}

function pickSource(target) {
  if (CONFIG.mode === 'local') return 'local';
  if (CONFIG.mode === 'remote') return 'remote';
  return existsSync(target.localPath) ? 'local' : 'remote';
}

function ensureClone(target) {
  if (existsSync(join(target.cacheDir, '.git'))) {
    log(`refreshing ${basename(target.cacheDir)}…`);
    git(['fetch', '--depth', '1', 'origin', target.ref], target.cacheDir);
    git(['reset', '--hard', 'FETCH_HEAD'], target.cacheDir);
  } else {
    log(`cloning ${target.repo} (${target.ref})…`);
    if (existsSync(target.cacheDir)) rmSync(target.cacheDir, { recursive: true, force: true });
    mkdirSync(dirname(target.cacheDir), { recursive: true });
    git(['clone', '--depth', '1', '--branch', target.ref, target.repo, target.cacheDir]);
  }
  return target.cacheDir;
}

function resolveSource(target) {
  const source = pickSource(target);
  if (source === 'local') {
    log(`using local ${relative(ROOT, target.localPath)}`);
    return target.localPath;
  }
  return ensureClone(target);
}

function clean(dir) {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

function frontmatter(fields) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && /[:#&*!@,|>%]|^\s|\s$/.test(value)) {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push('---', '');
  return lines.join('\n');
}

function stripExistingFrontmatter(content) {
  if (!content.startsWith('---')) return content;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return content;
  return content.slice(end + 4).replace(/^\s*\n/, '');
}

function copyWithFrontmatter(srcFile, destFile, fields) {
  const raw = readFileSync(srcFile, 'utf8');
  const body = stripExistingFrontmatter(raw);
  mkdirSync(dirname(destFile), { recursive: true });
  writeFileSync(destFile, frontmatter(fields) + body);
}

// ─── specs (S000–S010) ──────────────────────────────────────────────────────

function syncSpecs() {
  const repoRoot = resolveSource(CONFIG.specs);
  // Spec modules live under `<repo>/specs/`, not at the repo root. The README
  // stays at the repo root and is rendered into the top-level index.
  const specsRoot = join(repoRoot, 'specs');
  clean(CONFIG.specs.target);

  // Top-level index. README links to GitHub-relative paths like
  // `specs/000-workspace/index.md`; rewrite those to Fumadocs slugs
  // (`./000-workspace`) so they resolve at `/docs/specs/000-workspace`
  // on the deployed site.
  const readme = existsSync(join(repoRoot, 'README.md'))
    ? readFileSync(join(repoRoot, 'README.md'), 'utf8')
        .replace(/^# .*\n+/, '')
        .replace(/^!\[[^\]]*]\(https?:\/\/[^)]+\)\n+/gm, '')
        .replace(/\]\(specs\/(\d{3}-[^/)]+)\/index\.md\)/g, '](./$1)')
    : '';
  writeFileSync(
    join(CONFIG.specs.target, 'index.md'),
    frontmatter({
      title: 'Specifications',
      description: 'Outcall is built spec-first. Modular specs S000–S015 define the system.',
    }) + readme
  );

  const specDirs = existsSync(specsRoot)
    ? readdirSync(specsRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory() && /^\d{3}-/.test(e.name))
        .map((e) => e.name)
        .sort()
    : [];

  writeFileSync(
    join(CONFIG.specs.target, 'meta.json'),
    JSON.stringify({ title: 'Specifications', pages: ['index', ...specDirs] }, null, 2)
  );

  for (const dir of specDirs) {
    const specSource = join(specsRoot, dir);
    const specTarget = join(CONFIG.specs.target, dir);
    mkdirSync(specTarget, { recursive: true });

    const title = SPEC_TITLES[dir] ?? dir;

    if (existsSync(join(specSource, 'index.md'))) {
      copyWithFrontmatter(join(specSource, 'index.md'), join(specTarget, 'index.md'), {
        title,
        description: `Specification module ${dir}`,
      });
    }

    const subpages = SUBPAGE_ORDER.filter((p) => existsSync(join(specSource, p.file)));

    for (const page of subpages) {
      const slug = page.file.replace(/\.md$/, '');
      copyWithFrontmatter(join(specSource, page.file), join(specTarget, `${slug}.md`), {
        title: page.title,
      });
    }

    writeFileSync(
      join(specTarget, 'meta.json'),
      JSON.stringify(
        {
          title,
          pages: ['index', ...subpages.map((p) => p.file.replace(/\.md$/, ''))],
        },
        null,
        2
      )
    );
  }

  log(`specs synced (${specDirs.length} modules)`);
}

// ─── guides (hand-written docs from outcall-dev/docs) ───────────────────────

function syncGuides() {
  const repoRoot = resolveSource(CONFIG.guides);
  // Guide markdown used to live under `<repo>/docs/md/`; the public docs repo
  // now stores the same files directly under `<repo>/docs/`.
  const legacyGuidesRoot = join(repoRoot, 'docs', 'md');
  const guidesRoot = existsSync(legacyGuidesRoot) ? legacyGuidesRoot : join(repoRoot, 'docs');
  clean(CONFIG.guides.target);

  // Skip files that exist for the docs repo's own tooling, not for site readers:
  //   - README.md: repo-level overview
  //   - AGENTS.md / CLAUDE.md: agent-tooling context (claude-mem etc.)
  const SKIP_GUIDE_FILES = new Set(['README.md', 'AGENTS.md', 'CLAUDE.md']);
  const candidates = existsSync(guidesRoot)
    ? readdirSync(guidesRoot, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith('.md') && !SKIP_GUIDE_FILES.has(e.name))
        .map((e) => e.name)
        .sort()
    : [];

  for (const file of candidates) {
    const slug = file.replace(/\.md$/, '');
    const title = slug.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join(' ');
    copyWithFrontmatter(join(guidesRoot, file), join(CONFIG.guides.target, `${slug}.md`), { title });
  }

  const testsDir = join(repoRoot, 'docs', 'tests');
  let testFiles = [];
  if (existsSync(testsDir) && statSync(testsDir).isDirectory()) {
    testFiles = readdirSync(testsDir).filter((f) => f.endsWith('.md') && f !== 'README.md');
  }
  // Skip creating the /docs/guides/tests page when there's no content to put
  // in it; an empty nav entry just creates a dead route on the site.
  if (testFiles.length > 0) {
    const testTarget = join(CONFIG.guides.target, 'tests');
    mkdirSync(testTarget, { recursive: true });
    for (const entry of testFiles) {
      const slug = entry.replace(/\.md$/, '');
      copyWithFrontmatter(join(testsDir, entry), join(testTarget, `${slug}.md`), {
        title: `Test plan · ${slug}`,
      });
    }
    writeFileSync(
      join(testTarget, 'meta.json'),
      JSON.stringify(
        { title: 'Test plans', pages: testFiles.map((f) => f.replace(/\.md$/, '')) },
        null,
        2
      )
    );
  }

  const slugs = candidates.map((f) => f.replace(/\.md$/, ''));
  const ordered = [
    ...GUIDE_ORDER.filter((s) => slugs.includes(s)),
    ...slugs.filter((s) => !GUIDE_ORDER.includes(s)).sort(),
  ];

  writeFileSync(
    join(CONFIG.guides.target, 'meta.json'),
    JSON.stringify(
      {
        title: 'Operator guides',
        pages: ordered.concat(testFiles.length > 0 ? ['tests'] : []),
      },
      null,
      2
    )
  );

  log(`guides synced (${candidates.length} files${testFiles.length ? `, ${testFiles.length} test plans` : ''})`);
}

// ─── main ───────────────────────────────────────────────────────────────────

function main() {
  log(`mode=${CONFIG.mode}`);
  mkdirSync(join(ROOT, 'content', 'docs'), { recursive: true });
  writeFileSync(
    join(ROOT, 'content', 'docs', 'index.mdx'),
    frontmatter({
      title: 'Welcome',
      description:
        "Outcall is a host-level firewall daemon for Docker agent containers. Read the guides if you're operating it; read the specs if you're contributing to it.",
    }) +
      `Outcall sits between agent containers and the outside world. It is one binary
that runs the bridge, the rule engine, the DNS filter, the HTTP proxy, the
container-side shim API, and the Docker network manager. It is opinionated in
exactly two directions: **default-deny** and **fail-closed**.

If \`outcalld\` is unreachable, every layer answers \`block\`, \`SERVFAIL\`, or
exit-5. There is no "best effort" mode.

## Pick your path

<Cards>
  <Card title="Quickstart" href="/docs/guides/quickstart" description="Run an agent that can reach exactly one host in five minutes." />
  <Card title="Installation" href="/docs/guides/installation" description="Capabilities, mounts, and release images." />
  <Card title="Writing rules" href="/docs/guides/rules" description="The YAML format, CEL conditions, and per-rule egress modes." />
  <Card title="Specifications" href="/docs/specs" description="Every functional requirement, interface, and edge case — versioned and stable." />
</Cards>

## Two kinds of documentation

- **[Operator guides](/docs/guides)** — installation, configuration, the CLI,
  rule authoring, troubleshooting.
- **[Specifications](/docs/specs)** — the formal source of truth for every
  Outcall subsystem.
`
  );
  writeFileSync(
    join(ROOT, 'content', 'docs', 'meta.json'),
    JSON.stringify({ title: 'Documentation', pages: ['index', 'guides', 'specs'] }, null, 2)
  );
  syncSpecs();
  syncGuides();
  log('done');
}

main();
