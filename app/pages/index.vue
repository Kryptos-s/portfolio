<script setup lang="ts">
import type { Repo } from '~/components/RepoCard.vue'

useHead({ title: 'Kryptos - Cybersecurity & Reverse Engineering' })
useSeoMeta({ description: 'Kryptos. Cybersecurity student and reverse engineer building low-level tools in C, C++ and Rust.' })

const { data: repos } = await useFetch<Repo[]>('/api/github-repos')
const featured = computed(() => (repos.value || []).slice(0, 4))
</script>

<template>
  <div>
    <section class="hero">
      <p class="hero-status rise rise-1">// now: wrapping up a C++ networking project</p>
      <h1 class="rise rise-2">Cybersecurity student<br>&amp; reverse engineer.</h1>
      <p class="hero-sub rise rise-3">
        I'm Kryptos. I build networking tools in C, C++ and Rust,
        and spend my nights taking binaries apart.
      </p>
      <div class="hero-actions rise rise-4">
        <NuxtLink to="/projects" class="button primary">View projects</NuxtLink>
        <NuxtLink to="/about" class="button secondary">More about me</NuxtLink>
      </div>
    </section>

    <section v-if="featured.length" v-fade-in class="section section-fade-in">
      <h2 class="section-title">Selected work</h2>
      <p class="section-lede">Recent repositories, pulled straight from GitHub.</p>
      <div class="grid-2">
        <RepoCard v-for="repo in featured" :key="repo.name" :repo="repo" />
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
          <NuxtLink to="/lab" class="button secondary">Tour the lab</NuxtLink>
        </div>
        <div class="split-media">
          <img src="/images/setup.jpg" alt="The Arch Linux workstation where most of the work happens" loading="lazy">
        </div>
      </div>
    </section>
  </div>
</template>
