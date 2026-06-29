# Project Memory

## Snapshot

Date: 2026-06-29

The user is building a personal website for the domain `премиум-продюсер.рф`. The project is maintained in GitHub repo `premium-producer/premium-producer-ru`, deployed through GitHub Pages from `main` branch and repository root.

The site started as a Linktree-style page, then shifted into a minimalist portfolio/catalog inspired by the sparse Yeezy product grid: large white field, fixed minimal header, 6-column desktop work grid, object-like abstract visuals, short work codes under objects, and minimal footer links.

The user specifically requested an `agent/` folder and an `agent/memory/` subfolder for persistent context. They later requested `agent/local/` for private local-only data that must not be committed.

## Current Structure

- `.gitignore`
- `.nojekyll`
- `CNAME`
- `README.md`
- `index.html`
- `black/index.html`
- `gold/index.html`
- `styles.css`
- `docs/deploy-github-pages.md`
- `agent/README.md`
- `agent/project-brief.md`
- `agent/worklog.md`
- `agent/memory/context.md`
- `agent/memory/decisions.md`
- `agent/memory/next-steps.md`
- `agent/local/` ignored local-only data, not committed
- `src/`
- `public/`

## Current Architecture

- Static website, no build step.
- Main entry: `index.html`.
- Theme route entries: `black/index.html` and `gold/index.html`.
- Styling: `styles.css`.
- Behavior: `script.js`.
- Static assets: `public/`.
- GitHub Pages publishes from branch `main`, folder `/root`.
- Domain configured through root `CNAME`: `xn----htbbcmxbrdffgdmx6p.xn--p1ai`.
- Local preview command: `python3 -m http.server <port>`.

## Current Libraries And External Assets

- Google Fonts: Outfit, weights `200`, `300`, `400`, `500`.
- Lenis `1.3.25` from jsDelivr for a controlled desktop smooth-scroll trial.
- Current Lenis desktop wheel speed uses `wheelMultiplier: 0.9375`, which is 25% faster than the earlier `0.75` trial.
- Lenis runs only on desktop/fine pointer, with reduced-motion fallback and native scroll fallback if CDN fails.
- Custom fleur-de-lis cursor asset: `public/fleur-cursor.svg`, generated from user-provided reference SVG.
- Reference materials live in `agent/referens/`, including Yeezy-like visual references and fleur-de-lis references.

## Current UX Decisions

- Overall direction: thin, minimal, sparse, luxury/catalog feeling.
- The root page currently uses the `theme-gold` route styling.
- `/black/` provides the strict black-and-white minimal version.
- `/gold/` provides the velvet burgundy-and-gold version.
- Typography should be light/thin, not bold.
- Work codes like `PR-01` sit below each visual object.
- Vertical rhythm matters: distance from visual to label should feel balanced against distance from label to the next visual row.
- Native Mac scrolling felt too plain, but the first custom `preventDefault` wheel implementation felt bad on Mac trackpad. Current trial uses Lenis instead.
- Custom cursor should be a small heraldic fleur-de-lis. Current SVG size is `21x21`, about 1.5x smaller than the earlier `32x32`.
- Desktop cursor should react to mouse movement inertia rather than aim at work objects: horizontal pointer velocity sets a `-45deg..45deg` lean, then the cursor smoothly returns to center.
- Cursor uses color inversion (`filter: invert(1)` with `mix-blend-mode: difference`) rather than staying visually static.
- Cursor link hover zoom should be subtle and smooth; current hover scale is `1.4`, animated through CSS `@property --cursor-scale`.
- Mobile/touch devices should avoid custom cursor and avoid forced smooth-scroll behavior.

## Deployment And Domain

The GitHub repository was created by the user through the GitHub web UI. Initial files were uploaded through the connected GitHub app, then local HTTPS credentials were configured through macOS Keychain. Direct `git push` now works. The repository is now public so GitHub Pages can be used on the free plan.

GitHub Pages is enabled from branch `main`, folder `/root`; status is `built`. Reg.ru DNS resource records were updated in the UI to:

- `A @ 185.199.108.153`
- `A @ 185.199.109.153`
- `A @ 185.199.110.153`
- `A @ 185.199.111.153`

On 2026-06-29, local DNS, Google DNS, and Cloudflare DNS returned the four GitHub Pages IPs. The root `CNAME` file was restored with `xn----htbbcmxbrdffgdmx6p.xn--p1ai`. `https://премиум-продюсер.рф/` returns the deployed site with `200 OK`; `https://www.премиум-продюсер.рф/` redirects to the apex HTTPS domain.

## Known User Data

- Public/contact email: `hello@premium-producer.ru`.
- Private/local-only data belongs in `agent/local/`, which is ignored by git.

## Ideas Under Consideration

- Move from plain static HTML/CSS/JS to a maintainable app framework later, likely Next.js or another static-capable framework, when detailed cards, data storage, animations, filtering, and richer project pages become real needs.
- Add detailed work cards/project pages.
- Add richer motion for cards and transitions rather than over-controlling the wheel/trackpad.
- Replace placeholder abstract objects with real work assets when available.
- Keep the first screen as the actual catalog experience, not a landing page.
