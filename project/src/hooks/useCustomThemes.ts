import { useState, useEffect } from 'react';
import { generatePalette } from '../utils/colorUtils';

export interface CustomTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  textLight: string;
  border: string;
  gradient: string;
  createdAt: Date;
}

const CUSTOM_THEMES_KEY = 'customThemes';

export const useCustomThemes = () => {
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);

  // Load custom themes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CUSTOM_THEMES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert createdAt strings back to Date objects
        const themes = parsed.map((theme: any) => ({
          ...theme,
          createdAt: new Date(theme.createdAt)
        }));
        setCustomThemes(themes);
      } catch (error) {
        console.error('Error loading custom themes:', error);
      }
    }
  }, []);

  // Save custom themes to localStorage
  const saveThemes = (themes: CustomTheme[]) => {
    localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(themes));
    setCustomThemes(themes);
  };

  // Create a new custom theme from a primary color
  const createCustomTheme = (primaryColor: string, name: string): CustomTheme | null => {
    const palette = generatePalette(primaryColor);
    if (!palette) return null;

    const newTheme: CustomTheme = {
      id: Date.now().toString(),
      name,
      ...palette,
      createdAt: new Date()
    };

    const updatedThemes = [...customThemes, newTheme];
    saveThemes(updatedThemes);
    return newTheme;
  };

  // Update an existing custom theme
  const updateCustomTheme = (id: string, updates: Partial<CustomTheme>): boolean => {
    const themeIndex = customThemes.findIndex(theme => theme.id === id);
    if (themeIndex === -1) return false;

    const updatedThemes = [...customThemes];
    updatedThemes[themeIndex] = { ...updatedThemes[themeIndex], ...updates };
    saveThemes(updatedThemes);
    return true;
  };

  // Delete a custom theme
  const deleteCustomTheme = (id: string): boolean => {
    const updatedThemes = customThemes.filter(theme => theme.id !== id);
    saveThemes(updatedThemes);
    return true;
  };

  // Rename a custom theme
  const renameCustomTheme = (id: string, newName: string): boolean => {
    return updateCustomTheme(id, { name: newName });
  };

  // Get a custom theme by ID
  const getCustomTheme = (id: string): CustomTheme | null => {
    return customThemes.find(theme => theme.id === id) || null;
  };

  // Export custom themes to JSON
  const exportCustomThemes = (): string => {
    return JSON.stringify(customThemes, null, 2);
  };

  // Import custom themes from JSON
  const importCustomThemes = (jsonString: string): boolean => {
    try {
      const imported = JSON.parse(jsonString);
      if (!Array.isArray(imported)) return false;

      // Validate structure
      const validThemes = imported.filter(theme => 
        theme.id && theme.name && theme.primary && theme.secondary && theme.accent
      ).map(theme => ({
        ...theme,
        createdAt: new Date(theme.createdAt || Date.now())
      }));

      // Merge with existing themes, avoiding duplicates
      const existingIds = new Set(customThemes.map(t => t.id));
      const newThemes = validThemes.filter(theme => !existingIds.has(theme.id));
      
      const mergedThemes = [...customThemes, ...newThemes];
      saveThemes(mergedThemes);
      return true;
    } catch (error) {
      console.error('Error importing custom themes:', error);
      return false;
    }
  };

  // Generate a unique theme name
  const generateThemeName = (baseName: string = 'Mon thème'): string => {
    const existingNames = new Set(customThemes.map(t => t.name));
    let name = baseName;
    let counter = 1;
    
    while (existingNames.has(name)) {
      name = `${baseName} ${counter}`;
      counter++;
    }
    
    return name;
  };

  return {
    customThemes,
    createCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    renameCustomTheme,
    getCustomTheme,
    exportCustomThemes,
    importCustomThemes,
    generateThemeName
  };
};