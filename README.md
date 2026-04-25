# outcall.dev (or wherever this lands)

Marketing/landing site for Outcall. Single-page static HTML — no framework, no build step.

## Files

- `index.html` — landing page
- `style.css` — styling (monochrome dark + indigo accent)

## Local preview

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Or any static server (`npx serve .`, `caddy file-server`, etc.).

## Deploy

### GitHub Pages (zero config)

1. Push to `main` on `outcall-dev/website`.
2. Settings → Pages → source: `main`, folder: `/ (root)`.
3. Site is live at `https://outcall-dev.github.io/website/` (or a custom domain via `CNAME`).

### Cloudflare Pages

1. Connect the repo.
2. Build command: _(none)_, output directory: `/`.
3. Done.

## Design

- Dark monochrome palette with one indigo accent (`--accent: #7c8cff`).
- System font stack — no web fonts, no extra requests.
- Mobile breakpoint at 600px.

To revisit when there's a real design system: spacing scale, type scale, motion, brand mark.
