import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

interface URLInputProps {
  onUrlSubmit: (url: string) => void;
  loading?: boolean;
}

export const URLInput: React.FC<URLInputProps> = ({ onUrlSubmit, loading = false }) => {
  const [url, setUrl] = useState('');

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextUrl = url.trim();

    if (nextUrl && isValidUrl(nextUrl)) {
      onUrlSubmit(nextUrl);
    }
  };

  const hasInvalidUrl = url.length > 0 && !isValidUrl(url.trim());

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        border: '1px solid',
        borderColor: alpha('#ffffff', 0.08),
        bgcolor: alpha('#0f0b18', 0.92),
      }}
    >
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Paste a media URL
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Works best with a direct video, post, or track link.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={hasInvalidUrl}
            helperText={hasInvalidUrl ? 'Enter a valid URL starting with http:// or https://' : ' '}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkRoundedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: url && !loading ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setUrl('')} edge="end">
                    <ClearRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                minHeight: 58,
                borderRadius: 4,
                bgcolor: alpha('#ffffff', 0.03),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !url.trim() || hasInvalidUrl}
            endIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <ArrowForwardRoundedIcon />
              )
            }
            sx={{
              minWidth: { xs: '100%', sm: 170 },
              minHeight: 58,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #9b87f5 0%, #c8b6ff 100%)',
              color: '#130c20',
              '&:hover': {
                background: 'linear-gradient(135deg, #af9cff 0%, #ddd0ff 100%)',
              },
            }}
          >
            {loading ? 'Loading' : 'Preview'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
