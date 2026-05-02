// Public route wrapper for the authentication screen.
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AuthScreen from './components/AuthScreen';

export default function Auth() {
  // Read Clerk auth state to decide whether this public route should remain visible.
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for Clerk to restore any existing session before rendering auth UI.
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8D6E63" />
      </View>
    );
  }

  // Redirect authenticated users away from the auth screen.
  if (isSignedIn) {
    return <Redirect href="/home" />;
  }

  // Render the sign-in and sign-up experience for guests.
  return <AuthScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAF0',
  },
});
