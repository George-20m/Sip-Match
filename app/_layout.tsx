// App root layout that wires Clerk auth, Convex, and the top-level Expo Router stack.
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
<<<<<<< HEAD
=======
import { ThemeProvider } from "@/src/theme/ThemeContext";
import { Logger } from "@/src/utils/logger";
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09

// Create one shared Convex client for the full app lifecycle.
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

// Persist Clerk session tokens securely so sign-in state survives app restarts.
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
<<<<<<< HEAD
      console.error("SecureStore get error:", err);
=======
      Logger.error("Failed to retrieve token from SecureStore", "tokenCache.getToken", err);
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
<<<<<<< HEAD
      console.error("SecureStore save error:", err);
=======
      Logger.error("Failed to save token to SecureStore", "tokenCache.saveToken", err);
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
    }
  },
};

export default function RootLayout() {
  // Read the Clerk publishable key from Expo env during startup.
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  // Fail fast if the app is missing its Clerk configuration.
  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env.local"
    );
  }

  return (
    // Provide Clerk auth state to the complete Expo Router tree.
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {/* Attach Convex requests to the current Clerk auth session. */}
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
<<<<<<< HEAD
        {/* Register the top-level routes and hide native headers. */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="forgot-password" />  {/* ADD THIS LINE */}
          <Stack.Screen name="home" />
        </Stack>
=======
        <ThemeProvider>
          {/* Register the top-level routes and hide native headers. */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="home" />
          </Stack>
        </ThemeProvider>
>>>>>>> a42ee00cba98587dbf889ac8f43e7e38e3232f09
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
