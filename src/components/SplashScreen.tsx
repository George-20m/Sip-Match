import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  Animated,
  Image,
  StatusBar,
  Text,
  View
} from 'react-native';
import { useSplashScreenLogic } from '../hooks/useSplashScreenLogic';
import { getStyles } from './styles/SplashScreen.styles';
import { Logger } from '@/src/utils/logger';

interface SplashScreenProps {
  onFinish: () => void;
  minimumDisplayTime?: number;
}

export default function SplashScreen({ 
  onFinish, 
  minimumDisplayTime = 3000 
}: SplashScreenProps) {
  const {
    theme,
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
  } = useSplashScreenLogic(onFinish, minimumDisplayTime);

  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <Image
        source={require('../../assets/images/SipMatchBackground.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        onError={(error) => {
          Logger.warn(`Failed to load splash background: ${error.nativeEvent.error}`, 'SplashScreen');
        }}
      />
      <View style={styles.overlay} />

      {/* Decorative Elements */}
      <View style={styles.topDecoration}>
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
      </View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUp }],
          },
        ]}
      >
        {/* Logo Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: scaleAnim }, { rotate: rotation }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <View style={styles.logoInnerCircle}>
              <MaterialCommunityIcons name="coffee" size={56} color={theme.secondary} />
            </View>
          </View>
        </Animated.View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Sip&Match</Text>
          <View style={styles.subtitleContainer}>
            <View style={styles.decorLine} />
            <Text style={styles.subtitle}>sip your mood, match your moment</Text>
            <View style={styles.decorLine} />
          </View>
        </View>

        {/* Loading Dots */}
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.dot,
              { opacity: dotAnim1, transform: [{ scale: dot1Scale }] },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { opacity: dotAnim2, transform: [{ scale: dot2Scale }] },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { opacity: dotAnim3, transform: [{ scale: dot3Scale }] },
            ]}
          />
        </View>
      </Animated.View>

      {/* Bottom Decoration */}
      <View style={styles.bottomDecoration}>
        <View style={styles.waveShape} />
      </View>
    </View>
  );
}
