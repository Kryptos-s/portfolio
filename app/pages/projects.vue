<script setup lang="ts">
import type { Repo } from '~/components/RepoCard.vue'

useHead({ title: 'Projects - Kryptos' })
useSeoMeta({ description: 'Public repositories by Kryptos, pulled live from GitHub.' })

const { data: repos, error, status } = await useFetch<Repo[]>('/api/github-repos')
</script>

<template>
  <div>
    <section class="masthead container">
      <div class="masthead-strip">
        <span class="label rise rise-1">// public repositories, pulled live</span>
        <span class="label rise rise-1">SORT: LAST_PUSH</span>
      </div>
      <h1 class="macro h-page rise rise-2">Projects</h1>
    </section>

    <section class="zone" style="margin-top: 48px;">
      <div class="container">
        <div class="zone-head">
          <h2 class="macro h-zone">[ Index ]</h2>
          <span class="label">
            crackme writeups &gt;&gt;&gt;
            <a href="https://crackmes.one/records/Kryptos-s" target="_blank" rel="noopener noreferrer" class="accent">crackmes.one</a>
          </span>
        </div>

        <div v-if="status === 'pending'" aria-hidden="true">
          <div v-for="n in 5" :key="n" class="skeleton" style="margin-bottom: 8px;" />
        </div>

        <p v-else-if="error || !repos" class="state-note error">
          [ERR] GITHUB LINK OFFLINE. TRY AGAIN IN A BIT.
        </p>

        <p v-else-if="repos.length === 0" class="state-note">
          [NULL] NO PUBLIC REPOSITORIES FOUND.
        </p>

        <div v-else v-fade-in v-stagger class="work-rows cascade section-fade-in">
          <RepoCard v-for="(repo, i) in repos" :key="repo.name" :repo="repo" :idx="i" />
        </div>
      </div>
    </section>
  </div>
</template>
