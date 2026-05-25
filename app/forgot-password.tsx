<<<<<<< HEAD
// Public route wrapper for the password reset screen.
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';

export default function ForgotPassword() {
  // Read auth state so signed-in users do not enter the password reset flow.
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for Clerk auth to load before deciding what this route should show.
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8D6E63" />
=======
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import ForgotPasswordScreen from '@/src/components/ForgotPasswordScreen';
import { useTheme } from '@/src/theme/ThemeContext';
import { ThemeColors } from '@/src/theme/colors';

export default function ForgotPassword() {
  const { isSignedIn, isLoaded } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.secondary} />
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
      </View>
    );
  }

<<<<<<< HEAD
  // Redirect authenticated users back to the home route.
=======
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
  if (isSignedIn) {
    return <Redirect href="/home" />;
  }

<<<<<<< HEAD
  // Render the password recovery experience for guests.
  return <ForgotPasswordScreen />;
}

const styles = StyleSheet.create({
=======
  return <ForgotPasswordScreen />;
}

const getStyles = (theme: ThemeColors) => StyleSheet.create({
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
    backgroundColor: '#FFFAF0',
=======
    backgroundColor: theme.background,
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
  },
});
