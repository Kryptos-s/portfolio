<script setup lang="ts">
useHead({ title: 'Kryptos Terminal - About' })
useSeoMeta({
  description: 'Detailed biography, skills matrix, education, and cybersecurity focus areas.'
})
</script>

<template>
  <div>
    <section v-fade-in class="about-bio terminal-box section-fade-in">
      <h2 class="with-cursor">$ system profile</h2>
      <p class="prompt-line">$ cat about_me.txt</p>
      <p>I'm <strong>Kryptos</strong>. first-year networking and CS student at SPSE PRESOV. mostly into low-level systems and security work — C, C++, and Rust.</p>
      <p>most of what I do comes down to figuring out how things work under the hood, from packets on the wire to whatever's inside a binary. lately that's been writing networking tools in Rust and grinding reverse engineering challenges, mostly on Arch with Docker for the messy stuff.</p>
      <p><strong>I keep my real name off the internet. just Kryptos.</strong></p>
    </section>

    <section v-fade-in class="skills-matrix section-fade-in">
      <h2>$ technical skills matrix</h2>
      <p class="subtitle">what I'm comfortable with, roughly.</p>

      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Skill / Tool</th>
              <th class="level-col">Proficiency</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th rowspan="3">Languages</th>
              <td>C / C++ / C#</td>
              <td class="level-col-adv">Advanced</td>
            </tr>
            <tr>
              <td>Rust / Python</td>
              <td class="level-col-int">Intermediate</td>
            </tr>
            <tr>
              <td>HTML / JS / TS</td>
              <td class="level-col-beg">Beginner</td>
            </tr>
            <tr>
              <th rowspan="2">Databases</th>
              <td>SQLite</td>
              <td class="level-col-int">Intermediate</td>
            </tr>
            <tr>
              <td>MySQL</td>
              <td class="level-col-int">Intermediate</td>
            </tr>
            <tr>
              <th rowspan="3">Systems &amp; Tools</th>
              <td>Docker / Proxmox / AWS</td>
              <td class="level-col-int">Intermediate</td>
            </tr>
            <tr>
              <td>VS Code / Vim</td>
              <td class="level-col-adv">Advanced</td>
            </tr>
            <tr>
              <td>Nginx / Systemd</td>
              <td class="level-col-int">Intermediate</td>
            </tr>
            <tr>
              <th rowspan="3">Cybersecurity</th>
              <td>Forensics / Reverse Engineering</td>
              <td class="level-col-int">Intermediate</td>
            </tr>
            <tr>
              <td>Metasploit / Nmap / BeEf</td>
              <td class="level-col-adv">Advanced</td>
            </tr>
            <tr>
              <td>Offensive Security Methodologies</td>
              <td class="level-col-int">Intermediate</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-fade-in class="timeline-section section-fade-in">
      <h2>$ education &amp; milestones</h2>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-date">2025 - Present</div>
          <div class="timeline-content">
            <h3>SPSE PRESOV</h3>
            <p>started networking and CS, year 1.</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-date">2024</div>
          <div class="timeline-content">
            <h3>DEF CON 32</h3>
            <p>went to DEF CON 32 in Vegas. talks, villages, met a lot of people in the scene.</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-date">2024 - Ongoing</div>
          <div class="timeline-content">
            <h3>Reverse Engineering &amp; CTF Record</h3>
            <p>posted a few solves on crackmes.one. mostly grinding binary analysis.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
