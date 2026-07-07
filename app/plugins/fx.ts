// Interaction directives. Registered universally so SSR can resolve them;
// all behavior runs client-side only (directive mounted hooks don't fire on
// the server). Everything animates transform/opacity/CSS-vars only.
export default defineNuxtPlugin((nuxtApp) => {
  const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // --- v-spotlight -----------------------------------------------------
  // Tracks the pointer per element and exposes --mx/--my (px, element-local)
  // for the CSS spotlight-border treatment on cards.
  const spotHandlers = new WeakMap<HTMLElement, (e: PointerEvent) => void>()

  nuxtApp.vueApp.directive('spotlight', {
    mounted(el: HTMLElement) {
      el.classList.add('spot')
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      }
      el.addEventListener('pointermove', move, { passive: true })
      spotHandlers.set(el, move)
    },
    unmounted(el: HTMLElement) {
      const move = spotHandlers.get(el)
      if (move) el.removeEventListener('pointermove', move)
      spotHandlers.delete(el)
    }
  })

  // --- v-magnetic -------------------------------------------------------
  // Buttons lean a few px toward the cursor and spring back on leave.
  interface MagnetState {
    move: (e: PointerEvent) => void
    leave: () => void
  }
  const magnets = new WeakMap<HTMLElement, MagnetState>()

  nuxtApp.vueApp.directive('magnetic', {
    mounted(el: HTMLElement) {
      if (reduced()) return
      const strength = 0.18
      // write custom properties, not transform, so stylesheet transforms
      // (e.g. .button:active { scale }) still compose with the magnet offset
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        el.style.setProperty('--tx', `${(dx * strength).toFixed(1)}px`)
        el.style.setProperty('--ty', `${(dy * strength).toFixed(1)}px`)
      }
      const leave = () => {
        el.style.setProperty('--tx', '0px')
        el.style.setProperty('--ty', '0px')
      }
      el.classList.add('magnetic')
      el.addEventListener('pointermove', move, { passive: true })
      el.addEventListener('pointerleave', leave, { passive: true })
      magnets.set(el, { move, leave })
    },
    unmounted(el: HTMLElement) {
      const s = magnets.get(el)
      if (s) {
        el.removeEventListener('pointermove', s.move)
        el.removeEventListener('pointerleave', s.leave)
      }
      magnets.delete(el)
    }
  })

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

  // (Parallax is handled in pure CSS via animation-timeline: view() — see
  // styles.css. No JS loop: the compositor drives it, idle cost is zero, and
  // browsers without support simply render the image static.)
})
