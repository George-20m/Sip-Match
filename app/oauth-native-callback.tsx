// Lightweight native callback route used during Clerk OAuth sign-in flows.
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function OAuthCallback() {
  useEffect(() => {
    // No manual logic is needed here because Clerk processes the OAuth callback automatically.
    // This route simply gives the native redirect a valid in-app screen target.
  }, []);

  // Show a neutral loading state while the auth callback is being resolved.
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#8D6E63" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAF0',
  },
});
