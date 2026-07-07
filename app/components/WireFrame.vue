<script setup lang="ts">
// Slowly tumbling wireframe icosahedron, drawn with raw projection math on a
// 2D canvas. No 3D library: 12 vertices from the golden ratio, 30 edges,
// rotate -> perspective-project -> depth-faded lines in the accent color.
// Pauses when offscreen or the tab is hidden; renders one static frame under
// prefers-reduced-motion.

const canvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let visible = true
let reduced = false
let rgb: [number, number, number] = [88, 169, 221]
let size = 420
let dpr = 1
let t = 0

// Icosahedron geometry: vertices from the three golden-ratio rectangles.
const PHI = (1 + Math.sqrt(5)) / 2
const VERTS: [number, number, number][] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]
]
// Each edge appears in exactly two of the 20 faces; enumerate the 30 pairs.
const EDGES: [number, number][] = [
  [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
  [1, 5], [1, 7], [1, 8], [1, 9],
  [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
  [3, 4], [3, 6], [3, 8], [3, 9],
  [4, 5], [4, 9], [4, 11],
  [5, 9], [5, 11],
  [6, 7], [6, 8], [6, 10],
  [7, 8], [7, 10],
  [8, 9], [10, 11]
]

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full || '58a9dd', 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function frame() {
  if (!ctx) return
  const [r, g, b] = rgb
  const half = size / 2
  ctx.clearRect(0, 0, size, size)

  const rotY = t * 0.00035
  const rotX = Math.sin(t * 0.00019) * 0.55 + 0.4
  const cosY = Math.cos(rotY)
  const sinY = Math.sin(rotY)
  const cosX = Math.cos(rotX)
  const sinX = Math.sin(rotX)

  const scale = size * 0.21
  const cam = 5.2

  const projected = VERTS.map(([x, y, z]) => {
    // rotate Y then X
    const x1 = x * cosY + z * sinY
    const z1 = -x * sinY + z * cosY
    const y2 = y * cosX - z1 * sinX
    const z2 = y * sinX + z1 * cosX
    // perspective
    const p = cam / (cam - z2)
    return { x: half + x1 * p * scale, y: half + y2 * p * scale, z: z2 }
  })

  for (const [a, bIdx] of EDGES) {
    const p1 = projected[a]!
    const p2 = projected[bIdx]!
    // edges nearer the camera render brighter and thicker
    const depth = (p1.z + p2.z) / 2 / PHI // -1 .. 1 approx
    const alpha = 0.1 + (depth + 1) * 0.19
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`
    ctx.lineWidth = 1 + (depth + 1) * 0.55
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
  }

  // vertex points
  for (const p of projected) {
    const depth = p.z / PHI
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(0.25 + (depth + 1) * 0.25).toFixed(3)})`
    ctx.beginPath()
    ctx.arc(p.x, p.y, 1.6 + (depth + 1) * 0.8, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Anchor the clock so the first animated frame continues exactly from the
// pose of the static frame (t = 4200) instead of snapping to a new angle.
let t0: number | null = null

function loop(now: number) {
  if (t0 === null) t0 = now - 4200
  t = now - t0
  frame()
  raf = requestAnimationFrame(loop)
}

function start() {
  if (raf || reduced || !visible || document.hidden) return
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

let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null

// (Re)size the backing store to the rendered CSS size so lines stay crisp at
// any viewport width; repaint immediately when the loop isn't running.
function fit(el: HTMLCanvasElement) {
  const w = el.clientWidth
  if (!ctx || w <= 0 || w === size) return
  size = w
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  el.width = Math.floor(size * dpr)
  el.height = Math.floor(size * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  if (!raf) frame()
}

onMounted(() => {
  const el = canvas.value
  if (!el) return
  ctx = el.getContext('2d')
  if (!ctx) return

  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent')
  if (accent) rgb = hexToRgb(accent)

  dpr = Math.min(window.devicePixelRatio || 1, 2)
  size = el.clientWidth || 420
  el.width = Math.floor(size * dpr)
  el.height = Math.floor(size * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  // paint one frame immediately so the canvas is never blank while waiting
  // for the observer/rAF to kick in (or forever, under reduced motion)
  t = 4200 // an angle that reads well as a still
  frame()

  ro = new ResizeObserver(() => fit(el))
  ro.observe(el)

  if (reduced) return

  io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
  })
  io.observe(el)
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  stop()
  io?.disconnect()
  ro?.disconnect()
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <canvas ref="canvas" class="wireframe" aria-hidden="true" />
</template>
