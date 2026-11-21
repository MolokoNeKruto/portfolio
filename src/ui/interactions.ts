import { cases, ui, type Lang } from '../data/content'

interface State {
  lang: Lang
  theme: 'light' | 'dark'
  reducedMotion: boolean
}

interface Handlers {
  onLangChange: (lang: Lang) => void
  onThemeChange: (theme: 'light' | 'dark') => void
  scrollTo: (target: string | Element) => void
}

type CmdItem = { label: string; hint: string; target: string }

function buildItems(lang: Lang): CmdItem[] {
  const base: CmdItem[] = [
    { label: ui.nav.hero[lang], hint: '#hero', target: '#hero' },
    { label: ui.nav.about[lang], hint: '#about', target: '#about' },
    { label: ui.nav.cases[lang], hint: '#cases', target: '#cases' },
    { label: ui.nav.capabilities[lang], hint: '#capabilities', target: '#capabilities' },
    { label: ui.nav.contact[lang], hint: '#contact', target: '#contact' },
  ]
  const caseItems = cases.map((c) => ({ label: `${c.number} ${c.title[lang]}`, hint: c.kind === 'real' ? (lang === 'ru' ? 'реальный кейс' : 'real case') : (lang === 'ru' ? 'концепт' : 'concept'), target: `#case-${c.id}` }))
  return [...base, ...caseItems]
}

export function initInteractions(root: HTMLElement, state: State, handlers: Handlers): void {
  // lang & theme
  const skip = document.querySelector<HTMLAnchorElement>('.skip-link')
  if (skip) skip.textContent = ui.skip[state.lang]
  root.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang as Lang
      if (lang && lang !== state.lang) handlers.onLangChange(lang)
    })
  })
  root.querySelector<HTMLButtonElement>('[data-action="theme"]')?.addEventListener('click', () => {
    handlers.onThemeChange(state.theme === 'dark' ? 'light' : 'dark')
  })

  // chapter nav active state
  const chapterLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>('.chapter-nav a'))
  const chapters = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'))
  const setActive = (id: string) => {
    chapterLinks.forEach((a) => a.setAttribute('aria-current', a.dataset.nav === id ? 'true' : 'false'))
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) setActive(visible.target.id)
    }, { threshold: [0.25, 0.5, 0.7] })
    chapters.forEach((c) => io.observe(c))
  }

  // scroll nav clicks
  root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        handlers.scrollTo(target)
        history.replaceState(null, '', href)
      }
    })
  })

  // reveal animations
  const revealEls = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
  if (state.reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none' })
  } else {
    revealEls.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(18px)'
      el.style.transition = 'opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)'
    })
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement
          el.style.opacity = '1'
          el.style.transform = 'none'
          rio.unobserve(el)
        }
      })
    }, { threshold: 0.15 })
    revealEls.forEach((el) => rio.observe(el))
  }

  // case demos
  initSpectrumDemo(root)
  initContourDemo(root, state.lang)

  // command palette
  initCommandPalette(root, state, handlers)
}

function initSpectrumDemo(root: HTMLElement) {
  const demo = root.querySelector<HTMLElement>('[data-demo="spectrum"]')
  if (!demo) return
  const orb = demo.querySelector<HTMLElement>('.spectrum-orb')
  const buttons = Array.from(demo.querySelectorAll<HTMLButtonElement>('[data-swatch]'))
  const presets: Record<string, string> = {
    cool: 'conic-gradient(from 120deg, rgba(120,211,197,0.75), rgba(127,168,216,0.65), rgba(120,211,197,0.35), rgba(120,211,197,0.75))',
    warm: 'conic-gradient(from 120deg, rgba(216,176,122,0.8), rgba(180,120,70,0.55), rgba(120,211,197,0.25), rgba(216,176,122,0.8))',
    balance: 'conic-gradient(from 120deg, rgba(120,211,197,0.7), rgba(216,176,122,0.65), rgba(127,168,216,0.6), rgba(120,211,197,0.7))',
  }
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.swatch || 'balance'
      buttons.forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'))
      if (orb && presets[key]) orb.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 35%), ${presets[key]}`
    })
  })
}

function initContourDemo(root: HTMLElement, lang: Lang) {
  const demo = root.querySelector<HTMLElement>('[data-demo="contour"]')
  if (!demo) return
  const steps = Array.from(demo.querySelectorAll<HTMLElement>('.flow span'))
  const log = demo.querySelector<HTMLElement>('.flow-log')
  if (!steps.length || !log) return
  const messages = lang === 'ru'
    ? ['Шаг 1/4: план зафиксирован.', 'Шаг 2/4: сборка прошла успешно.', 'Шаг 3/4: проверки завершены.', 'Шаг 4/4: артефакт готов к выпуску.']
    : ['Step 1/4: plan captured.', 'Step 2/4: build completed.', 'Step 3/4: checks finished.', 'Step 4/4: artifact ready to ship.']
  const w = window as Window & { __contourTimer?: number }
  if (w.__contourTimer) window.clearInterval(w.__contourTimer)
  let i = 0
  const tick = () => {
    if (!document.body.contains(demo)) {
      if (w.__contourTimer) window.clearInterval(w.__contourTimer)
      return
    }
    steps.forEach((s, idx) => s.classList.toggle('active', idx === i))
    log.textContent = messages[i]
    i = (i + 1) % steps.length
  }
  tick()
  w.__contourTimer = window.setInterval(tick, 2200)
}

function initCommandPalette(root: HTMLElement, state: State, handlers: Handlers) {
  const overlay = root.querySelector<HTMLElement>('#cmdk')
  const input = root.querySelector<HTMLInputElement>('#cmdk-input')
  const list = root.querySelector<HTMLUListElement>('#cmdk-list')
  const openBtn = root.querySelector<HTMLButtonElement>('[data-action="palette"]')
  if (!overlay || !input || !list) return

  let items = buildItems(state.lang)
  let filtered = items
  let active = 0

  const renderList = () => {
    list.innerHTML = filtered.map((it, idx) => `<li role="none"><button type="button" role="option" id="cmdk-opt-${idx}" data-target="${it.target}" aria-selected="${idx === active}"><span>${it.label}</span><span>${it.hint}</span></button></li>`).join('')
    list.querySelectorAll<HTMLButtonElement>('button').forEach((btn) => {
      btn.addEventListener('click', () => go(btn.dataset.target || '#hero'))
    })
    const activeBtn = list.querySelector<HTMLElement>('button[aria-selected="true"]')
    if (activeBtn) input.setAttribute('aria-activedescendant', activeBtn.id)
    else input.removeAttribute('aria-activedescendant')
  }

  const open = () => {
    items = buildItems(state.lang)
    filtered = items
    active = 0
    input.value = ''
    overlay.setAttribute('aria-hidden', 'false')
    renderList()
    setTimeout(() => input.focus(), 0)
  }
  const close = () => {
    overlay.setAttribute('aria-hidden', 'true')
    openBtn?.focus()
  }
  const go = (target: string) => {
    close()
    handlers.scrollTo(target)
  }

  openBtn?.addEventListener('click', open)
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close() })
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim()
    filtered = !q ? items : items.filter((it) => it.label.toLowerCase().includes(q) || it.hint.toLowerCase().includes(q))
    active = 0
    renderList()
  })
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, Math.max(0, filtered.length - 1)); renderList() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); renderList() }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[active]) go(filtered[active].target) }
    else if (e.key === 'Escape') { e.preventDefault(); close() }
  })

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      if (overlay.getAttribute('aria-hidden') === 'false') close(); else open()
    }
    if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') close()
  })
}
