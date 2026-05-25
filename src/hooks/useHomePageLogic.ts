import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export const useHomePageLogic = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [forceRender, setForceRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setForceRender(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigateToSettings = () => {
    router.push('/settings');
  };

  return {
    isSignedIn,
    isLoaded,
    forceRender,
    handleNavigateToSettings,
  };
};
