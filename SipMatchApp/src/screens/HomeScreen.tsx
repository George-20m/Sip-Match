// SipMatchApp/src/screens/HomeScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import styles from '../theme/HomeScreenTheme';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  userName: string; // Add userName prop
  onGetRecommendation: (mood: string) => void;
  onNavigate: (screen: string) => void;
}

// Simple icon components (you can replace with actual icons later)
const IconWrapper = ({ children, size = 24, color = '#000' }: any) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.7, color }}>{children}</Text>
  </View>
);

const moods = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#FACC15' },
  { id: 'calm', label: 'Calm', emoji: '🌬️', color: '#60A5FA' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡', color: '#FB923C' },
  { id: 'tired', label: 'Tired', emoji: '☕', color: '#D97706' },
  { id: 'romantic', label: 'Romantic', emoji: '❤️', color: '#F472B6' },
  { id: 'focused', label: 'Focused', emoji: '☁️', color: '#C084FC' },
];

const COLORS = {
  background: '#FFF8E7',
  foreground: '#3E2723',
  card: '#ffffff',
  primary: '#8B4513',
  primaryForeground: '#ffffff',
  secondary: '#F5E6D3',
  secondaryForeground: '#3E2723',
  mutedForeground: '#8D6E63',
  accent: '#D4A574',
  border: 'rgba(139, 69, 19, 0.15)',
};

export default function HomeScreen({ userName, onGetRecommendation, onNavigate }: HomeScreenProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const moodAnims = useRef(moods.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Fade in and slide up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger mood card animations
    const animations = moodAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      })
    );
    Animated.stagger(50, animations).start();
  }, []);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleGetRecommendation = () => {
    if (selectedMood) {
      onGetRecommendation(selectedMood);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.card} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}! 👋</Text>
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherIcon}>☀️</Text>
            <Text style={styles.weatherText}>28°C, Cairo</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onNavigate('settings')}
          style={styles.menuButton}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mood selection */}
        <Animated.View 
          style={[
            styles.section,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <View style={styles.moodGrid}>
            {moods.map((mood, index) => (
              <Animated.View
                key={mood.id}
                style={[
                  styles.moodCardWrapper,
                  {
                    opacity: moodAnims[index],
                    transform: [{
                      scale: moodAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      })
                    }]
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleMoodSelect(mood.id)}
                  style={[
                    styles.moodCard,
                    selectedMood === mood.id && styles.moodCardSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.moodIcon, { backgroundColor: mood.color }]}>
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  </View>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Music detection */}
        <Animated.View 
          style={[
            styles.section,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.musicCardWrapper}>
            <TouchableOpacity
              onPress={() => {
                // Show alert that Spotify integration is coming soon
                Alert.alert(
                  'Spotify Integration',
                  'Connect your Spotify account to automatically detect your mood from your music! This feature is coming soon.',
                  [{ text: 'OK' }]
                );
              }}
              style={styles.musicCard}
              activeOpacity={0.7}
            >
              <View style={styles.musicIconContainer}>
                <Text style={styles.musicEmoji}>🎵</Text>
              </View>
              <View style={styles.musicTextContainer}>
                <Text style={styles.musicTitle}>Detect Mood from Music</Text>
                <Text style={styles.musicSubtitle}>Connect Spotify to auto-detect</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>
        </Animated.View>

        {/* Quick stats */}
        <Animated.View 
          style={[
            styles.statsContainer,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableOpacity
            onPress={() => onNavigate('favorites')}
            style={styles.statCard}
            activeOpacity={0.7}
          >
            <Text style={styles.statEmoji}>❤️</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate('history')}
            style={styles.statCard}
            activeOpacity={0.7}
          >
            <Text style={styles.statEmoji}>☁️</Text>
            <Text style={styles.statLabel}>History</Text>
          </TouchableOpacity>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>☕</Text>
            <Text style={styles.statLabel}>23 drinks</Text>
          </View>
        </Animated.View>

        {/* Today's suggestion */}
        <Animated.View 
          style={[
            styles.section,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.suggestionCard}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Today's Pick</Text>
            </View>
            <Text style={styles.suggestionTitle}>☕ Caramel Macchiato</Text>
            <Text style={styles.suggestionDescription}>
              Perfect for a sunny morning in Cairo! Sweet and energizing.
            </Text>
            <TouchableOpacity
              onPress={() => onGetRecommendation('happy')}
              style={styles.tryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.tryButtonText}>Try it now</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Bottom spacing for fixed button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomGradient}>
        <TouchableOpacity
          onPress={handleGetRecommendation}
          disabled={!selectedMood}
          style={[
            styles.ctaButton,
            !selectedMood && styles.ctaButtonDisabled,
          ]}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaButtonText}>Get Recommendation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}