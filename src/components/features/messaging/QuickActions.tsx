import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const quickActions = [
    {
        id: 'find_events',
        title: 'Find Events',
        subtitle: 'AI suggestions',
        icon: 'search-outline',
        color: 'bg-blue-500',
        action: () => router.push('/cast/ai?prompt=find_events'),
    },
    {
        id: 'split_payment',
        title: 'Split Payment',
        subtitle: 'Crypto payments',
        icon: 'card-outline',
        color: 'bg-green-500',
        action: () => router.push('/cast/ai?prompt=split_payment'),
    },
    {
        id: 'group_plan',
        title: 'Plan Together',
        subtitle: 'Group coordination',
        icon: 'people-outline',
        color: 'bg-purple-500',
        action: () => router.push('/cast/ai?prompt=group_plan'),
    },
    {
        id: 'buy_tickets',
        title: 'Buy Tickets',
        subtitle: 'NFT tickets',
        icon: 'ticket-outline',
        color: 'bg-orange-500',
        action: () => router.push('/cast/ai?prompt=buy_tickets'),
    },
];

export const QuickActions: React.FC = () => {
    return (
        <View className="px-4 pb-4">
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold text-gray-900">Quick Actions</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
            >
                {quickActions.map((action) => (
                    <TouchableOpacity
                        key={action.id}
                        onPress={action.action}
                        className="mr-3 w-32"
                        activeOpacity={0.8}
                    >
                        <View className={`${action.color} rounded-xl p-4 mb-2`}>
                            <Ionicons name={action.icon as any} size={24} color="white" />
                        </View>
                        <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
                            {action.title}
                        </Text>
                        <Text className="text-xs text-gray-600" numberOfLines={1}>
                            {action.subtitle}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};