// Route wrapper for the account and profile settings screen.
import { useRouter } from 'expo-router';
import React from 'react';
<<<<<<< HEAD
import SettingsScreen from './components/SettingsScreen';
=======
import SettingsScreen from '@/src/components/SettingsScreen';
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09

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
