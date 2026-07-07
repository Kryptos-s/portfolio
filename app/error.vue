<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const notFound = computed(() => props.error.statusCode === 404)
const code = computed(() => props.error.statusCode || 500)

useHead({ title: () => `${code.value} - Kryptos` })

function back() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div>
    <!-- error.vue renders outside layouts; recreate the shell so the failure
         path looks exactly like the rest of the instrument. -->
    <a href="#main" class="skip-link">Skip to content</a>
    <SiteHeader />
    <main id="main" class="page" tabindex="-1">
      <section class="masthead container">
        <div class="masthead-strip">
          <span class="label rise rise-1">{{ notFound ? '// err: route not found in index' : '// err: subsystem fault' }}</span>
          <span class="label rise rise-1">CODE: {{ code }}</span>
        </div>
        <h1 class="macro giant rise rise-2">{{ code }}</h1>
        <div class="copy rise rise-3" style="margin-top: 32px;">
          <p v-if="notFound">
            Nothing at this address. The index is four pages deep;
            this isn't one of them.
          </p>
          <p v-else>
            Something broke server-side. It logs, I read the logs.
          </p>
        </div>
        <div class="rise rise-4" style="margin-top: 32px;">
          <button class="button" @click="back">Return to index &gt;&gt;&gt;</button>
        </div>
      </section>
    </main>
    <SiteFooter />
    <div class="scanlines" aria-hidden="true" />
    <div class="grain" aria-hidden="true" />
  </div>
</template>
