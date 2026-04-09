import React, { useState } from 'react';
import { TextField, Box, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface URLInputProps {
  onUrlSubmit: (url: string) => void;
  loading?: boolean;
}

export const URLInput: React.FC<URLInputProps> = ({ onUrlSubmit, loading = false }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && isValidUrl(url.trim())) {
      onUrlSubmit(url.trim());
    }
  };

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleClear = () => {
    setUrl('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Paste video or audio URL here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        error={url.length > 0 && !isValidUrl(url)}
        helperText={url.length > 0 && !isValidUrl(url) ? 'Please enter a valid URL' : ''}
        disabled={loading}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            fontSize: '1rem',
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <SearchIcon color="action" />
              )}
            </InputAdornment>
          ),
          endAdornment: url && !loading && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};
