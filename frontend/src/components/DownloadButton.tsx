import React, { useState } from 'react';
import { Button, Box, CircularProgress, Alert, LinearProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const request: DownloadRequest = {
        url,
        format,
        quality,
        audio_only: audioOnly,
      };

      const response = await api.download(request);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = `http://localhost:8080${response.download_url}`;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to download. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 700, mx: 'auto' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} icon={<CheckCircleIcon />}>
          Download started! Check your downloads folder.
        </Alert>
      )}
      {loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress sx={{ borderRadius: 1 }} />
        </Box>
      )}
      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
        onClick={handleDownload}
        disabled={loading}
        sx={{
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          borderRadius: 3,
          textTransform: 'none',
          boxShadow: 2,
          '&:hover': {
            boxShadow: 4,
          },
        }}
      >
        {loading ? 'Preparing download...' : success ? 'Downloaded!' : 'Download'}
      </Button>
    </Box>
  );
};
