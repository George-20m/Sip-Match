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
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/home" />;
  }

  return <ForgotPasswordScreen />;
}

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
});
