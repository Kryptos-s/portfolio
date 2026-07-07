<script setup lang="ts">
import type { Repo } from '~/components/RepoCard.vue'

useHead({ title: 'Projects - Kryptos' })
useSeoMeta({ description: 'Public repositories by Kryptos, pulled live from GitHub.' })

const { data: repos, error, status } = await useFetch<Repo[]>('/api/github-repos')
</script>

<template>
  <div>
    <section class="hero">
      <h1 class="page-title rise rise-1">Projects</h1>
      <p class="hero-sub rise rise-2">
        Public repositories, pulled live from GitHub.
        Writeups for solved crackmes live on
        <a href="https://crackmes.one/records/Kryptos-s" target="_blank" rel="noopener noreferrer">crackmes.one</a>.
      </p>
    </section>

    <section class="section" style="margin-top: 48px;">
      <div v-if="status === 'pending'" aria-hidden="true">
        <div v-for="n in 5" :key="n" class="skeleton" style="min-height: 92px; margin-bottom: 12px;" />
      </div>

      <p v-else-if="error || !repos" class="state-note error">
        // github link offline. try again in a bit.
      </p>

      <p v-else-if="repos.length === 0" class="state-note">
        // no public repositories found.
      </p>

      <div v-else v-fade-in v-stagger class="work-rows cascade section-fade-in">
        <RepoCard v-for="repo in repos" :key="repo.name" :repo="repo" />
      </div>
    </section>
  </div>
</template>
