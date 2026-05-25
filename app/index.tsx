import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import SplashScreen from '@/src/components/SplashScreen';
import { useIndexLogic } from '@/src/hooks/useIndexLogic';
import { ThemeColors } from '@/src/theme/colors';

export default function Index() {
  const {
    isLoaded,
    theme,
    showSplash,
    hasSeenOnboarding,
    handleSplashFinish,
  } = useIndexLogic();

  const styles = useMemo(() => getStyles(theme), [theme]);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} minimumDisplayTime={2000} />;
  }

  if (!isLoaded || hasSeenOnboarding === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.secondary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.secondary} />
      <Text style={styles.loadingText}>Redirecting...</Text>
    </View>
  );
}

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.secondary,
    fontWeight: '500',
  },
});
