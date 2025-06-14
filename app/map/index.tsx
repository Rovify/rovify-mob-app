import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function MapScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900 flex-1">Event Map</Text>
                <TouchableOpacity>
                    <Ionicons name="options" size={24} color="#F97316" />
                </TouchableOpacity>
            </View>

            {/* Map Placeholder */}
            <View className="flex-1 bg-gray-100 items-center justify-center">
                <Ionicons name="map" size={64} color="#9CA3AF" />
                <Text className="text-xl font-bold text-gray-900 mt-4">Interactive Map</Text>
                <Text className="text-gray-600 mt-2 text-center px-8">
                    Discover events near you with our interactive map feature
                </Text>
                <View className="bg-orange-100 px-6 py-3 rounded-full mt-6">
                    <Text className="text-orange-600 font-semibold">Coming Soon</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}