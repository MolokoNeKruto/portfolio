# Портфолио — Георгий Сушинский

Иммерсивный сайт-портфолио (RU/EN), собранный как живая сцена: WebGL-фон (жидкость + геометрия), скролл-повествование, светлая/тёмная темы, процедурная вариативность и интерактивные кейсы.

## Стек

- Vite (vanilla + TypeScript)
- three (WebGL/шейдерная сцена)
- GSAP, Lenis (движение и плавный скролл)
- Статическая сборка, готовая для GitHub Pages (`base: './'`)

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

## Контент

- Данные и тексты: `src/data/content.ts` (языки, контакты, кейсы).
- Реальный кейс: Glassmorphism v2 (OpenCode Desktop). Остальные кейсы — концепты-прототипы, помечены в интерфейсе и предназначены для замены.
- Контакты: `georgiminivi@gmail.com`, `https://t.me/DornegE`, `https://github.com/MolokoNeKruto`. Кнопка «Поддержать» — демо (ведёт на главную страницу сервиса, без адресата перевода).

## Деплой на GitHub Pages (аккаунт MolokoNeKruto)

В репозитории подготовлен workflow: `.github/workflows/deploy.yml`.

1. Создайте репозиторий на GitHub (например `portfolio`) под аккаунтом **MolokoNeKruto**.
2. Авторизуйтесь локально безопасным способом (без пароля в файлах): `gh auth login` (устройство/токен) или настроенный Git Credential Manager / SSH.
3. В папке `portfolio/` выполните (пример для HTTPS):
   ```bash
   git init
   git add -A
   git commit -m "feat: initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/MolokoNeKruto/portfolio.git
   git push -u origin main
   ```
4. В GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. После успешного workflow сайт будет доступен по адресу Pages репозитория.

> Примечание: автоматический push из этой среды не выполнен, так как сохранённые учётные данные/токен для аккаунта в доступных местах не обнаружены. Секреты (пароли/токены) в репозиторий не добавлялись.

## Проверки и отчёт

Итоговый аудит (дизайн, структура, безопасность, актуальность) и план/приоритеты фиксируются отдельно в отчёте выполнения задачи.
