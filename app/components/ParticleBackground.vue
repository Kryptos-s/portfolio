<script setup lang="ts">
// Subtle particle-network background: nodes drift and link to nearby nodes (and
// the cursor). Sits fixed behind all content, adapts to the theme accent colour,
// pauses when the tab is hidden, and renders a single static frame when the user
// prefers reduced motion.
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

const canvas = ref<HTMLCanvasElement | null>(null)
const colorMode = useColorMode()

let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let particles: Particle[] = []
let width = 0
let height = 0
let dpr = 1
let rgb: [number, number, number] = [58, 142, 187]
let reduced = false
const mouse = { x: -9999, y: -9999 }

const LINK_DIST = 140
const MOUSE_DIST = 170

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full || '3A8EBB', 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function readAccent() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--color-accent')
  if (raw) rgb = hexToRgb(raw)
}

function seedParticles() {
  // Scale count to viewport area, capped for performance.
  const count = Math.min(Math.floor((width * height) / 15000), 110)
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45
  }))
}

function resize() {
  const el = canvas.value
  if (!el || !ctx) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  el.width = Math.floor(width * dpr)
  el.height = Math.floor(height * dpr)
  el.style.width = `${width}px`
  el.style.height = `${height}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  seedParticles()
}

function draw() {
  if (!ctx) return
  const [r, g, b] = rgb
  ctx.clearRect(0, 0, width, height)

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]!

    if (!reduced) {
      p.x += p.vx
      p.y += p.vy
      if (p.x <= 0 || p.x >= width) p.vx *= -1
      if (p.y <= 0 || p.y >= height) p.vy *= -1
    }

    // Links to other nodes.
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j]!
      const dx = p.x - q.x
      const dy = p.y - q.y
      const dist = Math.hypot(dx, dy)
      if (dist < LINK_DIST) {
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(1 - dist / LINK_DIST) * 0.22})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(q.x, q.y)
        ctx.stroke()
      }
    }

    // Link to the cursor.
    const mdx = p.x - mouse.x
    const mdy = p.y - mouse.y
    const mdist = Math.hypot(mdx, mdy)
    if (mdist < MOUSE_DIST) {
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(1 - mdist / MOUSE_DIST) * 0.35})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(mouse.x, mouse.y)
      ctx.stroke()
    }

    // Node.
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`
    ctx.beginPath()
    ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
    ctx.fill()
  }
}

function loop() {
  draw()
  raf = requestAnimationFrame(loop)
}

function start() {
  if (raf || reduced) return
  raf = requestAnimationFrame(loop)
}

function stop() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}

function onVisibility() {
  if (document.hidden) stop()
  else start()
}

function onMouseMove(e: MouseEvent) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

function onMouseLeave() {
  mouse.x = -9999
  mouse.y = -9999
}

let resizeTimer: ReturnType<typeof setTimeout>
function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(resize, 150)
}

onMounted(() => {
  const el = canvas.value
  if (!el) return
  ctx = el.getContext('2d')
  if (!ctx) return

  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  readAccent()
  resize()

  if (reduced) {
    draw() // one static frame
  } else {
    start()
  }

  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('mouseout', onMouseLeave)
  document.addEventListener('visibilitychange', onVisibility)
})

// Re-read the accent colour after a theme switch (data-theme drives the CSS var).
watch(() => colorMode.value, () => nextTick(readAccent))

onBeforeUnmount(() => {
  stop()
  clearTimeout(resizeTimer)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseout', onMouseLeave)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <canvas ref="canvas" class="particle-bg" aria-hidden="true" />
</template>

<style scoped>
.particle-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
