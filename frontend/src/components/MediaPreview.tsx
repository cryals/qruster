import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import VideoLibraryRoundedIcon from '@mui/icons-material/VideoLibraryRounded';
import { ExtractResponse } from '../services/api';

interface MediaPreviewProps {
  media: ExtractResponse;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ media }) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      className="result-card"
      sx={{
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: media.thumbnail ? '220px 1fr' : '1fr' },
      }}
    >
      {media.thumbnail && (
        <Box
          sx={{
            minHeight: { xs: 220, sm: '100%' },
            backgroundImage: `linear-gradient(180deg, rgba(20, 18, 21, 0.04), rgba(20, 18, 21, 0.58)), url(${media.thumbnail})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      )}

      <Stack spacing={2} sx={{ p: { xs: 2.25, sm: 2.6 } }}>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Box sx={chipSx(true)}>{media.platform.toUpperCase()}</Box>
          <Box sx={chipSx()}>
            <AccessTimeRoundedIcon sx={{ fontSize: 15 }} />
            {formatDuration(media.duration)}
          </Box>
          <Box sx={chipSx()}>
            <VideoLibraryRoundedIcon sx={{ fontSize: 15 }} />
            {media.formats.length} formats
          </Box>
        </Stack>

        <Box sx={{ textAlign: 'left' }}>
          <Typography
            sx={{
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
              lineHeight: 1.3,
              fontWeight: 500,
              color: 'var(--text)',
              mb: 0.8,
              wordBreak: 'break-word',
            }}
          >
            {media.title}
          </Typography>
          <Typography sx={{ fontSize: '.92rem', fontWeight: 300, color: 'var(--muted)' }}>
            Выбери тип загрузки и формат. Весь блок оформлен в том же стиле, что и главный экран.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

const chipSx = (accent = false) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  minHeight: 32,
  px: 1.5,
  py: 0.65,
  borderRadius: '999px',
  border: '1px solid',
  borderColor: accent ? 'var(--primary)' : 'var(--border)',
  background: accent ? 'color-mix(in srgb, var(--primary) 14%, transparent)' : 'var(--sv)',
  color: accent ? 'var(--primary)' : 'var(--text)',
  fontSize: '.76rem',
  fontWeight: 400,
});
