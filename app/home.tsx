<<<<<<< HEAD
// Protected route wrapper for the main home experience.
import { useAuth } from '@clerk/clerk-expo';
import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import HomeScreen from './components/HomeScreen';

export default function Home() {
  // Track auth state and keep a timeout guard for stuck protected-route loading.
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [forceRender, setForceRender] = useState(false);

  // Force rendering after a short delay if auth loading appears stuck.
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⚠️ Home page timeout - forcing render');
      setForceRender(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Log auth state while debugging access to the protected home route.
  useEffect(() => {
    console.log('Home.tsx - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);
  }, [isLoaded, isSignedIn]);

  // Show a loading screen until Clerk auth resolves or the timeout guard fires.
=======
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import HomeScreen from '@/src/components/HomeScreen';
import { useHomePageLogic } from '@/src/hooks/useHomePageLogic';

export default function Home() {
  const {
    isSignedIn,
    isLoaded,
    forceRender,
    handleNavigateToSettings,
  } = useHomePageLogic();

>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
  if (!isLoaded && !forceRender) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8D6E63" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

<<<<<<< HEAD
  // Redirect guests away from the protected home route.
  if (!isSignedIn && isLoaded) {
    console.log('Home.tsx - User NOT signed in, redirecting to auth');
    return <Redirect href="/auth" />;
  }

  // Open the settings route from the main home experience.
  const handleNavigateToSettings = () => {
    router.push('/settings');
  };

  // Render the main signed-in home screen.
=======
  if (!isSignedIn && isLoaded) {
    return <Redirect href="/auth" />;
  }

>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
  return <HomeScreen onNavigateToSettings={handleNavigateToSettings} />;
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
