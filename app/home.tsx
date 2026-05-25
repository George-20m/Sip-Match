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

  if (!isLoaded && !forceRender) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8D6E63" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!isSignedIn && isLoaded) {
    return <Redirect href="/auth" />;
  }

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
