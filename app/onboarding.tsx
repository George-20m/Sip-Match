import React from 'react';
import OnboardingScreen from '@/src/components/OnboardingScreen';
import { useOnboardingPageLogic } from '@/src/hooks/useOnboardingPageLogic';

export default function Onboarding() {
  const { handleComplete } = useOnboardingPageLogic();

  return <OnboardingScreen onComplete={handleComplete} />;
}
