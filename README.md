# kryptos-terminal-portfolio

> personal site. terminal vibes. mostly an excuse to mess with stuff.



**Live Demo:** https://lab.kryptosss.xyz


![Website Preview](assets/preview.png)

---

## About

skipped the usual "about me" page and built a terminal-style site instead.

rebuilt on Nuxt now. still the same terminal look, just componentised — the pages,
the theme switcher, the hero typewriter, the gallery lightbox, the contact form.
the little API (contact form + github proxy) runs on Nuxt's Nitro server.

nothing's exposed directly. traffic comes through a Cloudflare Tunnel, so the box
never has an open public port.

---

## What's in here

- terminal-style UI, kinda like a shell prompt
- Nuxt (Vue 3) frontend, SSR
- small Nitro API for the contact form and a github proxy
- SQLite for storing messages + visitor logs
- server only listens on 127.0.0.1, all traffic comes through a Cloudflare Tunnel
- strict CSP + rate limiting via nuxt-security

---

## Stack

- framework: Nuxt 4 (Vue 3)
- server: Nitro (node)
- db: SQLite
- theming: @nuxtjs/color-mode (dark / light / purple)
- security: nuxt-security (helmet-style CSP, rate limiting), same-origin checks
- ingress: Cloudflare Tunnel (Zero Trust)

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Kryptos-s/portfolio.git
cd portfolio
npm install
```

---

### 2. Configuration

Create a `.env` file in the project root (copy `.env.example`):

```env
HOST=127.0.0.1
PORT=3000
NODE_ENV=production
DATABASE_PATH=./server/portfolio.db
GITHUB_USERNAME=your_username
GITHUB_TOKEN=optional_token
```

notes:
- `GITHUB_TOKEN` is optional. only purpose is dodging github's rate limit on unauthenticated requests.
- nothing else needs setting up.

---

### 3. Run

Dev (hot reload):

```bash
npm run dev
# http://127.0.0.1:3000
```

Production:

```bash
npm run build
npm run start
# serves .output on http://127.0.0.1:3000 (honours HOST/PORT)
```

---

## Architecture

```
[ Browser ]
     ↓
[ Cloudflare Edge ]
     ↓
[ Cloudflare Tunnel ]
     ↓
[ localhost:3000 ]
     ↓
[ Nuxt / Nitro server ]
     ↓
[ SQLite DB ]
```

the backend never gets a public IP. all traffic goes through Cloudflare's edge.

---

## API

- `GET /api/github-repos` — cached github proxy (5 min, serves stale on upstream failure)
- `POST /api/contact` — validated contact form, stored in SQLite
- `POST /api/log-visit` — basic visitor telemetry

all POST routes are same-origin only and rate limited in production.

---

## License

MIT
