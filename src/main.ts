import './styles/global.css'
import { renderApp, type ViewState } from './ui/render'
import { initInteractions } from './ui/interactions'
import { initHeroScene } from './scene/heroScene'
import { initSignalScene } from './scene/signalScene'

const appEl = document.querySelector<HTMLDivElement>('#app')
if (!appEl) throw new Error('#app not found')
const app: HTMLDivElement = appEl

const state: ViewState = {
  lang: (localStorage.getItem('gs-lang') as 'ru' | 'en') || 'ru',
  theme: (localStorage.getItem('gs-theme') as 'dark' | 'light') || 'dark',
}

let cleanupHero: (() => void) | null = null

function applyState() {
  document.documentElement.lang = state.lang
  document.documentElement.dataset.theme = state.theme
  document.title = state.lang === 'ru'
    ? 'Георгий Сушинский — портфолио'
    : 'Georgiy Sushinsky — Portfolio'
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', state.theme === 'dark' ? '#0b0b0c' : '#f3f0e8')
}

function mount() {
  if (cleanupHero) { cleanupHero(); cleanupHero = null }
  applyState()
  renderApp(app, state)
  initInteractions(app, state, {
    onLang: (lang) => { state.lang = lang; localStorage.setItem('gs-lang', lang); mount() },
    onTheme: (theme) => { state.theme = theme; localStorage.setItem('gs-theme', theme); mount() },
  })
  cleanupHero = initHeroScene(document.querySelector<HTMLCanvasElement>('#hero-canvas'))
  initSignalScene(document.querySelector<HTMLCanvasElement>('#signal-canvas'))
}

mount()
