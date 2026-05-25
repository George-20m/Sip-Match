import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFavoritesScreenLogic } from '../hooks/useFavoritesScreenLogic';
import { getStyles } from './styles/FavoritesScreen.styles';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface FavoritesScreenProps {
  onBack: () => void;
  userId: string;
}

export default function FavoritesScreen({ onBack, userId }: FavoritesScreenProps) {
  const {
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
  } = useFavoritesScreenLogic(userId);

  const styles = useMemo(() => getStyles(theme), [theme]);

  const renderDrinkCard = ({ item }: { item: any }) => {
    const drink = item.drink;

    return (
      <View style={styles.drinkCard}>
        {/* Favorite Button */}
        <TouchableOpacity
          onPress={() => handleToggleFavorite(drink._id)}
          style={styles.favoriteButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="heart"
            size={24}
            color="#F472B6"
          />
        </TouchableOpacity>

        <View style={styles.drinkHeader}>
          <View style={styles.drinkTitleContainer}>
            <Text style={styles.drinkName}>{drink.name}</Text>
            <Text style={styles.drinkNameArabic}>{drink.nameArabic}</Text>
          </View>
          {drink.seasonal && (
            <View style={styles.seasonalBadge}>
              <MaterialCommunityIcons name="snowflake" size={12} color="#8B5CF6" />
              <Text style={styles.seasonalText}>Seasonal</Text>
            </View>
          )}
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{getCategoryLabel(drink.category)}</Text>
        </View>

        <View style={styles.drinkDetails}>
          {/* Temperature */}
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: `${getTemperatureColor(drink.temperature)}15` }]}>
              <MaterialCommunityIcons
                name={getTemperatureIcon(drink.temperature) as any}
                size={18}
                color={getTemperatureColor(drink.temperature)}
              />
            </View>
            <View>
              <Text style={styles.detailLabel}>Temperature</Text>
              <Text style={styles.detailValue}>{drink.temperature.charAt(0).toUpperCase() + drink.temperature.slice(1)}</Text>
            </View>
          </View>

          {/* Caffeine Level */}
          <View style={styles.detailItem}>
            <View style={[styles.detailIcon, { backgroundColor: `${getCaffeineColor(drink.caffeineLevel)}15` }]}>
              <MaterialCommunityIcons
                name={getCaffeineIcon(drink.caffeineLevel) as any}
                size={18}
                color={getCaffeineColor(drink.caffeineLevel)}
              />
            </View>
            <View>
              <Text style={styles.detailLabel}>Caffeine</Text>
              <Text style={styles.detailValue}>
                {drink.caffeineLevel ? drink.caffeineLevel.charAt(0).toUpperCase() + drink.caffeineLevel.slice(1) : 'N/A'}
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
              <Text style={styles.detailValue}>{getSweetnessLabel(drink.sweetnessLevel)}</Text>
            </View>
          </View>
        </View>

        {/* Dietary badges */}
        <View style={styles.dietaryBadges}>
          {drink.vegan && (
            <View style={[styles.dietaryBadge, { backgroundColor: '#10B98115' }]}>
              <MaterialCommunityIcons name="leaf" size={12} color="#10B981" />
              <Text style={[styles.dietaryText, { color: '#10B981' }]}>Vegan</Text>
            </View>
          )}
          {drink.vegetarian && !drink.vegan && (
            <View style={[styles.dietaryBadge, { backgroundColor: '#8B5CF615' }]}>
              <MaterialCommunityIcons name="food-variant" size={12} color="#8B5CF6" />
              <Text style={[styles.dietaryText, { color: '#8B5CF6' }]}>Vegetarian</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (!favorites) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.secondary} />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.surface} translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.headerRight}>
          <Text style={styles.favoritesCount}>{favorites.length} drinks</Text>
        </View>
      </View>

      {/* Favorites List */}
      <FlatList
        data={favorites}
        renderItem={renderDrinkCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="heart-outline" size={64} color={theme.muted} />
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the heart icon on any drink to add it to your favorites!
            </Text>
          </View>
        }
      />
    </View>
  );
}