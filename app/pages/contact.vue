<script setup lang="ts">
useHead({ title: 'Kryptos Terminal - Contact' })
useSeoMeta({ description: 'Get in touch with Kryptos via email or social links.' })
</script>

<template>
  <div>
    <section v-fade-in class="contact-info terminal-box section-fade-in">
      <h2>$ contact details</h2>
      <p class="prompt-line">$ mail -t kryptosss99@proton.me</p>
      <ul>
        <li><strong>Handle:</strong> Kryptos</li>
        <li><strong>Location:</strong> Slovakia</li>
        <li><strong>Email:</strong> <a href="mailto:kryptosss99@proton.me">kryptosss99@proton.me</a></li>
        <li><strong>GitHub:</strong> <a href="https://github.com/Kryptos-s" target="_blank" rel="noopener noreferrer">github.com/Kryptos-s</a></li>
        <li><strong>Other Link:</strong> <a href="https://kryptos.xyz" target="_blank" rel="noopener noreferrer">kryptos.xyz (Discord)</a></li>
      </ul>

      <h3>// Languages:</h3>
      <p>Slovak (Native), Czech (Fluent), English (Fluent)</p>
    </section>

    <section class="terminal-box">
      <h2>$ send message</h2>
      <ContactForm />
    </section>
  </div>
</template>
