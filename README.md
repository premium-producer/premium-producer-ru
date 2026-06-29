# premium-producer.rf personal site

Personal website project for the domain `премиум-продюсер.рф`.

## Current status

Static minimalist works catalog is published with GitHub Pages.

The repository keeps source files out of the deploy root:

- `src/pages/` contains route source files for `/`, `/black/`, and `/gold/`.
- `src/products/<product>/` contains each visible product's data and local image assets.
- `src/assets/css/main.css` imports base layers and component styles.
- `src/assets/js/main.js` imports feature modules for the detail view, cursor, and smooth scroll.
- `scripts/build-site.mjs` builds the public `dist/` artifact for GitHub Pages.

Live URL:

https://премиум-продюсер.рф/

Local preview:

```bash
npm run preview
```

## Deployment

See `docs/deploy-github-pages.md`.
