import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppWrapper } from '../src/components/layout/AppWrapper';
import '../src/utils/polyfills';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppWrapper>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: 'white' }
          }}
        >
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

          {/* Main app with initialization */}
          <Stack.Screen
            name="(tabs)"
            options={{
              gestureEnabled: false,
              animation: 'fade'
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

          {/* Other screens */}
          <Stack.Screen
            name="chat/[topic]"
            options={{
              gestureEnabled: true,
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="agent/[id]"
            options={{
              gestureEnabled: true,
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="agent/create"
            options={{
              gestureEnabled: true,
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="agent/marketplace"
            options={{
              gestureEnabled: true,
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="mini-app/[id]"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }}
          />
          <Stack.Screen
            name="event/[id]"
            options={{
              gestureEnabled: true,
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="map/index"
            options={{
              gestureEnabled: true,
              animation: 'slide_from_right'
            }}
          />
        </Stack>
        <StatusBar style="light" />
      </AppWrapper>
    </SafeAreaProvider>
  );
}