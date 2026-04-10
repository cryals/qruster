import React, { useState } from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { api, DownloadRequest } from '../services/api';

interface DownloadButtonProps {
  url: string;
  format: string;
  audioOnly?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ url, format, audioOnly }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    setDownloadUrl(null);
    setExpiresAt(null);

    try {
      const request: DownloadRequest = {
        url,
        format,
        audio_only: audioOnly,
      };

      const response = await api.download(request);
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';
      setDownloadUrl(`${baseUrl}${response.download_url}`);
      setExpiresAt(response.expires_at);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось начать загрузку';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="result-card" sx={{ p: { xs: 2, sm: 2.35 }, textAlign: 'left' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: '.98rem', fontWeight: 500, color: 'var(--text)', mb: 0.35 }}>
            {downloadUrl ? 'Файл готов' : 'Подготовка скачивания'}
          </Typography>
          <Typography sx={{ fontSize: '.84rem', fontWeight: 300, color: error ? '#ffb4ab' : 'var(--muted)' }}>
            {error
              ? error
              : downloadUrl
                ? 'Файл подготовлен. Нажми кнопку ниже, когда хочешь скачать.'
                : audioOnly
                  ? 'Аудио будет экспортировано в выбранный формат.'
                  : 'Будет загружен выбранный видеопоток.'}
          </Typography>
          {expiresAt && (
            <Typography sx={{ mt: 0.5, fontSize: '.76rem', fontWeight: 300, color: 'var(--muted)' }}>
              Ссылка активна ограниченное время.
            </Typography>
          )}
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <button
            type="button"
            onClick={handleDownload}
            disabled={loading || !format}
            style={downloadButtonSx(loading || !format)}
          >
            {loading ? (
              <CircularProgress size={18} sx={{ color: 'var(--on-p)' }} />
            ) : (
              <CheckRoundedIcon sx={{ fontSize: 18 }} />
            )}
            {loading ? 'Подготовка…' : downloadUrl ? 'Подготовить заново' : 'Подготовить файл'}
          </button>

          {downloadUrl && (
            <a href={downloadUrl} download style={downloadLinkSx}>
              <DownloadRoundedIcon sx={{ fontSize: 18 }} />
              Скачать файл
            </a>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

const downloadButtonSx = (disabled: boolean): React.CSSProperties => ({
  height: '46px',
  minWidth: disabled ? '160px' : '186px',
  borderRadius: '999px',
  border: 'none',
  padding: '0 20px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  background: disabled ? 'var(--sv)' : 'var(--primary)',
  color: disabled ? 'var(--muted)' : 'var(--on-p)',
  fontFamily: 'Outfit, sans-serif',
  fontSize: '.9rem',
  fontWeight: 500,
  cursor: disabled ? 'default' : 'pointer',
  boxShadow: disabled ? 'none' : '0 12px 32px rgba(156,39,176,.28)',
});

const downloadLinkSx: React.CSSProperties = {
  height: '46px',
  minWidth: '170px',
  borderRadius: '999px',
  padding: '0 20px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  background: 'transparent',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  textDecoration: 'none',
  fontFamily: 'Outfit, sans-serif',
  fontSize: '.9rem',
  fontWeight: 500,
};
