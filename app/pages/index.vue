<script setup lang="ts">
import type { Repo } from '~/components/RepoCard.vue'

useHead({ title: 'Kryptos - Cybersecurity & Reverse Engineering' })
useSeoMeta({ description: 'Kryptos. Cybersecurity student and reverse engineer building low-level tools in C, C++ and Rust.' })

const { data: repos } = await useFetch<Repo[]>('/api/github-repos')
const work = computed(() => (repos.value || []).slice(0, 5))
</script>

<template>
  <div>
    <section class="hero">
      <p class="hero-status rise rise-1">// now: wrapping up a C++ networking project</p>
      <h1 class="wordmark rise rise-2">Kryptos</h1>
      <div class="hero-role rise rise-3">
        <span>cybersecurity · reverse engineering · c-family</span>
        <span>student @ spse presov</span>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <p class="statement">
        I take binaries apart to see how they work.
        <span class="dim">Then I build things that hold together.</span>
      </p>
    </section>

    <section v-if="work.length" v-fade-in class="section section-fade-in">
      <h2 class="section-title">Work</h2>
      <p class="section-lede">Pulled live from GitHub. Crackme writeups live on <a href="https://crackmes.one/records/Kryptos-s" target="_blank" rel="noopener noreferrer">crackmes.one</a>.</p>
      <div v-stagger class="work-rows cascade">
        <RepoCard v-for="repo in work" :key="repo.name" :repo="repo" />
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
        <div class="split-media">
          <img src="/images/setup.jpg" alt="The Arch Linux workstation where most of the work happens" loading="lazy">
        </div>
      </div>
    </section>
  </div>
</template>
