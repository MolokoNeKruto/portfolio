export type Lang = 'ru' | 'en'

export interface CaseItem {
  id: string
  index: string
  year: string
  title: { ru: string; en: string }
  kind: { ru: string; en: string }
  description: { ru: string; en: string }
  stack: string[]
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
}

export const ui = {
  nav: {
    home: { ru: 'Старт', en: 'Home' },
    work: { ru: 'Проекты', en: 'Work' },
    about: { ru: 'Обо мне', en: 'About' },
    contact: { ru: 'Контакт', en: 'Contact' },
  },
  hero: {
    status: { ru: 'Открыт к проектам', en: 'Open for projects' },
    title: {
      ru: ['Делаю', 'интерфейсы,', 'которые', 'ощущаются'],
      en: ['I build', 'interfaces', 'that', 'feel alive'],
    },
    lead: {
      ru: 'Георгий Сушинский — дизайнер и фронтенд-разработчик. Живые проекты, а не скриншоты.',
      en: 'Georgiy Sushinsky — designer and frontend developer. Live projects, not screenshots.',
    },
    hint: { ru: 'Колесо / свайп / стрелки', en: 'Wheel / swipe / arrows' },
  },
  work: {
    label: { ru: 'Проект', en: 'Project' },
    open: { ru: 'Открыть', en: 'Open' },
  },
  about: {
    label: { ru: 'Обо мне', en: 'About' },
    title: { ru: 'Кто за этим стоит', en: 'The person behind it' },
    p1: {
      ru: 'Мне нравится делать вещи, которые приятно трогать. Типографика, движение и код работают вместе.',
      en: 'I like making things that feel good to touch. Typography, motion, and code work together.',
    },
    p2: {
      ru: 'Делаю интерфейсы, сайты, плагины и визуальные инструменты — от идеи до рабочего результата.',
      en: 'I make interfaces, websites, plugins, and visual tools — from idea to a working result.',
    },
  },
  contact: {
    label: { ru: 'Контакт', en: 'Contact' },
    title: { ru: 'Давайте сделаем что-то', en: "Let's make something" },
    lead: {
      ru: 'Открыт к интересным проектам и коллаборациям. Пишите в Telegram или на почту.',
      en: 'Open to interesting projects and collaborations. Reach out on Telegram or by email.',
    },
  },
}

export const cases: CaseItem[] = [
  {
    id: 'poster-lab',
    index: '01',
    year: '2026',
    title: { ru: 'POSTER LAB', en: 'POSTER LAB' },
    kind: { ru: 'Интерактивный редактор', en: 'Interactive editor' },
    description: {
      ru: 'Редактор плакатов прямо в браузере: текст, сетка, шум, акцент, экспорт PNG. Не демо — инструмент.',
      en: 'A poster editor in the browser: text, grid, noise, accent, PNG export. Not a demo — a tool.',
    },
    stack: ['Canvas', 'Typography', 'Export', 'UI'],
  },
  {
    id: 'type-machine',
    index: '02',
    year: '2026',
    title: { ru: 'TYPE MACHINE', en: 'TYPE MACHINE' },
    kind: { ru: 'Типографическая физика', en: 'Typographic physics' },
    description: {
      ru: 'Печатай, бросай, включай гравитацию, меняй размер. Буквы — живые объекты, а не картинка.',
      en: 'Type, throw, toggle gravity, change size. Letters are live objects, not a picture.',
    },
    stack: ['Canvas', 'Physics', 'Typography', 'Play'],
  },
  {
    id: 'glassmorphism',
    index: '03',
    year: '2026',
    title: { ru: 'GLASSMORPHISM V2', en: 'GLASSMORPHISM V2' },
    kind: { ru: 'Расширение VS Code', en: 'VS Code Extension' },
    description: {
      ru: 'Рабочий плагин для VS Code: стеклянные поверхности, обои, шрифты, клавиатура и модули.',
      en: 'A working VS Code plugin: glass surfaces, wallpapers, fonts, keyboard, and modules.',
    },
    stack: ['TypeScript', 'VS Code API', 'CSS'],
    link: 'https://github.com/MolokoNeKruto/Glassmorphism-V2',
    linkLabel: { ru: 'GitHub', en: 'GitHub' },
  },
]

export const skills = [
  'Figma', 'TypeScript', 'React', 'Three.js', 'WebGL / GLSL',
  'Canvas', 'Motion', 'UI Design', 'Design Systems', 'Prototyping',
]
