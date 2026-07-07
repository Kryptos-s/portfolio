// Registers a `v-fade-in` directive that adds `.is-visible` when the element
// scrolls into view — the Vue-native replacement for main.js initScrollAnimations().
// Registered universally so SSR can resolve it; the observer only runs client-side
// (directive mounted hooks don't fire on the server).
export default defineNuxtPlugin((nuxtApp) => {
  const observers = new WeakMap<HTMLElement, IntersectionObserver>()

  nuxtApp.vueApp.directive('fade-in', {
    mounted(el: HTMLElement) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer.unobserve(entry.target)
            }
          })
        },
        { rootMargin: '0px', threshold: 0.1 }
      )
      observer.observe(el)
      observers.set(el, observer)
    },
    unmounted(el: HTMLElement) {
      observers.get(el)?.disconnect()
      observers.delete(el)
    }
  })
})
