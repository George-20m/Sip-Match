// Public route wrapper for the authentication screen.
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
<<<<<<< HEAD
import AuthScreen from './components/AuthScreen';
=======
import AuthScreen from '@/src/components/AuthScreen';
import { useTheme } from '@/src/theme/ThemeContext';
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09

export default function Auth() {
  // Read Clerk auth state to decide whether this public route should remain visible.
  const { isSignedIn, isLoaded } = useAuth();
<<<<<<< HEAD
=======
  const { theme } = useTheme();
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09

  // Wait for Clerk to restore any existing session before rendering auth UI.
  if (!isLoaded) {
    return (
<<<<<<< HEAD
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8D6E63" />
=======
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.secondary} />
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
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
<<<<<<< HEAD
    backgroundColor: '#FFFAF0',
=======
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
  },
});
