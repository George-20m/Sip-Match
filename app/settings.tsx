// Route wrapper for the account and profile settings screen.
import { useRouter } from 'expo-router';
import React from 'react';
import SettingsScreen from './components/SettingsScreen';

export default function Settings() {
  // Router is only needed here to return from the settings screen.
  const router = useRouter();

  // Navigate back to the previous route when the user exits settings.
  const handleBack = () => {
    router.back();
  };

  // Render the settings screen with a back handler.
  return <SettingsScreen onBack={handleBack} />;
}
