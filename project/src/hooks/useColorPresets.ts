import { useState, useEffect } from 'react';

const COLOR_PRESETS_STORAGE_KEY = 'colorPresets';
const MAX_PRESETS = 24;

const DEFAULT_PRESETS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD',
  '#00D2D3', '#FF9F43', '#EE5A24', '#009432', '#0652DD', '#9C88FF', '#FFC312', '#C4E538',
  '#F0932B', '#EB4D4B', '#6AB04C', '#7ED6DF', '#E056FD', '#686DE0', '#30336B', '#2C2C54'
];

export const useColorPresets = () => {
  const [presets, setPresets] = useState<string[]>(DEFAULT_PRESETS);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // Load presets from localStorage
  useEffect(() => {
    const savedPresets = localStorage.getItem(COLOR_PRESETS_STORAGE_KEY);
    const savedRecents = localStorage.getItem('recentColors');
    
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (error) {
        console.error('Error loading color presets:', error);
      }
    }
    
    if (savedRecents) {
      try {
        setRecentColors(JSON.parse(savedRecents));
      } catch (error) {
        console.error('Error loading recent colors:', error);
      }
    }
  }, []);

  // Save presets to localStorage
  useEffect(() => {
    localStorage.setItem(COLOR_PRESETS_STORAGE_KEY, JSON.stringify(presets));
  }, [presets]);

  // Save recent colors to localStorage
  useEffect(() => {
    localStorage.setItem('recentColors', JSON.stringify(recentColors));
  }, [recentColors]);

  const addToPresets = (color: string) => {
    if (!color || presets.includes(color)) return;
    
    const newPresets = [color, ...presets];
    if (newPresets.length > MAX_PRESETS) {
      newPresets.splice(MAX_PRESETS);
    }
    setPresets(newPresets);
  };

  const removeFromPresets = (color: string) => {
    setPresets(prev => prev.filter(c => c !== color));
  };

  const addToRecents = (color: string) => {
    if (!color) return;
    
    const newRecents = [color, ...recentColors.filter(c => c !== color)];
    if (newRecents.length > 12) {
      newRecents.splice(12);
    }
    setRecentColors(newRecents);
  };

  const clearPresets = () => {
    setPresets(DEFAULT_PRESETS);
  };

  const clearRecents = () => {
    setRecentColors([]);
  };

  const resetToDefaults = () => {
    setPresets(DEFAULT_PRESETS);
    setRecentColors([]);
  };

  return {
    presets,
    recentColors,
    addToPresets,
    removeFromPresets,
    addToRecents,
    clearPresets,
    clearRecents,
    resetToDefaults
  };
};