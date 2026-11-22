let cleanupType: (() => void) | null = null

export function initTypeDemo(root: HTMLElement): void {
  if (cleanupType) { cleanupType(); cleanupType = null }
  const canvasEl = root.querySelector<HTMLCanvasElement>('#type-canvas')
  if (!canvasEl) return
  const ctx2d = canvasEl.getContext('2d')
  if (!ctx2d) return
  const canvas = canvasEl
  const ctx = ctx2d

  interface Glyph {
    char: string
    x: number; y: number
    vx: number; vy: number
    rot: number; vr: number
    size: number
    life: number
  }

  let glyphs: Glyph[] = []
  let gravity = false
  let raf = 0
  const text = 'GEORGIY DESIGN CODE MAKE TOUCH TYPE PLAY '
  let idx = 0

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const r = canvas.getBoundingClientRect()
    canvas.width = Math.floor(r.width * dpr)
    canvas.height = Math.floor(r.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function addChar(char: string, x?: number, y?: number) {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    glyphs.push({
      char,
      x: x ?? w * 0.2 + Math.random() * w * 0.6,
      y: y ?? h * 0.25,
      vx: (Math.random() - 0.5) * 2.2,
      vy: -1.5 - Math.random() * 2,
      rot: (Math.random() - 0.5) * 0.4,
      vr: (Math.random() - 0.5) * 0.03,
      size: Math.max(28, Math.min(w * 0.09, 72)) * (0.7 + Math.random() * 0.6),
      life: 1,
    })
    if (glyphs.length > 60) glyphs.shift()
  }

  function seed() {
    glyphs = []
    const s = 'TYPE'
    for (let i = 0; i < s.length; i++) addChar(s[i], canvas.clientWidth * 0.25 + i * canvas.clientWidth * 0.13, canvas.clientHeight * 0.45)
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (e.key.length === 1) {
      addChar(e.key.toUpperCase())
      e.preventDefault()
    } else if (e.key === 'Backspace') {
      glyphs.pop()
      e.preventDefault()
    }
  }

  const onClick = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect()
    addChar(text[idx % text.length], e.clientX - r.left, e.clientY - r.top)
    idx++
  }

  root.querySelector('#type-reset')?.addEventListener('click', seed)
  root.querySelector('#type-gravity')?.addEventListener('click', (e) => {
    gravity = !gravity
    ;(e.currentTarget as HTMLElement).classList.toggle('active', gravity)
  })

  canvas.addEventListener('click', onClick)
  window.addEventListener('keydown', onKey)

  function draw() {
    const w = canvas.clientWidth, h = canvas.clientHeight
    if (!w || !h) return
    ctx.clearRect(0, 0, w, h)
    const bg = document.documentElement.dataset.theme === 'light' ? '#ece7dc' : '#111113'
    const fg = document.documentElement.dataset.theme === 'light' ? '#141311' : '#f2efe8'
    const accent = '#ff5c3a'
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    ctx.strokeStyle = fg
    ctx.globalAlpha = 0.07
    ctx.strokeRect(w * 0.05, h * 0.08, w * 0.9, h * 0.84)
    ctx.globalAlpha = 1

    for (const g of glyphs) {
      g.vy += gravity ? 0.18 : 0.03
      g.vx *= 0.995
      g.vy *= 0.995
      g.x += g.vx
      g.y += g.vy
      g.rot += g.vr
      if (g.y > h - g.size * 0.3) { g.y = h - g.size * 0.3; g.vy *= -0.55; g.vx *= 0.85 }
      if (g.x < g.size * 0.2) { g.x = g.size * 0.2; g.vx *= -0.6 }
      if (g.x > w - g.size * 0.2) { g.x = w - g.size * 0.2; g.vx *= -0.6 }
      g.life = Math.min(1, g.life + 0.02)

      ctx.save()
      ctx.translate(g.x, g.y)
      ctx.rotate(g.rot)
      ctx.globalAlpha = g.life
      ctx.fillStyle = /[AEIOU]/.test(g.char) ? accent : fg
      ctx.font = `700 ${g.size}px "Bebas Neue", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(g.char, 0, 0)
      ctx.restore()
    }
    ctx.globalAlpha = 1
  }

  function loop() { draw(); raf = requestAnimationFrame(loop) }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()
  seed()
  loop()

  cleanupType = () => {
    cancelAnimationFrame(raf); ro.disconnect()
    canvas.removeEventListener('click', onClick)
    window.removeEventListener('keydown', onKey)
  }
}
