<script setup lang="ts">
useHead({ title: 'About - Kryptos' })
useSeoMeta({
  description: 'Who Kryptos is: networking and CS student, low-level systems and security work in C, C++ and Rust.'
})

const skillGroups = [
  {
    title: 'Languages',
    items: [
      { name: 'C / C++ / C#', level: 'advanced' },
      { name: 'Rust / Python', level: 'intermediate' },
      { name: 'HTML / JS / TS', level: 'beginner' }
    ]
  },
  {
    title: 'Systems & Infra',
    items: [
      { name: 'Docker / Proxmox / AWS', level: 'intermediate' },
      { name: 'Nginx / Systemd', level: 'intermediate' },
      { name: 'SQLite / MySQL', level: 'intermediate' }
    ]
  },
  {
    title: 'Security',
    items: [
      { name: 'Metasploit / Nmap / BeEF', level: 'advanced' },
      { name: 'Forensics / Reverse engineering', level: 'intermediate' },
      { name: 'Offensive methodologies', level: 'intermediate' }
    ]
  }
]

const milestones = [
  {
    date: '2025 - present',
    title: 'SPSE Presov',
    text: 'Networking and computer science, year one.'
  },
  {
    date: '2024 - ongoing',
    title: 'Reverse engineering record',
    text: 'Posted solves on crackmes.one. Mostly grinding binary analysis.'
  },
  {
    date: '2024',
    title: 'DEF CON 32',
    text: 'Talks, villages, and a lot of people from the scene in Las Vegas.'
  }
]

const toolbox = [
  {
    title: 'Core stack',
    items: ['Arch Linux & Windows 11', 'NeoVim, VSCodium', 'Kitty terminal', 'LibreWolf']
  },
  {
    title: 'Offensive',
    items: ['Metasploit Framework', 'Nmap', 'Burp Suite', 'Hashcat']
  },
  {
    title: 'RE & forensics',
    items: ['IDA Pro 9', 'x64dbg', 'Volatility Framework', 'Memoryze']
  }
]
</script>

<template>
  <div>
    <section class="hero">
      <h1 class="rise rise-1">About</h1>
      <div class="bio rise rise-2">
        <p>
          I'm <strong>Kryptos</strong>, a first-year networking and CS student at
          SPSE Presov. Most of my time goes into low-level systems and security
          work: C, C++, and lately a lot of Rust.
        </p>
        <p>
          What I do usually comes down to figuring out how things work under the
          hood, from packets on the wire to whatever is inside a binary. Right now
          that means writing networking tools in Rust and grinding reverse
          engineering challenges, mostly on Arch with Docker for the messy stuff.
        </p>
        <p><strong>I keep my real name off the internet. Just Kryptos.</strong></p>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <h2 class="section-title">Skills</h2>
      <p class="section-lede">What I'm comfortable with, roughly.</p>
      <div v-stagger class="grid-3 cascade">
        <div v-for="group in skillGroups" :key="group.title" v-spotlight class="card skill-group">
          <h3>{{ group.title }}</h3>
          <ul class="skill-list">
            <li v-for="skill in group.items" :key="skill.name">
              <span>{{ skill.name }}</span>
              <span class="skill-level" :class="{ adv: skill.level === 'advanced' }">{{ skill.level }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <h2 class="section-title">Milestones</h2>
      <div class="timeline" style="margin-top: 40px;">
        <div v-for="item in milestones" :key="item.title" class="timeline-item">
          <span class="timeline-date">{{ item.date }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </div>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <h2 class="section-title">Day-to-day toolbox</h2>
      <p class="section-lede">The stuff I actually use for dev and security work.</p>
      <div v-stagger class="grid-3 toolbox cascade">
        <div v-for="group in toolbox" :key="group.title" class="toolbox-col">
          <h3>{{ group.title }}</h3>
          <ul class="tool-list">
            <li v-for="tool in group.items" :key="tool">{{ tool }}</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
