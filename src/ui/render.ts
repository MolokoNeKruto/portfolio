import { cases, site, ui, type Lang } from '../data/content'

export interface ViewState {
  lang: Lang
  theme: 'dark' | 'light'
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c))
}

function projectMedia(c: typeof cases[number], lang: Lang): string {
  const badge = `<span class="media-badge">${esc(c.kind[lang])}</span>`
  if (c.id === 'poster-lab') {
    return `
      <div class="live-demo" data-demo="poster">
        <canvas id="poster-canvas"></canvas>
        <div class="live-demo-ui">
          <button class="demo-btn active" data-poster="grid">GRID</button>
          <button class="demo-btn" data-poster="chaos">CHAOS</button>
          <button class="demo-btn" data-poster="type">TYPE</button>
          <button class="demo-btn" data-poster="shift">SHIFT</button>
          <span class="demo-label">${lang === 'ru' ? 'Живой демо' : 'Live demo'}</span>
        </div>
      </div>`
  }
  if (c.id === 'signal') {
    return `
      <div class="live-demo" data-demo="signal">
        <canvas id="signal-canvas"></canvas>
        <div class="live-demo-ui">
          <button class="demo-btn active" data-signal="mesh">MESH</button>
          <button class="demo-btn" data-signal="points">POINTS</button>
          <button class="demo-btn" data-signal="wire">WIRE</button>
          <span class="demo-label">${lang === 'ru' ? 'Двигай мышью / включи микрофон' : 'Move mouse / enable mic'}</span>
        </div>
      </div>`
  }
  if (c.id === 'type-machine') {
    return `
      <div class="live-demo" data-demo="type">
        <canvas id="type-canvas"></canvas>
        <div class="live-demo-ui">
          <button class="demo-btn" id="type-reset">${lang === 'ru' ? 'СБРОС' : 'RESET'}</button>
          <button class="demo-btn" id="type-gravity">${lang === 'ru' ? 'ГРАВИТАЦИЯ' : 'GRAVITY'}</button>
          <span class="demo-label">${lang === 'ru' ? 'Печатай на клавиатуре' : 'Type on keyboard'}</span>
        </div>
      </div>`
  }
  // default: video render
  return `
    <div class="project-media">
      ${badge}
      <video src="${esc(c.media)}" poster="${esc(c.poster)}" muted loop playsinline autoplay preload="metadata"></video>
      <div class="media-overlay"></div>
    </div>`
}

export function renderApp(root: HTMLElement, state: ViewState): void {
  const { lang, theme } = state
  const t = ui
  const otherLang = lang === 'ru' ? 'en' : 'ru'

  root.innerHTML = `
    <nav class="nav" id="nav">
      <div class="nav-inner">
        <a class="brand" href="#top" aria-label="Georgiy Sushinsky"><span>GS</span> / ${lang === 'ru' ? 'Портфолио' : 'Portfolio'}</a>
        <div class="nav-links">
          <a href="#work" data-nav="work">${esc(t.nav.work[lang])}</a>
          <a href="#about" data-nav="about">${esc(t.nav.about[lang])}</a>
          <a href="#contact" data-nav="contact">${esc(t.nav.contact[lang])}</a>
        </div>
        <div class="nav-controls">
          <button class="pill" data-lang-switch aria-label="${lang === 'ru' ? 'Switch to English' : 'Переключить на русский'}">${otherLang.toUpperCase()}</button>
          <button class="pill" data-theme-switch aria-label="${lang === 'ru' ? 'Сменить тему' : 'Toggle theme'}" aria-pressed="${theme === 'light'}">${theme === 'dark' ? 'LIGHT' : 'DARK'}</button>
        </div>
      </div>
    </nav>

    <main id="top">
      <section class="hero" aria-label="Hero">
        <canvas id="hero-canvas" aria-hidden="true"></canvas>
        <div class="hero-overlay" aria-hidden="true"></div>
        <div class="hero-content">
          <div class="hero-status reveal">${esc(t.hero.status[lang])}</div>
          <h1 class="hero-title" aria-label="${esc(site.name)}">
            <span class="line"><span>${esc(t.hero.title1[lang])}</span></span>
            <span class="line"><span>${esc(t.hero.title2[lang])}</span></span>
            <span class="line"><span>${esc(t.hero.title3[lang])}</span></span>
            <span class="line"><span class="accent">${esc(t.hero.title4[lang])}</span></span>
          </h1>
          <div class="hero-bottom">
            <p class="hero-lead reveal">${esc(t.hero.lead[lang])}</p>
            <div class="hero-scroll reveal" aria-hidden="true"><span class="bar"></span>${esc(t.hero.scroll[lang])}</div>
          </div>
        </div>
      </section>

      <section class="section shell" id="work" aria-labelledby="work-title">
        <div class="section-head">
          <div>
            <div class="label reveal">${esc(t.work.label[lang])}</div>
            <h2 class="section-title reveal" id="work-title">${esc(t.work.title[lang])}</h2>
          </div>
          <p class="section-hint reveal">${esc(t.work.hint[lang])}</p>
        </div>
        <div class="projects">
          ${cases.map((c) => `
            <article class="project reveal" id="project-${esc(c.id)}">
              <div class="project-index">${esc(c.index)}</div>
              <div class="project-meta">
                <div class="project-kind"><span>${esc(c.kind[lang])}</span><span class="year">${esc(c.year)}</span></div>
                <h3 class="project-name">${esc(c.title[lang])}</h3>
                <p class="project-desc">${esc(c.description[lang])}</p>
                <div class="project-stack">${c.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div>
                ${c.link ? `<a class="project-link" href="${esc(c.link)}" target="_blank" rel="noopener noreferrer">${esc(c.linkLabel?.[lang] || 'Link')}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></a>` : ''}
              </div>
              ${projectMedia(c, lang)}
            </article>
          `).join('')}
        </div>
      </section>

      <section class="section shell" id="about" aria-labelledby="about-title">
        <div class="section-head">
          <div>
            <div class="label reveal">${esc(t.about.label[lang])}</div>
            <h2 class="section-title reveal" id="about-title">${esc(t.about.title[lang])}</h2>
          </div>
        </div>
        <div class="about-grid">
          <div class="about-text reveal">
            <p><strong>${esc(site.name)}</strong> — ${esc(site.role[lang])}.</p>
            <p>${esc(t.about.body[lang])}</p>
          </div>
          <div class="skills reveal" aria-label="${lang === 'ru' ? 'Навыки' : 'Skills'}">
            ${t.about.skills[lang].map((s) => `<span class="skill">${esc(s)}</span>`).join('')}
          </div>
        </div>
        <div class="about-manifesto reveal">
          ${lang === 'ru' ? 'Меньше шаблонов. <em>Больше характера.</em>' : 'Less template. <em>More character.</em>'}
        </div>
      </section>

      <section class="section shell" id="contact" aria-labelledby="contact-title">
        <div class="contact-grid">
          <div>
            <div class="label reveal">${esc(t.contact.label[lang])}</div>
            <h2 class="section-title reveal" id="contact-title">${esc(t.contact.title[lang])}<br><em>${esc(t.contact.title2[lang])}</em></h2>
          </div>
          <div class="contact-links reveal">
            <a class="contact-link" href="mailto:${esc(site.email)}">
              <span class="c-label">${esc(t.contact.mail[lang])}</span>
              <span class="c-val">${esc(site.email)}</span>
            </a>
            <a class="contact-link" href="${esc(site.telegram)}" target="_blank" rel="noopener noreferrer">
              <span class="c-label">${esc(t.contact.tg[lang])}</span>
              <span class="c-val">${esc(site.telegramLabel)}</span>
            </a>
            <a class="contact-link" href="${esc(site.github)}" target="_blank" rel="noopener noreferrer">
              <span class="c-label">${esc(t.contact.gh[lang])}</span>
              <span class="c-val">${esc(site.githubLabel)}</span>
            </a>
            <a class="contact-link" href="${esc(site.support)}" target="_blank" rel="noopener noreferrer">
              <span class="c-label">${esc(t.contact.support[lang])}</span>
              <span class="c-val">${esc(t.contact.supportNote[lang])}</span>
            </a>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer shell">
      <span>© ${new Date().getFullYear()} ${esc(site.name)}</span>
      <span>${esc(t.footer.made[lang])}</span>
    </footer>
  `
}
