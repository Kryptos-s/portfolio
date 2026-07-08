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
    <section class="hero container">
      <div class="hero-grid">
        <div>
          <p class="hero-eyebrow rise rise-1">Kryptos / est. 2024 / SVK</p>
          <h1 class="hero-title rise rise-2">I reverse binaries and build low-level tools.</h1>
          <p class="hero-sub rise rise-3">
            Cybersecurity student at SPSE Presov. C, C++, Rust and Go,
            self-hosted from a Proxmox box with no open ports.
          </p>
          <div class="hero-actions rise rise-4">
            <NuxtLink to="/projects" class="button">View the work</NuxtLink>
            <a href="https://github.com/Kryptos-s" target="_blank" rel="noopener noreferrer" class="button ghost">GitHub</a>
          </div>
        </div>
        <div class="hero-visual rise rise-4">
          <ClientOnly>
            <WireFrame />
          </ClientOnly>
        </div>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">Work</h2>
          <span class="label">{{ offline ? 'SOURCE: GITHUB / OFFLINE' : `SOURCE: GITHUB / LIVE / N=${work.length}` }}</span>
        </div>
        <div v-if="work.length" v-stagger class="panel work-rows cascade">
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
          <h2 class="section-title">The lab</h2>
          <span class="label">NODES: 1 / PROXMOX</span>
        </div>
        <div class="panel split">
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
