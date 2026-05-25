import { useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { Logger } from '@/src/utils/logger';

const ONBOARDING_KEY = '@sip_match_onboarding_complete';

export const useIndexLogic = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (!showSplash && isLoaded && hasSeenOnboarding !== null && !isNavigating) {
      navigateToCorrectScreen();
    }
  }, [showSplash, isLoaded, hasSeenOnboarding, isSignedIn]);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasSeenOnboarding(value === 'true');
    } catch (error) {
      Logger.error('Failed to check onboarding status', 'useIndexLogic.checkOnboardingStatus', error);
      setHasSeenOnboarding(false);
    }
  };

  const navigateToCorrectScreen = async () => {
    if (isNavigating) return;
    
    try {
      setIsNavigating(true);
      
      if (isSignedIn) {
        router.replace('/home');
      } else if (hasSeenOnboarding) {
        router.replace('/auth');
      } else {
        router.replace('/onboarding');
      }
    } catch (error) {
      Logger.error('Navigation error during screen redirection', 'useIndexLogic.navigateToCorrectScreen', error);
      router.replace('/onboarding');
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return {
    isSignedIn,
    isLoaded,
    theme,
    showSplash,
    hasSeenOnboarding,
    handleSplashFinish,
  };
};
