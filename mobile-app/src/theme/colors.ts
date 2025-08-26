// Système de couleurs adapté pour mobile
export const lightTheme = {
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#8e44ad',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#2c3e50',
  textLight: '#6c757d',
  border: '#e9ecef',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  surface: '#ffffff',
  onSurface: '#000000',
  disabled: '#cccccc',
  placeholder: '#999999',
  backdrop: 'rgba(0, 0, 0, 0.5)',
};

export const darkTheme = {
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#8e44ad',
  background: '#1a1a1a',
  card: '#2d2d2d',
  text: '#ffffff',
  textLight: '#cccccc',
  border: '#404040',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  surface: '#2d2d2d',
  onSurface: '#ffffff',
  disabled: '#666666',
  placeholder: '#888888',
  backdrop: 'rgba(0, 0, 0, 0.7)',
};

export type ThemeType = typeof lightTheme;