````markdown
# kryptos-terminal-portfolio

> A retro, terminal-style personal portfolio and technical playground.

<!--
INSERT A HIGH-RES SCREENSHOT OR SHORT GIF HERE.
This is mandatory for a portfolio project.
-->

**Live Demo:** https://kryptos.xyz

---

## About

This project replaces a traditional “About Me” page with an interactive, terminal-inspired web interface.

The frontend is fully static and runs entirely in the browser.
A minimal Express backend is used only where persistence or external data is required.

Public access is routed exclusively through **Cloudflare Tunnel**, ensuring the backend never exposes a public IP or open port.

---

## Key Features

- **Interactive Terminal UI**  
  Command-driven interface inspired by classic UNIX shells.

- **Minimal Backend**  
  Express API used strictly for message persistence and limited API requests.

- **Local Persistence**  
  SQLite database for storing contact messages and operational data.

- **Restricted Exposure**  
  Server binds to `127.0.0.1` and is reachable only via Cloudflare Tunnel.

- **No Framework Bloat**  
  Built with vanilla JavaScript, HTML, and CSS.

---

## Tech Stack

- **Frontend:** Vanilla JS, HTML5, CSS3  
- **Backend:** Node.js, Express  
- **Database:** SQLite  
- **Security:** Helmet, rate limiting  
- **Ingress:** Cloudflare Tunnel (Zero Trust)

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

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./server/portfolio.db
GITHUB_USERNAME=your_username
GITHUB_TOKEN=optional_token
```

Notes:
- `GITHUB_TOKEN` is optional
- it is used only to avoid GitHub API rate limits
- no authentication secrets are required

---

### 3. Run

```bash
npm run dev
# Server runs on http://127.0.0.1:3000
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
[ Express API ]
     ↓
[ SQLite DB ]
```

The backend is never directly exposed to the public internet.

---

## Documentation

Full technical documentation, security model, and deployment notes are available in the Wiki:

https://github.com/Kryptos-s/portfolio/wiki

---

## License

MIT
````
