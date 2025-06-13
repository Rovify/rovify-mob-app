import '../global.css';

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from '../src/hooks/useFonts';
import { initializeStores } from '../src/store';
import '../src/utils/polyfills';

export default function RootLayout() {
  const { fontsLoaded, fontError } = useFonts();
  const [storesInitialized, setStoresInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeStores();
        setStoresInitialized(true);
      } catch (error) {
        console.error('Failed to initialize stores:', error);
        setStoresInitialized(true); // Continue anyway
      }
    };

    if (fontsLoaded) {
      initialize();
    }
  }, [fontsLoaded]);

  // Show loading screen while initializing
  if (!fontsLoaded || !storesInitialized) {
    return (
      <SafeAreaProvider>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F97316'
        }}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{
            color: 'white',
            marginTop: 16,
            fontSize: 16,
            fontWeight: '500'
          }}>
            {!fontsLoaded ? 'Loading fonts...' : 'Initializing...'}
          </Text>
        </View>
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right'
        }}
      >
        {/* Initial flow */}
        <Stack.Screen name="index" />
        <Stack.Screen
          name="splash"
          options={{
            gestureEnabled: false,
            animation: 'fade'
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            gestureEnabled: false,
            animation: 'slide_from_right'
          }}
        />

        {/* Auth flow */}
        <Stack.Screen
          name="auth/connect"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }}
        />

        {/* Main app */}
        <Stack.Screen
          name="(tabs)"
          options={{
            gestureEnabled: false,
            animation: 'fade'
          }}
        />

        {/* Other screens */}
        <Stack.Screen name="chat/[topic]" />
        <Stack.Screen name="agent/[id]" />
        <Stack.Screen
          name="mini-app/[id]"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }}
        />
        <Stack.Screen name="event/[id]" />
        <Stack.Screen name="map/index" />

        <Stack.Screen name="auth/connect" options={{ presentation: 'modal' }} />
        {/* <Stack.Screen name="chat/[topic]" options={{ gestureEnabled: true }} />
          <Stack.Screen name="agent/[id]" options={{ gestureEnabled: true }} />
          <Stack.Screen name="agent/marketplace" options={{ gestureEnabled: true }} />
          <Stack.Screen name="mini-app/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="event/[id]" options={{ gestureEnabled: true }} />
          <Stack.Screen name="map/index" options={{ gestureEnabled: true }} /> */}
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}