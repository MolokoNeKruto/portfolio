export function initTypeDemo(root: HTMLElement): () => void {
  const canvasEl = root.querySelector<HTMLCanvasElement>('#type-canvas')
  if (!canvasEl) return () => {}
  const ctx2d = canvasEl.getContext('2d')
  if (!ctx2d) return () => {}
  const canvas = canvasEl
  const ctx = ctx2d

  const sizeInput = root.querySelector<HTMLInputElement>('#type-size')
  const bounceInput = root.querySelector<HTMLInputElement>('#type-bounce')
  const gravityBtn = root.querySelector<HTMLButtonElement>('#type-gravity')
  const clearBtn = root.querySelector<HTMLButtonElement>('#type-clear')
  const spawnBtn = root.querySelector<HTMLButtonElement>('#type-spawn')
  const hiddenInput = root.querySelector<HTMLInputElement>('#type-hidden-input')
  const hint = root.querySelector<HTMLElement>('#type-hint')

  interface Glyph {
    ch: string
    x: number; y: number
    vx: number; vy: number
    rot: number; vr: number
    size: number
  }

  let glyphs: Glyph[] = []
  let gravity = false
  let raf = 0
  let dragging: Glyph | null = null
  let dragOff = { x: 0, y: 0 }
  let lastPointer = { x: 0, y: 0, t: 0 }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const r = canvas.getBoundingClientRect()
    const w = Math.max(10, Math.floor(r.width))
    const h = Math.max(10, Math.floor(r.height))
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function addGlyph(ch: string, x?: number, y?: number, vx?: number, vy?: number) {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const baseSize = Number(sizeInput?.value ?? 64)
    glyphs.push({
      ch,
      x: x ?? w * (0.2 + Math.random() * 0.6),
      y: y ?? h * (0.25 + Math.random() * 0.25),
      vx: vx ?? (Math.random() - 0.5) * 2.2,
      vy: vy ?? -1.5 - Math.random() * 1.5,
      rot: (Math.random() - 0.5) * 0.4,
      vr: (Math.random() - 0.5) * 0.03,
      size: baseSize * (0.85 + Math.random() * 0.3),
    })
    if (glyphs.length > 80) glyphs.shift()
    if (hint) hint.style.opacity = '0'
  }

  function spawnWord() {
    const word = (stateLang() === 'ru' ? 'ДИЗАЙН' : 'DESIGN')
    const w = canvas.clientWidth
    const startX = w * 0.25
    for (let i = 0; i < word.length; i++) {
      addGlyph(word[i], startX + i * 58, canvas.clientHeight * 0.35, (Math.random() - 0.5) * 1.2, -2.2 - Math.random())
    }
  }

  function stateLang(): 'ru' | 'en' {
    return document.documentElement.lang === 'en' ? 'en' : 'ru'
  }

  function draw() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (w < 10 || h < 10) return
    const isDark = document.documentElement.dataset.theme !== 'light'
    const bg = isDark ? '#0b0b0d' : '#f4efe4'
    const fg = isDark ? '#f4f1ea' : '#1d1914'
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff5a3a'

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // baseline grid
    ctx.strokeStyle = isDark ? 'rgba(244,241,234,0.06)' : 'rgba(29,25,20,0.07)'
    ctx.lineWidth = 1
    for (let y = h * 0.75; y < h; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

    const bounce = Number(bounceInput?.value ?? 55) / 100
    const floor = h - 28
    const pad = 16

    for (const g of glyphs) {
      if (g !== dragging) {
        g.vy += gravity ? 0.28 : -0.005
        g.x += g.vx
        g.y += g.vy
        g.rot += g.vr
        g.vx *= 0.995
        g.vy *= 0.995
        g.vr *= 0.995

        const half = g.size * 0.28
        if (g.x < pad + half) { g.x = pad + half; g.vx *= -0.7 }
        if (g.x > w - pad - half) { g.x = w - pad - half; g.vx *= -0.7 }
        if (g.y < pad + half) { g.y = pad + half; g.vy *= -0.5 }
        if (g.y > floor - half) {
          g.y = floor - half
          g.vy *= -(0.2 + bounce * 0.65)
          g.vx *= 0.88
          g.vr *= 0.8
          if (Math.abs(g.vy) < 0.7) g.vy = 0
        }
      }

      ctx.save()
      ctx.translate(g.x, g.y)
      ctx.rotate(g.rot)
      ctx.font = `400 ${g.size}px "Bebas Neue", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = fg
      ctx.fillText(g.ch, 0, 0)
      ctx.restore()
    }

    // footer line
    ctx.fillStyle = accent
    ctx.fillRect(20, h - 18, 36, 2)
    ctx.fillStyle = isDark ? 'rgba(244,241,234,0.5)' : 'rgba(29,25,20,0.5)'
    ctx.font = '700 11px Manrope, sans-serif'
    ctx.fillText(gravity ? (stateLang() === 'ru' ? 'ГРАВИТАЦИЯ ВКЛ' : 'GRAVITY ON') : (stateLang() === 'ru' ? 'СВОБОДНЫЙ РЕЖИМ' : 'FREE MODE'), 64, h - 12)
  }

  function frame() {
    draw()
    raf = requestAnimationFrame(frame)
  }

  function canvasPos(e: PointerEvent) {
    const r = canvas.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  function pick(x: number, y: number): Glyph | null {
    for (let i = glyphs.length - 1; i >= 0; i--) {
      const g = glyphs[i]
      const half = g.size * 0.35
      if (Math.abs(x - g.x) < half && Math.abs(y - g.y) < half * 1.2) return g
    }
    return null
  }

  const onPointerDown = (e: PointerEvent) => {
    const p = canvasPos(e)
    const g = pick(p.x, p.y)
    if (g) {
      dragging = g
      dragOff = { x: p.x - g.x, y: p.y - g.y }
      lastPointer = { x: p.x, y: p.y, t: performance.now() }
      g.vx = 0; g.vy = 0; g.vr = 0
      canvas.setPointerCapture(e.pointerId)
    } else {
      hiddenInput?.focus()
    }
  }
  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return
    const p = canvasPos(e)
    const now = performance.now()
    const dt = Math.max(1, now - lastPointer.t)
    dragging.x = p.x - dragOff.x
    dragging.y = p.y - dragOff.y
    dragging.vx = (p.x - lastPointer.x) / dt * 8
    dragging.vy = (p.y - lastPointer.y) / dt * 8
    lastPointer = { x: p.x, y: p.y, t: now }
  }
  const onPointerUp = (e: PointerEvent) => {
    if (dragging) {
      dragging.vr = (Math.random() - 0.5) * 0.08
      dragging = null
      try { canvas.releasePointerCapture(e.pointerId) } catch {}
    }
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (e.key === 'Backspace') { glyphs.pop(); e.preventDefault(); return }
    if (e.key === ' ') { e.preventDefault(); addGlyph('·'); return }
    if (e.key.length === 1) {
      addGlyph(e.key.toUpperCase())
      e.preventDefault()
    }
  }

  const onHiddenInput = () => {
    const v = hiddenInput?.value || ''
    if (!v) return
    for (const ch of v) addGlyph(ch.toUpperCase())
    if (hiddenInput) hiddenInput.value = ''
  }

  const onGravity = () => {
    gravity = !gravity
    if (gravityBtn) gravityBtn.textContent = gravity
      ? (stateLang() === 'ru' ? 'Гравитация: вкл' : 'Gravity: on')
      : (stateLang() === 'ru' ? 'Гравитация: выкл' : 'Gravity: off')
  }
  const onClear = () => { glyphs = []; if (hint) hint.style.opacity = '1' }
  const onSpawn = () => spawnWord()
  const onResize = () => { resize(); draw() }

  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)
  window.addEventListener('keydown', onKey)
  hiddenInput?.addEventListener('input', onHiddenInput)
  gravityBtn?.addEventListener('click', onGravity)
  clearBtn?.addEventListener('click', onClear)
  spawnBtn?.addEventListener('click', onSpawn)
  window.addEventListener('resize', onResize)

  resize()
  spawnWord()
  frame()

  return () => {
    cancelAnimationFrame(raf)
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointercancel', onPointerUp)
    window.removeEventListener('keydown', onKey)
    hiddenInput?.removeEventListener('input', onHiddenInput)
    gravityBtn?.removeEventListener('click', onGravity)
    clearBtn?.removeEventListener('click', onClear)
    spawnBtn?.removeEventListener('click', onSpawn)
    window.removeEventListener('resize', onResize)
  }
}
