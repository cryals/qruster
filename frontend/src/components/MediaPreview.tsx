import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
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
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
      {media.thumbnail && (
        <CardMedia
          component="img"
          height="300"
          image={media.thumbnail}
          alt={media.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip label={media.platform} color="primary" size="small" />
          {media.duration && (
            <Chip label={formatDuration(media.duration)} variant="outlined" size="small" />
          )}
        </Box>
        <Typography variant="h6" component="div" gutterBottom>
          {media.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {media.formats.length} format{media.formats.length !== 1 ? 's' : ''} available
        </Typography>
      </CardContent>
    </Card>
  );
};
