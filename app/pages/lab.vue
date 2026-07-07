<script setup lang="ts">
import type { Photo } from '~/components/LightBox.vue'

useHead({ title: 'Lab - Kryptos' })
useSeoMeta({
  description: 'The Kryptos homelab: Ryzen 9 9950X analysis box on Proxmox behind Ubiquiti gear.'
})

const specs = [
  { name: 'Compute', value: 'AMD Ryzen 9 9950X', detail: '16 cores / 32 threads, Zen 5' },
  { name: 'Memory', value: '256GB DDR5', detail: 'Running at 6000MHz' },
  { name: 'Virtualization', value: 'Proxmox VE 8', detail: 'KVM and LXC workloads' }
]

const network = [
  { name: 'Edge gateway', value: 'Ubiquiti UDM Pro', detail: '10G SFP+ uplink' },
  { name: 'Core switch', value: 'Ubiquiti USW Pro', detail: 'Multi-layer switching' }
]

const photos: Photo[] = [
  {
    thumb: '/images/lab_setup_thumbnail.jpg',
    full: '/images/lab_setup.jpg',
    alt: 'Server rack with the analysis box and Ubiquiti network gear',
    file: 'rack_01.jpg',
    desc: 'The 9950X box and the Ubiquiti gear.'
  },
  {
    thumb: '/images/setup_thumbnail.jpg',
    full: '/images/setup.jpg',
    alt: 'Arch Linux workstation with multiple displays',
    file: 'station.jpg',
    desc: 'The Arch box where most of the work happens.'
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
  <div>
    <section class="hero">
      <h1 class="rise rise-1">The lab</h1>
      <p class="hero-sub rise rise-2">
        One primary analysis cluster. Used for malware analysis,
        DMA-based memory forensics and whatever needs a disposable VM.
      </p>
    </section>

    <section v-fade-in class="section section-fade-in" style="margin-top: 48px;">
      <div class="grid-3">
        <div v-for="spec in specs" :key="spec.name" class="spec-tile">
          <span class="spec-name">{{ spec.name }}</span>
          <p class="spec-value">{{ spec.value }}</p>
          <p class="spec-detail">{{ spec.detail }}</p>
        </div>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <h2 class="section-title">Network</h2>
      <p class="section-lede">Everything rides through Ubiquiti, tunneled out via Cloudflare Zero Trust.</p>
      <div class="net-rows">
        <div v-for="node in network" :key="node.name" class="net-row">
          <span class="net-role">{{ node.name }}</span>
          <span class="net-device">{{ node.value }}</span>
          <span class="net-detail">{{ node.detail }}</span>
        </div>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <h2 class="section-title">In the flesh</h2>
      <p class="section-lede">The rack and the desk.</p>
      <div class="photo-grid">
        <div
          v-for="(photo, i) in photos"
          :key="photo.file"
          class="photo-card"
          role="button"
          tabindex="0"
          :aria-label="`Open ${photo.desc}`"
          @click="openAt(i)"
          @keydown.enter="openAt(i)"
        >
          <div class="img-frame">
            <img :src="photo.thumb" :alt="photo.alt" class="gallery-thumb" loading="lazy">
          </div>
          <div class="photo-meta">
            <span class="file-name">{{ photo.file }}</span>
            <p class="desc">{{ photo.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <LightBox v-model:open="open" v-model:index="index" :photos="photos" />
  </div>
</template>
