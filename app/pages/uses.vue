<script setup lang="ts">
useHead({ title: 'Kryptos Terminal - Uses' })
useSeoMeta({
  description: 'The hardware, software, and toolchain used by Kryptos.'
})
</script>

<template>
  <div>
    <section v-fade-in class="uses-intro terminal-box section-fade-in">
      <h2>$ env | grep TOOLS</h2>
      <p class="subtitle">the stuff I actually use day-to-day for dev and security work.</p>
    </section>

    <div class="uses-grid">
      <section v-fade-in class="uses-col terminal-box section-fade-in">
        <h3>// Core Stack</h3>
        <ul>
          <li><strong>OS:</strong> Arch Linux &amp; Windows 11 (23H2)</li>
          <li><strong>Editor:</strong> NeoVim, VS codium</li>
          <li><strong>Terminal:</strong> Kitty</li>
          <li><strong>Browser:</strong> LibreWolf</li>
        </ul>
      </section>

      <section v-fade-in class="uses-col terminal-box section-fade-in">
        <h3>// Offensive Security</h3>
        <ul>
          <li>Metasploit Framework</li>
          <li>Nmap</li>
          <li>Burp Suite</li>
          <li>Hashcat</li>
        </ul>
      </section>

      <section v-fade-in class="uses-col terminal-box section-fade-in">
        <h3>// RE &amp; Forensics</h3>
        <ul>
          <li>IDA Pro 9</li>
          <li>x64dbg</li>
          <li>Volatility Framework</li>
          <li>Memoryze</li>
        </ul>
      </section>
    </div>
  </div>
</template>
