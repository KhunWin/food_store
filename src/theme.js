import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5722', // Warm orange
    },
    secondary: {
      main: '#4CAF50', // Fresh green
    },
    background: {
      default: '#FFF3E0', // Light beige
      paper: '#FFFFFF', // White
    },
    text: {
      primary: '#3E2723', // Dark brown
      secondary: '#795548', // Brown
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

export default theme;