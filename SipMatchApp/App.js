// App.js
import React, { useState } from 'react';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userData, setUserData] = useState(null);

  // Handle successful authentication
  const handleAuthSuccess = (user) => {
    setUserData(user);
    setIsAuthenticated(true);
    setShowForgotPassword(false); // Reset in case they came from forgot password
  };

  // Handle forgot password navigation
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  // Handle back from forgot password
  const handleBackToAuth = () => {
    setShowForgotPassword(false);
  };

  // Handle navigation from HomeScreen
  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    console.log('Navigate to:', screen);
  };

  // Handle mood recommendation
  const handleGetRecommendation = (mood) => {
    console.log('Get recommendation for mood:', mood);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(true)} />;
  }

  if (!isAuthenticated) {
    // Show Forgot Password Screen if user clicked "Forgot Password"
    if (showForgotPassword) {
      return <ForgotPasswordScreen onBack={handleBackToAuth} />;
    }
    
    // Show Auth Screen with forgot password handler
    return (
      <AuthScreen 
        onAuthSuccess={handleAuthSuccess}
        onForgotPassword={handleForgotPassword}
      />
    );
  }

  // User is authenticated, show HomeScreen
  return (
    <HomeScreen 
      userName={userData?.username || 'User'}
      onGetRecommendation={handleGetRecommendation}
      onNavigate={handleNavigate}
    />
  );
}