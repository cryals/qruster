import React, { useState } from 'react';
import { Button, Box, CircularProgress, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { api, DownloadRequest } from '../services/api';

interface DownloadButtonProps {
  url: string;
  format: string;
  quality?: string;
  audioOnly?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  url,
  format,
  quality,
  audioOnly,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const request: DownloadRequest = {
        url,
        format,
        quality,
        audio_only: audioOnly,
      };

      const response = await api.download(request);
      window.location.href = response.download_url;
    } catch (err) {
      setError('Failed to download. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? 'Preparing download...' : 'Download'}
      </Button>
    </Box>
  );
};
