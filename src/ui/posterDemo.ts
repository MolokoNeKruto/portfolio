export function initPosterDemo(root: HTMLElement): () => void {
  const canvasEl = root.querySelector<HTMLCanvasElement>('#poster-canvas')
  if (!canvasEl) return () => {}
  const ctx2d = canvasEl.getContext('2d')
  if (!ctx2d) return () => {}
  const canvas = canvasEl
  const ctx = ctx2d

  const textInput = root.querySelector<HTMLInputElement>('#poster-text')
  const subInput = root.querySelector<HTMLInputElement>('#poster-sub')
  const gridInput = root.querySelector<HTMLInputElement>('#poster-grid')
  const noiseInput = root.querySelector<HTMLInputElement>('#poster-noise')
  const sizeInput = root.querySelector<HTMLInputElement>('#poster-size')
  const accentInput = root.querySelector<HTMLInputElement>('#poster-accent')
  const exportBtn = root.querySelector<HTMLButtonElement>('#poster-export')
  const modeBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-poster-mode]'))

  let mode: 'grid' | 'type' | 'chaos' = 'type'
  let raf = 0
  let t = 0

  const get = () => ({
    text: (textInput?.value || 'MAKE IT REAL').toUpperCase().slice(0, 32),
    sub: (subInput?.value || '').slice(0, 42),
    grid: Number(gridInput?.value ?? 55) / 100,
    noise: Number(noiseInput?.value ?? 18) / 100,
    size: Number(sizeInput?.value ?? 88) / 100,
    accent: accentInput?.value || '#ff5a3a',
  })

  const onMode = (e: Event) => {
    const btn = e.currentTarget as HTMLButtonElement
    modeBtns.forEach((b) => b.classList.remove('active'))
    btn.classList.add('active')
    mode = (btn.dataset.posterMode as typeof mode) || 'type'
  }
  modeBtns.forEach((b) => b.addEventListener('click', onMode))

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const r = canvas.getBoundingClientRect()
    const w = Math.max(10, Math.floor(r.width))
    const h = Math.max(10, Math.floor(r.height))
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function draw() {
    const { text, sub, grid, noise, size, accent } = get()
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (w < 10 || h < 10) return
    const isDark = document.documentElement.dataset.theme !== 'light'
    const bg = isDark ? '#0b0b0d' : '#f4efe4'
    const fg = isDark ? '#f4f1ea' : '#1d1914'
    const muted = isDark ? 'rgba(244,241,234,0.55)' : 'rgba(29,25,20,0.55)'

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, w, h)

    // background accent wash
    const g = ctx.createRadialGradient(w * 0.75, h * 0.3, 10, w * 0.75, h * 0.3, w * 0.8)
    g.addColorStop(0, accent + (isDark ? '33' : '22'))
    g.addColorStop(1, 'transparent')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    // grid
    const gridAlpha = 0.03 + grid * 0.18
    ctx.strokeStyle = isDark ? `rgba(244,241,234,${gridAlpha})` : `rgba(29,25,20,${gridAlpha})`
    ctx.lineWidth = 1
    const step = Math.max(18, 56 - grid * 34)
    for (let x = 0; x <= w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
    for (let y = 0; y <= h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

    // chaos ribbons
    if (mode === 'chaos') {
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = i % 2 ? accent : (isDark ? 'rgba(244,241,234,0.18)' : 'rgba(29,25,20,0.15)')
        ctx.lineWidth = 1.5
        ctx.beginPath()
        for (let x = -20; x <= w + 20; x += 24) {
          const y = h * (0.2 + i * 0.15) + Math.sin(x * 0.012 + t * 0.8 + i) * (30 + i * 10)
          if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
    }

    // title
    const base = Math.min(w, h)
    const fontSize = Math.max(36, base * (0.22 + size * 0.22))
    ctx.save()
    ctx.translate(w * 0.08, h * (mode === 'type' ? 0.58 : 0.54))
    if (mode === 'chaos') ctx.rotate(-0.06 + Math.sin(t * 0.3) * 0.02)
    ctx.fillStyle = fg
    ctx.font = `400 ${fontSize}px "Bebas Neue", sans-serif`
    ctx.textBaseline = 'alphabetic'
    const lines = text.split(/\s+/).reduce<string[]>((acc, word) => {
      if (!acc.length) return [word]
      const last = acc[acc.length - 1]
      const test = last + ' ' + word
      if (ctx.measureText(test).width < w * 0.82) acc[acc.length - 1] = test
      else acc.push(word)
      return acc
    }, [])
    const lh = fontSize * 0.88
    lines.slice(0, 3).forEach((line, i) => {
      ctx.fillText(line, 0, i * lh)
      if (mode === 'type' && i === 0) {
        const tw = ctx.measureText(line).width
        ctx.fillStyle = accent
        ctx.fillRect(0, 12, Math.min(tw, w * 0.82), Math.max(4, fontSize * 0.06))
        ctx.fillStyle = fg
      }
    })
    ctx.restore()

    // sub + meta
    ctx.fillStyle = muted
    ctx.font = `700 ${Math.max(11, base * 0.028)}px Manrope, sans-serif`
    ctx.fillText(sub.toUpperCase(), w * 0.08, h * 0.84)
    ctx.fillStyle = accent
    ctx.fillRect(w * 0.08, h * 0.86, 48, 2)
    ctx.fillStyle = muted
    ctx.font = `600 ${Math.max(10, base * 0.022)}px Manrope, sans-serif`
    ctx.fillText('PORTFOLIO / POSTER LAB', w * 0.08, h * 0.12)
    ctx.textAlign = 'right'
    ctx.fillText(new Date().getFullYear().toString(), w * 0.92, h * 0.12)
    ctx.textAlign = 'left'

    // noise
    if (noise > 0.01) {
      const count = Math.floor(w * h * noise * 0.03)
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)'
      for (let i = 0; i < count; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        ctx.fillRect(x, y, 1, 1)
      }
    }

    // border
    ctx.strokeStyle = isDark ? 'rgba(244,241,234,0.12)' : 'rgba(29,25,20,0.14)'
    ctx.lineWidth = 1
    ctx.strokeRect(10, 10, w - 20, h - 20)
  }

  function frame() {
    t += 0.016
    draw()
    raf = requestAnimationFrame(frame)
  }

  const onExport = () => {
    const a = document.createElement('a')
    a.download = 'poster-lab.png'
    a.href = canvas.toDataURL('image/png')
    a.click()
  }
  exportBtn?.addEventListener('click', onExport)

  const onResize = () => { resize(); draw() }
  window.addEventListener('resize', onResize)
  resize()
  frame()

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
    exportBtn?.removeEventListener('click', onExport)
    modeBtns.forEach((b) => b.removeEventListener('click', onMode))
  }
}
