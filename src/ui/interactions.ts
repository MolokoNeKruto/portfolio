import type { ViewState } from './render'
import { initPosterDemo } from './posterDemo'
import { initTypeDemo } from './typeDemo'

interface Handlers {
  onLang: (lang: 'ru' | 'en') => void
  onTheme: (theme: 'dark' | 'light') => void
}

export function initInteractions(root: HTMLElement, state: ViewState, handlers: Handlers): void {
  // nav scroll
  const nav = document.getElementById('nav')
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 24)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  // lang/theme
  root.querySelector('[data-lang-switch]')?.addEventListener('click', () => {
    handlers.onLang(state.lang === 'ru' ? 'en' : 'ru')
  })
  root.querySelector('[data-theme-switch]')?.addEventListener('click', () => {
    handlers.onTheme(state.theme === 'dark' ? 'light' : 'dark')
  })

  // anchor nav
  root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id)
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.pushState(null, '', id) }
    })
  })

  // active nav
  const sections = ['work', 'about', 'contact']
  const navLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-nav]'))
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        navLinks.forEach((l) => l.classList.toggle('active', l.dataset.nav === e.target.id))
      }
    }
  }, { rootMargin: '-30% 0px -60% 0px' })
  sections.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })

  // reveal
  const reveals = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const rio = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.isIntersecting) { e.target.classList.add('visible'); rio.unobserve(e.target) } }
    }, { threshold: 0.12 })
    reveals.forEach((el) => rio.observe(el))
  } else {
    reveals.forEach((el) => el.classList.add('visible'))
  }

  // live demos
  initPosterDemo(root)
  initTypeDemo(root)

  // signal mode buttons (signal scene reads data attr)
  root.querySelectorAll<HTMLButtonElement>('[data-signal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('[data-signal]').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      const canvas = document.getElementById('signal-canvas')
      if (canvas) canvas.dataset.mode = btn.dataset.signal || 'mesh'
    })
  })

  // pause videos out of view
  const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('video'))
  const vio = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target as HTMLVideoElement
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }
  }, { threshold: 0.1 })
  videos.forEach((v) => vio.observe(v))
}
