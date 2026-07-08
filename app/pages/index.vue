<script setup lang="ts">
import type { Repo } from '~/components/RepoCard.vue'

useHead({ title: 'Kryptos - Cybersecurity & Reverse Engineering' })
useSeoMeta({
  description: 'Kryptos. Cybersecurity student and reverse engineer: binary analysis, low-level tooling and a self-hosted lab.',
  ogTitle: 'Kryptos - Cybersecurity & Reverse Engineering',
  ogDescription: 'Cybersecurity student and reverse engineer: binary analysis, low-level tooling and a self-hosted lab.'
})

const { data: repos, error } = await useFetch<Repo[]>('/api/github-repos')
const work = computed(() => (repos.value || []).slice(0, 5))
const offline = computed(() => Boolean(error.value) || !repos.value)
</script>

<template>
  <div>
    <section class="hero">
      <div class="hero-atmo" aria-hidden="true" />
      <div class="container">
        <div class="hero-visual" aria-hidden="true">
          <ClientOnly>
            <WireFrame />
          </ClientOnly>
        </div>
        <div class="masthead-strip">
          <span class="label rise rise-1 caret">// self-hosted, no open ports</span>
          <span class="label rise rise-1">EST. 2024 / SVK</span>
        </div>
        <h1 class="macro giant rise rise-2">Kryptos</h1>
        <p class="hero-sub rise rise-3">
          I reverse binaries and build low-level tools. Cybersecurity student
          at SPSE Presov, working in C, C++, Rust and Go.
        </p>
        <div class="hero-actions rise rise-4">
          <NuxtLink to="/projects" class="button">View the work</NuxtLink>
          <a href="https://github.com/Kryptos-s" target="_blank" rel="noopener noreferrer" class="button ghost">GitHub</a>
        </div>
        <!-- instrumentation, not a paraphrase of the sub: numbers and facts
             the sentence above doesn't already state -->
        <div class="panel stat-grid cols-4 hero-stats rise rise-5">
          <div>
            <span class="cell-label">Crackme</span>
            <span class="cell-value">1,400+ downloads</span>
          </div>
          <div>
            <span class="cell-label">Lab node</span>
            <span class="cell-value">16C / 256GB / Proxmox</span>
          </div>
          <div>
            <span class="cell-label">Ingress</span>
            <span class="cell-value">Cloudflare Zero Trust</span>
          </div>
          <div>
            <span class="cell-label">Environment</span>
            <span class="cell-value">Arch Linux / IDA Pro</span>
          </div>
        </div>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <div class="container">
        <div class="section-head">
          <h2 class="macro h-zone">[ Work Index ]</h2>
          <span class="label">{{ offline ? 'SOURCE: GITHUB / OFFLINE' : `SOURCE: GITHUB / LIVE / N=${work.length}` }}</span>
        </div>
        <div v-if="work.length" v-stagger v-spotlight class="panel work-rows cascade">
          <RepoCard v-for="repo in work" :key="repo.name" :repo="repo" />
        </div>
        <p v-else-if="offline" class="state-note error">
          [ERR] GITHUB LINK OFFLINE.
          <a href="https://github.com/Kryptos-s" target="_blank" rel="noopener noreferrer">OPEN GITHUB</a>
        </p>
        <p v-else class="state-note">
          [NULL] NO PUBLIC REPOSITORIES FOUND.
        </p>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <div class="container">
        <div class="section-head">
          <h2 class="macro h-zone">[ The Lab ]</h2>
          <span class="label">NODES: 1 / PROXMOX</span>
        </div>
        <div v-spotlight class="panel split">
          <div class="split-copy">
            <p class="copy">
              A Ryzen 9 9950X box with 256GB of DDR5 on Proxmox, behind
              Ubiquiti gear. Runs the VMs for malware analysis and memory
              forensics.
            </p>
            <NuxtLink to="/lab" class="button ghost">See the lab</NuxtLink>
          </div>
          <div class="split-media">
            <img
              src="/images/setup_split.webp"
              alt="The Arch Linux workstation where most of the work happens"
              width="1400"
              height="1050"
              loading="lazy"
              decoding="async"
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
