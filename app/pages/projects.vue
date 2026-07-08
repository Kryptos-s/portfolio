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
    facts: ['GO', 'TUI', 'AUR'],
    copy: 'Terminal app that shows synced lyrics for the currently playing song. Reads the active player over MPRIS, pulls lyrics from LRCLIB, and highlights word by word when timing data exists. Packaged for the AUR.'
  },
  {
    name: 'Homelab Monitor',
    url: 'https://github.com/Kryptos-s/homelab-monitor',
    facts: ['GO', 'AGENTS + DASHBOARD', 'LINUX / WINDOWS'],
    copy: 'Self-hosted LAN monitoring. Each node runs a static Go agent exposing CPU, memory, disk and network metrics over HTTP; a central dashboard polls the agents, groups nodes and raises alerts. No cloud dependencies.'
  },
  {
    name: 'This Site',
    url: 'https://github.com/Kryptos-s/portfolio',
    facts: ['NUXT 4 / NITRO', 'SQLITE', 'CF ZERO TRUST'],
    copy: 'Nuxt SSR on a self-hosted box behind a Cloudflare Tunnel; the server never exposes a public port. Nonce-based CSP, rate-limited API, repos pulled live from GitHub.'
  }
]
</script>

<template>
  <div>
    <section class="masthead container">
      <div class="masthead-strip">
        <span class="label rise rise-1">// selected work + live github index</span>
      </div>
      <h1 class="macro h-page rise rise-2">Projects</h1>
    </section>

    <section v-fade-in class="section section-fade-in">
      <div class="container">
        <div class="section-head">
          <h2 class="macro h-zone">[ Selected ]</h2>
          <span class="label">CURATED / N={{ selected.length }}</span>
        </div>
        <div v-stagger v-spotlight class="panel work-rows cascade">
          <div v-for="project in selected" :key="project.name" class="sel-row">
            <div>
              <h3 class="sel-name">{{ project.name }}</h3>
              <div class="sel-facts">
                <span v-for="fact in project.facts" :key="fact" class="chip">{{ fact }}</span>
              </div>
            </div>
            <div class="sel-body">
              <p>{{ project.copy }}</p>
              <div class="sel-links">
                <a :href="project.url" target="_blank" rel="noopener noreferrer">
                  Source
                  <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <div class="container">
        <div class="section-head">
          <h2 class="macro h-zone">[ Crackme ]</h2>
          <span class="label">
            SOURCE:
            <a href="https://crackmes.one/user/Kryptos" target="_blank" rel="noopener noreferrer" class="accent">CRACKMES.ONE</a>
            / SNAPSHOT: 2026-07
          </span>
        </div>
        <div v-stagger v-spotlight class="panel stat-grid cols-5 cascade">
          <div>
            <span class="cell-label">Name</span>
            <a
              href="https://crackmes.one/crackme/69e13f938afd9d6c48b488fd"
              target="_blank"
              rel="noopener noreferrer"
              class="cell-value"
            >Simple login crackme</a>
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

    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2 class="macro h-zone">[ Full Index ]</h2>
          <span class="label">SORT: LAST_PUSH / LIVE</span>
        </div>

        <div v-if="status === 'pending'">
          <p class="visually-hidden" role="status">Loading repositories</p>
          <div aria-hidden="true">
            <div v-for="n in 5" :key="n" class="skeleton" style="margin-bottom: 10px;" />
          </div>
        </div>

        <p v-else-if="error || !repos" class="state-note error">
          [ERR] GITHUB LINK OFFLINE.
          <a href="https://github.com/Kryptos-s" target="_blank" rel="noopener noreferrer">OPEN GITHUB</a>
        </p>

        <p v-else-if="repos.length === 0" class="state-note">
          [NULL] NO PUBLIC REPOSITORIES FOUND.
        </p>

        <div v-else v-fade-in v-stagger v-spotlight class="panel work-rows cascade section-fade-in">
          <RepoCard v-for="repo in repos" :key="repo.name" :repo="repo" />
        </div>
      </div>
    </section>
  </div>
</template>
