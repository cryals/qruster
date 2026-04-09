import { useState } from 'react';
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Box sx={{ py: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 500,
                background: 'linear-gradient(135deg, #6750A4 0%, #7965AF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Media Downloader
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Universal selfhosted media downloader
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Download audio and video from 20+ platforms
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              bgcolor: 'background.paper',
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <URLInput onUrlSubmit={handleUrlSubmit} loading={loading} />

            {error && (
              <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {loading && !mediaInfo && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Extracting media information...
                  </Typography>
                </Box>
              </Box>
            )}

            {mediaInfo && (
              <Box sx={{ mt: 4 }}>
                <MediaPreview media={mediaInfo} />
                <FormatSelector formats={mediaInfo.formats} onFormatChange={handleFormatChange} />
                <DownloadButton
                  url={currentUrl}
                  format={selectedFormat}
                  audioOnly={audioOnly}
                />
              </Box>
            )}
          </Paper>

          <Box sx={{ mt: 4 }}>
            <PlatformBadges />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
