import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#6750A4',
          light: '#7965AF',
          dark: '#4F378B',
        },
        secondary: {
          main: '#625B71',
          light: '#7A7289',
          dark: '#4A4458',
        },
        error: {
          main: '#B3261E',
          light: '#DC362E',
          dark: '#8C1D18',
        },
        background: {
          default: '#FEF7FF',
          paper: '#FFFBFE',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#D0BCFF',
          light: '#E8DEF8',
          dark: '#4F378B',
        },
        secondary: {
          main: '#CCC2DC',
          light: '#E8DEF8',
          dark: '#4A4458',
        },
        error: {
          main: '#F2B8B5',
          light: '#F9DEDC',
          dark: '#8C1D18',
        },
        background: {
          default: '#1C1B1F',
          paper: '#1C1B1F',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 400,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});
