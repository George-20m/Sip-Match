import { useQuery } from 'convex/react';
import { useTheme } from '../theme/ThemeContext';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { MLDrinkRecommendation } from '../services/mlService';
import { useState } from 'react';

export const useHistoryScreenLogic = (userId: string) => {
  const { theme, isDark } = useTheme();
  const [selectedSession, setSelectedSession] = useState<any>(null);

  // Fetch user's history from Convex
  const historyData = useQuery(
    api.recommendations.getUserHistoryGrouped,
    userId ? { userId } : 'skip'
  );

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

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('sun') || lower === 'clear') return 'weather-sunny';
    if (lower.includes('cloud')) return 'weather-cloudy';
    if (lower.includes('rain')) return 'weather-rainy';
    if (lower.includes('storm')) return 'weather-lightning';
    return 'weather-partly-cloudy';
  };

  const getTimeIcon = (timeOfDay: string) => {
    switch (timeOfDay.toLowerCase()) {
      case 'morning': return 'weather-sunset-up';
      case 'afternoon': return 'weather-sunny';
      case 'evening': return 'weather-sunset-down';
      case 'night': return 'weather-night';
      default: return 'clock-outline';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Convert history session to ML recommendation format
  const convertToMLFormat = (session: any): MLDrinkRecommendation[] => {
    return session.recommendations.map((rec: any, index: number) => ({
      name: rec.drink?.name || 'Unknown',
      nameArabic: rec.drink?.nameArabic || '',
      category: rec.drink?.category || '',
      temperature: rec.drink?.temperature || '',
      caffeineLevel: rec.drink?.caffeineLevel || 'none',
      sweetnessLevel: rec.drink?.sweetnessLevel || 0,
      score: 100 - (index * 5), // Approximate scores
      reasons: rec.drink?.bestForMoods?.slice(0, 3) || [],
      flavorProfile: rec.drink?.flavorProfile || [],
      vegan: rec.drink?.vegan || false,
      intensity: rec.drink?.intensity || 3,
    }));
  };

  const handleSessionPress = (session: any) => {
    setSelectedSession(session);
  };

  const handleBackFromRecommendations = () => {
    setSelectedSession(null);
  };

  return {
    theme,
    isDark,
    historyData,
    selectedSession,
    setSelectedSession,
    getMoodEmoji,
    getWeatherIcon,
    getTimeIcon,
    formatDate,
    formatTime,
    convertToMLFormat,
    handleSessionPress,
    handleBackFromRecommendations,
  };
};