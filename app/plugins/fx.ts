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
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
      }
      const leave = () => {
        el.style.transform = ''
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

  // --- v-parallax -------------------------------------------------------
  // Gentle depth drift for media while it crosses the viewport. Driven by a
  // scroll-linked rAF that only runs while the element is on screen (armed by
  // IntersectionObserver, no scroll listeners).
  interface ParallaxState {
    io: IntersectionObserver
    raf: number
  }
  const parallaxed = new WeakMap<HTMLElement, ParallaxState>()

  nuxtApp.vueApp.directive('parallax', {
    mounted(el: HTMLElement) {
      if (reduced()) return
      const depth = 0.08
      let running = false
      let raf = 0

      const tick = () => {
        if (!running) return
        const r = el.getBoundingClientRect()
        const mid = r.top + r.height / 2 - window.innerHeight / 2
        el.style.transform = `translateY(${(-mid * depth).toFixed(1)}px)`
        raf = requestAnimationFrame(tick)
      }

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          running = entry.isIntersecting
          if (running) {
            raf = requestAnimationFrame(tick)
          } else {
            cancelAnimationFrame(raf)
          }
        })
      })
      io.observe(el)
      parallaxed.set(el, { io, raf })
    },
    unmounted(el: HTMLElement) {
      const s = parallaxed.get(el)
      if (s) {
        s.io.disconnect()
        cancelAnimationFrame(s.raf)
      }
      parallaxed.delete(el)
    }
  })
})
