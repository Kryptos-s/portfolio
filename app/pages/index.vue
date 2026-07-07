<script setup lang="ts">
import type { Repo } from '~/components/RepoCard.vue'

useHead({ title: 'Kryptos - Cybersecurity & Reverse Engineering' })
useSeoMeta({ description: 'Kryptos. Cybersecurity student and reverse engineer building low-level tools in C, C++ and Rust.' })

const { data: repos } = await useFetch<Repo[]>('/api/github-repos')
const featured = computed(() => (repos.value || [])[0])
const rest = computed(() => (repos.value || []).slice(1, 5))
</script>

<template>
  <div>
    <section class="hero hero-home">
      <div>
        <p class="hero-status rise rise-1">// now: wrapping up a C++ networking project</p>
        <h1 class="rise rise-2">Cybersecurity student<br>&amp; <span class="sheen">reverse engineer</span>.</h1>
        <p class="hero-sub rise rise-3">
          I'm Kryptos. I build networking tools in C, C++ and Rust,
          and spend my nights taking binaries apart.
        </p>
        <div class="hero-actions rise rise-4">
          <NuxtLink v-magnetic to="/projects" class="button primary">View projects</NuxtLink>
          <NuxtLink v-magnetic to="/about" class="button secondary">More about me</NuxtLink>
        </div>
      </div>
      <div class="hero-visual rise rise-5">
        <ClientOnly>
          <WireFrame />
        </ClientOnly>
      </div>
    </section>

    <section v-if="repos?.length" v-fade-in class="section section-fade-in">
      <h2 class="section-title">Selected work</h2>
      <p class="section-lede">Recent repositories, pulled straight from GitHub.</p>
      <div v-stagger class="grid-2 cascade">
        <RepoCard v-if="featured" v-spotlight :repo="featured" class="repo-feature">
          <template #flag><span class="feature-flag">latest push</span></template>
        </RepoCard>
        <RepoCard v-for="repo in rest" :key="repo.name" v-spotlight :repo="repo" />
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <div class="split">
        <div>
          <h2 class="section-title">The lab</h2>
          <p class="section-lede">
            A Ryzen 9 9950X box with 256GB of DDR5 running Proxmox,
            behind Ubiquiti gear. Malware analysis, memory forensics
            and a lot of broken VMs.
          </p>
          <NuxtLink v-magnetic to="/lab" class="button secondary">Tour the lab</NuxtLink>
        </div>
        <div v-parallax class="split-media">
          <img src="/images/setup.jpg" alt="The Arch Linux workstation where most of the work happens" loading="lazy">
        </div>
      </div>
    </section>
  </div>
</template>
