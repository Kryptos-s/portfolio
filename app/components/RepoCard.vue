<script setup lang="ts">
// One repository as an index-table row.
export interface Repo {
  name: string
  description: string | null
  language: string | null
  stars: number
  url: string
  updated: string
}

const props = defineProps<{ repo: Repo; idx: number }>()

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
const language = computed(() => (props.repo.language || 'txt').toUpperCase())
const href = computed(() => safeUrl(props.repo.url))
const index = computed(() => String(props.idx + 1).padStart(2, '0'))
</script>

<template>
  <a :href="href" target="_blank" rel="noopener noreferrer" class="work-row">
    <span class="work-idx">{{ index }}</span>
    <span class="work-name">{{ repo.name }}</span>
    <span class="work-desc">{{ description }}</span>
    <span class="work-lang">{{ language }}</span>
    <span class="work-arrow" aria-hidden="true">&gt;&gt;&gt;</span>
  </a>
</template>
