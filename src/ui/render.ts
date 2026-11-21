import { cases, site, ui, type Lang } from '../data/content'

interface State {
  lang: Lang
  theme: 'light' | 'dark'
  reducedMotion: boolean
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}

function demoMarkup(id: string, lang: Lang): string {
  switch (id) {
    case 'glassmorphism-v2':
      return `
        <div class="case-demo demo-glass" aria-label="${lang === 'ru' ? 'Демо интерфейса Glassmorphism v2' : 'Glassmorphism v2 interface demo'}">
          <div class="demo-bar"><span class="demo-dot"></span><span class="demo-dot"></span><span class="demo-pill"></span></div>
          <div class="demo-sheet">
            <div class="demo-row" style="width:92%"></div>
            <div class="demo-row short"></div>
            <div class="demo-row" style="width:78%"></div>
          </div>
          <div class="demo-modules" role="list" aria-label="${lang === 'ru' ? 'Модули' : 'Modules'}">
            <span role="listitem">${lang === 'ru' ? 'Обои' : 'Wallpapers'}</span>
            <span role="listitem">${lang === 'ru' ? 'Клавиатура' : 'Keyboard'}</span>
            <span role="listitem">${lang === 'ru' ? 'Смайлики' : 'Emoji'}</span>
            <span role="listitem">${lang === 'ru' ? 'Переливания' : 'Motion'}</span>
          </div>
        </div>`
    case 'spectrum':
      return `
        <div class="case-demo demo-spectrum" data-demo="spectrum">
          <div class="spectrum-orb" aria-hidden="true"></div>
          <div class="spectrum-ui">
            <button type="button" data-swatch="cool" aria-pressed="true">${lang === 'ru' ? 'Холодный' : 'Cool'}</button>
            <button type="button" data-swatch="warm" aria-pressed="false">${lang === 'ru' ? 'Тёплый' : 'Warm'}</button>
            <button type="button" data-swatch="balance" aria-pressed="false">${lang === 'ru' ? 'Баланс' : 'Balance'}</button>
          </div>
        </div>`
    case 'gran':
      return `
        <div class="case-demo demo-edge" aria-hidden="true">
          <div class="edge-layer"></div>
          <div class="edge-layer"></div>
          <div class="edge-layer"></div>
          <div class="edge-layer"></div>
        </div>`
    case 'kontur':
      return `
        <div class="case-demo demo-contour" data-demo="contour">
          <div class="flow" aria-hidden="true">
            <span class="active">${lang === 'ru' ? 'План' : 'Plan'}</span>
            <span>${lang === 'ru' ? 'Сборка' : 'Build'}</span>
            <span>${lang === 'ru' ? 'Проверка' : 'Check'}</span>
            <span>${lang === 'ru' ? 'Выпуск' : 'Ship'}</span>
          </div>
          <div class="flow-log" aria-live="polite">${lang === 'ru' ? 'Шаг 1/4: план зафиксирован.' : 'Step 1/4: plan captured.'}</div>
        </div>`
    case 'sreda':
      return `
        <div class="case-demo demo-space" aria-hidden="true">
          <div class="space-grid">
            <span class="space-node n1" style="left:18%;top:22%"></span>
            <span class="space-node n2" style="left:55%;top:38%"></span>
            <span class="space-node n3" style="left:36%;top:62%"></span>
          </div>
        </div>`
    default:
      return `<div class="case-demo"></div>`
  }
}

export function renderApp(root: HTMLElement, state: State): void {
  const { lang, theme } = state
  const t = ui
  const navItems = [
    { id: 'hero', label: t.nav.hero[lang] },
    { id: 'about', label: t.nav.about[lang] },
    { id: 'cases', label: t.nav.cases[lang] },
    { id: 'capabilities', label: t.nav.capabilities[lang] },
    { id: 'contact', label: t.nav.contact[lang] },
  ]

  root.innerHTML = `
    <header class="topbar glass" role="banner">
      <div class="brand">
        <span class="brand-mark">${esc(site.owner.name)}</span>
        <span class="brand-role">${esc(site.owner.roles[lang])}</span>
      </div>
      <div class="top-actions">
        <div class="lang-switch" role="group" aria-label="${lang === 'ru' ? 'Язык' : 'Language'}">
          <button type="button" data-lang="ru" aria-pressed="${lang === 'ru'}">RU</button>
          <button type="button" data-lang="en" aria-pressed="${lang === 'en'}">EN</button>
        </div>
        <button type="button" class="btn icon-btn" data-action="theme" aria-label="${esc(t.palette.theme[lang])}" title="${esc(t.palette.theme[lang])}">
          <span aria-hidden="true">${theme === 'dark' ? '☀' : '◐'}</span>
        </button>
        <button type="button" class="btn" data-action="palette" aria-label="${esc(t.palette.open[lang])}">${lang === 'ru' ? 'Переход' : 'Jump'} <span class="muted small">Ctrl+K</span></button>
      </div>
    </header>

    <nav class="chapter-nav" aria-label="${lang === 'ru' ? 'Главы' : 'Chapters'}">
      ${navItems.map((n) => `<a href="#${n.id}" data-nav="${n.id}" aria-label="${esc(n.label)}"><span>${esc(n.label)}</span></a>`).join('')}
    </nav>

    <main id="main">
      <section id="hero" class="chapter hero shell" data-chapter>
        <div class="hero-grid">
          <div>
            <p class="eyebrow reveal">${esc(t.hero.eyebrow[lang])}</p>
            <h1 class="reveal">
              <span class="line">${esc(t.hero.titleA[lang])}</span>
              <span class="line accent">${esc(t.hero.titleB[lang])}</span>
            </h1>
            <p class="lead reveal">${esc(t.hero.lead[lang])}</p>
            <div class="scroll-cue reveal"><i aria-hidden="true"></i><span>${esc(t.hero.cue[lang])}</span></div>
          </div>
          <div class="hero-meta reveal">
            <div class="hero-tags">
              <span class="chip">RU / EN</span>
              <span class="chip">${lang === 'ru' ? 'Светлая и тёмная тема' : 'Light & dark theme'}</span>
              <span class="chip">WebGL</span>
              <span class="chip">${lang === 'ru' ? 'Живые кейсы' : 'Live cases'}</span>
            </div>
            <div class="glass panel">
              <p class="small" style="margin:0">${lang === 'ru'
                ? 'Эта страница собрана как резюме: рассказывает о проектах и одновременно показывает, как я работаю с композицией, движением и интерфейсом.'
                : 'This page works as a résumé: it presents projects while showing how I handle composition, motion, and interface.'}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" class="chapter shell" data-chapter>
        <div class="chapter-header">
          <p class="eyebrow reveal">${esc(t.about.eyebrow[lang])}</p>
          <h2 class="reveal">${esc(t.about.title[lang])}</h2>
          <p class="lead reveal">${esc(t.about.lead[lang])}</p>
        </div>
        <div class="split">
          <div class="glass panel reveal">
            <h3>${esc(site.owner.name)}</h3>
            <p class="muted" style="margin:.5rem 0 0">${esc(site.owner.roles[lang])}</p>
          </div>
          <div class="glass panel reveal">
            <ul class="about-points">
              ${t.about.points.map((p) => `<li><strong>${esc(p.title[lang])}</strong><span class="muted">${esc(p.text[lang])}</span></li>`).join('')}
            </ul>
          </div>
        </div>
      </section>

      <section id="cases" class="chapter shell" data-chapter>
        <div class="chapter-header">
          <p class="eyebrow reveal">${esc(t.cases.eyebrow[lang])}</p>
          <h2 class="reveal">${esc(t.cases.title[lang])}</h2>
          <p class="lead reveal">${esc(t.cases.lead[lang])}</p>
        </div>
        <div class="cases-grid">
          ${cases.map((c, i) => `
            <article class="case-card glass reveal ${i === 0 ? 'featured' : ''}" id="case-${esc(c.id)}" data-case="${esc(c.id)}">
              <div>
                <div class="case-head">
                  <span class="chip">${esc(c.number)}</span>
                  <span class="chip">${esc(c.kind === 'real' ? t.cases.realLabel[lang] : t.cases.conceptLabel[lang])}</span>
                </div>
                <h3 style="margin:.7rem 0 .25rem">${esc(c.title[lang])}</h3>
                <p class="muted">${esc(c.subtitle[lang])}</p>
                <p style="margin-top:.7rem">${esc(c.summary[lang])}</p>
                <p class="small" style="margin-top:.6rem"><strong>${lang === 'ru' ? 'Роль/фокус:' : 'Role/focus:'}</strong> ${esc(c.role[lang])}</p>
                <ul class="case-points">${c.points[lang].map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
                <div class="case-meta" style="margin-top:.7rem">${c.tags.map((tag) => `<span class="chip">${esc(tag)}</span>`).join('')}</div>
              </div>
              ${demoMarkup(c.id, lang)}
            </article>
          `).join('')}
        </div>
      </section>

      <section id="capabilities" class="chapter shell" data-chapter>
        <div class="chapter-header">
          <p class="eyebrow reveal">${esc(t.capabilities.eyebrow[lang])}</p>
          <h2 class="reveal">${esc(t.capabilities.title[lang])}</h2>
          <p class="lead reveal">${esc(t.capabilities.lead[lang])}</p>
        </div>
        <div class="cap-grid">
          ${t.capabilities.items.map((it) => `
            <article class="cap glass reveal"><h3>${esc(it.title[lang])}</h3><p>${esc(it.text[lang])}</p></article>
          `).join('')}
        </div>
      </section>

      <section id="contact" class="chapter shell" data-chapter>
        <div class="chapter-header">
          <p class="eyebrow reveal">${esc(t.contact.eyebrow[lang])}</p>
          <h2 class="reveal">${esc(t.contact.title[lang])}</h2>
          <p class="lead reveal">${esc(t.contact.lead[lang])}</p>
        </div>
        <div class="contact-grid">
          <div class="glass panel reveal">
            <ul class="contact-list">
              <li><a class="contact-link" href="${esc(site.contacts.emailHref)}"><div><strong>${esc(t.contact.email[lang])}</strong><br><span>${esc(site.contacts.email)}</span></div><span aria-hidden="true">→</span></a></li>
              <li><a class="contact-link" href="${esc(site.contacts.telegramHref)}" target="_blank" rel="noopener noreferrer"><div><strong>${esc(t.contact.telegram[lang])}</strong><br><span>${esc(site.contacts.telegramLabel)}</span></div><span aria-hidden="true">↗</span></a></li>
              <li><a class="contact-link" href="${esc(site.contacts.githubHref)}" target="_blank" rel="noopener noreferrer"><div><strong>${esc(t.contact.github[lang])}</strong><br><span>${esc(site.contacts.githubLabel)}</span></div><span aria-hidden="true">↗</span></a></li>
            </ul>
          </div>
          <div class="glass panel reveal">
            <h3>${esc(t.contact.support[lang])}</h3>
            <p class="muted" style="margin:.5rem 0 1rem">${esc(t.contact.supportNote[lang])}</p>
            <a class="btn btn-primary" href="${esc(site.contacts.supportHref)}" target="_blank" rel="noopener noreferrer">${esc(t.contact.support[lang])}</a>
            <p class="support-note">${lang === 'ru' ? 'Переход на главную страницу сервиса. Адресата перевода нет.' : 'Goes to the service home page. No payment recipient is set.'}</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="shell"><p>${esc(t.footer.note[lang])}</p></footer>

    <div class="cmdk-overlay" id="cmdk" aria-hidden="true">
      <div class="cmdk glass" role="dialog" aria-modal="true" aria-label="${esc(t.palette.open[lang])}">
        <input id="cmdk-input" type="text" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-autocomplete="list" placeholder="${esc(t.palette.placeholder[lang])}" />
        <ul class="cmdk-list" id="cmdk-list" role="listbox"></ul>
        <p class="cmdk-hint">${esc(t.palette.hint[lang])}</p>
      </div>
    </div>
  `
}
