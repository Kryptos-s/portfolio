<script setup lang="ts">
export interface Photo {
  thumb: string
  full: string
  alt: string
  file: string
  desc: string
}

const props = defineProps<{
  photos: Photo[]
  open: boolean
  index: number
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:index': [value: number]
}>()

const current = computed(() => props.photos[props.index])

function close() {
  emit('update:open', false)
}

function navigate(dir: number) {
  const n = props.photos.length
  if (n === 0) return
  emit('update:index', (props.index + dir + n) % n)
}

function onBackdrop(e: MouseEvent) {
  if ((e.target as HTMLElement).id === 'lightbox') close()
}

function onKey(e: KeyboardEvent) {
  if (!props.open) return
  if (e.key === 'ArrowLeft') navigate(-1)
  else if (e.key === 'ArrowRight') navigate(1)
  else if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div id="lightbox" class="lightbox" :class="{ 'is-open': open }" @click="onBackdrop">
    <span class="lightbox-close" @click="close">&times;</span>
    <button
      v-if="photos.length > 1"
      class="lightbox-prev"
      aria-label="Previous image"
      @click="navigate(-1)"
    >&#10094;</button>

    <img
      id="lightbox-img"
      class="lightbox-content"
      :src="open ? (current?.full || '') : ''"
      :alt="current?.alt || ''"
    >

    <button
      v-if="photos.length > 1"
      class="lightbox-next"
      aria-label="Next image"
      @click="navigate(1)"
    >&#10095;</button>

    <div id="lightbox-caption" class="lightbox-caption">
      <span class="lightbox-label">// RECORD:</span> {{ current?.desc || 'Image Record' }}
    </div>
    <div id="lightbox-counter" class="lightbox-counter">[ {{ index + 1 }} / {{ photos.length }} ]</div>
  </div>
</template>
