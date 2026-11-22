import { cases, site, skills, ui, type Lang } from '../data/content'

export type SceneId = 'home' | 'poster-lab' | 'type-machine' | 'glassmorphism' | 'about' | 'contact'

export interface ViewState {
  lang: Lang
  theme: 'dark' | 'light'
  scene: SceneId
}

export const SCENES: SceneId[] = ['home', 'poster-lab', 'type-machine', 'glassmorphism', 'about', 'contact']

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c))
}

function sceneLabel(id: SceneId, lang: Lang): string {
  if (id === 'home') return ui.nav.home[lang]
  if (id === 'about') return ui.nav.about[lang]
  if (id === 'contact') return ui.nav.contact[lang]
  const c = cases.find((x) => x.id === id)
  return c ? c.title[lang] : id
}

function posterPanel(lang: Lang): string {
  return `
    <div class="demo-shell poster-shell">
      <div class="poster-stage">
        <canvas id="poster-canvas" aria-label="Poster editor canvas"></canvas>
      </div>
      <div class="demo-controls" data-demo-controls>
        <label class="ctl"><span>${lang === 'ru' ? 'Текст' : 'Text'}</span>
          <input id="poster-text" type="text" value="MAKE IT REAL" maxlength="32" autocomplete="off" />
        </label>
        <label class="ctl"><span>${lang === 'ru' ? 'Подпись' : 'Sub'}</span>
          <input id="poster-sub" type="text" value="${lang === 'ru' ? 'дизайн / код / эксперимент' : 'design / code / experiment'}" maxlength="42" autocomplete="off" />
        </label>
        <label class="ctl"><span>${lang === 'ru' ? 'Сетка' : 'Grid'}</span><input id="poster-grid" type="range" min="0" max="100" value="55" /></label>
        <label class="ctl"><span>${lang === 'ru' ? 'Шум' : 'Noise'}</span><input id="poster-noise" type="range" min="0" max="100" value="18" /></label>
        <label class="ctl"><span>${lang === 'ru' ? 'Размер' : 'Size'}</span><input id="poster-size" type="range" min="40" max="140" value="88" /></label>
        <label class="ctl ctl-row"><span>${lang === 'ru' ? 'Акцент' : 'Accent'}</span><input id="poster-accent" type="color" value="#ff5a3a" /></label>
        <div class="ctl-btns">
          <button class="demo-btn" data-poster-mode="grid">GRID</button>
          <button class="demo-btn active" data-poster-mode="type">TYPE</button>
          <button class="demo-btn" data-poster-mode="chaos">CHAOS</button>
          <button class="demo-btn demo-btn-solid" id="poster-export">${lang === 'ru' ? 'Экспорт PNG' : 'Export PNG'}</button>
        </div>
      </div>
    </div>`
}

function typePanel(lang: Lang): string {
  return `
    <div class="demo-shell type-shell">
      <div class="poster-stage">
        <canvas id="type-canvas" aria-label="Type machine canvas"></canvas>
        <div class="type-hint" id="type-hint">${lang === 'ru' ? 'Печатай на клавиатуре. Тяни буквы мышью/пальцем.' : 'Type on keyboard. Drag letters with mouse/touch.'}</div>
      </div>
      <div class="demo-controls">
        <label class="ctl"><span>${lang === 'ru' ? 'Размер' : 'Size'}</span><input id="type-size" type="range" min="28" max="110" value="64" /></label>
        <label class="ctl"><span>${lang === 'ru' ? 'Прыгучесть' : 'Bounce'}</span><input id="type-bounce" type="range" min="10" max="95" value="55" /></label>
        <div class="ctl-btns">
          <button class="demo-btn" id="type-gravity">${lang === 'ru' ? 'Гравитация: выкл' : 'Gravity: off'}</button>
          <button class="demo-btn" id="type-clear">${lang === 'ru' ? 'Очистить' : 'Clear'}</button>
          <button class="demo-btn demo-btn-solid" id="type-spawn">${lang === 'ru' ? 'Бросить слово' : 'Spawn word'}</button>
        </div>
        <input id="type-hidden-input" class="type-hidden-input" type="text" inputmode="text" autocomplete="off" autocapitalize="off" aria-label="Type input" />
      </div>
    </div>`
}

function glassPanel(lang: Lang): string {
  const c = cases.find((x) => x.id === 'glassmorphism')!
  return `
    <div class="demo-shell glass-shell">
      <div class="glass-preview">
        <div class="glass-mock">
          <div class="glass-mock-bar"><span></span><span></span><span></span></div>
          <div class="glass-mock-body">
            <div class="glass-mock-side"></div>
            <div class="glass-mock-main">
              <div class="glass-float g1"><b>Blur</b><small>24px</small></div>
              <div class="glass-float g2"><b>Wallpaper</b><small>Live</small></div>
              <div class="glass-float g3"><b>Keyboard</b><small>On-screen</small></div>
              <div class="glass-code">
                <code><i>const</i> glass = <i>true</i></code>
                <code>theme.<em>apply</em>(<i>'glassmorphism-v2'</i>)</code>
                <code>ui.<em>blur</em>(24)</code>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-controls glass-copy">
        <p class="glass-kicker">${esc(c.kind[lang])} · ${esc(c.year)}</p>
        <p class="glass-desc">${esc(c.description[lang])}</p>
        <div class="project-stack">${c.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div>
        ${c.link ? `<a class="project-link" href="${esc(c.link)}" target="_blank" rel="noopener noreferrer"><span>${esc(c.linkLabel?.[lang] || 'Open')}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M7 7h10v10"/></svg></a>` : ''}
      </div>
    </div>`
}

function projectBody(id: SceneId, lang: Lang): string {
  if (id === 'poster-lab') return posterPanel(lang)
  if (id === 'type-machine') return typePanel(lang)
  return glassPanel(lang)
}

export function renderApp(root: HTMLElement, state: ViewState): void {
  const lang = state.lang
  const idx = SCENES.indexOf(state.scene)
  const prev = SCENES[(idx - 1 + SCENES.length) % SCENES.length]
  const next = SCENES[(idx + 1) % SCENES.length]
  const project = cases.find((c) => c.id === state.scene)
  const sceneNum = String(idx + 1).padStart(2, '0')

  const dots = SCENES.map((s, i) => `
    <button class="dot ${s === state.scene ? 'active' : ''}" data-scene="${s}" aria-label="${esc(sceneLabel(s, lang))}" aria-current="${s === state.scene ? 'true' : 'false'}">
      <span>${String(i + 1).padStart(2, '0')}</span>
    </button>`).join('')

  let panel = ''
  if (state.scene === 'home') {
    panel = `
      <div class="panel panel-home">
        <p class="hero-status">${esc(ui.hero.status[lang])}</p>
        <h1 class="hero-title">
          ${ui.hero.title[lang].map((line, i) => `<span class="line ${i === 3 ? 'accent' : ''}">${esc(line)}</span>`).join('')}
        </h1>
        <p class="hero-lead">${esc(ui.hero.lead[lang])}</p>
        <div class="hero-actions">
          <button class="cta" data-scene="poster-lab">${esc(ui.nav.work[lang])}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
          <span class="hero-hint">${esc(ui.hero.hint[lang])}</span>
        </div>
      </div>`
  } else if (state.scene === 'about') {
    panel = `
      <div class="panel panel-info">
        <p class="label">${esc(ui.about.label[lang])}</p>
        <h2 class="section-title">${esc(ui.about.title[lang])}</h2>
        <div class="about-cols">
          <div class="about-text">
            <p><strong>${esc(site.name)}</strong> — ${esc(site.role[lang])}</p>
            <p>${esc(ui.about.p1[lang])}</p>
            <p>${esc(ui.about.p2[lang])}</p>
          </div>
          <div class="skills">${skills.map((s) => `<span class="skill">${esc(s)}</span>`).join('')}</div>
        </div>
      </div>`
  } else if (state.scene === 'contact') {
    panel = `
      <div class="panel panel-info">
        <p class="label">${esc(ui.contact.label[lang])}</p>
        <h2 class="section-title">${esc(ui.contact.title[lang])}</h2>
        <p class="contact-lead">${esc(ui.contact.lead[lang])}</p>
        <div class="contact-links">
          <a class="contact-link" href="mailto:${esc(site.email)}"><span class="c-label">Email</span><span class="c-val">${esc(site.email)}</span></a>
          <a class="contact-link" href="${esc(site.telegram)}" target="_blank" rel="noopener noreferrer"><span class="c-label">Telegram</span><span class="c-val">${esc(site.telegramLabel)}</span></a>
          <a class="contact-link" href="${esc(site.github)}" target="_blank" rel="noopener noreferrer"><span class="c-label">GitHub</span><span class="c-val">${esc(site.githubLabel)}</span></a>
        </div>
      </div>`
  } else if (project) {
    panel = `
      <div class="panel panel-project">
        <div class="project-head">
          <p class="label">${esc(ui.work.label[lang])} ${esc(project.index)}</p>
          <h2 class="project-name">${esc(project.title[lang])}</h2>
          <p class="project-kind"><span>${esc(project.kind[lang])}</span><span class="year">${esc(project.year)}</span></p>
          <p class="project-desc">${esc(project.description[lang])}</p>
        </div>
        <div class="project-body">${projectBody(state.scene, lang)}</div>
      </div>`
  }

  root.innerHTML = `
    <div class="app-shell" data-scene="${esc(state.scene)}">
      <canvas id="bg-canvas" aria-hidden="true"></canvas>
      <div class="chrome">
        <header class="topbar">
          <button class="brand" data-scene="home" aria-label="Home">
            <span class="brand-mark">GS</span><span class="brand-name">${esc(site.name)}</span>
          </button>
          <nav class="scene-nav" aria-label="Sections">
            ${SCENES.map((s) => `<button class="nav-btn ${s === state.scene ? 'active' : ''}" data-scene="${s}">${esc(sceneLabel(s, lang))}</button>`).join('')}
          </nav>
          <div class="nav-controls">
            <button class="pill" data-lang-switch aria-label="Switch language">${lang === 'ru' ? 'EN' : 'RU'}</button>
            <button class="pill" data-theme-switch aria-label="Switch theme">${state.theme === 'dark' ? '☀' : '☾'}</button>
          </div>
        </header>

        <main class="stage" id="stage">
          <div class="scene-num" aria-hidden="true">${sceneNum}</div>
          ${panel}
        </main>

        <footer class="bottombar">
          <button class="arrow" data-scene="${prev}" aria-label="Previous">←</button>
          <div class="dots" role="tablist" aria-label="Scenes">${dots}</div>
          <button class="arrow" data-scene="${next}" aria-label="Next">→</button>
        </footer>
      </div>
    </div>`
}