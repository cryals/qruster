---
sidebar_position: 1
slug: /
---

# Media Downloader

Самостоятельно размещаемый сервис для скачивания видео и аудио по ссылке с веб-интерфейсом, backend на Rust и пайплайном на `yt-dlp`.

## Что Делает Проект

Media Downloader принимает ссылку на поддерживаемую страницу с медиа, извлекает доступные форматы и подготавливает файл к скачиванию.

Текущий поток в веб-интерфейсе:

1. Вставьте ссылку на лендинге.
2. Нажмите `Скачать`, чтобы получить информацию о медиа и форматах.
3. Посмотрите карточку превью.
4. Выберите режим `Видео` или `Аудио`.
5. Нажмите `Подготовить файл`.
6. Используйте кнопку `Скачать файл`.

Фронтенд больше не открывает подготовленный файл автоматически в новой вкладке. Скачивание теперь является явным действием пользователя.

## Основные Части Проекта

- `frontend/`: интерфейс на Vite + React
- `backend/`: API-сервер на Axum
- `docs/`: документация на Docusaurus
- `scripts/`: интерактивные скрипты запуска и настройки

## Поддерживаемые Платформы

YouTube, TikTok, Instagram, Facebook, Twitter/X, VK, Bilibili, Vimeo, Reddit, SoundCloud, Twitch, Dailymotion, Rutube, Bluesky, Pinterest, Tumblr, Loom, Streamable, Newgrounds, Snapchat, OK.ru

## Стек

- Frontend: React 18, TypeScript, Vite, MUI
- Backend: Rust, Axum, Tokio
- Инструменты: `yt-dlp`, FFmpeg
- Инфраструктура: Docker, Docker Compose, Caddy, GitHub Actions

## Следующие Разделы

- [Установка](installation.md)
- [Использование](usage.md)
- [API](api.md)
- [Разработка](development.md)
