export type Lang = 'ru' | 'en'

export interface CaseItem {
  id: string
  number: string
  kind: 'real' | 'concept'
  title: { ru: string; en: string }
  subtitle: { ru: string; en: string }
  summary: { ru: string; en: string }
  role: { ru: string; en: string }
  points: { ru: string[]; en: string[] }
  tags: string[]
}

export const site = {
  owner: {
    name: 'Георгий Сушинский',
    roles: {
      ru: 'Дизайнер интерфейсов · Фронтенд-разработчик · Автор визуальных экспериментов',
      en: 'Interface designer · Front-end developer · Visual experiment author',
    },
  },
  contacts: {
    email: 'georgiminivi@gmail.com',
    emailHref: 'mailto:georgiminivi@gmail.com',
    telegramLabel: '@DornegE',
    telegramHref: 'https://t.me/DornegE',
    githubLabel: 'github.com/MolokoNeKruto',
    githubHref: 'https://github.com/MolokoNeKruto',
    supportHref: 'https://boosty.to',
  },
}

export const ui = {
  skip: { ru: 'Перейти к содержанию', en: 'Skip to content' },
  nav: {
    hero: { ru: 'Вход', en: 'Intro' },
    about: { ru: 'Обо мне', en: 'About' },
    cases: { ru: 'Кейсы', en: 'Cases' },
    capabilities: { ru: 'Возможности', en: 'Capabilities' },
    contact: { ru: 'Контакты', en: 'Contact' },
  },
  hero: {
    eyebrow: { ru: 'Личное портфолио и витрина экспериментов', en: 'Personal portfolio and experiment showcase' },
    titleA: { ru: 'Георгий', en: 'Georgiy' },
    titleB: { ru: 'Сушинский', en: 'Sushinsky' },
    lead: {
      ru: 'Собираю интерфейсы, где композиция, свет и движение работают вместе с задачей. Этот сайт — и резюме, и живая демонстрация того, как я думаю о материале экрана.',
      en: 'I build interfaces where composition, light, and motion work with the task, not against it. This site is both a résumé and a live demonstration of how I think about screen material.',
    },
    cue: { ru: 'Листайте — главы раскрываются по ходу движения', en: 'Scroll — chapters unfold as you move' },
  },
  about: {
    eyebrow: { ru: 'Позиция', en: 'Stance' },
    title: { ru: 'Каркас для смысла, поток для ощущения', en: 'A frame for meaning, a flow for feeling' },
    lead: {
      ru: 'Мне интересны интерфейсы, в которых видно устройство: где структура держит внимание, а переходы объясняют, что изменилось. Я работаю на стыке визуального решения и фронтенд-реализации.',
      en: 'I’m drawn to interfaces with visible structure: where layout holds attention and transitions explain what changed. I work between visual decisions and front-end implementation.',
    },
    points: [
      {
        title: { ru: 'Интерфейс как среда', en: 'Interface as an environment' },
        text: {
          ru: 'Экран воспринимаю как пространство со слоями, глубиной и правилами поведения, а не как набор независимых блоков.',
          en: 'I treat the screen as a space with layers, depth, and rules of behavior — not as a stack of unrelated blocks.',
        },
      },
      {
        title: { ru: 'Эффект с опорой', en: 'Effect with a reason' },
        text: {
          ru: 'Анимация и свет нужны там, где они помогают прочитать состояние, выделить главное или задать ритм.',
          en: 'Motion and light belong where they clarify state, mark what matters, or set rhythm.',
        },
      },
      {
        title: { ru: 'От идеи до сборки', en: 'From idea to build' },
        text: {
          ru: 'Довожу замысел до работающего результата: от композиции и токенов до интерактива и аккуратной реализации.',
          en: 'I carry an idea through to a working result: from composition and tokens to interaction and careful implementation.',
        },
      },
    ],
  },
  cases: {
    eyebrow: { ru: 'Кейсы и прототипы', en: 'Cases and prototypes' },
    title: { ru: 'Проекты, которые можно рассмотреть', en: 'Projects you can inspect' },
    lead: {
      ru: 'Один проект — реальный, остальные — концепты-прототипы, собранные специально для этой витрины. Их можно заменить вашими кейсами, сохранив подачу. У каждого есть живой фрагмент, а не только описание.',
      en: 'One project is real; the rest are concept prototypes built for this showcase. You can replace them with your own cases while keeping the presentation. Each one includes a live fragment, not just a description.',
    },
    realLabel: { ru: 'Реальный проект', en: 'Real project' },
    conceptLabel: { ru: 'Концепт-прототип (заменю своим)', en: 'Concept prototype (to be replaced)' },
  },
  capabilities: {
    eyebrow: { ru: 'Что показывает этот сайт', en: 'What this site demonstrates' },
    title: { ru: 'Возможности, собранные в одном месте', en: 'Capabilities gathered in one place' },
    lead: {
      ru: 'Страница устроена как опыт: сцена, типографика, темы и навигация связаны между собой и реагируют на действия посетителя.',
      en: 'The page is built as an experience: scene, typography, themes, and navigation are connected and respond to the visitor.',
    },
    items: [
      { title: { ru: 'Живая WebGL-сцена', en: 'Live WebGL scene' }, text: { ru: 'Шейдерный фон с геометрией и текучим светом, реагирующий на скролл, курсор и выбранную тему.', en: 'A shader background with geometry and fluid light that responds to scroll, pointer, and the selected theme.' } },
      { title: { ru: 'Скролл-повествование', en: 'Scroll narrative' }, text: { ru: 'Главы раскрываются последовательно: движение связывает разделы вместо набора разрозненных экранов.', en: 'Chapters unfold in sequence: motion connects sections instead of presenting isolated screens.' } },
      { title: { ru: 'Светлая и тёмная темы', en: 'Light and dark themes' }, text: { ru: 'Два состояния освещения одной системы. Палитра и материалы меняются, характер — сохраняется.', en: 'Two lighting states of one system. Palette and materials shift while the character stays consistent.' } },
      { title: { ru: 'Два языка', en: 'Two languages' }, text: { ru: 'Русский по умолчанию и наглядное переключение на английский прямо в интерфейсе.', en: 'Russian by default with a clear, in-place switch to English.' } },
      { title: { ru: 'Процедурная вариативность', en: 'Procedural variation' }, text: { ru: 'Параметры сцены получают зерно при каждом заходе: облик знакомый, детали — каждый раз свои.', en: 'Scene parameters receive a seed on each visit: familiar character, slightly different details every time.' } },
      { title: { ru: 'Быстрый переход', en: 'Quick jump' }, text: { ru: 'Ненавязчивая командная палитра (Ctrl/Cmd+K) для перехода к главам, кейсам и контактам.', en: 'An unobtrusive command palette (Ctrl/Cmd+K) to jump to chapters, cases, and contacts.' } },
    ],
  },
  contact: {
    eyebrow: { ru: 'Связь', en: 'Contact' },
    title: { ru: 'Написать или посмотреть профиль', en: 'Get in touch or view profiles' },
    lead: {
      ru: 'Открыт к диалогу о проектах, интерфейсах и визуальных экспериментах. Ниже — прямые ссылки.',
      en: 'Open to conversations about projects, interfaces, and visual experiments. Direct links below.',
    },
    email: { ru: 'Почта', en: 'Email' },
    telegram: { ru: 'Telegram', en: 'Telegram' },
    github: { ru: 'GitHub', en: 'GitHub' },
    support: { ru: 'Поддержать (демо)', en: 'Support (demo)' },
    supportNote: {
      ru: 'Демо-кнопка: открывает главную страницу сервиса, без адресата перевода. Никому ничего не отправится.',
      en: 'Demo button: opens the service home page with no recipient. Nothing will be sent to anyone.',
    },
  },
  palette: {
    open: { ru: 'Открыть быстрый переход', en: 'Open quick jump' },
    placeholder: { ru: 'Перейти к разделу или кейсу…', en: 'Jump to a section or case…' },
    hint: { ru: 'Enter — перейти · Esc — закрыть', en: 'Enter — go · Esc — close' },
    theme: { ru: 'Переключить тему', en: 'Toggle theme' },
  },
  footer: {
    note: {
      ru: 'Георгий Сушинский. Сайт-портфолио и живая витрина. Концепт-кейсы помечены и ждут замены на ваши проекты.',
      en: 'Georgiy Sushinsky. Portfolio site and live showcase. Concept cases are marked and ready to be replaced with your projects.',
    },
  },
}

export const cases: CaseItem[] = [
  {
    id: 'glassmorphism-v2',
    number: '01',
    kind: 'real',
    title: { ru: 'Glassmorphism v2', en: 'Glassmorphism v2' },
    subtitle: { ru: 'Плагин визуальной кастомизации для OpenCode Desktop', en: 'Visual customization plugin for OpenCode Desktop' },
    summary: {
      ru: 'Переработка плагина для OpenCode Desktop 2.3.2: единый стеклянный материал, собственные обои и шрифты, экранная клавиатура и эмодзи, переключаемые модули и встраивание в композер — с упором на цельность и приемлемую нагрузку.',
      en: 'A rework of a plugin for OpenCode Desktop 2.3.2: a unified glass material, custom wallpapers and fonts, an on-screen keyboard and emoji, toggleable modules, and composer integration — with attention to coherence and reasonable cost.',
    },
    role: { ru: 'Дизайн системы поверхностей · фронтенд-реализация', en: 'Surface system design · front-end implementation' },
    points: {
      ru: [
        'Единый визуальный материал (glass / liquid glass) для панелей, меню и композера при разной степени прозрачности.',
        'Модули «Обои», «Клавиатура», «Смайлики», «Переливания» с реальным включением и выключением поведения.',
        'Экранная клавиатура, панель эмодзи, управление обоями и шрифтами в компактной панели настроек.',
        'GUI-бандл и сборка через PowerShell-скрипт; плагин регистрирует русскую контекстную инструкцию в сессии.',
      ],
      en: [
        'A unified visual material (glass / liquid glass) for panels, menus, and the composer with varying transparency.',
        '“Wallpapers”, “Keyboard”, “Emoji”, and “Motion” modules that actually enable and disable behavior.',
        'On-screen keyboard, emoji panel, wallpaper and font management inside a compact settings panel.',
        'GUI bundle built via a PowerShell script; the plugin registers a Russian context instruction for the session.',
      ],
    },
    tags: ['TypeScript', 'CSS', 'OpenCode Desktop', 'UI system'],
  },
  {
    id: 'spectrum',
    number: '02',
    kind: 'concept',
    title: { ru: 'Спектр', en: 'Spectrum' },
    subtitle: { ru: 'Среда визуальных тем и токенов', en: 'An environment for visual themes and tokens' },
    summary: {
      ru: 'Концепт системы, где палитра, свет и контраст настраиваются как параметры живой сцены. Тема перестаёт быть статичной таблицей и становится инструментом, который можно потрогать.',
      en: 'A concept system where palette, light, and contrast are tuned as parameters of a living scene. A theme stops being a static table and becomes something you can handle.',
    },
    role: { ru: 'Проектирование токенов · интерактивный прототип', en: 'Token design · interactive prototype' },
    points: {
      ru: [
        'Общий подтон для светлого и тёмного состояний, чтобы мир не распадался на два разных сайта.',
        'Акцент работает как подсветка материала, а не как плоская заливка.',
        'Предпросмотр показывает, как решение ведёт себя в движении и на разных поверхностях.',
      ],
      en: [
        'A shared undertone for light and dark states so the world doesn’t split into two different sites.',
        'Accent behaves like material lighting rather than a flat fill.',
        'The preview shows how a choice behaves in motion and across surfaces.',
      ],
    },
    tags: ['Design tokens', 'Color', 'Prototype'],
  },
  {
    id: 'gran',
    number: '03',
    kind: 'concept',
    title: { ru: 'Грань', en: 'Facet' },
    subtitle: { ru: 'Интерфейс, собранный из слоёв', en: 'An interface assembled from layers' },
    summary: {
      ru: 'Эксперимент с подачей контента без привычной ленты блоков: сведения раскрываются через геометрию, глубину и смещение, сохраняя читаемость и фокус.',
      en: 'An experiment in presenting content without a familiar block feed: information unfolds through geometry, depth, and offset while keeping focus and legibility.',
    },
    role: { ru: 'Композиция · motion-дизайн · вёрстка', en: 'Composition · motion design · layout' },
    points: {
      ru: [
        'Слои разделяют смысловые уровни вместо декоративного нагромождения.',
        'Переходы объясняют связь между состояниями, а не отвлекают от них.',
        'Геометрический каркас удерживает ритм даже при активном движении.',
      ],
      en: [
        'Layers separate levels of meaning instead of piling on decoration.',
        'Transitions explain the relation between states rather than distracting from them.',
        'A geometric frame keeps rhythm even when motion is active.',
      ],
    },
    tags: ['Interaction', 'Layout', 'Motion'],
  },
  {
    id: 'kontur',
    number: '04',
    kind: 'concept',
    title: { ru: 'Контур', en: 'Contour' },
    subtitle: { ru: 'Инструменты и автоматизация с обратной связью', en: 'Tooling and automation with feedback' },
    summary: {
      ru: 'Инженерный концепт: процесс сборки и проверок представлен как понятный контур. Каждый шаг отдаёт статус, чтобы результат был наблюдаемым, а не скрытым за командами.',
      en: 'An engineering concept: build and check flow presented as a clear contour. Each step reports status so the outcome is observable, not hidden behind commands.',
    },
    role: { ru: 'Проектирование процесса · UI для статусов', en: 'Process design · status UI' },
    points: {
      ru: [
        'Цепочка «план → сборка → проверка → выпуск» как наглядная модель.',
        'Состояния шагов различимы по форме и свету, без опоры на один цвет.',
        'Журнал событий фиксирует, что именно произошло и где процесс сейчас.',
      ],
      en: [
        'A “plan → build → check → ship” chain as a visible model.',
        'Step states differ by form and light, not by color alone.',
        'An event log records what happened and where the process stands.',
      ],
    },
    tags: ['Automation', 'DX', 'Visualization'],
  },
  {
    id: 'sreda',
    number: '05',
    kind: 'concept',
    title: { ru: 'Среда', en: 'Medium' },
    subtitle: { ru: 'Продуктовый прототип цифрового пространства', en: 'A product prototype of a digital space' },
    summary: {
      ru: 'Концепт, в котором важнее сценарий и связи между объектами, чем отдельные экраны. Пространство показывает, как пользователь перемещается между узлами и задачами.',
      en: 'A concept where scenario and links between objects matter more than individual screens. The space shows how a user moves between nodes and tasks.',
    },
    role: { ru: 'Продуктовое мышление · прототипирование', en: 'Product thinking · prototyping' },
    points: {
      ru: [
        'Узлы и связи делают маршрут пользователя видимым.',
        'Фокус и контекст меняются мягко, сохраняя ориентацию.',
        'Геометрическая сетка задаёт порядок, текучие акценты — направление.',
      ],
      en: [
        'Nodes and links make the user path visible.',
        'Focus and context shift gently to preserve orientation.',
        'A geometric grid sets order; fluid accents suggest direction.',
      ],
    },
    tags: ['Product concept', 'Systems', 'Prototype'],
  },
]
