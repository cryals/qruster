---
sidebar_position: 6
---

# Поддерживаемые Платформы

Этот список соответствует extractor-ам, которые реально зарегистрированы в `backend/src/extractors/mod.rs`.

## Платформы С Отдельными Extractor-ами

Сейчас в backend есть отдельные модули для:

- YouTube
- TikTok
- Instagram
- Facebook
- Twitter/X
- VK
- Bilibili
- Bluesky
- Dailymotion
- Vimeo
- Rutube
- Odnoklassniki
- Pinterest
- Newgrounds
- Reddit
- SoundCloud
- Streamable
- Tumblr
- Twitch
- Loom
- Snapchat

Также существует generic fallback extractor для любого HTTP или HTTPS URL, который умеет обработать `yt-dlp`.

## Важное Уточнение

Слово “поддерживается” в этом проекте означает:

- либо есть зарегистрированный extractor для платформы
- либо generic extractor может передать URL в `yt-dlp`

Это **не** гарантирует работу для любого типа контента, любого режима приватности, региона или конкретного варианта медиа.

## Комментарии По Платформам

### YouTube

- отдельный extractor
- обычно доступно несколько форматов
- режим аудио работает через audio mode

### Bilibili

- отдельный extractor
- видео скачивается через выбранный `format_id`
- backend теперь реально передаёт выбранный формат в `yt-dlp`, а не теряет его

### SoundCloud

- отдельный extractor
- особенно полезен в аудио-режиме

### Twitch

- extractor есть
- фактически поддерживаемые URL зависят от текущей логики внутри extractor-а

### Rutube и Streamable

- у обоих есть отдельные extractor-модули
- обе платформы показываются в popover сервиса на frontend
- в текущем UI для них используются встроенные inline SVG-иконки

## Generic Fallback

Если URL не совпал со специальным extractor-ом, но начинается с `http://` или `https://`, generic extractor всё равно может попробовать обработать его через `yt-dlp`.

Это значит, что практическая поддержка иногда шире явно перечисленного списка, но зависит уже от возможностей текущего `yt-dlp`.

## Как Добавить Новую Платформу

На уровне кода шаги такие:

1. создать новый extractor в `backend/src/extractors/`
2. реализовать `MediaExtractor`
3. зарегистрировать модуль в `backend/src/extractors/mod.rs`
4. добавить платформу в список frontend, если она должна отображаться в popover
5. обновить документацию и при необходимости шаблоны issue
