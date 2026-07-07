<script setup lang="ts">
import type { Repo } from '~/components/RepoCard.vue'

useHead({ title: 'Projects - Kryptos' })
useSeoMeta({
  description: 'Selected work by Kryptos: terminal tooling and homelab infrastructure in Go, an authored crackme, and the full public index pulled live from GitHub.',
  ogTitle: 'Projects - Kryptos',
  ogDescription: 'Selected work: terminal tooling and homelab infrastructure in Go, an authored crackme, and the full public index pulled live from GitHub.'
})

const { data: repos, error, status } = await useFetch<Repo[]>('/api/github-repos')

// Curated writeups. Facts and phrasing come from each repo's own README;
// the live index below stays the source of truth for everything else.
const selected = [
  {
    name: 'LyriTerm',
    url: 'https://github.com/Kryptos-s/LyriTerm',
    facts: ['LANG: GO', 'IFACE: TUI', 'DIST: AUR / GO INSTALL'],
    copy: 'Synced lyrics for whatever is playing, rendered in the terminal. Reads the active player over MPRIS, pulls timing data from LRCLIB, and highlights word by word, karaoke style, when the track carries it. Packaged for the AUR.'
  },
  {
    name: 'Homelab Monitor',
    url: 'https://github.com/Kryptos-s/homelab-monitor',
    facts: ['LANG: GO', 'SHAPE: AGENTS + DASHBOARD', 'TARGETS: LINUX / WINDOWS'],
    copy: 'Distributed monitoring for the LAN. Each node runs a static Go agent exposing CPU, memory, disk and throughput over HTTP; one dashboard polls the fleet, groups nodes and raises alerts. No cloud dependency; everything stays on the LAN.'
  },
  {
    name: 'This Site',
    url: 'https://github.com/Kryptos-s/portfolio',
    facts: ['STACK: NUXT 4 / NITRO', 'DB: SQLITE', 'INGRESS: CF ZERO TRUST'],
    copy: 'The page you are reading. Nuxt SSR on a self-hosted box behind a Cloudflare Tunnel, so the server never exposes a public port. Nonce-based CSP, rate-limited API, repos pulled live from GitHub. The stack is part of the resume.'
  }
]
</script>

<template>
  <div>
    <section class="masthead container">
      <div class="masthead-strip">
        <span class="label rise rise-1">// selected work first, full public index below</span>
        <span class="label rise rise-1">SOURCE: GITHUB / CRACKMES.ONE</span>
      </div>
      <h1 class="macro h-page rise rise-2">Projects</h1>
    </section>

    <section v-fade-in class="zone section-fade-in" style="margin-top: 48px;">
      <div class="container">
        <div class="zone-head">
          <h2 class="macro h-zone">[ Selected ]</h2>
          <span class="label">CURATED / N={{ selected.length }}</span>
        </div>
        <div v-stagger class="compartments cascade">
          <div v-for="project in selected" :key="project.name" class="sel-row">
            <div>
              <h3 class="sel-name">{{ project.name }}</h3>
              <div class="sel-facts">
                <span v-for="fact in project.facts" :key="fact" class="label">{{ fact }}</span>
              </div>
            </div>
            <div class="sel-body">
              <p>{{ project.copy }}</p>
              <div class="sel-links">
                <a :href="project.url" target="_blank" rel="noopener noreferrer">Source &gt;&gt;&gt;</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-fade-in class="zone section-fade-in">
      <div class="container">
        <div class="zone-head">
          <h2 class="macro h-zone">[ Crackme ]</h2>
          <span class="label">
            SOURCE:
            <a href="https://crackmes.one/user/Kryptos" target="_blank" rel="noopener noreferrer" class="accent">CRACKMES.ONE</a>
            / SNAPSHOT: 2026-07
          </span>
        </div>
        <p class="copy" style="margin-bottom: 28px;">
          Published for other reversers to break. Four of them wrote it up.
        </p>
        <div v-stagger class="compartments record-grid cascade">
          <div>
            <span class="cell-label">Name</span>
            <a
              href="https://crackmes.one/crackme/69e13f938afd9d6c48b488fd"
              target="_blank"
              rel="noopener noreferrer"
              class="cell-value"
            >Simple login crackme &gt;&gt;&gt;</a>
          </div>
          <div>
            <span class="cell-label">Lang</span>
            <span class="cell-value">C / C++</span>
          </div>
          <div>
            <span class="cell-label">Target</span>
            <span class="cell-value">x86-64 / Windows</span>
          </div>
          <div>
            <span class="cell-label">Writeups</span>
            <span class="cell-value">4 public</span>
          </div>
          <div>
            <span class="cell-label">Downloads</span>
            <span class="cell-value">1,400+</span>
          </div>
        </div>
      </div>
    </section>

    <section class="zone">
      <div class="container">
        <div class="zone-head">
          <h2 class="macro h-zone">[ Index ]</h2>
          <span class="label">SORT: LAST_PUSH / LIVE</span>
        </div>

        <div v-if="status === 'pending'" aria-hidden="true">
          <div v-for="n in 5" :key="n" class="skeleton" style="margin-bottom: 8px;" />
        </div>

        <p v-else-if="error || !repos" class="state-note error">
          [ERR] GITHUB LINK OFFLINE.
          <a href="https://github.com/Kryptos-s" target="_blank" rel="noopener noreferrer" class="accent">READ THE INDEX AT SOURCE &gt;&gt;&gt;</a>
        </p>

        <p v-else-if="repos.length === 0" class="state-note">
          [NULL] NO PUBLIC REPOSITORIES FOUND.
        </p>

        <div v-else v-fade-in v-stagger class="work-rows cascade section-fade-in">
          <RepoCard v-for="(repo, i) in repos" :key="repo.name" :repo="repo" :idx="i" />
        </div>
      </div>
    </section>
  </div>
</template>
