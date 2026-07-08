<script setup lang="ts">
// One repository as an index row.
export interface Repo {
  name: string
  description: string | null
  language: string | null
  stars: number
  url: string
  pushed: string
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

const description = computed(() => props.repo.description || 'No description pushed')
const language = computed(() => (props.repo.language || 'txt').toUpperCase())
const href = computed(() => safeUrl(props.repo.url))
// 'PUSHED 2026-06' matches the index's SORT: LAST_PUSH label.
const pushed = computed(() => {
  const iso = (props.repo.pushed || '').slice(0, 7)
  return iso ? `PUSHED ${iso}` : ''
})
</script>

<template>
  <a :href="href" target="_blank" rel="noopener noreferrer" class="work-row">
    <span class="work-name">{{ repo.name }}</span>
    <span class="work-desc">{{ description }}</span>
    <span class="work-chips">
      <span class="chip">{{ language }}</span>
      <span v-if="pushed" class="chip">{{ pushed }}</span>
    </span>
    <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
  </a>
</template>
