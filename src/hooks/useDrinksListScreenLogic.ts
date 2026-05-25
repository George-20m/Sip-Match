import { useQuery } from 'convex/react';
import { useTheme } from '../theme/ThemeContext';
import { Dimensions } from 'react-native';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useState } from 'react';

export const useDrinksListScreenLogic = (onBack: (() => void) | undefined, userId: string | undefined) => {
  const { theme, isDark } = useTheme();
  const { width } = Dimensions.get('window');

  const [temperatureFilter, setTemperatureFilter] = useState<'all' | 'hot' | 'cold' | 'frozen'>('all');
  const [caffeineFilter, setCaffeineFilter] = useState<'all' | 'none' | 'low' | 'medium' | 'high'>('all');
  const [searchCategory, setSearchCategory] = useState<string | null>(null);

  // Fetch all drinks from Convex
  const allDrinks = useQuery(api.drinks.getAllDrinks);

  // Get unique categories
  const categories = allDrinks
    ? Array.from(new Set(allDrinks.map(d => d.category)))
    : [];

  // Filter drinks based on selected filters
  const filteredDrinks = allDrinks?.filter(drink => {
    const matchesTemperature = temperatureFilter === 'all' || drink.temperature === temperatureFilter;
    const matchesCaffeine = caffeineFilter === 'all' || drink.caffeineLevel === caffeineFilter;
    const matchesCategory = !searchCategory || drink.category === searchCategory;

    return matchesTemperature && matchesCaffeine && matchesCategory;
  }) || [];

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

  return {
    theme,
    isDark,
    width,
    allDrinks,
    categories,
    filteredDrinks,
    temperatureFilter,
    setTemperatureFilter,
    caffeineFilter,
    setCaffeineFilter,
    searchCategory,
    setSearchCategory,
    getCaffeineIcon,
    getCaffeineColor,
    getTemperatureIcon,
    getTemperatureColor,
    getSweetnessLabel,
    getCategoryLabel,
    userId,
  };
};