import { useState, useEffect, createContext, useContext } from 'react';
import { Appearance } from 'react-native';
import { lightTheme, darkTheme, ThemeType } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeProvider = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('auto');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadThemePreference();
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'auto') {
        setIsDark(colorScheme === 'dark');
      }
    });

    return () => subscription?.remove();
  }, [themeMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme) {
        const mode = savedTheme as 'light' | 'dark' | 'auto';
        setThemeMode(mode);
        
        if (mode === 'auto') {
          setIsDark(Appearance.getColorScheme() === 'dark');
        } else {
          setIsDark(mode === 'dark');
        }
      } else {
        setIsDark(Appearance.getColorScheme() === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setTheme = async (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
    
    if (mode === 'auto') {
      setIsDark(Appearance.getColorScheme() === 'dark');
    } else {
      setIsDark(mode === 'dark');
    }
    
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setTheme(newMode);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };
};

export { ThemeContext };