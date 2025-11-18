// App.js
import React, { useState } from 'react';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userData, setUserData] = useState(null);

  // Handle successful authentication
  const handleAuthSuccess = (user) => {
    console.log('✅ User authenticated:', user);
    setUserData(user);
    setIsAuthenticated(true);
    setShowForgotPassword(false);
    setShowVerification(false);
    setCurrentScreen('home'); // Reset to home on login
  };

  // Handle forgot password navigation
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setShowVerification(false);
  };

  // Handle show verification screen
  const handleShowVerification = (data) => {
    setVerificationData(data);
    setShowVerification(true);
    setShowForgotPassword(false);
  };

  // Handle back to auth
  const handleBackToAuth = () => {
    setShowForgotPassword(false);
    setShowVerification(false);
  };

  // Handle navigation from HomeScreen
  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    console.log('Navigate to:', screen);
  };

  // Handle back from settings
  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setCurrentScreen('home');
    console.log('User logged out');
  };

  // Handle mood recommendation
  const handleGetRecommendation = (mood) => {
    console.log('Get recommendation for mood:', mood);
    // TODO: Navigate to recommendation screen or show modal
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(true)} />;
  }

  if (!isAuthenticated) {
    // Show Email Verification Screen
    if (showVerification && verificationData) {
      return (
        <EmailVerificationScreen
          email={verificationData.email}
          username={verificationData.username}
          password={verificationData.password}
          onVerificationSuccess={handleAuthSuccess}
          onBack={handleBackToAuth}
        />
      );
    }

    // Show Forgot Password Screen
    if (showForgotPassword) {
      return <ForgotPasswordScreen onBack={handleBackToAuth} />;
    }
    
    // Show Auth Screen
    return (
      <AuthScreen 
        onAuthSuccess={handleAuthSuccess}
        onForgotPassword={handleForgotPassword}
        onShowVerification={handleShowVerification}
      />
    );
  }

  // User is authenticated - show different screens based on navigation
  switch (currentScreen) {
    case 'settings':
      return (
        <SettingsScreen 
          onBack={handleBackToHome}
          onLogout={handleLogout}
          userData={userData}
        />
      );
    
    case 'favorites':
      // TODO: Create FavoritesScreen
      console.log('Favorites screen not implemented yet');
      return (
        <HomeScreen 
          userName={userData?.username || 'User'}
          onGetRecommendation={handleGetRecommendation}
          onNavigate={handleNavigate}
        />
      );
    
    case 'history':
      // TODO: Create HistoryScreen
      console.log('History screen not implemented yet');
      return (
        <HomeScreen 
          userName={userData?.username || 'User'}
          onGetRecommendation={handleGetRecommendation}
          onNavigate={handleNavigate}
        />
      );
    
    case 'home':
    default:
      return (
        <HomeScreen 
          userName={userData?.username || 'User'}
          onGetRecommendation={handleGetRecommendation}
          onNavigate={handleNavigate}
        />
      );
  }
}