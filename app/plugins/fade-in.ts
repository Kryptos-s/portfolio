// Registers a `v-fade-in` directive that adds `.is-visible` when the element
// scrolls into view — the Vue-native replacement for main.js initScrollAnimations().
// Registered universally so SSR can resolve it; the observer only runs client-side
// (directive mounted hooks don't fire on the server).
//
// Robustness note: elements already within the viewport at mount are revealed
// immediately, so above-the-fold content never gets stuck at opacity:0 if the
// IntersectionObserver can't fire (e.g. a backgrounded tab on first load).
export default defineNuxtPlugin((nuxtApp) => {
  const observers = new WeakMap<HTMLElement, IntersectionObserver>()

  const reveal = (el: Element) => el.classList.add('is-visible')

  const inViewport = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    return rect.top < window.innerHeight && rect.bottom > 0
  }

  nuxtApp.vueApp.directive('fade-in', {
    mounted(el: HTMLElement) {
      if (inViewport(el)) {
        reveal(el)
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target)
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
