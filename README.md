# premium-producer.rf personal site

Personal website project for the domain `премиум-продюсер.рф`.

## Current status

Static minimalist works catalog is published with GitHub Pages.

The frontend stays build-free for GitHub Pages, but assets are organized as
small modules:

- `assets/css/main.css` imports base layers and component styles.
- `assets/js/main.js` imports feature modules for the detail view, cursor, and smooth scroll.

Live URL:

https://премиум-продюсер.рф/

Local preview:

```bash
python3 -m http.server 4173
```

## Deployment

See `docs/deploy-github-pages.md`.
