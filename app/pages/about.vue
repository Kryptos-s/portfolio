<script setup lang="ts">
useHead({ title: 'About - Kryptos' })
useSeoMeta({
  description: 'Who Kryptos is: networking and CS student. C, C++, Rust and Go, reverse engineering, and a self-hosted homelab.',
  ogTitle: 'About - Kryptos',
  ogDescription: 'Networking and CS student. C, C++, Rust and Go, reverse engineering, and a self-hosted homelab.'
})

// Tagged by how often each shows up in a normal week, not by claimed mastery.
const skillGroups = [
  {
    title: 'Languages',
    items: [
      { name: 'C / C++', level: 'DAILY' },
      { name: 'Rust / Go / Python', level: 'WEEKLY' },
      { name: 'HTML / JS / TS', level: 'LEARNING' }
    ]
  },
  {
    title: 'Systems & Infra',
    items: [
      { name: 'Docker / Proxmox', level: 'DAILY' },
      { name: 'Nginx / Systemd', level: 'WEEKLY' },
      { name: 'SQLite / MySQL', level: 'WEEKLY' }
    ]
  },
  {
    title: 'Security',
    items: [
      { name: 'Reverse engineering / forensics', level: 'DAILY' },
      { name: 'Recon / exploitation tooling', level: 'WEEKLY' },
      { name: 'Malware analysis (VM detonation)', level: 'WEEKLY' }
    ]
  }
]

const milestones = [
  {
    date: '2025 - PRESENT',
    title: 'SPSE Presov',
    text: 'Networking and computer science, year one.'
  },
  {
    date: '2024 - ONGOING',
    title: 'Crackmes',
    text: 'Working through binaries on crackmes.one. Authored one in 2026.'
  },
  {
    date: '2024',
    title: 'DEF CON 32',
    text: 'Attended in Las Vegas. Mostly villages and talks.'
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
    <section class="masthead container">
      <div class="masthead-strip">
        <span class="label rise rise-1">// background, tools, timeline</span>
        <span class="label rise rise-1">PSEUDONYMOUS</span>
      </div>
      <h1 class="h-page rise rise-2">About</h1>
      <div class="copy rise rise-3" style="margin-top: 24px;">
        <p>
          I'm <strong>Kryptos</strong>, a first-year networking and CS student at
          SPSE Presov. Outside class it's C, C++, Rust and Go, reverse
          engineering, and a self-hosted homelab.
        </p>
        <p>
          Most of it is reverse engineering practice on crackmes.one and small
          tools that fix an annoyance: synced lyrics in the terminal, LAN
          monitoring for the rack. Daily driver is Arch; untrusted binaries
          stay in VMs.
        </p>
        <p><strong>I don't put my real name online.</strong></p>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">Skills</h2>
          <span class="label">MEASURE: FREQUENCY</span>
        </div>
        <div v-stagger class="panel grid-3 cascade">
          <div v-for="group in skillGroups" :key="group.title" class="skill-group">
            <h3>{{ group.title }}</h3>
            <ul class="skill-list">
              <li v-for="skill in group.items" :key="skill.name">
                <span>{{ skill.name }}</span>
                <span class="chip" :class="{ accent: skill.level === 'DAILY' }">{{ skill.level }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">Milestones</h2>
        </div>
        <div class="panel mile-rows">
          <div v-for="item in milestones" :key="item.title" class="mile-row">
            <span class="mile-date">{{ item.date }}</span>
            <span class="mile-title">{{ item.title }}</span>
            <span class="mile-text">{{ item.text }}</span>
          </div>
        </div>
      </div>
    </section>

    <section v-fade-in class="section section-fade-in">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">Toolbox</h2>
        </div>
        <div v-stagger class="panel grid-3 cascade">
          <div v-for="group in toolbox" :key="group.title" class="skill-group">
            <h3>{{ group.title }}</h3>
            <ul class="skill-list">
              <li v-for="tool in group.items" :key="tool">{{ tool }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
