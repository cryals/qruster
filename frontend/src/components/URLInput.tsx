import React, { useState } from 'react';
import { TextField, Box, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface URLInputProps {
  onUrlSubmit: (url: string) => void;
  loading?: boolean;
}

export const URLInput: React.FC<URLInputProps> = ({ onUrlSubmit, loading = false }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
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
        InputProps={{
          startAdornment: loading ? (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          ) : (
            <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          ),
        }}
        disabled={loading}
      />
    </Box>
  );
};
