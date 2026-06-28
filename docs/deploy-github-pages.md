# GitHub Pages Deploy

## Repository

- GitHub repo: `premium-producer/premium-producer-ru`
- Publishing source target: branch `main`, folder `/root`
- Custom domain: `премиум-продюсер.рф`
- Punycode custom domain: `xn----htbbcmxbrdffgdmx6p.xn--p1ai`

## GitHub Pages Settings

Status: blocked for the current private repository plan.

GitHub API returned:

```text
Your current plan does not support GitHub Pages for this repository.
```

To use GitHub Pages, either make the repository public or use a GitHub plan that supports Pages for private repositories.

In GitHub:

1. Open `premium-producer/premium-producer-ru`.
2. Go to `Settings` -> `Pages`.
3. Set source to `Deploy from a branch`.
4. Select branch `main` and folder `/root`.
5. Set custom domain to `xn----htbbcmxbrdffgdmx6p.xn--p1ai`.
6. Save.
7. Enable `Enforce HTTPS` when GitHub allows it.

## DNS Records

For apex domain `премиум-продюсер.рф`, add these `A` records:

```text
@  A  185.199.108.153
@  A  185.199.109.153
@  A  185.199.110.153
@  A  185.199.111.153
```

Optional IPv6 `AAAA` records:

```text
@  AAAA  2606:50c0:8000::153
@  AAAA  2606:50c0:8001::153
@  AAAA  2606:50c0:8002::153
@  AAAA  2606:50c0:8003::153
```

If configuring `www`, add:

```text
www  CNAME  premium-producer.github.io
```

DNS propagation can take up to 24 hours.

## Private Repository Alternatives

If the repository must stay private, use one of these deployment targets instead:

- Vercel
- Cloudflare Pages
- Netlify

All three can deploy a static HTML/CSS site and connect a custom domain while keeping the GitHub repository private.
