import type { SceneId, ViewState } from './render'
import { SCENES } from './render'
import { initPosterDemo } from './posterDemo'
import { initTypeDemo } from './typeDemo'

interface Handlers {
  onLang: (lang: 'ru' | 'en') => void
  onTheme: (theme: 'dark' | 'light') => void
  onScene: (scene: SceneId) => void
}

export function initInteractions(root: HTMLElement, state: ViewState, handlers: Handlers): () => void {
  const cleanups: Array<() => void> = []

  root.querySelector('[data-lang-switch]')?.addEventListener('click', () => {
    handlers.onLang(state.lang === 'ru' ? 'en' : 'ru')
  })
  root.querySelector('[data-theme-switch]')?.addEventListener('click', () => {
    handlers.onTheme(state.theme === 'dark' ? 'light' : 'dark')
  })

  root.querySelectorAll<HTMLElement>('[data-scene]').forEach((el) => {
    el.addEventListener('click', () => {
      const s = el.dataset.scene as SceneId | undefined
      if (s && (SCENES as string[]).includes(s)) handlers.onScene(s)
    })
  })

  // wheel / trackpad scene navigation (throttled)
  let wheelLock = 0
  const onWheel = (e: WheelEvent) => {
    const target = e.target as HTMLElement | null
    if (target?.closest('input, textarea, [data-demo-controls], .panel')) {
      // allow scroll inside panel/demo controls; only switch when panel can't scroll
      const panel = target.closest('.panel') as HTMLElement | null
      if (panel) {
        const canScroll = panel.scrollHeight > panel.clientHeight + 4
        if (canScroll) {
          const atTop = panel.scrollTop <= 0
          const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 2
          if (!(atTop && e.deltaY < 0) && !(atBottom && e.deltaY > 0)) return
        }
      }
      if (target.closest('[data-demo-controls]')) return
    }
    if (Math.abs(e.deltaY) < 30) return
    const now = Date.now()
    if (now - wheelLock < 900) return
    wheelLock = now
    const idx = SCENES.indexOf(state.scene)
    const dir = e.deltaY > 0 ? 1 : -1
    const next = SCENES[(idx + dir + SCENES.length) % SCENES.length]
    handlers.onScene(next)
  }
  window.addEventListener('wheel', onWheel, { passive: true })
  cleanups.push(() => window.removeEventListener('wheel', onWheel))

  // keyboard navigation
  const onKey = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement | null)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement | null)?.isContentEditable) return
    const idx = SCENES.indexOf(state.scene)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault(); handlers.onScene(SCENES[(idx + 1) % SCENES.length])
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault(); handlers.onScene(SCENES[(idx - 1 + SCENES.length) % SCENES.length])
    } else if (e.key === 'Home') {
      e.preventDefault(); handlers.onScene('home')
    } else if (e.key === 'End') {
      e.preventDefault(); handlers.onScene(SCENES[SCENES.length - 1])
    }
  }
  window.addEventListener('keydown', onKey)
  cleanups.push(() => window.removeEventListener('keydown', onKey))

  // touch swipe
  let touchY = 0
  let touchX = 0
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    if (!t) return
    touchY = t.clientY
    touchX = t.clientX
  }
  const onTouchEnd = (e: TouchEvent) => {
    const t = e.changedTouches[0]
    if (!t) return
    const target = e.target as HTMLElement | null
    if (target?.closest('input, textarea, [data-demo-controls], #poster-canvas, #type-canvas, .glass-preview')) return
    const dy = touchY - t.clientY
    const dx = touchX - t.clientX
    const ady = Math.abs(dy)
    const adx = Math.abs(dx)
    if (Math.max(ady, adx) < 45) return
    const idx = SCENES.indexOf(state.scene)
    if (ady > adx) {
      handlers.onScene(SCENES[(idx + (dy > 0 ? 1 : -1) + SCENES.length) % SCENES.length])
    } else {
      handlers.onScene(SCENES[(idx + (dx > 0 ? 1 : -1) + SCENES.length) % SCENES.length])
    }
  }
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  cleanups.push(() => { window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchend', onTouchEnd) })

  // demos
  if (state.scene === 'poster-lab') cleanups.push(initPosterDemo(root))
  if (state.scene === 'type-machine') cleanups.push(initTypeDemo(root))

  return () => { for (const c of cleanups) c() }
}
