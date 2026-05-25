import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Animated,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useOnboardingScreenLogic } from '../hooks/useOnboardingScreenLogic';
import { getStyles } from './styles/OnboardingScreen.styles';


interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const {
    theme,
    isDark,
    currentIndex,
    fadeAnim,
    slideAnim,
    scaleAnim,
    handleNext,
    handleSkip,
    currentSlide,
    slides,
  } = useOnboardingScreenLogic(onComplete);

  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      
      {/* Background Decoration */}
      <View style={styles.backgroundDecor}>
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
        <View style={[styles.decorCircle, styles.decorCircle3]} />
      </View>

      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.contentWrapper}>
        <Animated.View
          style={[
            styles.slideContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Icon Container */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: currentSlide.accentColor },
            ]}
          >
            <View style={styles.iconInnerCircle}>
              <MaterialCommunityIcons
                name={currentSlide.icon as any}
                size={56}
                color={currentSlide.accentColor}
              />
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{currentSlide.title}</Text>
            <Text style={styles.description}>{currentSlide.description}</Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: currentIndex === index ? 24 : 8,
                  opacity: currentIndex === index ? 1 : 0.3,
                  backgroundColor: currentIndex === index ? theme.primary : theme.secondary,
                },
              ]}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={22} color={isDark ? theme.background : "#FFFFFF"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
