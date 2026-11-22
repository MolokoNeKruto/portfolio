let cleanupPoster: (() => void) | null = null

export function initPosterDemo(root: HTMLElement): void {
  if (cleanupPoster) { cleanupPoster(); cleanupPoster = null }
  const canvasEl = root.querySelector<HTMLCanvasElement>('#poster-canvas')
  if (!canvasEl) return
  const ctx2d = canvasEl.getContext('2d')
  if (!ctx2d) return
  const canvas = canvasEl
  const ctx = ctx2d

  let mode: 'grid' | 'chaos' | 'type' | 'shift' = 'grid'
  let raf = 0
  let t = 0

  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-poster]'))
  buttons.forEach((b) => b.addEventListener('click', () => {
    buttons.forEach((x) => x.classList.remove('active'))
    b.classList.add('active')
    mode = (b.dataset.poster as typeof mode) || 'grid'
  }))

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const r = canvas.getBoundingClientRect()
    canvas.width = Math.floor(r.width * dpr)
    canvas.height = Math.floor(r.height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function draw() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    ctx.clearRect(0, 0, w, h)

    const bg = document.documentElement.dataset.theme === 'light' ? '#f3f0e8' : '#0f0f11'
    const fg = document.documentElement.dataset.theme === 'light' ? '#141311' : '#f2efe8'
    const accent = '#ff5c3a'
    const accent2 = '#c6ff4d'

    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    if (mode === 'grid') {
      const cols = 12, rows = 8
      const cw = w / cols, ch = h / rows
      ctx.strokeStyle = fg
      ctx.globalAlpha = 0.1
      for (let i = 0; i <= cols; i++) { ctx.beginPath(); ctx.moveTo(i * cw, 0); ctx.lineTo(i * cw, h); ctx.stroke() }
      for (let j = 0; j <= rows; j++) { ctx.beginPath(); ctx.moveTo(0, j * ch); ctx.lineTo(w, j * ch); ctx.stroke() }
      ctx.globalAlpha = 1
      ctx.fillStyle = accent
      ctx.fillRect(cw * 2, ch * 1.5, cw * 4, ch * 2.5)
      ctx.fillStyle = fg
      ctx.font = `700 ${Math.max(28, w * 0.08)}px "Bebas Neue", sans-serif`
      ctx.fillText('MAKE', cw * 2.2, ch * 3.3)
      ctx.fillStyle = bg
      ctx.fillText('IT', cw * 4.8, ch * 3.3)
      ctx.fillStyle = fg
      ctx.font = `italic ${Math.max(20, w * 0.045)}px "Instrument Serif", serif`
      ctx.fillText('loud / clear / yours', cw * 2.2, ch * 5.2)
      ctx.fillStyle = accent2
      ctx.fillRect(cw * 8.5, ch * 5, cw * 2, ch * 1.8)
      ctx.fillStyle = '#0b0b0c'
      ctx.font = `700 ${Math.max(12, w * 0.022)}px "Manrope", sans-serif`
      ctx.fillText('2026', cw * 8.8, ch * 6.1)
    } else if (mode === 'chaos') {
      for (let i = 0; i < 80; i++) {
        const x = (Math.sin(i * 12.9898 + t * 0.2) * 43758.5453 % 1 + 1) % 1 * w
        const y = (Math.sin(i * 78.233 + t * 0.15) * 43758.5453 % 1 + 1) % 1 * h
        const s = 10 + (i % 7) * 18
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate((i + t * 0.3) * 0.2)
        ctx.globalAlpha = 0.08 + (i % 5) * 0.06
        ctx.strokeStyle = i % 3 === 0 ? accent : fg
        ctx.lineWidth = 1.5
        ctx.strokeRect(-s / 2, -s / 2, s, s * 0.6)
        ctx.restore()
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = fg
      ctx.font = `700 ${Math.max(36, w * 0.11)}px "Bebas Neue", sans-serif`
      ctx.save()
      ctx.translate(w * 0.08, h * 0.62)
      ctx.rotate(-0.06)
      ctx.fillText('BREAK', 0, 0)
      ctx.fillStyle = accent
      ctx.fillText('THE GRID', 0, w * 0.1)
      ctx.restore()
    } else if (mode === 'type') {
      ctx.fillStyle = fg
      const lines = ['TYPE', 'IS', 'IMAGE']
      const base = Math.max(30, w * 0.1)
      lines.forEach((ln, i) => {
        ctx.font = `700 ${base * (1 - i * 0.12)}px "Bebas Neue", sans-serif`
        const y = h * 0.3 + i * base * 0.95
        ctx.fillText(ln, w * 0.08, y)
        ctx.strokeStyle = i === 1 ? accent : fg
        ctx.globalAlpha = 0.18
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(w * 0.08, y + 8)
        ctx.lineTo(w * 0.92, y + 8)
        ctx.stroke()
        ctx.globalAlpha = 1
      })
      ctx.font = `italic ${Math.max(16, w * 0.03)}px "Instrument Serif", serif`
      ctx.fillStyle = accent
      ctx.fillText('play with letters', w * 0.08, h * 0.85)
    } else {
      for (let i = 0; i < 18; i++) {
        const y = (i / 18) * h
        const offset = Math.sin(t * 0.8 + i * 0.45) * w * 0.08
        ctx.fillStyle = i % 4 === 0 ? accent : i % 4 === 1 ? accent2 : fg
        ctx.globalAlpha = i % 4 < 2 ? 0.9 : 0.08
        ctx.fillRect(offset - w * 0.1, y, w * 1.2, h / 22)
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = bg
      ctx.fillRect(w * 0.1, h * 0.28, w * 0.8, h * 0.44)
      ctx.fillStyle = fg
      ctx.font = `700 ${Math.max(34, w * 0.095)}px "Bebas Neue", sans-serif`
      ctx.fillText('SHIFT', w * 0.14, h * 0.52)
      ctx.fillStyle = accent
      ctx.fillRect(w * 0.14, h * 0.56, w * 0.18, 4)
    }

    // grain
    ctx.globalAlpha = 0.04
    ctx.fillStyle = fg
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      ctx.fillRect(x, y, 1, 1)
    }
    ctx.globalAlpha = 1
  }

  function loop() {
    t += 0.016
    draw()
    raf = requestAnimationFrame(loop)
  }

  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()
  loop()

  cleanupPoster = () => { cancelAnimationFrame(raf); ro.disconnect() }
}
