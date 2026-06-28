# Project Memory

## Snapshot

Date: 2026-06-29

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

Verify GitHub Pages accepts the restored custom domain and that HTTPS works for `https://премиум-продюсер.рф/`.

The GitHub repository was created by the user through the GitHub web UI. Initial files were uploaded through the connected GitHub app, then local HTTPS credentials were configured through macOS Keychain. Direct `git push` now works. The repository is now public so GitHub Pages can be used on the free plan.

The current site is a static Linktree-style page designed to be published from branch `main`, folder `/root`.

GitHub Pages is enabled from branch `main`, folder `/root`; status is `built`. Reg.ru DNS resource records were updated in the UI to:

- `A @ 185.199.108.153`
- `A @ 185.199.109.153`
- `A @ 185.199.110.153`
- `A @ 185.199.111.153`

On 2026-06-29, local DNS, Google DNS, and Cloudflare DNS returned the four GitHub Pages IPs. The root `CNAME` file was restored with `xn----htbbcmxbrdffgdmx6p.xn--p1ai`.
