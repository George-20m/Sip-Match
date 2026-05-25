import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHistoryScreenLogic } from '../hooks/useHistoryScreenLogic';
import { getStyles } from './styles/HistoryScreen.styles';
import FavoriteButton from './FavoriteButton';
import RecommendationsScreen from './RecommendationsScreen';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Id } from '../../convex/_generated/dataModel';

interface HistoryScreenProps {
  onBack: () => void;
  userId: string;
}

export default function HistoryScreen({ onBack, userId }: HistoryScreenProps) {
  const {
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
  } = useHistoryScreenLogic(userId);

  const styles = useMemo(() => getStyles(theme), [theme]);

  const renderHistoryItem = ({ item }: { item: any }) => {
    const context = item.context;
    const drinksCount = item.recommendations.length;
    const firstDrink = item.recommendations[0]?.drink;

    return (
      <TouchableOpacity
        style={styles.historyCard}
        onPress={() => handleSessionPress(item)}
        activeOpacity={0.7}
      >
        {/* Favorite Button */}
        {firstDrink && userId && (
          <FavoriteButton
            userId={userId}
            drinkId={firstDrink._id as Id<"drinks">}
            style={styles.favoriteButtonPosition}
            size={20}
          />
        )}

        {/* Header */}
        <View style={styles.historyHeader}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
            <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
          </View>
          <View style={styles.drinksCountBadge}>
            <MaterialCommunityIcons name="coffee" size={14} color="#8D6E63" />
            <Text style={styles.drinksCountText}>{drinksCount}</Text>
          </View>
        </View>

        {/* Context Info */}
        <View style={styles.contextRow}>
          <View style={styles.contextItem}>
            <Text style={styles.contextEmoji}>{getMoodEmoji(context.mood)}</Text>
            <Text style={styles.contextLabel}>{context.mood}</Text>
          </View>

          <View style={styles.contextDivider} />

          <View style={styles.contextItem}>
            <MaterialCommunityIcons
              name={getWeatherIcon(context.weatherCondition) as any}
              size={18}
              color="#8D6E63"
            />
            <Text style={styles.contextLabel}>{context.temperature}°C</Text>
          </View>

          <View style={styles.contextDivider} />

          <View style={styles.contextItem}>
            <MaterialCommunityIcons
              name={getTimeIcon(context.timeOfDay) as any}
              size={18}
              color="#8D6E63"
            />
            <Text style={styles.contextLabel}>{context.timeOfDay}</Text>
          </View>
        </View>

        {/* Top Drinks Preview */}
        <View style={styles.drinksPreview}>
          <Text style={styles.previewTitle}>Top recommendations:</Text>
          {item.recommendations.slice(0, 3).map((rec: any, index: number) => (
            <View key={index} style={styles.drinkPreviewItem}>
              <View style={styles.rankDot}>
                <Text style={styles.rankDotText}>{index + 1}</Text>
              </View>
              <Text style={styles.drinkPreviewName} numberOfLines={1}>
                {rec.drink?.name || 'Unknown'}
              </Text>
            </View>
          ))}
          {drinksCount > 3 && (
            <Text style={styles.moreText}>+{drinksCount - 3} more</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Show recommendations screen if session selected
  if (selectedSession) {
    return (
      <RecommendationsScreen
        recommendations={convertToMLFormat(selectedSession)}
        context={{
          mood: selectedSession.context.mood,
          weather: selectedSession.context.weatherCondition,
          temperature: selectedSession.context.temperature,
          time_of_day: selectedSession.context.timeOfDay,
          has_song: false,
        }}
        onBack={handleBackFromRecommendations}
        selectedMood={selectedSession.context.mood}
        selectedSong={null}
        userId={userId}
      />
    );
  }

  if (!historyData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.secondary} />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.surface}
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.headerRight}>
          <Text style={styles.sessionCount}>{historyData.length} sessions</Text>
        </View>
      </View>

      {/* History List */}
      <FlatList
        data={historyData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.timestamp.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="history" size={64} color={theme.muted} />
            <Text style={styles.emptyText}>No history yet</Text>
            <Text style={styles.emptySubtext}>
              Get your first drink recommendation to start building your history!
            </Text>
          </View>
        }
      />
    </View>
  );
}