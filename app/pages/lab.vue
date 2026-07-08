<script setup lang="ts">
import type { Photo } from '~/components/LightBox.vue'

useHead({ title: 'Lab - Kryptos' })
useSeoMeta({
  description: 'The Kryptos homelab: Ryzen 9 9950X analysis box on Proxmox behind Ubiquiti gear.',
  ogTitle: 'Lab - Kryptos',
  ogDescription: 'The homelab: Ryzen 9 9950X analysis box on Proxmox behind Ubiquiti gear, ingress via Cloudflare Zero Trust.'
})

// Count-up numerals; armed when the spec row scrolls in.
const cores = useCountUp(16, 700)
const memory = useCountUp(256, 900)
const specRow = ref<HTMLElement>()
onMounted(() => {
  cores.arm(specRow.value ?? null)
  memory.arm(specRow.value ?? null)
})

const network = [
  { name: 'Edge gateway', value: 'Ubiquiti UDM Pro', detail: '10G SFP+ uplink' },
  { name: 'Core switch', value: 'Ubiquiti USW Pro', detail: 'Multi-layer switching' }
]

const photos: Photo[] = [
  {
    thumb: '/images/lab_thumb.webp',
    full: '/images/lab_full.webp',
    alt: 'Server rack with the analysis box and Ubiquiti network gear',
    file: 'RACK_01.WEBP',
    desc: 'The 9950X box and the Ubiquiti gear.'
  },
  {
    thumb: '/images/setup_thumb.webp',
    full: '/images/setup_full.webp',
    alt: 'Arch Linux workstation with multiple displays',
    file: 'STATION.WEBP',
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
    <section class="masthead container">
      <div class="masthead-strip">
        <span class="label rise rise-1">// hardware, network, photos</span>
        <span class="label rise rise-1">NODES: 1</span>
      </div>
      <h1 class="macro h-page rise rise-2">Lab</h1>
      <p class="copy rise rise-3" style="margin-top: 24px;">
        One analysis node. Malware analysis, DMA-based memory forensics,
        and disposable VMs for anything untrusted.
      </p>
    </section>

    <section v-fade-in class="section section-fade-in">
      <div class="container">
        <div class="section-head">
          <h2 class="macro h-zone">[ Hardware ]</h2>
        </div>
        <div ref="specRow" v-stagger v-spotlight class="panel stat-grid cols-3 cascade">
          <div class="spec-cell">
            <span class="spec-name">Compute</span>
            <p class="spec-num">{{ cores.value.value }}<span class="unit">CORES</span></p>
            <p class="spec-value">AMD Ryzen 9 9950X</p>
            <p class="spec-detail">Zen 5, 32 threads</p>
          </div>
          <div class="spec-cell">
            <span class="spec-name">Memory</span>
            <p class="spec-num">{{ memory.value.value }}<span class="unit">GB</span></p>
            <p class="spec-value">DDR5</p>
            <p class="spec-detail">Running at 6000MHz</p>
          </div>
          <div class="spec-cell">
            <span class="spec-name">Virtualization</span>
            <p class="spec-num">8<span class="unit">VE</span></p>
            <p class="spec-value">Proxmox</p>
            <p class="spec-detail">KVM and LXC workloads</p>
          </div>
        </div>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <div class="container">
        <div class="section-head">
          <h2 class="macro h-zone">[ Network ]</h2>
          <span class="label">INGRESS: CLOUDFLARE ZERO TRUST</span>
        </div>
        <div v-spotlight class="panel net-rows">
          <div v-for="node in network" :key="node.name" class="net-row">
            <span class="net-role">{{ node.name }}</span>
            <span class="net-device">{{ node.value }}</span>
            <span class="net-detail">{{ node.detail }}</span>
          </div>
        </div>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <div class="container">
        <div class="section-head">
          <h2 class="macro h-zone">[ Photos ]</h2>
        </div>
        <div v-stagger class="photo-grid cascade">
          <div
            v-for="(photo, i) in photos"
            :key="photo.file"
            class="photo-card"
            role="button"
            tabindex="0"
            :aria-label="`Open ${photo.desc}`"
            @click="openAt(i)"
            @keydown.enter.prevent="openAt(i)"
            @keydown.space.prevent="openAt(i)"
          >
            <div class="img-frame">
              <img :src="photo.thumb" :alt="photo.alt" class="gallery-thumb" width="1240" height="775" loading="lazy" decoding="async">
            </div>
            <div class="photo-meta">
              <span class="file-name">{{ photo.file }}</span>
              <p class="desc">{{ photo.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <LightBox v-model:open="open" v-model:index="index" :photos="photos" />
  </div>
</template>
