import { Redirect } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import DrinksListScreen from '@/src/components/DrinksListScreen';
import { useDrinksPageLogic } from '@/src/hooks/useDrinksPageLogic';
import { ThemeColors } from '@/src/theme/colors';

export default function Drinks() {
  const {
    isSignedIn,
    isLoaded,
    user,
    theme,
    forceRender,
    handleBack,
  } = useDrinksPageLogic();

  const styles = useMemo(() => getStyles(theme), [theme]);

  if (!isLoaded && !forceRender) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.secondary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!isSignedIn && isLoaded) {
    return <Redirect href="/auth" />;
  }

  return <DrinksListScreen onBack={handleBack} userId={user?.id} />;
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
