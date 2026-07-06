<script setup lang="ts">
// Same set of updates the old main.js injected into every sidebar.
const updates = [
  { date: 'Nov 2025', text: 'wrapping up a C++ networking project. release soon.' },
  { date: 'Oct 2025', text: 'studying for Security+.' },
  { date: 'Sep 2025', text: 'SPSE here i come.' },
  { date: 'Aug 2025', text: 'deep dive into Rust.' }
]

// The projects page carried a couple of extra status lines in its sidebar.
const route = useRoute()
const showApiStatus = computed(() => route.path === '/projects')
</script>

<template>
  <aside class="sidebar" role="complementary">
    <h2>$ status check</h2>
    <div class="terminal-box">
      <div v-for="update in updates" :key="update.date" class="update-item">
        <span>// {{ update.date }}</span> {{ update.text }}
      </div>
    </div>

    <template v-if="showApiStatus">
      <h3>$ status</h3>
      <p>// GITHUB API: CONNECTED</p>
      <p>// Mode: READ_ONLY</p>
    </template>
  </aside>
</template>
