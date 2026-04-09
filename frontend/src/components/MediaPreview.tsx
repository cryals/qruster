import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { ExtractResponse } from '../services/api';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

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
    <Card
      sx={{
        maxWidth: 700,
        mx: 'auto',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      {media.thumbnail && (
        <CardMedia
          component="img"
          height="350"
          image={media.thumbnail}
          alt={media.title}
          sx={{
            objectFit: 'cover',
            bgcolor: 'grey.100',
          }}
        />
      )}
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={media.platform.toUpperCase()}
            color="primary"
            size="small"
            sx={{ fontWeight: 600, borderRadius: 2 }}
          />
          {media.duration && (
            <Chip
              icon={<AccessTimeIcon fontSize="small" />}
              label={formatDuration(media.duration)}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2 }}
            />
          )}
          <Chip
            icon={<VideoLibraryIcon fontSize="small" />}
            label={`${media.formats.length} formats`}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2 }}
          />
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 500, mb: 1 }}>
          {media.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose your preferred format and quality below
        </Typography>
      </CardContent>
    </Card>
  );
};
