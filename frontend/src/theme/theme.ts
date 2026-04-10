import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#c8b6ff',
      light: '#e9ddff',
      dark: '#8f7ae6',
    },
    secondary: {
      main: '#b69cff',
      light: '#ddceff',
      dark: '#6f5bb3',
    },
    error: {
      main: '#ffb4ab',
      light: '#ffd9d4',
      dark: '#93000a',
    },
    success: {
      main: '#7ef7c2',
    },
    background: {
      default: '#0b0714',
      paper: '#151022',
    },
  },
  typography: {
    fontFamily: '"Google Sans Text", "Roboto Flex", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.05,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontSize: '2.4rem',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontSize: '1.6rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 24,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at top, rgba(129, 99, 255, 0.24), transparent 36%), radial-gradient(circle at 85% 15%, rgba(198, 135, 255, 0.18), transparent 22%), #0b0714',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 999,
          padding: '12px 22px',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 28,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
  },
});
