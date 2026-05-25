import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDrinksListScreenLogic } from '../hooks/useDrinksListScreenLogic';
import { getStyles } from './styles/DrinksListScreen.styles';
import FavoriteButton from './FavoriteButton';
import { Id } from '../../convex/_generated/dataModel';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface DrinksListScreenProps {
  onBack?: () => void;
  userId?: string;
}

type TemperatureFilter = 'all' | 'hot' | 'cold' | 'frozen';
type CaffeineFilter = 'all' | 'none' | 'low' | 'medium' | 'high';

export default function DrinksListScreen({ onBack, userId }: DrinksListScreenProps) {
  const {
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
  } = useDrinksListScreenLogic(onBack, userId);

  const styles = useMemo(() => getStyles(theme), [theme]);

  const renderDrinkCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.drinkCard} activeOpacity={0.7}>
      {/* Favorite Button */}
      {userId && (
        <FavoriteButton
          userId={userId}
          drinkId={item._id as Id<"drinks">}
          style={styles.favoriteButtonPosition}
        />
      )}

      <View style={styles.drinkHeader}>
        <View style={styles.drinkTitleContainer}>
          <Text style={styles.drinkName}>{item.name}</Text>
          <Text style={styles.drinkNameArabic}>{item.nameArabic}</Text>
        </View>
        {item.seasonal && (
          <View style={styles.seasonalBadge}>
            <MaterialCommunityIcons name="snowflake" size={12} color={theme.secondary} />
            <Text style={styles.seasonalText}>Seasonal</Text>
          </View>
        )}
      </View>

      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{getCategoryLabel(item.category)}</Text>
      </View>

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
              {item.caffeineLevel ? item.caffeineLevel.charAt(0).toUpperCase() + item.caffeineLevel.slice(1) : 'N/A'}
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
      </View>

      {/* Dietary badges */}
      <View style={styles.dietaryBadges}>
        {item.vegan && (
          <View style={[styles.dietaryBadge, { backgroundColor: `${theme.success}15` }]}>
            <MaterialCommunityIcons name="leaf" size={12} color={theme.success} />
            <Text style={[styles.dietaryText, { color: theme.success }]}>Vegan</Text>
          </View>
        )}
        {item.vegetarian && !item.vegan && (
          <View style={[styles.dietaryBadge, { backgroundColor: `${theme.secondary}15` }]}>
            <MaterialCommunityIcons name="food-variant" size={12} color={theme.secondary} />
            <Text style={[styles.dietaryText, { color: theme.secondary }]}>Vegetarian</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (!allDrinks) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.secondary} />
        <Text style={styles.loadingText}>Loading drinks...</Text>
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
        <Text style={styles.headerTitle}>All Drinks</Text>
        <View style={styles.headerRight}>
          <Text style={styles.drinkCount}>{filteredDrinks?.length || 0} drinks</Text>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <TouchableOpacity
            onPress={() => setSearchCategory(null)}
            style={[
              styles.categoryChip,
              !searchCategory && styles.categoryChipActive
            ]}
          >
            <Text style={[
              styles.categoryChipText,
              !searchCategory && styles.categoryChipTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => setSearchCategory(category)}
              style={[
                styles.categoryChip,
                searchCategory === category && styles.categoryChipActive
              ]}
            >
              <Text style={[
                styles.categoryChipText,
                searchCategory === category && styles.categoryChipTextActive
              ]}>
                {getCategoryLabel(category)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Temperature & Caffeine Filters */}
      <View style={styles.quickFilters}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Temperature:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(['all', 'hot', 'cold', 'frozen'] as TemperatureFilter[]).map(temp => (
              <TouchableOpacity
                key={temp}
                onPress={() => setTemperatureFilter(temp)}
                style={[
                  styles.filterChip,
                  temperatureFilter === temp && styles.filterChipActive
                ]}
              >
                <Text style={[
                  styles.filterChipText,
                  temperatureFilter === temp && styles.filterChipTextActive
                ]}>
                  {temp === 'all' ? 'All' : temp.charAt(0).toUpperCase() + temp.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Caffeine:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(['all', 'none', 'low', 'medium', 'high'] as CaffeineFilter[]).map(caff => (
              <TouchableOpacity
                key={caff}
                onPress={() => setCaffeineFilter(caff)}
                style={[
                  styles.filterChip,
                  caffeineFilter === caff && styles.filterChipActive
                ]}
              >
                <Text style={[
                  styles.filterChipText,
                  caffeineFilter === caff && styles.filterChipTextActive
                ]}>
                  {caff === 'all' ? 'All' : caff.charAt(0).toUpperCase() + caff.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Drinks List */}
      <FlatList
        data={filteredDrinks}
        renderItem={renderDrinkCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="coffee-off-outline" size={64} color={theme.muted} />
            <Text style={styles.emptyText}>No drinks found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
      />
    </View>
  );
}