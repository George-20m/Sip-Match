// App.js
import React, { useState } from 'react';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userData, setUserData] = useState(null); // Store user data

  // Handle successful authentication
  const handleAuthSuccess = (user) => {
    setUserData(user); // Save user data (includes username)
    setIsAuthenticated(true);
  };

  // Handle navigation from HomeScreen
  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
    // You can expand this later for different screens
    console.log('Navigate to:', screen);
  };

  // Handle mood recommendation
  const handleGetRecommendation = (mood) => {
    console.log('Get recommendation for mood:', mood);
    // Navigate to recommendation screen or show modal
    // You'll implement this later
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(true)} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // User is authenticated, show HomeScreen with user data
  return (
    <HomeScreen 
      userName={userData?.username || 'User'} // Pass username to HomeScreen
      onGetRecommendation={handleGetRecommendation}
      onNavigate={handleNavigate}
    />
  );
}