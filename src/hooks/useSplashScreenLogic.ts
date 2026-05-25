import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const useSplashScreenLogic = (onFinish: () => void, minimumDisplayTime: number = 3000) => {
  const { theme, isDark } = useTheme();

  // Animation values with useRef to prevent re-creation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;
  const dotAnim1 = useRef(new Animated.Value(0)).current;
  const dotAnim2 = useRef(new Animated.Value(0)).current;
  const dotAnim3 = useRef(new Animated.Value(0)).current;
  
  // Refs for proper cleanup
  const dotAnimationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    startEntranceAnimation();
    startLogoRotation();
    
    dotAnimationRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        animateDots();
      }
    }, 800);
    
    finishTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        handleFinish();
      }
    }, minimumDisplayTime);
    
    return () => {
      isMountedRef.current = false;
      
      if (dotAnimationRef.current) {
        clearTimeout(dotAnimationRef.current);
      }
      if (finishTimeoutRef.current) {
        clearTimeout(finishTimeoutRef.current);
      }
      
      fadeAnim.stopAnimation();
      scaleAnim.stopAnimation();
      logoRotate.stopAnimation();
      slideUp.stopAnimation();
      dotAnim1.stopAnimation();
      dotAnim2.stopAnimation();
      dotAnim3.stopAnimation();
    };
  }, []);

  const startEntranceAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startLogoRotation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const animateDots = () => {
    if (!isMountedRef.current) return;
    
    Animated.sequence([
      Animated.timing(dotAnim1, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(dotAnim2, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(dotAnim3, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(dotAnim1, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim2, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim3, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      if (isMountedRef.current) {
        animateDots();
      }
    });
  };

  const handleFinish = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      if (isMountedRef.current && onFinish) {
        onFinish();
      }
    });
  };

  const rotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  const dot1Scale = dotAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const dot2Scale = dotAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const dot3Scale = dotAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  return {
    theme,
    isDark,
    fadeAnim,
    scaleAnim,
    rotation,
    slideUp,
    dotAnim1,
    dotAnim2,
    dotAnim3,
    dot1Scale,
    dot2Scale,
    dot3Scale,
  };
};
