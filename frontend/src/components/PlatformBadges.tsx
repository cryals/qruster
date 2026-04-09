import React from 'react';
import { Box, Chip, Stack } from '@mui/material';

const platforms = [
  { name: 'YouTube', color: '#FF0000' },
  { name: 'TikTok', color: '#000000' },
  { name: 'Instagram', color: '#E4405F' },
  { name: 'Facebook', color: '#1877F2' },
  { name: 'Twitter', color: '#1DA1F2' },
  { name: 'VK', color: '#0077FF' },
  { name: 'Bilibili', color: '#00A1D6' },
  { name: 'Vimeo', color: '#1AB7EA' },
  { name: 'Reddit', color: '#FF4500' },
  { name: 'SoundCloud', color: '#FF5500' },
  { name: 'Twitch', color: '#9146FF' },
  { name: 'Dailymotion', color: '#0066DC' },
];

export const PlatformBadges: React.FC = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        justifyContent="center"
        sx={{ gap: 1 }}
      >
        {platforms.map((platform) => (
          <Chip
            key={platform.name}
            label={platform.name}
            size="small"
            sx={{
              bgcolor: platform.color,
              color: 'white',
              fontWeight: 500,
              '&:hover': {
                bgcolor: platform.color,
                opacity: 0.8,
              },
            }}
          />
        ))}
        <Chip
          label="+8 more"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      </Stack>
    </Box>
  );
};
