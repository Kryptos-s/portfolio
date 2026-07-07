<script setup lang="ts">
import type { Repo } from '~/components/RepoCard.vue'

useHead({ title: 'Kryptos Terminal - Projects' })

// Fetched during SSR via the Nitro proxy (which caches upstream GitHub calls).
const { data: repos, error, status } = await useFetch<Repo[]>('/api/github-repos')
</script>

<template>
  <section class="terminal-box section-fade-in is-visible">
    <h2 class="with-cursor">$ git fetch --all</h2>
    <p class="prompt-line">pulling repos from github...</p>

    <div id="project-gallery-grid" class="gallery-grid">
      <p v-if="status === 'pending'">Connecting to secure socket...</p>

      <div v-else-if="error || !repos" class="terminal-box">
        <p class="error">// ERROR: {{ error?.message || 'System link to GitHub offline.' }}</p>
      </div>

      <p v-else-if="repos.length === 0" class="terminal-box">No repositories found.</p>

      <RepoCard v-for="repo in repos" v-else :key="repo.name" :repo="repo" />
    </div>
  </section>
</template>
