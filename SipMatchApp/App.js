// App.js
import React, { useState } from 'react';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingScreen';
import RecommendationScreen from './src/screens/RecommendationScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import HistoryScreen from './src/screens/HistoryScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userData, setUserData] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);

  // Handle successful authentication
  const handleAuthSuccess = (user) => {
    console.log('✅ User authenticated:', user);
    setUserData(user);
    setIsAuthenticated(true);
    setShowForgotPassword(false);
    setShowVerification(false);
    setCurrentScreen('home'); // Reset to home on login
  };

  // Handle user data updates (like username changes)
  const handleUpdateUserData = (updatedUser) => {
    console.log('🔄 Updating user data:', updatedUser);
    setUserData(updatedUser);
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

  // Handle back to home from any screen
  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedMood(null); // Clear selected mood when going back
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setCurrentScreen('home');
    setSelectedMood(null);
    console.log('User logged out');
  };

  // Handle mood recommendation
  const handleGetRecommendation = (mood) => {
    console.log('Get recommendation for mood:', mood);
    setSelectedMood(mood);
    setCurrentScreen('recommendation');
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
          onUpdateUserData={handleUpdateUserData}
        />
      );
    
    case 'recommendation':
      return (
        <RecommendationScreen
          mood={selectedMood}
          onBack={handleBackToHome}
        />
      );
    
    case 'favorites':
      return (
        <FavoritesScreen 
          onBack={handleBackToHome}
        />
      );
    
    case 'history':
      return (
        <HistoryScreen 
          onBack={handleBackToHome}
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