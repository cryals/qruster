---
sidebar_position: 7
---

# Руководство По Разработке

Это практическое руководство. Оно описывает репозиторий таким, какой он есть сейчас.

## Требования

- Rust stable
- Node.js 20+
- npm
- `ffmpeg`
- `yt-dlp`
- Git

## Запуск Проекта

### Интерактивные скрипты

Из корня репозитория:

```bash
./scripts/setup.sh
./scripts/run.sh
```

### Ручной запуск backend

```bash
cd backend
cargo run
```

### Ручной запуск frontend

```bash
cd frontend
npm ci
npm run dev
```

## Структура Репозитория

```text
qruster/
├── .github/
│   └── workflows/
├── backend/
│   ├── src/
│   │   ├── extractors/
│   │   ├── handlers/
│   │   ├── services/
│   │   └── main.rs
│   └── Cargo.toml
├── docs/
│   ├── docs/
│   ├── i18n/ru/
│   ├── docusaurus.config.ts
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── theme/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
├── scripts/
├── docker-compose.yml
├── Caddyfile
└── README.md
```

## Разработка Frontend

### Основное разделение ответственности

- `App.tsx`: каркас страницы, переключение темы, верхнеуровневый state, отправка URL
- `components/MediaPreview.tsx`: карточка с информацией о медиа
- `components/FormatSelector.tsx`: переключение видео/аудио и выбор формата
- `components/DownloadButton.tsx`: подготовка файла и явная финальная ссылка на скачивание
- `services/api.ts`: HTTP-вызовы к backend

### Команды frontend

```bash
cd frontend
npm ci
npm run dev
npm run build
npm run lint
```

### Замечания по frontend

- текущий интерфейс стилизован в основном прямо внутри `App.tsx`
- MUI всё ещё используется для базовых layout-компонентов, typography, collapse, alerts и иконок
- лендинг и карточки результата намеренно держатся в одном визуальном стиле

## Разработка Backend

### Основное разделение ответственности

- `main.rs`: router, CORS, temp dir, отдача `/downloads`
- `handlers/extract.rs`: валидация extract-запроса и формирование ответа
- `handlers/download.rs`: валидация download-запроса и выбор режима
- `handlers/formats.rs`: placeholder endpoint со списками форматов
- `services/ytdlp.rs`: запуск `yt-dlp`
- `services/downloader.rs`: работа с временными файлами и путями
- `extractors/*.rs`: определение платформы и извлечение информации

### Команды backend

```bash
cd backend
cargo fmt -- --check
cargo clippy -- -D warnings
cargo test
cargo check
```

### Модель extractor-ов

Чтобы добавить новый extractor:

1. создать `backend/src/extractors/<platform>.rs`
2. реализовать `MediaExtractor`
3. зарегистрировать модуль и добавить его в `detect_platform()`
4. держать `generic::GenericExtractor` в конце, потому что он подходит для любого HTTP/HTTPS URL

## Разработка Docs

### Команды

```bash
cd docs
npm ci
npm run start
npm run build
```

### Важное замечание

Сборка docs теперь снова работает после удаления неверного `type: commonjs` из `docs/package.json`. Docusaurus генерирует ESM client modules, и это поле ломало pipeline сборки.

## CI И GitHub Actions

### Текущие workflows

- `.github/workflows/ci.yml`
- `.github/workflows/docs.yml`

### Что делает CI

`ci.yml` сейчас проверяет:

- форматирование backend
- backend clippy
- backend tests
- установку frontend-зависимостей, lint и build
- Docker build для backend и frontend

`docs.yml` сейчас:

- ставит docs-зависимости
- собирает Docusaurus сайт
- загружает Pages artifact
- деплоит в GitHub Pages

## Что Пока Остаётся Сырым

Это реальные текущие ограничения:

- у backend почти нет unit-тестов для extractor-ов
- `GET /api/formats` пока не связан с реальным extractor output
- очистка файлов есть в коде, но не запускается автоматически
- HTTP status code у ошибок пока слишком упрощены и в основном сводятся к `400`
- многие docs-страницы раньше описывали будущие идеи как уже существующее поведение; это было исправлено
