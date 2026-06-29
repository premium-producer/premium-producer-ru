# GitHub Pages Deploy

## Repository

- GitHub repo: `premium-producer/premium-producer-ru`
- Publishing source target: GitHub Actions artifact built from `dist/`
- Custom domain: `премиум-продюсер.рф`
- Punycode custom domain: `xn----htbbcmxbrdffgdmx6p.xn--p1ai`

## GitHub Pages Settings

Status: enabled.

The repository was made public and GitHub Pages was enabled successfully.

Live URL:

```text
https://премиум-продюсер.рф/
```

```text
source: GitHub Actions
custom domain: xn----htbbcmxbrdffgdmx6p.xn--p1ai
status: built
HTTPS: certificate approved; direct HTTPS works
```

In GitHub:

1. Open `premium-producer/premium-producer-ru`.
2. Go to `Settings` -> `Pages`.
3. Set source to `GitHub Actions`.
4. The workflow `.github/workflows/pages.yml` runs `npm run build` and deploys `dist/`.
5. Set custom domain to `xn----htbbcmxbrdffgdmx6p.xn--p1ai`.
6. Save.
7. Enable `Enforce HTTPS` when GitHub allows it.

## Local Build

```bash
npm run build
npm run preview
```

The source pages live in `src/pages/`. Product cards are generated from
`src/products/<product>/product.json` and product-local images in
`src/products/<product>/assets/`. The public routes `/`, `/black/`, and `/gold/`
are generated into `dist/` during deployment.

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

## Current DNS Status

As of 2026-06-29, local DNS, Google DNS, and Cloudflare DNS resolve the apex domain to GitHub Pages:

```text
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
CNAME www premium-producer.github.io.
```

`https://премиум-продюсер.рф/` returns `200 OK`.
`https://www.премиум-продюсер.рф/` redirects to the apex HTTPS domain.

## HTTPS Enforcement

The certificate is approved by GitHub Pages. If `http://премиум-продюсер.рф/`
does not automatically redirect to HTTPS, enable `Enforce HTTPS` in GitHub
repository settings: `Settings` -> `Pages`.
