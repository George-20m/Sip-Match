import { useMutation, useQuery } from 'convex/react';
import { useTheme } from '../theme/ThemeContext';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Logger } from '@/src/utils/logger';

export const useFavoritesScreenLogic = (userId: string) => {
  const { theme, isDark } = useTheme();
  const favorites = useQuery(api.favorites.getUserFavorites, { userId });
  const toggleFavorite = useMutation(api.favorites.toggleFavorite);

  const getCaffeineIcon = (level?: string) => {
    switch (level) {
      case 'high': return 'lightning-bolt';
      case 'medium': return 'flash';
      case 'low': return 'weather-night';
      case 'none': return 'sleep';
      default: return 'help-circle-outline';
    }
  };

  const getCaffeineColor = (level?: string) => {
    switch (level) {
      case 'high': return '#DC2626';
      case 'medium': return '#F59E0B';
      case 'low': return '#3B82F6';
      case 'none': return '#6B7280';
      default: return '#9CA3AF';
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
      case 'hot': return '#DC2626';
      case 'cold': return '#3B82F6';
      case 'frozen': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getSweetnessLabel = (level?: number) => {
    if (!level) return 'Not sweet';
    if (level <= 2) return 'Slightly sweet';
    if (level <= 5) return 'Medium sweet';
    if (level <= 7) return 'Sweet';
    return 'Very sweet';
  };

  const getCategoryLabel = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleToggleFavorite = async (drinkId: Id<"drinks">) => {
    try {
      await toggleFavorite({ userId, drinkId });
    } catch (error) {
      Logger.error('Failed to toggle favorite status', 'useFavoritesScreenLogic.handleToggleFavorite', error);
    }
  };

  return {
    theme,
    isDark,
    favorites,
    getCaffeineIcon,
    getCaffeineColor,
    getTemperatureIcon,
    getTemperatureColor,
    getSweetnessLabel,
    getCategoryLabel,
    handleToggleFavorite,
  };
};