import { useQuery } from 'convex/react';
import { useTheme } from '../theme/ThemeContext';
import { Dimensions } from 'react-native';
import { api } from '../../convex/_generated/api';

export const useRecommendationsScreenLogic = () => {
  const { theme, isDark } = useTheme();
  const { width } = Dimensions.get('window');
  const allDrinks = useQuery(api.drinks.getAllDrinks);

  const getCaffeineIcon = (level: string) => {
    switch (level) {
      case 'high': return 'lightning-bolt';
      case 'medium': return 'flash';
      case 'low': return 'weather-night';
      case 'none': return 'sleep';
      default: return 'help-circle-outline';
    }
  };

  const getCaffeineColor = (level: string) => {
    switch (level) {
      case 'high': return theme.error;
      case 'medium': return '#F59E0B';
      case 'low': return '#3B82F6';
      case 'none': return theme.muted;
      default: return theme.muted;
    }
  };

  const getTemperatureIcon = (temp: string) => {
    switch (temp) {
      case 'hot': return 'fire';
      case 'cold': return 'snowflake';
      case 'frozen': return 'ice-cream';
      default: return 'temperature-celsius';
    }
  };

  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'hot': return theme.error;
      case 'cold': return '#3B82F6';
      case 'frozen': return '#8B5CF6';
      default: return theme.muted;
    }
  };

  const getSweetnessLabel = (level: number) => {
    if (level === 0) return 'Not sweet';
    if (level <= 2) return 'Slightly sweet';
    if (level <= 5) return 'Medium sweet';
    if (level <= 7) return 'Sweet';
    return 'Very sweet';
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'energetic': return '⚡';
      case 'tired': return '😴';
      case 'romantic': return '💕';
      case 'focused': return '🎯';
      default: return '😊';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 100) return theme.success;
    if (score >= 90) return theme.success;
    if (score >= 80) return '#60A5FA';
    return '#93C5FD';
  };

  return {
    theme,
    isDark,
    width,
    allDrinks,
    getCaffeineIcon,
    getCaffeineColor,
    getTemperatureIcon,
    getTemperatureColor,
    getSweetnessLabel,
    getMoodEmoji,
    getScoreColor,
  };
};