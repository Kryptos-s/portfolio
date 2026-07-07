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

// Only allow http(s) links through, same guard as the old github.js safeUrl().
function safeUrl(url: string) {
  try {
    const u = new URL(url, 'https://github.com')
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.href
  } catch {
    /* fall through */
  }
  return '#'
}

const description = computed(() => props.repo.description || '// no description.')
const language = computed(() => props.repo.language || 'Plain')
const stars = computed(() => props.repo.stars || 0)
const date = computed(() => new Date(props.repo.updated).toLocaleDateString())
const href = computed(() => safeUrl(props.repo.url))
</script>

<template>
  <div class="terminal-box section-fade-in is-visible">
    <h3>$ git remote -v | grep {{ repo.name }}</h3>
    <p class="repo-summary">{{ description }}</p>

    <div class="repo-stats">
      <span class="tech-tag">{{ language }}</span>
      <span class="tech-tag">★ {{ stars }}</span>
      <span class="tech-tag">UPDT: {{ date }}</span>
    </div>

    <div class="repo-actions">
      <a class="button secondary" :href="href" target="_blank" rel="noopener noreferrer">VIEW SOURCE</a>
    </div>
  </div>
</template>
