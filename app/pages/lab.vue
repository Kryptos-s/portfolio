<script setup lang="ts">
useHead({ title: 'Kryptos Terminal - Lab Setup' })
useSeoMeta({
  description: 'Overview of the Kryptos high-performance analysis and operations lab.'
})
</script>

<template>
  <div>
    <section v-fade-in class="terminal-box section-fade-in">
      <h2 class="with-cursor">$ systemctl status lab-hardware</h2>
      <p class="prompt-line">// Nodes found: 1 primary analysis cluster</p>

      <div class="specs-container">
        <div class="spec-item">
          <span class="spec-label">CPU:</span>
          <span class="spec-value">AMD Ryzen 9 9950X (16C/32T - Zen 5)</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">RAM:</span>
          <span class="spec-value">256GB DDR5 @ 6000MHz</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">VIRT:</span>
          <span class="spec-value">Proxmox VE 8.x (KVM/LXC)</span>
        </div>
      </div>
      <p class="spec-description">
        mostly used for malware analysis, and DMA-based memory analysis.
      </p>
    </section>

    <section v-fade-in class="terminal-box section-fade-in">
      <h2>$ show running-config | section network</h2>
      <div class="networking-stack">
        <div class="net-node">
          <h3>[ EDGE GATEWAY ]</h3>
          <p>Ubiquiti UDM Pro (10G SFP+ Uplink)</p>
        </div>
        <div class="net-node">
          <h3>[ CORE SWITCH ]</h3>
          <p>Ubiquiti USW Pro (Multi-Layer Switching)</p>
        </div>
      </div>
    </section>

    <section v-fade-in class="terminal-box section-fade-in image-container">
      <h2>$ ls -la /mnt/media/lab_photos/</h2>
      <div class="single-photo-display">
        <div class="photo-wrapper">
          <img src="/images/lab_setup.jpg" alt="Kryptos Lab Rack" class="lab-img">
          <p class="img-caption">// Network Core: UDM Pro &amp; USW Pro</p>
        </div>
      </div>
    </section>
  </div>
</template>
