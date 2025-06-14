import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function MiniAppScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900 flex-1">Mini App</Text>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={24} color="#6B7280" />
                </TouchableOpacity>
            </View>

            {/* Mini App Content */}
            <View className="flex-1 items-center justify-center px-8">
                <Ionicons name="apps" size={64} color="#F97316" />
                <Text className="text-2xl font-bold text-gray-900 mt-4">Mini App {id}</Text>
                <Text className="text-gray-600 mt-2 text-center">
                    Interactive mini-applications will load here
                </Text>

                <View className="bg-orange-100 px-6 py-3 rounded-full mt-8">
                    <Text className="text-orange-600 font-semibold">Loading Mini App...</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}