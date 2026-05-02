// Protected route wrapper for browsing the drink catalog.
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import DrinksListScreen from './components/DrinksListScreen';

export default function Drinks() {
  // Track auth state, current user data, and a timeout guard for route startup.
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [forceRender, setForceRender] = useState(false);

  // Force rendering after a short delay if auth loading appears stuck.
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('⚠️ Drinks page timeout - forcing render');
      setForceRender(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Log auth state while debugging access to the drinks route.
  useEffect(() => {
    console.log('Drinks.tsx - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);
  }, [isLoaded, isSignedIn]);

  // Show a loading screen until the protected route can be safely resolved.
  if (!isLoaded && !forceRender) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8D6E63" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Redirect guests away from the protected drinks catalog.
  if (!isSignedIn && isLoaded) {
    console.log('Drinks.tsx - User NOT signed in, redirecting to auth');
    return <Redirect href="/auth" />;
  }

  // Return to the previous route when leaving the drinks screen.
  const handleBack = () => {
    router.back();
  };

  // Render the drink catalog for the current signed-in user.
  return <DrinksListScreen onBack={handleBack} userId={user?.id} />;
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
