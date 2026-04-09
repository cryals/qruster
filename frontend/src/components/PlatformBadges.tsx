import React from 'react';
import { Box, Chip, Typography, Paper } from '@mui/material';

const platforms = [
  { name: 'YouTube', color: '#FF0000' },
  { name: 'TikTok', color: '#000000' },
  { name: 'Instagram', color: '#E4405F' },
  { name: 'Facebook', color: '#1877F2' },
  { name: 'Twitter/X', color: '#000000' },
  { name: 'VK', color: '#0077FF' },
  { name: 'Bilibili', color: '#00A1D6' },
  { name: 'Vimeo', color: '#1AB7EA' },
  { name: 'Reddit', color: '#FF4500' },
  { name: 'SoundCloud', color: '#FF5500' },
  { name: 'Twitch', color: '#9146FF' },
  { name: 'Dailymotion', color: '#0066DC' },
  { name: 'Rutube', color: '#5BC0DE' },
  { name: 'Bluesky', color: '#1185FE' },
  { name: 'Pinterest', color: '#E60023' },
  { name: 'Tumblr', color: '#35465C' },
  { name: 'Loom', color: '#625DF5' },
  { name: 'Streamable', color: '#0E7EFF' },
  { name: 'Newgrounds', color: '#FFA000' },
  { name: 'Snapchat', color: '#FFFC00' },
  { name: 'OK.ru', color: '#EE8208' },
];

export const PlatformBadges: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="subtitle2"
        color="text.secondary"
        align="center"
        sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}
      >
        Supported Platforms
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center',
        }}
      >
        {platforms.map((platform) => (
          <Chip
            key={platform.name}
            label={platform.name}
            size="small"
            sx={{
              bgcolor: platform.color,
              color: platform.name === 'Snapchat' ? '#000' : '#fff',
              fontWeight: 500,
              fontSize: '0.75rem',
              borderRadius: 2,
              '&:hover': {
                bgcolor: platform.color,
                opacity: 0.85,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s',
              },
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};
