export type Lang = 'ru' | 'en'

export interface CaseItem {
  id: string
  index: string
  year: string
  title: { ru: string; en: string }
  kind: { ru: string; en: string }
  description: { ru: string; en: string }
  stack: string[]
  media: string
  poster: string
  link?: string
  linkLabel?: { ru: string; en: string }
}

export const site = {
  name: 'Георгий Сушинский',
  short: 'GS',
  role: {
    ru: 'Дизайн интерфейсов / фронтенд / визуальные эксперименты',
    en: 'Interface design / frontend / visual experiments',
  },
  location: { ru: 'Россия · удалённо', en: 'Russia · remote' },
  email: 'georgiminivi@gmail.com',
  telegram: 'https://t.me/DornegE',
  telegramLabel: '@DornegE',
  github: 'https://github.com/MolokoNeKruto',
  githubLabel: 'MolokoNeKruto',
  support: 'https://boosty.to',
}

export const ui = {
  nav: {
    work: { ru: 'Проекты', en: 'Work' },
    about: { ru: 'Обо мне', en: 'About' },
    contact: { ru: 'Контакт', en: 'Contact' },
  },
  hero: {
    status: { ru: 'Открыт к задачам', en: 'Available for work' },
    title1: { ru: 'ДЕЛАЮ', en: 'I BUILD' },
    title2: { ru: 'ИНТЕРФЕЙСЫ,', en: 'INTERFACES,' },
    title3: { ru: 'КОТОРЫЕ', en: 'THAT' },
    title4: { ru: 'ХОЧЕТСЯ ТРОГАТЬ', en: 'WANT TO BE TOUCHED' },
    lead: {
      ru: 'Георгий Сушинский. Проектирую и собираю цифровые вещи: от плагинов и интерфейсных систем до интерактивных сцен. Здесь не рассказ о проектах — сами проекты.',
      en: 'Georgiy Sushinsky. I design and build digital things: from plugins and interface systems to interactive scenes. Not stories about projects — the projects themselves.',
    },
    scroll: { ru: 'Скролл', en: 'Scroll' },
  },
  work: {
    label: { ru: 'Избранное', en: 'Selected work' },
    title: { ru: 'ПРОЕКТЫ', en: 'PROJECTS' },
    hint: { ru: 'Каждый проект — живой. Наведи, покрути, потяни.', en: 'Every project is live. Hover, drag, interact.' },
  },
  about: {
    label: { ru: 'Резюме', en: 'Resume' },
    title: { ru: 'НЕ ПРО СЛОВА', en: 'NOT ABOUT WORDS' },
    body: {
      ru: 'Мне интересно, когда интерфейс — это не набор карточек, а вещь с характером. Я работаю на стыке дизайна и кода: рисую, собираю, анимирую, довожу до состояния, в котором всё нажимается и движется как надо. Люблю сложную графику, странные композиции и аккуратную реализацию.',
      en: 'I care about interfaces that feel like objects, not card grids. I work between design and code: sketch, build, animate, and polish until everything clicks and moves right. I like heavy graphics, odd compositions, and clean implementation.',
    },
    skills: {
      ru: ['TypeScript', 'WebGL / Three.js', 'GSAP', 'CSS / дизайн-системы', 'Figma', 'Blender / рендер', 'UI-прототипирование'],
      en: ['TypeScript', 'WebGL / Three.js', 'GSAP', 'CSS / design systems', 'Figma', 'Blender / render', 'UI prototyping'],
    },
  },
  contact: {
    label: { ru: 'Связаться', en: 'Contact' },
    title: { ru: 'СДЕЛАЕМ ЧТО-ТО', en: "LET'S MAKE SOMETHING" },
    title2: { ru: 'НЕНУДНОЕ', en: 'NOT BORING' },
    mail: { ru: 'Почта', en: 'Email' },
    tg: { ru: 'Телеграм', en: 'Telegram' },
    gh: { ru: 'Гитхаб', en: 'GitHub' },
    support: { ru: 'Поддержать (демо)', en: 'Support (demo)' },
    supportNote: { ru: 'Демо-ссылка, без адресата.', en: 'Demo link, no recipient.' },
  },
  footer: {
    made: { ru: 'Собрано руками, не шаблоном', en: 'Built by hand, not template' },
  },
}

export const cases: CaseItem[] = [
  {
    id: 'glassmorphism',
    index: '01',
    year: '2025',
    title: { ru: 'Glassmorphism v2', en: 'Glassmorphism v2' },
    kind: { ru: 'Плагин для OpenCode Desktop', en: 'OpenCode Desktop plugin' },
    description: {
      ru: 'Настоящий плагин: стеклянные поверхности, обои, шрифты, экранная клавиатура, эмодзи и переключаемые модули. Не мокап — рабочая вещь.',
      en: 'A real plugin: glass surfaces, wallpapers, fonts, on-screen keyboard, emoji, and toggleable modules. Not a mockup — a working thing.',
    },
    stack: ['TypeScript', 'CSS', 'OpenCode'],
    media: '/media/glass.mp4',
    poster: '/media/glass-poster.jpg',
    link: 'https://github.com/MolokoNeKruto',
    linkLabel: { ru: 'GitHub', en: 'GitHub' },
  },
  {
    id: 'poster-lab',
    index: '02',
    year: '2026',
    title: { ru: 'POSTER LAB', en: 'POSTER LAB' },
    kind: { ru: 'Интерактивный генератор плакатов', en: 'Interactive poster generator' },
    description: {
      ru: 'Живой инструмент прямо на странице: меняй типографику, сетку, шум и цвет — получай плакат. Это не скриншот, это работает.',
      en: 'A live tool right on the page: change type, grid, noise, and color — get a poster. Not a screenshot, it works.',
    },
    stack: ['Canvas', 'Type', 'Generative'],
    media: '/media/poster.mp4',
    poster: '/media/poster-poster.jpg',
  },
  {
    id: 'signal',
    index: '03',
    year: '2026',
    title: { ru: 'SIGNAL', en: 'SIGNAL' },
    kind: { ru: 'Аудио-реактивная сцена', en: 'Audio-reactive scene' },
    description: {
      ru: '3D-объект, который реагирует на звук и движение мыши. Включи микрофон или просто води курсором — сцена отвечает.',
      en: 'A 3D object reacting to sound and mouse movement. Enable mic or just move cursor — the scene responds.',
    },
    stack: ['WebGL', 'Audio', 'Shader'],
    media: '/media/signal.mp4',
    poster: '/media/signal-poster.jpg',
  },
  {
    id: 'type-machine',
    index: '04',
    year: '2026',
    title: { ru: 'TYPE MACHINE', en: 'TYPE MACHINE' },
    kind: { ru: 'Кинетическая типографика', en: 'Kinetic typography' },
    description: {
      ru: 'Печатай — и буквы становятся физикой. Тяни, бросай, ломай строку. Маленькая машина для игры со шрифтом.',
      en: 'Type — and letters become physics. Drag, throw, break the line. A small machine for playing with type.',
    },
    stack: ['Matter.js', 'Type', 'Interactive'],
    media: '/media/type.mp4',
    poster: '/media/type-poster.jpg',
  },
]
