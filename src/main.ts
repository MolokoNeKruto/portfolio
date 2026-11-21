import './styles/global.css'
import Lenis from 'lenis'
import { renderApp } from './ui/render'
import { initBackground } from './scene/background'
import { initInteractions } from './ui/interactions'
import { prefersReducedMotion } from './utils/reducedMotion'

const app = document.querySelector<HTMLDivElement>('#app')
const canvas = document.querySelector<HTMLCanvasElement>('#bg-canvas')

if (!app || !canvas) {
  throw new Error('Не найдены корневые элементы приложения')
}

const state = {
  lang: (localStorage.getItem('portfolio-lang') as 'ru' | 'en' | null) ?? 'ru',
  theme: (localStorage.getItem('portfolio-theme') as 'light' | 'dark' | null) ?? 'dark',
  reducedMotion: prefersReducedMotion(),
}

function applyLangTheme() {
  document.documentElement.lang = state.lang
  document.documentElement.dataset.theme = state.theme
  document.title = state.lang === 'ru' ? 'Георгий Сушинский — портфолио' : 'Georgiy Sushinsky — Portfolio'
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', state.theme === 'dark' ? '#0f1418' : '#f3f1ec')
  const desc = document.querySelector('meta[name="description"]')
  if (desc) desc.setAttribute('content', state.lang === 'ru'
    ? 'Портфолио Георгия Сушинского — интерфейсы, фронтенд и визуальные эксперименты. Кейсы, живая сцена и контакты.'
    : 'Portfolio of Georgiy Sushinsky — interfaces, front-end development, and visual experiments. Cases, a live scene, and contacts.')
}

applyLangTheme()

const seed = (Math.random() * 1_000_000) | 0
const bg = initBackground(canvas, { theme: state.theme, seed, reducedMotion: state.reducedMotion })

let lenis: Lenis | null = null
if (!state.reducedMotion) {
  lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
  const raf = (time: number) => {
    lenis?.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  lenis.on('scroll', (e: { progress: number }) => {
    bg.setScroll(e.progress)
  })
}

function mount() {
  renderApp(app!, state)
  initInteractions(app!, state, {
    onLangChange: (lang) => {
      state.lang = lang
      localStorage.setItem('portfolio-lang', lang)
      applyLangTheme()
      mount()
    },
    onThemeChange: (theme) => {
      state.theme = theme
      localStorage.setItem('portfolio-theme', theme)
      applyLangTheme()
      bg.setTheme(theme)
      mount()
    },
    scrollTo: (target) => {
      const el = typeof target === 'string' ? document.querySelector(target) : target
      if (!el) return
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -40 })
      else (el as HTMLElement).scrollIntoView({ behavior: state.reducedMotion ? 'auto' : 'smooth', block: 'start' })
    },
  })
  bg.setScroll(lenis ? lenis.progress : 0)
}

window.addEventListener('mousemove', (e) => {
  bg.setPointer(e.clientX / window.innerWidth, e.clientY / window.innerHeight)
}, { passive: true })

window.addEventListener('scroll', () => {
  if (!lenis) {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? window.scrollY / max : 0
    bg.setScroll(p)
  }
}, { passive: true })

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  state.reducedMotion = e.matches
})

mount()
