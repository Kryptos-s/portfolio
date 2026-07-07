// Animates a number from 0 to `target` when `arm(el)` sees the element enter
// the viewport. Ease-out cubic via rAF; instant under prefers-reduced-motion.
export function useCountUp(target: number, durationMs = 900) {
  const value = ref(0)
  let started = false
  let io: IntersectionObserver | null = null
  let raf = 0

  function run() {
    if (started) return
    started = true

    // No animation if the user can't see it (reduced motion) or the tab is
    // hidden (rAF is paused there; snap so it never reads 0 on return).
    if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      value.value = target
      return
    }

    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / durationMs, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      value.value = Math.round(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
  }

  function arm(el: Element | null) {
    if (!el || io) return
    // already on screen: run now instead of waiting for the observer
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      run()
      return
    }
    io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        run()
        io?.disconnect()
      }
    }, { threshold: 0.4 })
    io.observe(el)
  }

  onBeforeUnmount(() => {
    io?.disconnect()
    if (raf) cancelAnimationFrame(raf)
  })

  return { value, arm }
}
