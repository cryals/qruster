import React, { useState } from 'react';
import { Container, Box, Typography, Alert, Paper } from '@mui/material';
import { URLInput } from './components/URLInput';
import { MediaPreview } from './components/MediaPreview';
import { FormatSelector } from './components/FormatSelector';
import { DownloadButton } from './components/DownloadButton';
import { PlatformBadges } from './components/PlatformBadges';
import { api, ExtractResponse } from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaInfo, setMediaInfo] = useState<ExtractResponse | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [audioOnly, setAudioOnly] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleUrlSubmit = async (url: string) => {
    setLoading(true);
    setError(null);
    setMediaInfo(null);
    setCurrentUrl(url);

    try {
      const info = await api.extract(url);
      setMediaInfo(info);
      if (info.formats.length > 0) {
        setSelectedFormat(info.formats[0].format_id);
      }
    } catch (err) {
      setError('Failed to extract media information. Please check the URL and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormatChange = (formatId: string, audioOnlyMode: boolean) => {
    setSelectedFormat(formatId);
    setAudioOnly(audioOnlyMode);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 1 }}>
            Media Downloader
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Download audio and video from 20+ platforms
          </Typography>

          <URLInput onUrlSubmit={handleUrlSubmit} loading={loading} />

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {mediaInfo && (
            <>
              <MediaPreview media={mediaInfo} />
              <FormatSelector formats={mediaInfo.formats} onFormatChange={handleFormatChange} />
              <DownloadButton
                url={currentUrl}
                format={selectedFormat}
                audioOnly={audioOnly}
              />
            </>
          )}

          <PlatformBadges />
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
