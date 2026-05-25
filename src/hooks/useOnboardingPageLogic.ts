import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { Logger } from '@/src/utils/logger';

const ONBOARDING_KEY = '@sip_match_onboarding_complete';

export const useOnboardingPageLogic = () => {
  const router = useRouter();

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      router.replace('/auth');
    } catch (error) {
      Logger.error('Failed to save onboarding completion status', 'useOnboardingPageLogic', error);
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

  return {
    handleComplete,
  };
};
