# GitHub Pages Deploy

## Repository

- GitHub repo: `premium-producer/premium-producer-ru`
- Publishing source target: branch `main`, folder `/root`
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
source: main / root
custom domain: xn----htbbcmxbrdffgdmx6p.xn--p1ai
status: built
HTTPS: certificate approved; direct HTTPS works
```

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
