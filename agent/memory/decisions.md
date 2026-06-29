# Decisions

## 2026-06-28

- Use `agent/` as the working folder for agent documentation.
- Use `agent/memory/` for durable project context.
- Keep the initial website source folders as `src/` and `public/` until the final stack is chosen.
- Use GitHub owner `premium-producer`.
- Use GitHub repository `premium-producer/premium-producer-ru`.
- Use a plain static HTML/CSS site for the first Linktree version.
- Use GitHub Pages as the initial deployment target.
- Use Punycode `xn----htbbcmxbrdffgdmx6p.xn--p1ai` for the custom domain config.
- Make the GitHub repository public so GitHub Pages can be used on the free plan.
- Temporarily disable the custom domain by removing `CNAME` until DNS propagation completes.
- Restore the custom domain after public DNS resolves to GitHub Pages.
- Use a Yeezy-inspired sparse catalog layout for works, without copying the brand or product imagery directly.

## 2026-06-29

- Keep `agent/local/` ignored and use it only for local/private data that should not go to GitHub.
- Store user-facing contact email as `hello@premium-producer.ru`.
- Use Google Fonts Outfit for the site typography.
- Keep typography thin and minimal, preferring weights around `200` and `300`.
- Use static HTML/CSS/JS for the current phase because GitHub Pages is simple and enough for the first portfolio/catalog version.
- Consider Next.js or another static-capable app framework later when detailed cards, data-backed content, richer animation, filtering, or admin-like workflows become necessary.
- Use generated CSS/HTML abstract work visuals for now instead of copied product imagery.
- Use a small fleur-de-lis custom cursor based on the user's SVG reference.
- Do not use the first custom `preventDefault` wheel-scroll implementation; it felt bad on Mac trackpad.
- Use pinned Lenis `1.3.25` from jsDelivr for the current smooth-scroll trial.
- Enable Lenis only on desktop/fine pointer and leave native scroll as fallback for mobile, reduced-motion users, and CDN failure.
- Do not use `cferdinandi/smooth-scroll` for page-wide smooth scrolling because it targets anchor-link animation, not ordinary wheel/trackpad smoothing.
- Increase Lenis wheel speed by 25% from the first trial: `wheelMultiplier` changed from `0.75` to `0.9375`.
- Make the desktop fleur-de-lis cursor rotate from mouse movement inertia, not from nearest-object aiming.
- Clamp cursor rotation to `-45deg..45deg` so it only leans left or right, then smoothly returns to center.
- Keep `/` as the gold visual version for now, and add static route folders `/black/` and `/gold/` for theme-specific variants on GitHub Pages.
