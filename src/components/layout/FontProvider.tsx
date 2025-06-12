// src/components/layout/FontProvider.tsx
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from '../../hooks/useFonts';

// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

interface FontProviderProps {
  children: ReactNode;
}

export const FontProvider: React.FC<FontProviderProps> = ({ children }) => {
  const { fontsLoaded, fontError } = useFonts();

  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (fontError) {
    console.warn('Font loading error:', fontError);
    // Still render the app with system fonts
  }

  if (!fontsLoaded && !fontError) {
    // Return null while fonts are loading
    return null;
  }

  return <>{children}</>;
};

// Loading component for when fonts are still loading
export const FontLoadingView: React.FC = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Loading Rovify...</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
  },
});

export default FontProvider;
