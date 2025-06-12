import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

export default function ChatScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-bold text-gray-900">Chat</Text>
        <Text className="text-gray-600 mt-2">Topic: {topic}</Text>
      </View>
    </SafeAreaView>
  );
}
