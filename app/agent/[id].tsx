import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

export default function AgentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-bold text-gray-900">Agent Details</Text>
        <Text className="text-gray-600 mt-2">Agent ID: {id}</Text>
      </View>
    </SafeAreaView>
  );
}
