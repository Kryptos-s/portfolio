<script setup lang="ts">
import type { Photo } from '~/components/LightBox.vue'

useHead({ title: 'Kryptos Terminal - Gallery' })

const photos: Photo[] = [
  {
    thumb: '/images/lab_setup_thumbnail.jpg',
    full: '/images/lab_setup.jpg',
    alt: 'Server Rack',
    file: 'RACK_01.JPG',
    desc: 'the 9950X box and the ubiquiti gear.'
  },
  {
    thumb: '/images/setup_thumbnail.jpg',
    full: '/images/setup.jpg',
    alt: 'Workstation',
    file: 'STATION.JPG',
    desc: 'the arch box where most of the work happens.'
  }
]

const open = ref(false)
const index = ref(0)

function openAt(i: number) {
  index.value = i
  open.value = true
}
</script>

<template>
  <section v-fade-in class="terminal-box section-fade-in">
    <h2 class="with-cursor">$ ls -R /var/www/evidence/</h2>
    <p class="prompt-line">pictures of the rack and the desk.</p>

    <div class="photo-grid">
      <div
        v-for="(photo, i) in photos"
        :key="photo.file"
        class="photo-card"
        @click="openAt(i)"
      >
        <div class="img-frame">
          <img :src="photo.thumb" :alt="photo.alt" class="gallery-thumb">
          <div class="overlay">VIEW RECORD</div>
        </div>
        <div class="photo-meta">
          <span class="file-name">{{ photo.file }}</span>
          <p class="desc">{{ photo.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <LightBox v-model:open="open" v-model:index="index" :photos="photos" />
</template>
