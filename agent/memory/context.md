# Project Memory

## Snapshot

Date: 2026-06-28

The user wants to build a personal website for the domain `премиум-продюсер.рф`. They have GitHub and want the project maintained there. They specifically requested an `agent/` folder and an `agent/memory/` subfolder for persistent context.

GitHub owner detected through the connected GitHub app: `premium-producer`.

## Current Structure

- `.gitignore`
- `.nojekyll`
- `CNAME`
- `README.md`
- `index.html`
- `styles.css`
- `docs/deploy-github-pages.md`
- `agent/README.md`
- `agent/project-brief.md`
- `agent/worklog.md`
- `agent/memory/context.md`
- `agent/memory/decisions.md`
- `agent/memory/next-steps.md`
- `src/`
- `public/`

## Next Likely Step

Enable GitHub Pages for `premium-producer/premium-producer-ru`, configure DNS records for `премиум-продюсер.рф`, and replace placeholder social links with real URLs.

The GitHub repository was created by the user through the GitHub web UI. Initial files were uploaded through the connected GitHub app, then local HTTPS credentials were configured through macOS Keychain. Direct `git push` now works.

The current site is a static Linktree-style page designed to be published from branch `main`, folder `/root`.
