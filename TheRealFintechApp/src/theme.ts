import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#2d3748',
    disabled: '#a0aec0',
    placeholder: '#a0aec0',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    error: '#e53e3e',
    success: '#38a169',
    warning: '#ed8936',
    info: '#3182ce',
  },
  roundness: 8,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700' as const,
    },
  },
};