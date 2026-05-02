// Entry route that decides between splash, onboarding, auth, and the signed-in home flow.
import { useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import SplashScreen from './components/SplashScreen';

// Shared storage key that remembers whether onboarding has already been completed.
const ONBOARDING_KEY = '@sip_match_onboarding_complete';

export default function Index() {
  // Track auth state, navigation, splash visibility, and onboarding progress.
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Log entry-state changes while debugging the startup flow.
  useEffect(() => {
    console.log('Index - Auth State:', { isLoaded, isSignedIn, hasSeenOnboarding, showSplash });
  }, [isLoaded, isSignedIn, hasSeenOnboarding, showSplash]);

  // Load the persisted onboarding flag on first mount.
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  // Route the user only after splash, auth, and onboarding state are all ready.
  useEffect(() => {
    if (!showSplash && isLoaded && hasSeenOnboarding !== null && !isNavigating) {
      navigateToCorrectScreen();
    }
  }, [showSplash, isLoaded, hasSeenOnboarding, isSignedIn]);

  // Read onboarding completion from storage and normalize it into local UI state.
  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      console.log('Onboarding status:', value);
      setHasSeenOnboarding(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasSeenOnboarding(false);
    }
  };

  // Send signed-in users home, returning users to auth, and new users to onboarding.
  const navigateToCorrectScreen = async () => {
    if (isNavigating) return; // Prevent multiple navigations
    
    try {
      setIsNavigating(true);
      
      console.log('🚀 Navigation decision:', { isSignedIn, hasSeenOnboarding });
      
      if (isSignedIn) {
        console.log('→ Navigating to /home');
        router.replace('/home');
      } else if (hasSeenOnboarding) {
        console.log('→ Navigating to /auth');
        router.replace('/auth');
      } else {
        console.log('→ Navigating to /onboarding');
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fall back to onboarding if route resolution fails unexpectedly.
      router.replace('/onboarding');
    }
  };

  // Hide the splash screen once its minimum display time finishes.
  const handleSplashFinish = () => {
    console.log('✅ Splash finished');
    setShowSplash(false);
  };

  // Show the branded splash screen before making any route decision.
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} minimumDisplayTime={2000} />;
  }

  // Show a loading state while auth and onboarding checks are still resolving.
  if (!isLoaded || hasSeenOnboarding === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8D6E63" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Fallback loading UI while the navigation effect redirects the user.
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#8D6E63" />
      <Text style={styles.loadingText}>Redirecting...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAF0',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8D6E63',
    fontWeight: '500',
  },
});
