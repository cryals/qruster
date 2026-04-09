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
} from '@mui/material';
import { FormatInfo } from '../services/api';

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
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Box sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Quality</InputLabel>
        <Select
          value={selectedFormat}
          label="Quality"
          onChange={(e) => handleFormatChange(e.target.value)}
        >
          {formats.map((format) => (
            <MenuItem key={format.format_id} value={format.format_id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography>
                  {format.quality} ({format.ext})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatFilesize(format.filesize)}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch checked={audioOnly} onChange={(e) => handleAudioOnlyChange(e.target.checked)} />
        }
        label="Audio only"
      />
    </Box>
  );
};
