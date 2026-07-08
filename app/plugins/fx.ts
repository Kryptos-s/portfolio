// Interaction directives. Registered universally so SSR can resolve them;
// behavior runs client-side only (directive mounted hooks don't fire on the
// server).
export default defineNuxtPlugin((nuxtApp) => {
  // --- v-stagger --------------------------------------------------------
  // Numbers the element's children with --i so the reveal cascade can delay
  // each child. Pair with v-fade-in on the same element.
  nuxtApp.vueApp.directive('stagger', {
    mounted(el: HTMLElement) {
      Array.from(el.children).forEach((child, i) => {
        ;(child as HTMLElement).style.setProperty('--i', String(i))
      })
    },
    updated(el: HTMLElement) {
      Array.from(el.children).forEach((child, i) => {
        ;(child as HTMLElement).style.setProperty('--i', String(i))
      })
    }
  })
})
