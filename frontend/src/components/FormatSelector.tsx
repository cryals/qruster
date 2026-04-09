import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { FormatInfo } from '../services/api';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import VideocamIcon from '@mui/icons-material/Videocam';

interface FormatSelectorProps {
  formats: FormatInfo[];
  onFormatChange: (formatId: string, audioOnly: boolean) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ formats, onFormatChange }) => {
  const [selectedFormat, setSelectedFormat] = useState(formats[0]?.format_id || '');
  const [audioOnly, setAudioOnly] = useState(false);

  const handleFormatChange = (formatId: string) => {
    setSelectedFormat(formatId);
    onFormatChange(formatId, audioOnly);
  };

  const handleAudioOnlyChange = (checked: boolean) => {
    setAudioOnly(checked);
    onFormatChange(selectedFormat, checked);
  };

  const formatFilesize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  // Filter formats to show only video/audio formats
  const videoFormats = formats.filter(f =>
    ['mp4', 'webm', 'mkv'].includes(f.ext.toLowerCase())
  );
  const audioFormats = formats.filter(f =>
    ['mp3', 'ogg', 'wav', 'm4a', 'opus', 'webm'].includes(f.ext.toLowerCase()) &&
    f.quality.toLowerCase().includes('audio')
  );

  const displayFormats = audioOnly ? audioFormats : videoFormats;

  return (
    <Box sx={{ mt: 4, maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Download Type
        </Typography>
        <ToggleButtonGroup
          value={audioOnly ? 'audio' : 'video'}
          exclusive
          onChange={(_, value) => {
            if (value !== null) {
              handleAudioOnlyChange(value === 'audio');
            }
          }}
          fullWidth
          sx={{
            '& .MuiToggleButton-root': {
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
            },
          }}
        >
          <ToggleButton value="video">
            <VideocamIcon sx={{ mr: 1 }} />
            Video
          </ToggleButton>
          <ToggleButton value="audio">
            <AudiotrackIcon sx={{ mr: 1 }} />
            Audio Only
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <FormControl fullWidth>
        <InputLabel>Quality & Format</InputLabel>
        <Select
          value={selectedFormat}
          label="Quality & Format"
          onChange={(e) => handleFormatChange(e.target.value)}
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderRadius: 2,
            },
          }}
        >
          {displayFormats.length > 0 ? (
            displayFormats.map((format) => (
              <MenuItem key={format.format_id} value={format.format_id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 500 }}>
                      {format.quality}
                    </Typography>
                    <Chip
                      label={format.ext.toUpperCase()}
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem', borderRadius: 1 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatFilesize(format.filesize)}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              No {audioOnly ? 'audio' : 'video'} formats available
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};
