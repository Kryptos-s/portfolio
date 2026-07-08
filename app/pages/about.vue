<script setup lang="ts">
useHead({ title: 'About - Kryptos' })
useSeoMeta({
  description: 'Who Kryptos is: networking and CS student, low-level systems and security work in C, C++ and Rust.',
  ogTitle: 'About - Kryptos',
  ogDescription: 'Networking and CS student. Low-level systems and security work in C, C++ and Rust.'
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
    title: 'RE record',
    text: 'Grinding binary analysis. Authored a crackme on crackmes.one in 2026.'
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
    <section class="masthead container">
      <div class="masthead-strip">
        <span class="label rise rise-1">// cat about_me.txt</span>
        <span class="label rise rise-1">IDENT: WITHHELD</span>
      </div>
      <h1 class="macro h-page rise rise-2">About</h1>
      <div class="copy rise rise-3" style="margin-top: 32px;">
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

    <section v-fade-in class="zone section-fade-in" style="margin-top: 64px;">
      <div class="container">
        <div class="zone-head">
          <h2 class="macro h-zone">[ Skills ]</h2>
          <span class="label">MEASURE: FREQUENCY</span>
        </div>
        <div v-stagger class="compartments grid-3 cascade">
          <div v-for="group in skillGroups" :key="group.title" class="skill-group">
            <h3>{{ group.title }}</h3>
            <ul class="skill-list">
              <li v-for="skill in group.items" :key="skill.name">
                <span>{{ skill.name }}</span>
                <span class="skill-tag" :class="{ adv: skill.level === 'DAILY' }">[{{ skill.level }}]</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section v-fade-in class="zone section-fade-in">
      <div class="container">
        <div class="zone-head">
          <h2 class="macro h-zone">[ Milestones ]</h2>
        </div>
        <div class="mile-rows">
          <div v-for="item in milestones" :key="item.title" class="mile-row">
            <span class="mile-date">{{ item.date }}</span>
            <span class="mile-title">{{ item.title }}</span>
            <span class="mile-text">{{ item.text }}</span>
          </div>
        </div>
      </div>
    </section>

    <section v-fade-in class="zone section-fade-in">
      <div class="container">
        <div class="zone-head">
          <h2 class="macro h-zone">[ Toolbox ]</h2>
          <span class="label">IN USE / DAILY</span>
        </div>
        <div v-stagger class="compartments grid-3 cascade">
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
