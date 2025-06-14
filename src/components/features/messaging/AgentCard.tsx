import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface AgentCardProps {
    agent: {
        id: string;
        name: string;
        type: string;
        description: string;
        icon: string;
        isActive: boolean;
    };
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
    const handlePress = () => {
        router.push(`/agent/${agent.id}`);
    };

    const getIconName = (type: string) => {
        switch (type) {
            case 'event_coordinator': return 'calendar-outline';
            case 'payment_splitter': return 'card-outline';
            case 'discovery_assistant': return 'search-outline';
            default: return 'sparkles-outline';
        }
    };

    const getGradientColors = (type: string) => {
        switch (type) {
            case 'event_coordinator': return 'from-blue-500 to-indigo-600';
            case 'payment_splitter': return 'from-green-500 to-emerald-600';
            case 'discovery_assistant': return 'from-purple-500 to-violet-600';
            default: return 'from-orange-500 to-red-600';
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className={`bg-gradient-to-br ${getGradientColors(agent.type)} rounded-xl p-4 mr-3 min-w-48`}
            activeOpacity={0.8}
        >
            <View className="flex-row items-center mb-3">
                <View className="bg-white/20 rounded-full p-2 mr-3">
                    <Ionicons name={getIconName(agent.type) as any} size={20} color="white" />
                </View>
                <View className="flex-1">
                    <Text className="text-white font-semibold">{agent.name}</Text>
                    <Text className="text-white/80 text-xs capitalize">
                        {agent.type.replace('_', ' ')}
                    </Text>
                </View>
                {agent.isActive && (
                    <View className="w-2 h-2 bg-green-400 rounded-full" />
                )}
            </View>

            <Text className="text-white/90 text-sm" numberOfLines={2}>
                {agent.description}
            </Text>

            <View className="flex-row items-center mt-3">
                <View className="bg-white/20 rounded-full px-3 py-1">
                    <Text className="text-white text-xs">Tap to chat</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};