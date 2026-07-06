<script setup lang="ts">
// No sub-routes exist, so exact-active matching reproduces the old
// setActiveNavLink() behaviour exactly (home only active on "/").
const links = [
  { to: '/', label: 'HOME', title: 'Home' },
  { to: '/projects', label: 'PROJECTS', title: 'Code Projects' },
  { to: '/gallery', label: 'GALLERY', title: 'Visual Gallery' },
  { to: '/about', label: 'ABOUT ME', title: 'About Me' },
  { to: '/lab', label: 'LAB', title: 'Lab Specs' },
  { to: '/uses', label: 'USES', title: 'Tools Used' },
  { to: '/contact', label: 'CONTACT', title: 'Contact Me' }
]
</script>

<template>
  <nav class="main-nav">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="nav-link"
      exact-active-class="active"
      :title="link.title"
    >{{ link.label }}</NuxtLink>
  </nav>
</template>
