import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Stack } from '@mui/material';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import logo from '../../assets/logo.png';
import { MediaPreview } from './components/MediaPreview';
import { FormatSelector } from './components/FormatSelector';
import { DownloadButton } from './components/DownloadButton';
import { api, ExtractResponse } from './services/api';

const platforms = [
  'YouTube',
  'TikTok',
  'Instagram',
  'Facebook',
  'Twitter/X',
  'VK',
  'Bilibili',
  'Vimeo',
  'Reddit',
  'SoundCloud',
  'Twitch',
  'Dailymotion',
  'Rutube',
  'Bluesky',
  'Pinterest',
  'Tumblr',
  'Loom',
  'Streamable',
  'Newgrounds',
  'Snapchat',
  'OK.ru',
];

const inlineIcons: Record<string, string> = {
  Rutube:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4zM8.4 7.2v9.6l8.4-4.8-8.4-4.8z"/></svg>',
  Streamable:
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 5.5l7 4.5-7 4.5V7.5z"/></svg>',
};

const simpleIconSlug = (platform: string) => {
  switch (platform) {
    case 'Twitter/X':
      return 'x';
    case 'OK.ru':
      return 'odnoklassniki';
    default:
      return platform.toLowerCase().replace('.', '').replace('/', '').replace(' ', '');
  }
};

function App() {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [servicesOpen, setServicesOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaInfo, setMediaInfo] = useState<ExtractResponse | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [audioOnly, setAudioOnly] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemeMode(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('.popover') && !target?.closest('.svc-btn')) {
        setServicesOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const iconColor = themeMode === 'dark' ? 'ffffff' : '1f1a1d';

  const supportedServiceChips = useMemo(
    () =>
      platforms.map((platform) => (
        <button
          key={platform}
          className="pchip"
          type="button"
          onClick={() => {
            setServicesOpen(false);
            setToast(platform);
          }}
        >
          {inlineIcons[platform] ? (
            <span
              style={{
                width: 14,
                height: 14,
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                color: themeMode === 'dark' ? '#fff' : '#1f1a1d',
              }}
              dangerouslySetInnerHTML={{ __html: inlineIcons[platform] }}
            />
          ) : (
            <img
              src={`https://cdn.simpleicons.org/${simpleIconSlug(platform)}/${iconColor}`}
              alt={platform}
              loading="lazy"
            />
          )}
          <span>{platform}</span>
        </button>
      )),
    [iconColor, themeMode]
  );

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleExtract = async () => {
    const nextUrl = url.trim();

    if (!nextUrl) {
      setToast('Вставь ссылку');
      return;
    }

    if (!isValidUrl(nextUrl)) {
      setToast('Не похоже на ссылку');
      return;
    }

    setLoading(true);
    setError(null);
    setMediaInfo(null);
    setSelectedFormat('');
    setAudioOnly(false);
    setCurrentUrl(nextUrl);

    try {
      const info = await api.extract(nextUrl);
      setMediaInfo(info);
      setToast('Форматы загружены');
      window.setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Не удалось получить информацию о медиа';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setToast('Вставлено');
      } else {
        setToast('Буфер пуст');
      }
    } catch {
      setToast('Вставьте вручную');
    }
  };

  const handleFormatChange = (formatId: string, audioOnlyMode: boolean) => {
    setSelectedFormat(formatId);
    setAudioOnly(audioOnlyMode);
  };

  return (
    <>
      <style>{`
        :root {
          color-scheme: light dark;
        }
        body {
          font-family: 'Outfit', sans-serif;
          overflow-x: hidden;
        }
        .landing-shell {
          --bg: ${themeMode === 'dark' ? '#141215' : '#fffbfd'};
          --surface: ${themeMode === 'dark' ? '#1e1b20' : '#ffffff'};
          --sv: ${themeMode === 'dark' ? '#2b272e' : '#f4ebf2'};
          --primary: ${themeMode === 'dark' ? '#eab3ff' : '#9c27b0'};
          --on-p: ${themeMode === 'dark' ? '#4b0076' : '#ffffff'};
          --text: ${themeMode === 'dark' ? '#e8e0e5' : '#1f1a1d'};
          --muted: ${themeMode === 'dark' ? '#9c9399' : '#7b7278'};
          --border: ${themeMode === 'dark' ? '#4a444e' : '#e8def8'};
          --grad: ${themeMode === 'dark'
            ? 'linear-gradient(135deg,#ff77ff,#b388ff)'
            : 'linear-gradient(135deg,#d500f9,#651fff)'};
          --sh: ${themeMode === 'dark' ? 'rgba(0,0,0,.45)' : 'rgba(100,30,140,.12)'};
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          transition: background .3s, color .3s;
        }
        .landing-shell *, .landing-shell *::before, .landing-shell *::after {
          box-sizing: border-box;
        }
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(110px);
          pointer-events: none;
          z-index: 0;
          transition: opacity .4s;
        }
        .blob-1 {
          width: 500px;
          height: 500px;
          top: -170px;
          left: -130px;
          background: radial-gradient(circle, rgba(140,0,200,.25), transparent 70%);
          animation: fl1 16s ease-in-out infinite alternate;
        }
        .blob-2 {
          width: 380px;
          height: 380px;
          bottom: -110px;
          right: -90px;
          background: radial-gradient(circle, rgba(200,0,150,.17), transparent 70%);
          animation: fl2 20s ease-in-out infinite alternate;
        }
        .landing-shell.light .blob {
          opacity: 0;
        }
        @keyframes fl1 {
          to { transform: translate(55px, 70px) scale(1.1); }
        }
        @keyframes fl2 {
          to { transform: translate(-45px, -55px) scale(1.08); }
        }
        @keyframes up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .topbar {
          position: sticky;
          top: 0;
          z-index: 200;
          width: 100%;
          backdrop-filter: blur(22px) saturate(160%);
          background: color-mix(in srgb, var(--bg) 78%, transparent);
          border-bottom: 1px solid color-mix(in srgb, var(--border) 55%, transparent);
        }
        .topbar-inner {
          max-width: 860px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
          color: var(--text);
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: -.3px;
        }
        .brand img {
          width: 26px;
          height: 26px;
          object-fit: contain;
          border-radius: 6px;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .svc-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          height: 36px;
          padding: 0 14px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 100px;
          font-family: 'Outfit', sans-serif;
          font-size: .83rem;
          color: var(--muted);
          cursor: pointer;
          transition: all .2s;
        }
        .svc-btn:hover, .svc-btn.open {
          border-color: var(--primary);
          color: var(--primary);
        }
        .icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .2s, color .2s;
        }
        .icon-btn:hover {
          background: var(--sv);
          color: var(--primary);
        }
        .popover {
          position: absolute;
          top: calc(100% + 10px);
          right: 24px;
          width: 440px;
          max-width: calc(100vw - 32px);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 20px;
          box-shadow: 0 20px 60px var(--sh);
          z-index: 300;
          opacity: 0;
          pointer-events: none;
          transform: translateY(-8px) scale(.97);
          transform-origin: top right;
          transition: opacity .2s cubic-bezier(.4,0,.2,1), transform .2s cubic-bezier(.4,0,.2,1);
        }
        .popover.open {
          opacity: 1;
          pointer-events: auto;
          transform: none;
        }
        .pop-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .pop-title {
          font-size: .72rem;
          font-weight: 500;
          letter-spacing: .13em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .pop-close {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: none;
          background: var(--sv);
          color: var(--muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pop-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .pchip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 13px;
          border-radius: 100px;
          background: var(--sv);
          border: 1px solid transparent;
          font: inherit;
          font-size: .8rem;
          color: var(--text);
          cursor: pointer;
          transition: all .18s cubic-bezier(.34,1.4,.64,1);
        }
        .pchip img {
          width: 14px;
          height: 14px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .pchip:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: transparent;
          transform: translateY(-1px);
        }
        .hero {
          position: relative;
          z-index: 1;
          min-height: calc(100dvh - 122px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 860px;
          padding: 20px 24px 32px;
          margin: 0 auto;
          text-align: center;
        }
        .hero.has-result {
          justify-content: flex-start;
          padding-top: 28px;
          padding-bottom: 32px;
        }
        .hero h1 {
          font-size: clamp(2.6rem, 7.5vw, 4.5rem);
          font-weight: 500;
          letter-spacing: -2px;
          line-height: 1.08;
          margin-bottom: 14px;
          opacity: 0;
          animation: up .5s .08s forwards;
        }
        .hero.has-result h1 {
          font-size: clamp(2.1rem, 5.2vw, 3.2rem);
          margin-bottom: 8px;
        }
        .hero h1 span {
          background: var(--grad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero .sub {
          font-size: .97rem;
          font-weight: 300;
          color: var(--muted);
          margin-bottom: 52px;
          opacity: 0;
          animation: up .5s .16s forwards;
        }
        .hero.has-result .sub {
          margin-bottom: 24px;
          font-size: .9rem;
        }
        .pill {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 620px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 7px 7px 7px 22px;
          gap: 8px;
          transition: border-color .22s, box-shadow .22s;
          opacity: 0;
          animation: up .5s .24s forwards;
        }
        .hero.has-result .pill {
          max-width: 760px;
        }
        .pill:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--sv);
        }
        .pill-input {
          flex: 1;
          min-width: 0;
          background: none;
          border: none;
          outline: none;
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 300;
          color: var(--text);
        }
        .pill-input::placeholder {
          color: var(--muted);
        }
        .acts {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        .ab {
          height: 42px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: .88rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 18px;
          transition: transform .18s, box-shadow .18s, filter .18s, background .2s;
        }
        .ab-ghost {
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 0 12px;
        }
        .ab-ghost:hover {
          background: var(--sv);
          color: var(--text);
          border-color: var(--primary);
        }
        .ab-fill {
          background: var(--primary);
          color: var(--on-p);
        }
        .ab-fill:hover {
          transform: scale(1.04);
          box-shadow: 0 6px 20px rgba(156,39,176,.35);
          filter: brightness(1.08);
        }
        .ab-fill:active {
          transform: scale(.97);
        }
        .ab-fill:disabled {
          opacity: .6;
          transform: none;
          box-shadow: none;
          cursor: default;
        }
        .results {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 760px;
          margin-top: 22px;
          opacity: 0;
          animation: up .42s .06s forwards;
        }
        .results-stack {
          display: grid;
          gap: 14px;
        }
        .inline-alert {
          width: 100%;
          border-radius: 24px;
          overflow: hidden;
          text-align: left;
        }
        .result-card {
          background: color-mix(in srgb, var(--surface) 92%, transparent);
          border: 1px solid var(--border);
          border-radius: 30px;
          box-shadow: 0 20px 60px var(--sh);
          backdrop-filter: blur(18px) saturate(135%);
        }
        .footer {
          position: relative;
          z-index: 1;
          width: 100%;
          border-top: 1px solid color-mix(in srgb, var(--border) 50%, transparent);
          padding: 18px 24px;
          text-align: center;
          font-size: .76rem;
          font-weight: 300;
          color: var(--muted);
        }
        .toast {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%) translateY(54px);
          background: var(--sv);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: .83rem;
          font-weight: 400;
          padding: 11px 22px;
          border-radius: 100px;
          opacity: 0;
          pointer-events: none;
          z-index: 999;
          transition: transform .32s cubic-bezier(.34,1.4,.64,1), opacity .22s;
          white-space: nowrap;
        }
        .toast.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .spin {
          animation: spin .7s linear infinite;
        }
        @media (max-width: 560px) {
          .hero h1 {
            letter-spacing: -1.5px;
          }
          .hero.has-result {
            padding-top: 18px;
          }
          .pill {
            flex-direction: column;
            border-radius: 28px;
            padding: 14px;
            align-items: stretch;
          }
          .acts {
            width: 100%;
          }
          .ab-fill {
            flex: 1;
            justify-content: center;
          }
          .ab-ghost {
            display: none;
          }
          .popover {
            right: 8px;
            left: 8px;
            width: auto;
          }
          .svc-label {
            display: none;
          }
        }
      `}</style>

      <Box className={`landing-shell ${themeMode}`}>
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <nav className="topbar">
          <div className="topbar-inner">
            <a href="#" className="brand" onClick={(event) => event.preventDefault()}>
              <img src={logo} alt="qruster logo" />
              qruster
            </a>

            <div className="nav-right">
              <button
                className={`svc-btn ${servicesOpen ? 'open' : ''}`}
                type="button"
                onClick={() => setServicesOpen((value) => !value)}
              >
                <AddCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />
                <span className="svc-label">Сервисы</span>
              </button>

              <div className={`popover ${servicesOpen ? 'open' : ''}`}>
                <div className="pop-head">
                  <span className="pop-title">Поддерживаемые сервисы</span>
                  <button className="pop-close" type="button" onClick={() => setServicesOpen(false)}>
                    <CloseRoundedIcon sx={{ fontSize: 15 }} />
                  </button>
                </div>
                <div className="pop-chips">{supportedServiceChips}</div>
              </div>

              <button
                className="icon-btn"
                type="button"
                onClick={() => setThemeMode((value) => (value === 'dark' ? 'light' : 'dark'))}
              >
                {themeMode === 'dark' ? (
                  <LightModeRoundedIcon sx={{ fontSize: 20 }} />
                ) : (
                  <DarkModeRoundedIcon sx={{ fontSize: 20 }} />
                )}
              </button>
            </div>
          </div>
        </nav>

        <main className={`hero ${mediaInfo || error ? 'has-result' : ''}`}>
          <h1>
            Любое видео.
            <br />
            <span>Один клик.</span>
          </h1>
          <p className="sub">Вставь ссылку — получи файл</p>

          <div className="pill">
            <LinkRoundedIcon sx={{ fontSize: 20, color: 'var(--muted)', flexShrink: 0 }} />
            <input
              className="pill-input"
              type="url"
              placeholder="https://…"
              autoComplete="off"
              spellCheck={false}
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  void handleExtract();
                }
              }}
            />

            <div className="acts">
              <button className="ab ab-ghost" type="button" title="Вставить из буфера" onClick={handlePaste}>
                <ContentPasteRoundedIcon sx={{ fontSize: 18 }} />
              </button>
              <button className="ab ab-fill" type="button" onClick={handleExtract} disabled={loading}>
                {loading ? (
                  <AutorenewRoundedIcon className="spin" sx={{ fontSize: 18 }} />
                ) : (
                  <DownloadRoundedIcon sx={{ fontSize: 18 }} />
                )}
                {loading ? 'Загружаю…' : 'Скачать'}
              </button>
            </div>
          </div>
          {(error || mediaInfo) && (
            <section className="results" id="results">
              <Stack className="results-stack">
                {error && (
                  <Alert severity="error" className="inline-alert">
                    {error}
                  </Alert>
                )}

                {mediaInfo && (
                  <>
                    <MediaPreview media={mediaInfo} />
                    <FormatSelector
                      formats={mediaInfo.formats}
                      selectedFormat={selectedFormat}
                      audioOnly={audioOnly}
                      onFormatChange={handleFormatChange}
                    />
                    <DownloadButton
                      url={currentUrl}
                      format={selectedFormat}
                      audioOnly={audioOnly}
                    />
                  </>
                )}
              </Stack>
            </section>
          )}
        </main>

        <footer className="footer">© 2026 qruster</footer>
        <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
      </Box>
    </>
  );
}

export default App;
