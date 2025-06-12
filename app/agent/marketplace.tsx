import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Agent {
    id: string;
    name: string;
    description: string;
    category: string;
    price: string;
    rating: number;
    users: number;
    image: string;
    creator: string;
}

export default function AgentMarketplaceScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Trading', 'Assistant', 'Gaming', 'Social', 'Utility'];

    const agents: Agent[] = [
        {
            id: '1',
            name: 'DeFi Master Trader',
            description: 'Advanced trading strategies for DeFi protocols',
            category: 'Trading',
            price: '0.05 ETH',
            rating: 4.8,
            users: 1200,
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100',
            creator: 'CryptoGuru'
        },
        {
            id: '2',
            name: 'Event Coordinator Pro',
            description: 'Manages events, RSVPs, and logistics automatically',
            category: 'Assistant',
            price: 'Free',
            rating: 4.6,
            users: 890,
            image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100',
            creator: 'EventMaster'
        },
        {
            id: '3',
            name: 'Social Media Manager',
            description: 'Automates social media posting and engagement',
            category: 'Social',
            price: '0.02 ETH',
            rating: 4.7,
            users: 2300,
            image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100',
            creator: 'SocialBot'
        }
    ];

    const renderAgentCard = ({ item }: { item: Agent }) => (
        <TouchableOpacity
            onPress={() => router.push(`/agent/${item.id}`)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4"
        >
            <View className="flex-row items-start">
                <Image
                    source={{ uri: item.image }}
                    className="w-16 h-16 rounded-xl mr-4"
                    resizeMode="cover"
                />

                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="font-bold text-gray-900 text-lg flex-1" numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Text className="text-orange-600 font-bold ml-2">{item.price}</Text>
                    </View>

                    <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
                        {item.description}
                    </Text>

                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Ionicons name="star" size={14} color="#F59E0B" />
                            <Text className="text-yellow-600 font-medium text-sm ml-1">{item.rating}</Text>
                            <Text className="text-gray-500 text-sm ml-2">• {item.users} users</Text>
                        </View>

                        <View className="bg-gray-100 px-2 py-1 rounded-full">
                            <Text className="text-gray-700 text-xs font-medium">{item.category}</Text>
                        </View>
                    </View>

                    <Text className="text-gray-500 text-xs mt-2">by {item.creator}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-6 py-4 border-b border-gray-100">
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900 flex-1">AI Agent Marketplace</Text>
                    <TouchableOpacity onPress={() => router.push('/agent/create')}>
                        <Ionicons name="add-circle" size={24} color="#F97316" />
                    </TouchableOpacity>
                </View>

                {/* Search */}
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
                    <Ionicons name="search" size={20} color="#6B7280" />
                    <TextInput
                        placeholder="Search agents..."
                        className="flex-1 ml-3 text-gray-900"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Categories */}
            <View className="bg-white px-6 py-4 border-b border-gray-100">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row space-x-3">
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                onPress={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full ${selectedCategory === category ? 'bg-orange-500' : 'bg-gray-100'
                                    }`}
                            >
                                <Text className={`font-medium ${selectedCategory === category ? 'text-white' : 'text-gray-700'
                                    }`}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Agents List */}
            <FlatList
                data={agents}
                renderItem={renderAgentCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 24 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}