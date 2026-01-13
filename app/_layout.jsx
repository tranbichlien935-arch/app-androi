import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [hasSeenWelcome, setHasSeenWelcome] = useState(null);

  // Check if user has seen welcome screen
  useEffect(() => {
    const checkWelcomeStatus = async () => {
      try {
        // DEV MODE: Uncomment to reset welcome screen on every launch
        // await AsyncStorage.removeItem('hasSeenWelcome');

        const value = await AsyncStorage.getItem('hasSeenWelcome');
        console.log('hasSeenWelcome value:', value); // Debug log
        setHasSeenWelcome(value === 'true');
      } catch (error) {
        console.error('Error checking welcome status:', error);
        setHasSeenWelcome(true); // Default to true on error
      }
    };
    checkWelcomeStatus();
  }, []);

  useEffect(() => {
    if (loading || hasSeenWelcome === null) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inWelcome = segments[0] === 'welcome';
    const inSignIn = segments[0] === 'sign-in';
    const inSignUp = segments[0] === 'sign-up';

    console.log('Navigation Debug:', {
      hasSeenWelcome,
      isAuthenticated,
      currentSegment: segments[0],
      inWelcome,
      inSignIn,
      inSignUp,
      inAuthGroup
    });

    // Priority 1: Show welcome screen on first launch
    if (!hasSeenWelcome && !inWelcome && !inSignIn && !inSignUp) {
      console.log('Redirecting to welcome screen');
      router.replace('/welcome');
      return;
    }

    // Priority 2: Redirect to sign-in if not authenticated and trying to access protected routes
    if (!isAuthenticated && inAuthGroup) {
      console.log('Redirecting to sign-in (not authenticated)');
      router.replace('/sign-in');
      return;
    }

    // Priority 3: Redirect to tabs if authenticated and on auth pages
    if (isAuthenticated && (inSignIn || inSignUp || inWelcome)) {
      console.log('Redirecting to tabs (already authenticated)');
      router.replace('/(tabs)');
      return;
    }
  }, [isAuthenticated, loading, segments, hasSeenWelcome]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
