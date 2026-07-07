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
const dialogEl = ref<HTMLElement>()
const closeBtn = ref<HTMLButtonElement>()
let lastFocused: HTMLElement | null = null

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

// Keep Tab cycling inside the dialog while it is open.
function trapTab(e: KeyboardEvent) {
  const focusables = dialogEl.value?.querySelectorAll<HTMLElement>('button')
  if (!focusables?.length) return
  const list = [...focusables]
  const first = list[0]!
  const last = list[list.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

function onKey(e: KeyboardEvent) {
  if (!props.open) return
  if (e.key === 'ArrowLeft') navigate(-1)
  else if (e.key === 'ArrowRight') navigate(1)
  else if (e.key === 'Escape') close()
  else if (e.key === 'Tab') trapTab(e)
}

// Focus management + background scroll lock.
watch(() => props.open, (open) => {
  if (open) {
    lastFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    nextTick(() => closeBtn.value?.focus())
  } else {
    document.body.style.overflow = ''
    lastFocused?.focus()
    lastFocused = null
  }
})

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <div
    id="lightbox"
    ref="dialogEl"
    class="lightbox"
    :class="{ 'is-open': open }"
    role="dialog"
    aria-modal="true"
    :aria-label="current?.desc || 'Image viewer'"
    @click="onBackdrop"
  >
    <button
      ref="closeBtn"
      class="lightbox-close"
      aria-label="Close image viewer"
      @click="close"
    >&times;</button>

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
      <span class="lightbox-label">// record:</span> {{ current?.desc || 'Image record' }}
    </div>
    <div id="lightbox-counter" class="lightbox-counter">[ {{ index + 1 }} / {{ photos.length }} ]</div>
  </div>
</template>
