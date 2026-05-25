import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRecommendationsScreenLogic } from '../hooks/useRecommendationsScreenLogic';
import { getStyles } from './styles/RecommendationsScreen.styles';
import FavoriteButton from './FavoriteButton';
import { MLDrinkRecommendation } from '../services/mlService';
import React, { useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Id } from '../../convex/_generated/dataModel';

interface RecommendationsScreenProps {
  recommendations: MLDrinkRecommendation[];
  context: {
    mood: string;
    weather: string;
    temperature: number;
    time_of_day: string;
    has_song: boolean;
  };
  onBack: () => void;
  selectedMood: string;
  selectedSong?: string | null;
  userId: string;
}

export default function RecommendationsScreen({
  recommendations,
  context,
  onBack,
  selectedMood,
  selectedSong,
  userId,
}: RecommendationsScreenProps) {
  const {
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
  } = useRecommendationsScreenLogic();

  const styles = useMemo(() => getStyles(theme), [theme]);

  const renderDrinkCard = ({ item, index }: { item: MLDrinkRecommendation; index: number }) => {
    // Find the drink ID by matching the name
    const drinkData = allDrinks?.find(d => d.name === item.name);
    const drinkId = drinkData?._id;

    return (
      <View style={styles.drinkCard}>
        {/* Favorite Button */}
        {drinkId && userId && (
          <FavoriteButton
            userId={userId}
            drinkId={drinkId as Id<"drinks">}
            style={styles.favoriteButtonPosition}
          />
        )}

        {/* Ranking Badge */}
        <View style={[
          styles.rankBadge,
          index === 0 && styles.rankBadgeFirst,
          index === 1 && styles.rankBadgeSecond,
          index === 2 && styles.rankBadgeThird,
        ]}>
          <Text style={styles.rankText}>#{index + 1}</Text>
        </View>

        {/* Score Badge */}
        <View style={[styles.scoreBadge, { backgroundColor: `${getScoreColor(item.score)}20` }]}>
          <MaterialCommunityIcons name="star" size={14} color={getScoreColor(item.score)} />
          <Text style={[styles.scoreText, { color: getScoreColor(item.score) }]}>
            {item.score}% Match
          </Text>
        </View>

        <View style={styles.drinkHeader}>
          <View style={styles.drinkTitleContainer}>
            <Text style={styles.drinkName}>{item.name}</Text>
            <Text style={styles.drinkNameArabic}>{item.nameArabic}</Text>
          </View>
        </View>

        {/* Reasons for Recommendation */}
        <View style={styles.reasonsContainer}>
          <Text style={styles.reasonsTitle}>Why we recommend this:</Text>
          {item.reasons.map((reason, idx) => (
            <View key={idx} style={styles.reasonItem}>
              <MaterialCommunityIcons name="check-circle" size={16} color={theme.success} />
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
        </View>

        {/* Flavor Profile */}
        {item.flavorProfile && item.flavorProfile.length > 0 && (
          <View style={styles.flavorContainer}>
            <Text style={styles.flavorTitle}>Flavor Notes:</Text>
            <View style={styles.flavorTags}>
              {item.flavorProfile.map((flavor, idx) => (
                <View key={idx} style={styles.flavorTag}>
                  <Text style={styles.flavorText}>{flavor}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Drink Details */}
        <View style={styles.drinkDetails}>
          {/* Temperature */}
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: `${getTemperatureColor(item.temperature)}15` }]}>
              <MaterialCommunityIcons
                name={getTemperatureIcon(item.temperature) as any}
                size={18}
                color={getTemperatureColor(item.temperature)}
              />
            </View>
            <View>
              <Text style={styles.detailLabel}>Temperature</Text>
              <Text style={styles.detailValue}>{item.temperature.charAt(0).toUpperCase() + item.temperature.slice(1)}</Text>
            </View>
          </View>

          {/* Caffeine Level */}
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: `${getCaffeineColor(item.caffeineLevel)}15` }]}>
              <MaterialCommunityIcons
                name={getCaffeineIcon(item.caffeineLevel) as any}
                size={18}
                color={getCaffeineColor(item.caffeineLevel)}
              />
            </View>
            <View>
              <Text style={styles.detailLabel}>Caffeine</Text>
              <Text style={styles.detailValue}>
                {item.caffeineLevel.charAt(0).toUpperCase() + item.caffeineLevel.slice(1)}
              </Text>
            </View>
          </View>

          {/* Sweetness Level */}
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: '#FACC1515' }]}>
              <MaterialCommunityIcons name="candy" size={18} color="#FACC15" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Sweetness</Text>
              <Text style={styles.detailValue}>{getSweetnessLabel(item.sweetnessLevel)}</Text>
            </View>
          </View>

          {/* Intensity */}
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: '#F4743B15' }]}>
              <MaterialCommunityIcons name="speedometer" size={18} color="#F4743B" />
            </View>
            <View>
              <Text style={styles.detailLabel}>Intensity</Text>
              <Text style={styles.detailValue}>{item.intensity}/5</Text>
            </View>
          </View>
        </View>

        {/* Dietary Badge */}
        {item.vegan && (
          <View style={styles.dietaryBadges}>
            <View style={[styles.dietaryBadge, { backgroundColor: `${theme.success}15` }]}>
              <MaterialCommunityIcons name="leaf" size={12} color={theme.success} />
              <Text style={[styles.dietaryText, { color: theme.success }]}>Vegan</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Your Perfect Matches</Text>
          <Text style={styles.headerSubtitle}>{recommendations.length} drinks found</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Context Card */}
      <View style={styles.contextCard}>
        <View style={styles.contextHeader}>
          <MaterialCommunityIcons name="information" size={20} color={theme.secondary} />
          <Text style={styles.contextTitle}>Matched for you</Text>
        </View>
        <View style={styles.contextDetails}>
          <View style={styles.contextItem}>
            <Text style={styles.contextLabel}>Mood:</Text>
            <Text style={styles.contextValue}>{getMoodEmoji(selectedMood)} {selectedMood}</Text>
          </View>
          <View style={styles.contextItem}>
            <Text style={styles.contextLabel}>Weather:</Text>
            <Text style={styles.contextValue}>{context.temperature}°C, {context.weather}</Text>
          </View>
          <View style={styles.contextItem}>
            <Text style={styles.contextLabel}>Time:</Text>
            <Text style={styles.contextValue}>{context.time_of_day}</Text>
          </View>
          {selectedSong && (
            <View style={styles.contextItem}>
              <Text style={styles.contextLabel}>Music:</Text>
              <Text style={styles.contextValue} numberOfLines={1}>🎵 {selectedSong}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Recommendations List */}
      <FlatList
        data={recommendations}
        renderItem={renderDrinkCard}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <MaterialCommunityIcons name="trophy" size={24} color="#F59E0B" />
            <Text style={styles.listHeaderText}>Ranked by AI match score</Text>
          </View>
        }
      />
    </View>
  );
}