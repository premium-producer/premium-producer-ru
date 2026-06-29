# Project Brief

## Goal

Build a personal website for the domain `премиум-продюсер.рф`: a thin, minimal, sparse portfolio/catalog of producer work inspired by the structure of Yeezy's product grid, adapted for services and projects rather than ecommerce.

## Known Inputs

- Domain: `премиум-продюсер.рф`
- GitHub repo: `premium-producer/premium-producer-ru`
- The project must include an `agent/` folder.
- The `agent/` folder must include `memory/` for project context and continuity.
- The project must include `agent/local/` for private local-only files; this folder must stay ignored by git.
- Contact email: `hello@premium-producer.ru`.
- Font: Google Fonts Outfit.
- Current hosting: GitHub Pages from `main` branch, repository root.
- Current frontend: static HTML routes with modular assets under `assets/css/` and `assets/js/`.
- Current smooth-scroll trial: Lenis `1.3.25` via jsDelivr.

## Direction

- Keep the first screen as the catalog itself, not a marketing landing page.
- Keep typography thin and minimal.
- Preserve balanced grid rhythm: object, code, whitespace, next object.
- Use custom fleur-de-lis cursor on desktop.
- Avoid heavy custom wheel-scroll code that fights Mac trackpad physics.

## Open Questions

- Real project names, descriptions, and assets.
- Final category taxonomy.
- Whether to stay static or migrate to Next.js/static export when the content model grows.
