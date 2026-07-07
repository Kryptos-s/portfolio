<script setup lang="ts">
export interface Repo {
  name: string
  description: string | null
  language: string | null
  stars: number
  url: string
  updated: string
}

const props = defineProps<{ repo: Repo }>()

// Only allow http(s) links through, same guard as the original github.js safeUrl().
function safeUrl(url: string) {
  try {
    const u = new URL(url, 'https://github.com')
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.href
  } catch {
    /* fall through */
  }
  return '#'
}

const description = computed(() => props.repo.description || 'No description yet.')
const language = computed(() => props.repo.language || 'Text')
const updated = computed(() =>
  new Date(props.repo.updated).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric'
  })
)
const href = computed(() => safeUrl(props.repo.url))
</script>

<template>
  <a :href="href" target="_blank" rel="noopener noreferrer" class="card repo-card">
    <h3>
      <span>{{ repo.name }}</span>
      <svg class="arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>
    </h3>
    <p class="repo-desc">{{ description }}</p>
    <div class="repo-meta">
      <span class="lang">{{ language }}</span>
      <span v-if="repo.stars > 0">★ {{ repo.stars }}</span>
      <span>{{ updated }}</span>
    </div>
  </a>
</template>
