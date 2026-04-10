import React from 'react';
import { Box, Chip, Paper, Typography, alpha } from '@mui/material';

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

export const PlatformBadges: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, sm: 2.75 },
        border: '1px solid',
        borderColor: alpha('#ffffff', 0.08),
        bgcolor: alpha('#120d1f', 0.72),
        backdropFilter: 'blur(14px)',
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
        Supported platforms
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Major video, social, and audio sources in one interface.
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {platforms.map((platform) => (
          <Chip
            key={platform}
            label={platform}
            variant="outlined"
            sx={{
              borderColor: alpha('#ffffff', 0.1),
              bgcolor: alpha('#ffffff', 0.03),
              color: 'text.primary',
              fontWeight: 500,
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};
