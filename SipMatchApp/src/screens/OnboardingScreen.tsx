import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'heart-outline',
    title: 'Discover drinks that match your mood',
    description: "Whether you're happy, calm, or energetic, we'll find the perfect drink for you.",
    colors: ['#FFF8E7', '#F5E6D3'] as const,
    circleColors: ['#FFB6C1', '#FFA07A'] as const,
  },
  {
    icon: 'weather-partly-cloudy',
    title: 'Sync with your music and weather',
    description: 'Get personalized recommendations based on what you\'re listening to and the weather outside.',
    colors: ['#FFF8E7', '#F5E6D3'] as const,
    circleColors: ['#87CEEB', '#98D8C8'] as const,
  },
  {
    icon: 'music-note-outline',
    title: 'Save favorites and share with friends',
    description: 'Build your collection of favorite drinks and share your discoveries.',
    colors: ['#FFF8E7', '#F5E6D3'] as const,
    circleColors: ['#DDA0DD', '#F0E68C'] as const,
  },
];

export default function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (current < slides.length - 1) {
      // Start exit animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 130,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 130,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Change slide
        setCurrent(prev => prev + 1);
        
        // Reset position for entry
        slideAnim.setValue(50);
        
        // Start entry animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      onComplete();
    }
  };

  return (
    <LinearGradient colors={slides[current].colors} style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slide Content with Animation */}
      <Animated.View 
        style={[
          styles.slideContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <LinearGradient
            colors={slides[current].circleColors}
            style={styles.circleBackground}
          >
            <MaterialCommunityIcons
              name={slides[current].icon as any}
              size={65}
              color="#fff"
            />
          </LinearGradient>
        </View>
        <Text style={styles.title}>{slides[current].title}</Text>
        <Text style={styles.description}>{slides[current].description}</Text>
      </Animated.View>

      {/* Pagination */}
      <View style={styles.pagination}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                opacity: current === i ? 1 : 0.4,
                width: current === i ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>
          {current === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 25,
  },
  skipText: {
    color: '#6B4E2E',
    fontWeight: '500',
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#4B2E05',
    textAlign: 'center',
    marginTop: 20,
  },
  description: {
    color: '#6B4E2E',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B4513',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    borderRadius: 30,
    paddingHorizontal: 120,
    paddingVertical: 12,
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 5,
  },
  iconCircle: {
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBackground: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});