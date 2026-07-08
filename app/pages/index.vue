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
    <section class="masthead container">
      <div class="masthead-strip">
        <span class="label rise rise-1 caret">// now: wrapping up a C++ networking project</span>
        <span class="label rise rise-1">EST. 2024 / SVK</span>
      </div>
      <h1 class="macro giant rise rise-2">Kryptos</h1>
      <p class="statement rise rise-3">
        I reverse binaries and build low-level tools.
      </p>
      <div v-stagger class="compartments masthead-data cascade section-fade-in is-visible">
        <div>
          <span class="cell-label">Discipline</span>
          <span class="cell-value">Cybersecurity / reverse engineering</span>
        </div>
        <div>
          <span class="cell-label">Languages</span>
          <span class="cell-value">C / C++ / Rust / Go</span>
        </div>
        <div>
          <span class="cell-label">Status</span>
          <span class="cell-value">Student @ SPSE Presov, YR 1</span>
        </div>
        <NuxtLink to="/projects" class="cell-link">
          <span class="cell-label">Next</span>
          <span class="cell-value">View the work &gt;&gt;&gt;</span>
        </NuxtLink>
      </div>
    </section>

    <section v-fade-in class="zone section-fade-in" style="margin-top: 72px;">
      <div class="container">
        <div class="zone-head">
          <h2 class="macro h-zone">[ Work Index ]</h2>
          <span class="label">{{ offline ? 'SOURCE: GITHUB / OFFLINE' : `SOURCE: GITHUB / LIVE / N=${work.length}` }}</span>
        </div>
        <div v-if="work.length" v-stagger class="work-rows cascade">
          <RepoCard v-for="(repo, i) in work" :key="repo.name" :repo="repo" :idx="i" />
        </div>
        <p v-else-if="offline" class="state-note error">
          [ERR] GITHUB LINK OFFLINE.
          <a href="https://github.com/Kryptos-s" target="_blank" rel="noopener noreferrer" class="accent">OPEN GITHUB &gt;&gt;&gt;</a>
        </p>
        <p v-else class="state-note">
          [NULL] NO PUBLIC REPOSITORIES FOUND.
        </p>
      </div>
    </section>

    <section v-fade-in class="zone section-fade-in">
      <div class="container">
        <div class="zone-head">
          <h2 class="macro h-zone">[ The Lab ]</h2>
          <span class="label">NODES: 1 / PROXMOX</span>
        </div>
        <div class="split">
          <div class="split-copy">
            <p class="copy">
              A Ryzen 9 9950X box with 256GB of DDR5 running Proxmox, behind
              Ubiquiti gear. Malware analysis, memory forensics and a lot of
              broken VMs.
            </p>
            <NuxtLink to="/lab" class="button">Tour the lab &gt;&gt;&gt;</NuxtLink>
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
