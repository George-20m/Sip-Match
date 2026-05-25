<<<<<<< HEAD
// Onboarding route that persists completion state before sending the user to auth.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import OnboardingScreen from './components/OnboardingScreen';

// Shared storage key that marks onboarding as completed.
const ONBOARDING_KEY = '@sip_match_onboarding_complete';

export default function Onboarding() {
  // Router is only used to continue into auth after onboarding finishes.
  const router = useRouter();

  // Persist completion locally, then move the user into the authentication flow.
  const handleComplete = async () => {
    try {
      // Save a local flag so onboarding does not appear again on the next launch.
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      
      // Continue into sign-in / sign-up once onboarding is complete.
      router.replace('/auth');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      // Offer recovery options if local persistence fails.
      Alert.alert(
        'Error',
        'Failed to save your progress. Please try again.',
        [
          {
            text: 'Try Again',
            onPress: handleComplete,
          },
          {
            text: 'Skip',
            onPress: () => router.replace('/auth'),
            style: 'cancel',
          },
        ]
      );
    }
  };

  // Render the onboarding slides and pass down the completion handler.
=======
import React from 'react';
import OnboardingScreen from '@/src/components/OnboardingScreen';
import { useOnboardingPageLogic } from '@/src/hooks/useOnboardingPageLogic';

export default function Onboarding() {
  const { handleComplete } = useOnboardingPageLogic();

>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
  return <OnboardingScreen onComplete={handleComplete} />;
}
