// src/theme/ThemeContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { darkColors, lightColors, ThemeColors } from './colors';
import { Logger } from '@/src/utils/logger';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeColors;
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@sipmatch_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeTypeState] = useState<ThemeType>('light');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    // Load persisted theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeTypeState(savedTheme as ThemeType);
        } else { // If no saved preference = first time ever opening the app → force light
          setThemeTypeState('light');
          await AsyncStorage.setItem(THEME_STORAGE_KEY, 'light');
        }
      } catch (e) {
        Logger.error('Failed to load theme preference', 'ThemeProvider.loadTheme', e);
      } finally {
        setIsThemeLoaded(true); // ← always mark as loaded
      }
    };
    loadTheme();
  }, []);

  const setThemeType = async (type: ThemeType) => {
    setThemeTypeState(type);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, type);
    } catch (e) {
      Logger.error('Failed to save theme preference', 'ThemeProvider.setThemeType', e);
    }
  };

  const isDark = themeType === 'system' 
    ? systemColorScheme === 'dark' 
    : themeType === 'dark';

  const theme = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, themeType, setThemeType, isDark }}>
      {isThemeLoaded ? children : <View />}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
