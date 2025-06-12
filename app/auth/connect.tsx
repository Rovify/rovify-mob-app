import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { WalletConnect } from '@/components/features/auth/WalletConnect';

export default function ConnectScreen() {
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/explore');
    }
  }, [isAuthenticated]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 20
        }}
      >
        <WalletConnect />
      </ScrollView>
    </SafeAreaView>
  );
}