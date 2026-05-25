import { Logger } from '@/src/utils/logger';
import { useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated } from 'react-native';
import { api } from '../../convex/_generated/api';
import { MLDrinkRecommendation, mlService } from '../services/mlService';
import { SpotifyTrack } from '../services/spotifyService';
import { useTheme } from '../theme/ThemeContext';
import { useUserLocation } from './userLocation';
import { useUserWeather } from './userWeather';

const ONBOARDING_KEY = '@sip_match_onboarding_complete';

export interface Mood {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const moods: Mood[] = [
  { id: 'happy', label: 'Happy', icon: 'emoticon-happy-outline', color: '#FACC15' },
  { id: 'calm', label: 'Calm', icon: 'cloud-outline', color: '#60A5FA' },
  { id: 'energetic', label: 'Energetic', icon: 'lightning-bolt-outline', color: '#FB923C' },
  { id: 'tired', label: 'Tired', icon: 'sleep', color: '#D97706' },
  { id: 'romantic', label: 'Romantic', icon: 'heart-outline', color: '#F472B6' },
  { id: 'focused', label: 'Focused', icon: 'bullseye-arrow', color: '#C084FC' },
];

export const useHomeScreenLogic = (onNavigateToSettings?: () => void) => {
  const { user } = useUser();
  const router = useRouter();
  const isMountedRef = useRef(true);
  const { theme, isDark } = useTheme();

  const {
    location,
    latitude,
    longitude,
    isLoading: isLoadingLocation,
  } = useUserLocation();

  const {
    temperature,
    weatherIcon,
    condition,
    isLoading: isLoadingWeather,
  } = useUserWeather(latitude, longitude);

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showSpotifyModal, setShowSpotifyModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);

  const [showRecommendations, setShowRecommendations] = useState(false);
  const [mlRecommendations, setMlRecommendations] = useState<MLDrinkRecommendation[]>([]);
  const [mlContext, setMlContext] = useState<any>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const moodAnims = useRef(moods.map(() => new Animated.Value(0))).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    isMountedRef.current = true;
    startAnimations();

    return () => {
      isMountedRef.current = false;
      fadeAnim.stopAnimation();
      slideAnim.stopAnimation();
      headerAnim.stopAnimation();
      ctaAnim.stopAnimation();
      moodAnims.forEach(anim => anim.stopAnimation());
    };
  }, []);

  const startAnimations = () => {
    // Header slide down
    Animated.spring(headerAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Content fade in and slide up
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
    Animated.stagger(
      70,
      moodAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        })
      )
    ).start();

    // CTA button animation
    Animated.spring(ctaAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      delay: 400,
      useNativeDriver: true,
    }).start();
  };

  const handleNavigateToSettings = () => {
    if (onNavigateToSettings) {
      onNavigateToSettings();
    }
  };

  const handleMoodSelect = (moodId: string) => {
    try {
      setSelectedMood(moodId);

      const selectedAnim = moodAnims[moods.findIndex(m => m.id === moodId)];
      Animated.sequence([
        Animated.timing(selectedAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(selectedAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      Logger.error('Failed to select mood', 'useHomeScreenLogic', error);
    }
  };

  const convexUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip"
  );
  const saveRecommendationBatch = useMutation(api.recommendations.saveRecommendationBatch);
  const allDrinks = useQuery(api.drinks.getAllDrinks);
  const userFavoritesQuery = useQuery(
    api.favorites.getUserFavorites,
    user?.id ? { userId: user.id } : "skip"
  );

  const handleGetRecommendation = async () => {
    if (!selectedMood) {
      Alert.alert('Select Your Mood', 'Please select how you\'re feeling first!');
      return;
    }

    if (latitude == null || longitude == null) {
      Alert.alert(
        "Location not ready",
        "Please wait a moment while we get your location."
      );
      return;
    }

    setIsLoadingRecommendations(true);

    try {
      // Get user's favorites
      const favoriteDrinks = (userFavoritesQuery ?? []).map(f => f.drink).filter(Boolean);

      const requestBody = {
        user_id: user?.id || 'guest',
        email: user?.emailAddresses?.[0]?.emailAddress || 'guest@sipmatch.com',
        name: user?.fullName || user?.firstName || 'Guest',
        mood: selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1),
        song: selectedTrack
          ? `${selectedTrack.name} - ${selectedTrack.artists.map(a => a.name).join(', ')}`
          : null,

        location: {
          latitude: latitude ?? 0,
          longitude: longitude ?? 0,
          city: location || "Unknown"
        },

        weather: {
          temperature: temperature ?? 0,
          condition: condition || "unknown",
          humidity: null
        },

        timestamp: new Date().toISOString(),
        userFavorites: favoriteDrinks
      };

      Logger.info('Sending recommendation request to ML service', 'useHomeScreenLogic');

      const response = await mlService.getRecommendations(requestBody);

      if (response.success && response.recommendations.length > 0) {
        Logger.success(`Received ${response.recommendations.length} recommendations from ML service`, 'useHomeScreenLogic');

        setMlRecommendations(response.recommendations);
        setMlContext(response.context);

        try {
          if (user?.id && allDrinks?.length) {
            const drinkIds = response.recommendations
              .map(mlDrink => {
                const drink = allDrinks.find(d => d.name === mlDrink.name);
                return drink?._id;
              })
              .filter(Boolean) as any[];

            if (drinkIds.length > 0) {
              await saveRecommendationBatch({
                userId: user.id,
                drinkIds,
                context: {
                  mood: selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1),
                  temperature: temperature ?? 0,
                  weatherCondition: weatherIcon?.replace('weather-', '') || "unknown",
                  timeOfDay: response.context.time_of_day,
                  song: selectedTrack?.name,
                },
              });

              Logger.success('Saved recommendation batch to history', 'useHomeScreenLogic');
            }
          }
        } catch (error) {
          Logger.error('Failed to save recommendations to history', 'useHomeScreenLogic', error);
        }

        setShowRecommendations(true);
      } else {
        Alert.alert(
          'No Recommendations Found',
          response.error || 'Unable to find matching drinks. Please try again.'
        );
      }
    } catch (error) {
      Logger.error('Failed to fetch recommendations from ML service', 'useHomeScreenLogic', error);

      Alert.alert(
        'Connection Error',
        'Unable to connect to recommendation service. Please check ML server and network.'
      );
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleSpotifyConnect = () => {
    if (!selectedMood) {
      Alert.alert(
        'Select Your Mood First',
        'Please select how you\'re feeling before choosing music.',
        [{ text: 'OK' }]
      );
      return;
    }
    setShowSpotifyModal(true);
  };

  const handleTrackSelect = (track: SpotifyTrack) => {
    setSelectedTrack(track);
    Alert.alert(
      'Song Selected! 🎵',
      `"${track.name}" by ${track.artists.map(a => a.name).join(', ')}\n\nThis perfectly captures your ${selectedMood} mood!`,
      [{ text: 'Awesome!' }]
    );
  };

  const handleNavigateToFavorites = () => {
    if (!user?.id) {
      Alert.alert('Sign In Required', 'Please sign in to view your favorites.', [{ text: 'OK' }]);
      return;
    }
    setShowFavorites(true);
  };

  const handleNavigateToHistory = () => {
    if (!user?.id) {
      Alert.alert('Sign In Required', 'Please sign in to view your history.', [{ text: 'OK' }]);
      return;
    }
    setShowHistory(true);
  };


  const handleResetOnboarding = async () => {
    Alert.alert(
      'Reset Onboarding',
      'This will show you the onboarding screens again next time you open the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(ONBOARDING_KEY);
              Alert.alert('Success', 'Onboarding has been reset!');
            } catch (error) {
              Logger.error('Failed to reset onboarding status', 'useHomeScreenLogic', error);
              Alert.alert('Error', 'Failed to reset onboarding.');
            }
          }
        },
      ]
    );
  };

  const handleNavigateToDrinks = () => {
    router.push('/drinks');
  };

  const userName = convexUser?.userName || user?.firstName || user?.username || 'Friend';
  const userImageUrl = convexUser?.image || null;

  return {
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
  };
};