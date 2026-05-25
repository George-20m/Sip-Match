import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { moods, useHomeScreenLogic } from '../hooks/useHomeScreenLogic';
import FavoritesScreen from './FavoritesScreen';
import HistoryScreen from './HistoryScreen';
import RecommendationsScreen from './RecommendationsScreen';
import SpotifyMusicSelector from './SpotifyMusicSelector';
import { getStyles } from './styles/HomeScreen.styles';

interface HomeScreenProps {
  onNavigateToSettings?: () => void;
}

export default function HomeScreen({ onNavigateToSettings }: HomeScreenProps) {
  const {
    user,
    userName,
    userImageUrl,
    location,
    temperature,
    weatherIcon,
    condition,
    isLoadingWeather,
    selectedMood,
    showSpotifyModal,
    selectedTrack,
    showRecommendations,
    mlRecommendations,
    mlContext,
    isLoadingRecommendations,
    showHistory,
    showFavorites,
    fadeAnim,
    slideAnim,
    headerAnim,
    moodAnims,
    ctaAnim,
    theme,
    isDark,
    setShowSpotifyModal,
    setShowRecommendations,
    setShowHistory,
    setShowFavorites,
    handleMoodSelect,
    handleGetRecommendation,
    handleSpotifyConnect,
    handleTrackSelect,
    handleNavigateToFavorites,
    handleNavigateToHistory,
    handleNavigateToDrinks,
    handleResetOnboarding,
    handleNavigateToSettings,
  } = useHomeScreenLogic(onNavigateToSettings);

  const styles = useMemo(() => getStyles(theme), [theme]);

  if (showFavorites) {
    return (
      <FavoritesScreen
        onBack={() => setShowFavorites(false)}
        userId={user?.id || ''}
      />
    );
  }

  if (showHistory) {
    return (
      <HistoryScreen
        onBack={() => setShowHistory(false)}
        userId={user?.id || ''}
      />
    );
  }

  if (showRecommendations && mlRecommendations.length > 0 && mlContext) {
    return (
      <RecommendationsScreen
        recommendations={mlRecommendations}
        context={mlContext}
        onBack={() => setShowRecommendations(false)}
        selectedMood={selectedMood || ''}
        selectedSong={selectedTrack ? `${selectedTrack.name} - ${selectedTrack.artists.map(a => a.name).join(', ')}` : null}
        userId={user?.id || ''}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.surface} translucent />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerAnim }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {userName}! 👋</Text>
            <View style={styles.weatherContainer}>
              {isLoadingWeather || temperature === null ? (
                <ActivityIndicator size="small" color="#F59E0B" />
              ) : (
                <>
                  <MaterialCommunityIcons name={(weatherIcon || 'weather-sunny') as any} size={16} color="#F59E0B" />
                  <Text style={styles.weatherText}>
                    {temperature}°C, {location || 'Detecting...'}
                  </Text>
                </>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={handleNavigateToSettings}
            style={styles.profileButton}
            activeOpacity={0.7}
          >
            {userImageUrl ? (
              <Image
                source={{ uri: userImageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profilePlaceholderText}>
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <View style={styles.moodGrid}>
            {moods.map((mood, index) => {
              const isSelected = selectedMood === mood.id;
              return (
                <Animated.View
                  key={mood.id}
                  style={[
                    styles.moodCardWrapper,
                    {
                      opacity: moodAnims[index],
                      transform: [
                        {
                          scale: moodAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleMoodSelect(mood.id)}
                    style={[
                      styles.moodCard,
                      isSelected && styles.moodCardSelected,
                    ]}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.moodIconContainer,
                        { backgroundColor: isSelected ? mood.color : `${mood.color}20` },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={mood.icon as any}
                        size={32}
                        color={isSelected ? '#FFFFFF' : mood.color}
                      />
                    </View>
                    <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                      {mood.label}
                    </Text>
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.musicCardWrapper}>
            <TouchableOpacity
              onPress={handleSpotifyConnect}
              style={styles.musicCard}
              activeOpacity={0.7}
            >
              <View style={styles.musicIconContainer}>
                <MaterialCommunityIcons name="spotify" size={32} color="#1DB954" />
              </View>
              <View style={styles.musicTextContainer}>
                <Text style={styles.musicTitle}>Express Mood with Music</Text>
                <Text style={styles.musicSubtitle}>
                  {selectedTrack 
                    ? `Playing: ${selectedTrack.name.substring(0, 25)}${selectedTrack.name.length > 25 ? '...' : ''}` 
                    : 'Browse and preview songs'}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={theme.secondary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            onPress={handleNavigateToFavorites}
            style={styles.statCard}
            activeOpacity={0.7}
          >
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? theme.accent : '#FFE6E6' }]}>
              <MaterialCommunityIcons name="heart" size={28} color={isDark ? theme.error : "#F472B6"} />
            </View>
            <Text style={styles.statLabel}>Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNavigateToHistory}
            style={styles.statCard}
            activeOpacity={0.7}
          >
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? theme.muted : '#E0E7FF' }]}>
              <MaterialCommunityIcons name="history" size={28} color={isDark ? theme.secondary : "#818CF8"} />
            </View>
            <Text style={styles.statLabel}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNavigateToDrinks}
            style={styles.statCard}
            activeOpacity={0.7}
          >
            <View style={[styles.statIconContainer, { backgroundColor: isDark ? theme.accent : '#FFF4E6' }]}>
              <MaterialCommunityIcons name="coffee" size={28} color={isDark ? theme.primary : "#D97706"} />
            </View>
            <Text style={styles.statLabel}>Drinks</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.suggestionCard}>
            <View style={styles.suggestionBadge}>
              <MaterialCommunityIcons name="star" size={14} color={isDark ? theme.text : "#F59E0B"} />
              <Text style={styles.suggestionBadgeText}>Today&apos;s Pick</Text>
            </View>
            <Text style={styles.suggestionTitle}>Caramel Macchiato</Text>
            <Text style={styles.suggestionDescription}>
              Perfect for a {condition?.toLowerCase() || 'sunny'} day in {location || 'your city'}! Sweet and energizing.
            </Text>
            <TouchableOpacity
              onPress={() => {
                alert('Coming Soon!');
              }}
              style={styles.tryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.tryButtonText}>Try it now</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* UNCOMMENT THEN SAVE TO RESET ONBOARDING */}
        {/* Debug Section - Remove in Production */}
        {/* <TouchableOpacity
          style={styles.debugButton}
          onPress={handleResetOnboarding}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="refresh" size={18} color="#8D6E63" />
          <Text style={styles.debugButtonText}>Reset Onboarding (Debug)</Text>
        </TouchableOpacity> */}

        <View style={{ height: 120 }} />
      </ScrollView>

      <Animated.View
        style={[
          styles.bottomContainer,
          {
            opacity: ctaAnim,
            transform: [
              {
                translateY: ctaAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleGetRecommendation}
          disabled={!selectedMood || isLoadingRecommendations}
          style={[
            styles.ctaButton, 
            (!selectedMood || isLoadingRecommendations) && styles.ctaButtonDisabled
          ]}
          activeOpacity={0.8}
        >
          {isLoadingRecommendations ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={isDark ? theme.background : "#FFFFFF"} />
              <Text style={styles.loadingText}>Finding perfect drinks...</Text>
            </View>
          ) : (
            <Text style={[
              styles.ctaButtonText, 
              !selectedMood && styles.ctaButtonTextDisabled
            ]}>
              Get Recommendation
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <SpotifyMusicSelector
        visible={showSpotifyModal}
        onClose={() => setShowSpotifyModal(false)}
        onSelectTrack={handleTrackSelect}
        selectedMood={selectedMood}
      />
    </View>
  );
}
