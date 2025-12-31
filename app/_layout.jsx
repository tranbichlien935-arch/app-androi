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

    // Show welcome screen on first launch
    if (!hasSeenWelcome && !inWelcome) {
      router.replace('/welcome');
      return;
    }

    if (!isAuthenticated && inAuthGroup) {
      // Redirect to sign-in if not authenticated
      router.replace('/sign-in');
    } else if (isAuthenticated && !inAuthGroup && !inWelcome) {
      // Redirect to tabs if authenticated
      router.replace('/(tabs)');
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
