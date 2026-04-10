import React, { useEffect, useMemo, useState } from 'react';
import { Box, Collapse, Stack, Typography } from '@mui/material';
import AudiotrackRoundedIcon from '@mui/icons-material/AudiotrackRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { FormatInfo } from '../services/api';

interface FormatSelectorProps {
  formats: FormatInfo[];
  selectedFormat: string;
  audioOnly: boolean;
  onFormatChange: (formatId: string, audioOnly: boolean) => void;
}

const audioOutputFormats = [
  { format_id: 'mp3', quality: 'MP3', ext: 'mp3', description: 'Максимальная совместимость' },
  { format_id: 'm4a', quality: 'M4A', ext: 'm4a', description: 'Более компактный файл' },
  { format_id: 'opus', quality: 'Opus', ext: 'opus', description: 'Хорошо для речи и стримов' },
  { format_id: 'wav', quality: 'WAV', ext: 'wav', description: 'Без сжатия, крупнее размер' },
];

const audioExtensions = new Set(['mp3', 'ogg', 'wav', 'm4a', 'opus', 'flac', 'aac']);

const formatFilesize = (bytes?: number) => {
  if (!bytes) return 'Размер неизвестен';
  const mb = bytes / (1024 * 1024);
  if (mb < 1) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${mb.toFixed(1)} MB`;
};

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  formats,
  selectedFormat,
  audioOnly,
  onFormatChange,
}) => {
  const [expanded, setExpanded] = useState(true);

  const videoFormats = useMemo(() => {
    const filtered = formats.filter((format) => {
      const quality = format.quality.toLowerCase();
      return !audioExtensions.has(format.ext.toLowerCase()) && !quality.includes('audio only');
    });

    return filtered.length > 0 ? filtered : formats;
  }, [formats]);

  const visibleFormats = audioOnly ? audioOutputFormats : videoFormats;

  useEffect(() => {
    if (visibleFormats.length === 0) {
      if (selectedFormat !== '') {
        onFormatChange('', audioOnly);
      }
      return;
    }

    const hasSelectedFormat = visibleFormats.some((format) => format.format_id === selectedFormat);
    if (!hasSelectedFormat) {
      onFormatChange(visibleFormats[0].format_id, audioOnly);
    }
  }, [audioOnly, onFormatChange, selectedFormat, visibleFormats]);

  const selectedItem = visibleFormats.find((format) => format.format_id === selectedFormat);

  return (
    <Box className="result-card" sx={{ p: { xs: 2, sm: 2.35 }, textAlign: 'left' }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography sx={{ fontSize: '.98rem', fontWeight: 500, color: 'var(--text)' }}>
              Настройки загрузки
            </Typography>
            <Typography sx={{ fontSize: '.85rem', fontWeight: 300, color: 'var(--muted)' }}>
              Переключай режим и выбирай формат без лишних выпадающих меню.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <button
              type="button"
              onClick={() => onFormatChange(selectedFormat, false)}
              style={toggleSx(!audioOnly)}
            >
              <VideocamRoundedIcon sx={{ fontSize: 17 }} />
              Видео
            </button>
            <button
              type="button"
              onClick={() => onFormatChange(selectedFormat, true)}
              style={toggleSx(audioOnly)}
            >
              <AudiotrackRoundedIcon sx={{ fontSize: 17 }} />
              Аудио
            </button>
          </Stack>
        </Stack>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          style={summaryButtonSx}
        >
          <Box>
            <Typography sx={{ fontSize: '.78rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              {audioOnly ? 'Output format' : 'Выбранный поток'}
            </Typography>
            <Typography sx={{ fontSize: '.98rem', fontWeight: 500, color: 'var(--text)' }}>
              {selectedItem ? `${selectedItem.quality} • ${selectedItem.ext.toUpperCase()}` : 'Выбери формат'}
            </Typography>
          </Box>
          <ExpandMoreRoundedIcon
            sx={{
              fontSize: 22,
              color: 'var(--muted)',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform .2s ease',
            }}
          />
        </button>

        <Collapse in={expanded}>
          <Stack spacing={1}>
            {visibleFormats.map((format) => {
              const isSelected = format.format_id === selectedFormat;
              const isAudioOutput = 'description' in format;

              return (
                <button
                  key={format.format_id}
                  type="button"
                  onClick={() => onFormatChange(format.format_id, audioOnly)}
                  style={optionSx(isSelected)}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    sx={{ width: '100%' }}
                  >
                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
                        <Typography sx={{ fontSize: '.98rem', fontWeight: 500, color: 'var(--text)' }}>
                          {format.quality}
                        </Typography>
                        <Box sx={extBadgeSx}>{format.ext.toUpperCase()}</Box>
                      </Stack>
                      <Typography sx={{ fontSize: '.82rem', fontWeight: 300, color: 'var(--muted)' }}>
                        {isAudioOutput
                          ? format.description
                          : `${formatFilesize(format.filesize)} • Format ID ${format.format_id}`}
                      </Typography>
                    </Stack>

                    {isSelected && (
                      <Box sx={checkBadgeSx}>
                        <CheckRoundedIcon sx={{ fontSize: 16 }} />
                      </Box>
                    )}
                  </Stack>
                </button>
              );
            })}
          </Stack>
        </Collapse>
      </Stack>
    </Box>
  );
};

const toggleSx = (active: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  height: '38px',
  padding: '0 14px',
  borderRadius: '999px',
  border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
  background: active ? 'color-mix(in srgb, var(--primary) 14%, transparent)' : 'transparent',
  color: active ? 'var(--primary)' : 'var(--muted)',
  fontFamily: 'Outfit, sans-serif',
  fontSize: '.84rem',
  cursor: 'pointer',
});

const summaryButtonSx: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  borderRadius: '24px',
  padding: '15px 18px',
  border: '1px solid var(--border)',
  background: 'var(--sv)',
  cursor: 'pointer',
  textAlign: 'left',
};

const optionSx = (selected: boolean): React.CSSProperties => ({
  width: '100%',
  display: 'block',
  padding: '14px 16px',
  borderRadius: '24px',
  border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
  background: selected ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'color-mix(in srgb, var(--surface) 76%, transparent)',
  cursor: 'pointer',
  textAlign: 'left',
  boxShadow: selected ? '0 10px 28px rgba(156,39,176,.14)' : 'none',
});

const extBadgeSx = {
  px: 1.1,
  py: 0.35,
  borderRadius: '999px',
  border: '1px solid var(--border)',
  background: 'var(--sv)',
  color: 'var(--muted)',
  fontSize: '.72rem',
  fontWeight: 500,
};

const checkBadgeSx = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  bgcolor: 'var(--primary)',
  color: 'var(--on-p)',
  flexShrink: 0,
};
