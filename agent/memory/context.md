# Project Memory

## Snapshot

Date: 2026-06-28

The user wants to build a personal website for the domain `премиум-продюсер.рф`. They have GitHub and want the project maintained there. They specifically requested an `agent/` folder and an `agent/memory/` subfolder for persistent context.

GitHub owner detected through the connected GitHub app: `premium-producer`.

## Current Structure

- `.gitignore`
- `README.md`
- `agent/README.md`
- `agent/project-brief.md`
- `agent/worklog.md`
- `agent/memory/context.md`
- `src/`
- `public/`

## Next Likely Step

Create private GitHub repository `premium-producer/premium-producer-rf`, connect it as `origin`, and push `main`.

The connector currently exposes repository file/issue/PR operations but not repository creation. Local `gh` is not installed and no `GITHUB_TOKEN`/`GH_TOKEN` is present in the shell environment, so remote creation requires GitHub web UI authorization or another authenticated method.
