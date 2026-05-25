import { useTheme } from '../theme/ThemeContext';
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export const useOnboardingScreenLogic = (onComplete: () => void) => {
  const { theme, isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMountedRef = useRef(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      fadeAnim.stopAnimation();
      slideAnim.stopAnimation();
      scaleAnim.stopAnimation();
    };
  }, []);

  const animateSlideTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!isMountedRef.current) return;

      callback();

      slideAnim.setValue(30);
      scaleAnim.setValue(0.95);

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
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      animateSlideTransition(() => {
        if (isMountedRef.current) {
          setCurrentIndex((prev) => prev + 1);
        }
      });
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (isMountedRef.current && onComplete) {
        onComplete();
      }
    });
  };

  const handleSkip = () => {
    handleComplete();
  };

  const slides = [
    {
      icon: 'heart-outline',
      title: 'Discover drinks that match your mood',
      description: "Whether you're happy, calm, or energetic, we'll find the perfect drink for you.",
      accentColor: '#D4A373',
    },
    {
      icon: 'weather-partly-cloudy',
      title: 'Sync with your music and weather',
      description: "Get personalized recommendations based on what you're listening to and the weather outside.",
      accentColor: '#C8956E',
    },
    {
      icon: 'music-note-outline',
      title: 'Save favorites and share with friends',
      description: 'Build your collection of favorite drinks and share your discoveries.',
      accentColor: '#B88359',
    },
  ];

  const currentSlide = slides[currentIndex];

  return {
    theme,
    isDark,
    currentIndex,
    setCurrentIndex,
    isMountedRef,
    fadeAnim,
    slideAnim,
    scaleAnim,
    animateSlideTransition,
    handleNext,
    handleComplete,
    handleSkip,
    currentSlide,
    slides,
  };
};