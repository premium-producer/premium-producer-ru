# Frontend architecture

This site is intentionally static: GitHub Pages publishes the repository root on
`main`, so there is no build step and no generated output to deploy.

## CSS

`src/assets/css/main.css` is the only stylesheet linked from HTML source. It composes the
site from small layers:

- `base/tokens.css`: color themes and shared design tokens.
- `base/reset.css`: document defaults and shared primitives.
- `components/*.css`: isolated UI surfaces such as header, grid, detail view,
  cursor, visuals, and footer.
- `base/responsive.css`: viewport-specific overrides collected at the end so
  they win predictably.

## JavaScript

`src/assets/js/main.js` is the only script module linked from HTML source. Feature modules
live in `src/assets/js/features/`:

- `work-detail.js`: centered product/detail viewer.
- `fleur-cursor.js`: custom inverted cursor behavior.
- `smooth-scroll.js`: Lenis setup and shared instance exposure.

Keep new behavior as feature modules and import it from `main.js`.
