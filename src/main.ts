import './styles/global.css'
import { renderApp, SCENES, type SceneId, type ViewState } from './ui/render'
import { initInteractions } from './ui/interactions'
import { initHeroScene, type HeroSceneController } from './scene/heroScene'

const appEl = document.querySelector<HTMLDivElement>('#app')
if (!appEl) throw new Error('#app not found')
const app: HTMLDivElement = appEl

function parseScene(hash: string): SceneId {
  const raw = hash.replace(/^#\/?/, '') as SceneId
  return (SCENES as string[]).includes(raw) ? raw : 'home'
}

const state: ViewState = {
  lang: (localStorage.getItem('gs-lang') as 'ru' | 'en') || 'ru',
  theme: (localStorage.getItem('gs-theme') as 'dark' | 'light') || 'dark',
  scene: parseScene(location.hash),
}

let scene: HeroSceneController | null = null
let cleanupInteractions: (() => void) | null = null

function applyState(): void {
  document.documentElement.lang = state.lang
  document.documentElement.dataset.theme = state.theme
  document.title = state.lang === 'ru'
    ? 'Георгий Сушинский — портфолио'
    : 'Georgiy Sushinsky — Portfolio'
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', state.theme === 'dark' ? '#09090b' : '#f5f1e8')
}

function syncHash(): void {
  const want = `#${state.scene}`
  if (location.hash !== want) history.replaceState(null, '', want)
}

function mount(): void {
  cleanupInteractions?.()
  cleanupInteractions = null
  applyState()
  syncHash()
  renderApp(app, state)

  const canvas = document.querySelector<HTMLCanvasElement>('#bg-canvas')
  if (!scene) {
    scene = initHeroScene(canvas, state)
  } else {
    scene.attach(canvas)
    scene.setTheme(state.theme)
    scene.setScene(state.scene)
  }

  cleanupInteractions = initInteractions(app, state, {
    onLang: (lang) => { state.lang = lang; localStorage.setItem('gs-lang', lang); mount() },
    onTheme: (theme) => {
      state.theme = theme
      localStorage.setItem('gs-theme', theme)
      applyState()
      const btn = app.querySelector('[data-theme-switch]')
      if (btn) btn.textContent = theme === 'dark' ? '☀' : '☾'
      scene?.setTheme(theme)
    },
    onScene: (next) => {
      if (state.scene === next) return
      state.scene = next
      syncHash()
      mount()
    },
  })
}

window.addEventListener('hashchange', () => {
  const next = parseScene(location.hash)
  if (next !== state.scene) {
    state.scene = next
    mount()
  }
})

mount()
