<script setup lang="ts">
import type { Repo } from '~/components/RepoCard.vue'

useHead({ title: 'Kryptos - Cybersecurity & Reverse Engineering' })
useSeoMeta({ description: 'Kryptos. Cybersecurity student and reverse engineer building low-level tools in C, C++ and Rust.' })

const { data: repos } = await useFetch<Repo[]>('/api/github-repos')
const work = computed(() => (repos.value || []).slice(0, 5))
</script>

<template>
  <div>
    <section class="masthead container">
      <div class="masthead-strip">
        <span class="label rise rise-1 caret">// now: wrapping up a C++ networking project</span>
        <span class="label rise rise-1">EST. 2024 / SVK</span>
      </div>
      <h1 class="macro giant rise rise-2">Kryptos</h1>
      <div v-stagger class="compartments masthead-data cascade section-fade-in is-visible">
        <div>
          <span class="cell-label">Discipline</span>
          <span class="cell-value">Cybersecurity / reverse engineering</span>
        </div>
        <div>
          <span class="cell-label">Languages</span>
          <span class="cell-value">C / C++ / Rust</span>
        </div>
        <div>
          <span class="cell-label">Status</span>
          <span class="cell-value">Student @ SPSE Presov, YR 1</span>
        </div>
        <div>
          <span class="cell-label">Environment</span>
          <span class="cell-value">Arch Linux / Proxmox / IDA Pro</span>
        </div>
      </div>
    </section>

    <section v-fade-in class="zone section-fade-in" style="margin-top: 72px;">
      <div class="container">
        <p class="statement">
          I take binaries apart to see how they work.
          <span class="dim">Then I build things that hold together.</span>
        </p>
      </div>
    </section>

    <section v-if="work.length" v-fade-in class="zone section-fade-in">
      <div class="container">
        <div class="zone-head">
          <h2 class="macro h-zone">[ Work Index ]</h2>
          <span class="label">SOURCE: GITHUB / LIVE / N={{ work.length }}</span>
        </div>
        <div v-stagger class="work-rows cascade">
          <RepoCard v-for="(repo, i) in work" :key="repo.name" :repo="repo" :idx="i" />
        </div>
      </div>
    </section>

    <section v-fade-in class="zone section-fade-in">
      <div class="container">
        <div class="zone-head">
          <h2 class="macro h-zone">[ The Lab ]</h2>
          <span class="label">1 PRIMARY ANALYSIS CLUSTER</span>
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
            <img src="/images/setup.jpg" alt="The Arch Linux workstation where most of the work happens" loading="lazy">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
