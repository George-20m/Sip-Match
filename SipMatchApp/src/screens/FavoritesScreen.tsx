// SipMatchApp/src/screens/FavoritesScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../theme/FavoritesScreenTheme';

interface FavoritesScreenProps {
  onBack: () => void;
}

const COLORS = {
  background: '#FFF8E7',
  foreground: '#3E2723',
  card: '#ffffff',
  primary: '#8B4513',
  primaryForeground: '#ffffff',
  secondary: '#F5E6D3',
  mutedForeground: '#8D6E63',
  border: 'rgba(139, 69, 19, 0.15)',
};

export default function FavoritesScreen({ onBack }: FavoritesScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.card} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Content Card */}
        <View style={styles.card}>
          <View style={styles.contentCenter}>
            <Text style={styles.emoji}>❤️</Text>
            <Text style={styles.title}>Your Favorites</Text>
            <Text style={styles.subtitle}>Save your favorite drinks here</Text>
            <Text style={styles.comingSoon}>Coming Soon!</Text>
          </View>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>Sip&Match v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}