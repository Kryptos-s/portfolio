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

  // --- v-spotlight ------------------------------------------------------
  // Cursor-tracking glow on .panel elements: writes --mx/--my custom props
  // that the .panel.lit::before radial gradient reads. Pointer-only; the
  // CSS is gated behind @media (hover: hover) so touch devices never see it.
  const moveHandlers = new WeakMap<HTMLElement, (e: PointerEvent) => void>()

  nuxtApp.vueApp.directive('spotlight', {
    mounted(el: HTMLElement) {
      el.classList.add('lit')
      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
        el.style.setProperty('--my', `${e.clientY - rect.top}px`)
      }
      moveHandlers.set(el, onMove)
      el.addEventListener('pointermove', onMove, { passive: true })
    },
    unmounted(el: HTMLElement) {
      const onMove = moveHandlers.get(el)
      if (onMove) el.removeEventListener('pointermove', onMove)
      moveHandlers.delete(el)
    }
  })
})
