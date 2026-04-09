---
sidebar_position: 1
slug: /
---

# Добро пожаловать в Media Downloader

<div style={{textAlign: 'center', margin: '40px 0'}}>
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white" alt="Material-UI" />
</div>

**Универсальный selfhosted веб-сервис** для скачивания аудио и видео контента с **20+ популярных платформ**. Создан с фокусом на приватность, простоту и полный контроль.

## ✨ Основные возможности

### 🎵 Скачивание аудио
- **Множество форматов**: MP3, OGG, WAV
- **Высокое качество**: Лучшее доступное качество аудио
- **Автоматическая конвертация**: Обработка через FFmpeg

### 🎬 Скачивание видео
- **Выбор качества**: От 144p до 4K
- **Поддержка форматов**: MP4, MKV, WebM
- **Гибкие опции**: С аудио или без

### 🌐 Поддержка платформ
YouTube • TikTok • Instagram • Facebook • Twitter/X • VK • Bilibili • Bluesky • Vimeo • Dailymotion • Rutube • Twitch • SoundCloud • Reddit • Pinterest • и другие...

**20+ платформ** поддерживаются из коробки!

### 🛡️ Приватность и контроль
- **Selfhosted**: Ваши данные остаются на вашем сервере
- **Без отслеживания**: Никакой аналитики, никаких сторонних сервисов
- **Open source**: Полная прозрачность

### 🚀 Современный стек
- **Material Design 3**: Красивый, современный UI
- **Docker-ready**: Развертывание одной командой
- **Автоматический SSL**: Caddy с Let's Encrypt
- **Production-ready**: CI/CD включен

## 🎯 Быстрый старт

Запустите за несколько минут:

```bash
git clone https://github.com/cryals/qruster.git
cd qruster
./scripts/setup.sh
./scripts/run.sh
```

Откройте `http://localhost:3000` и начните скачивать!

## 📚 Структура документации

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '30px 0'}}>
  <div style={{padding: '20px', border: '2px solid var(--ifm-color-primary)', borderRadius: '12px'}}>
    <h3>🚀 Начало работы</h3>
    <p>Изучите основы и запустите свой экземпляр</p>
    <a href="/concept">Концепция и идеи →</a>
  </div>
  <div style={{padding: '20px', border: '2px solid var(--ifm-color-primary)', borderRadius: '12px'}}>
    <h3>🏗️ Архитектура</h3>
    <p>Поймите как все работает под капотом</p>
    <a href="/architecture">Дизайн системы →</a>
  </div>
  <div style={{padding: '20px', border: '2px solid var(--ifm-color-primary)', borderRadius: '12px'}}>
    <h3>💻 Разработка</h3>
    <p>Участвуйте и расширяйте платформу</p>
    <a href="/development">Руководство разработчика →</a>
  </div>
</div>

## 🌟 Почему Media Downloader?

### Приватность прежде всего
Вся обработка происходит на вашем сервере. Никаких данных не отправляется третьим лицам. Полный контроль над вашими загрузками.

### Простое развертывание
Скрипты установки одной командой. Docker контейнеры для изоляции. Автоматические SSL сертификаты. Production-ready из коробки.

### Дружелюбно к разработчикам
Чистая архитектура. Подробная документация. Типобезопасность TypeScript и Rust. Легко расширять новыми платформами.

## 🛠️ Технологический стек

**Frontend**
- React 18 с TypeScript
- Material-UI v6 (Material Design 3)
- Vite для быстрой сборки
- Axios для API коммуникации

**Backend**
- Rust с фреймворком Axum
- Tokio async runtime
- Интеграция с yt-dlp
- FFmpeg для обработки медиа

**Инфраструктура**
- Docker multi-stage builds
- Docker Compose оркестрация
- Caddy reverse proxy с авто SSL
- GitHub Actions CI/CD

## 🤝 Участие в разработке

Мы приветствуем вклад! Ознакомьтесь с [Руководством разработчика](/development) чтобы начать.

## 📄 Лицензия

Этот проект с открытым исходным кодом. Смотрите репозиторий для деталей лицензии.

---

<div style={{textAlign: 'center', marginTop: '40px', color: '#666'}}>
  Сделано с ❤️ <a href="https://github.com/cryals">cryals</a>
</div>
