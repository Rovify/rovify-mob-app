import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useMessaging } from '../../src/hooks/useMessaging';
import { CreateBottomSheet } from '../../src/components/features/create/CreateBottomSheet';
import { CustomHeader } from '@/components/layout/Header';

type TabType = 'rooms' | 'groups' | 'friends';

export default function EchoScreen() {
    const [activeTab, setActiveTab] = useState<TabType>('rooms');
    const [showCreateSheet, setShowCreateSheet] = useState(false);

    const { isAuthenticated, connectWallet } = useAuth();
    const {
        conversations,
        isConnecting,
        error,
        refreshConversations
    } = useMessaging();

    // Filter conversations based on active tab
    const filteredConversations = conversations.filter(conv => {
        switch (activeTab) {
            case 'rooms':
                return conv.metadata?.type === 'event-room';
            case 'groups':
                return conv.metadata?.type === 'group';
            case 'friends':
                return conv.metadata?.type === 'direct' || conv.metadata?.type === 'agent';
            default:
                return false;
        }
    });

    // Calculate unread counts for tabs
    const unreadCounts = {
        rooms: conversations.filter(c => c.metadata?.type === 'event-room').reduce((sum, c) => sum + c.unreadCount, 0),
        groups: conversations.filter(c => c.metadata?.type === 'group').reduce((sum, c) => sum + c.unreadCount, 0),
        friends: conversations.filter(c => ['direct', 'agent'].includes(c.metadata?.type || '')).reduce((sum, c) => sum + c.unreadCount, 0)
    };

    // Show authentication required
    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 justify-center items-center px-6">
                    <Ionicons name="chatbubbles-outline" size={64} color="#9CA3AF" />
                    <Text className="text-xl font-semibold text-gray-900 mt-4 text-center">
                        Connect Your Wallet
                    </Text>
                    <Text className="text-gray-600 mt-2 text-center">
                        Connect your wallet to start messaging on XMTP
                    </Text>
                    <TouchableOpacity
                        className="bg-orange-500 px-6 py-3 rounded-xl mt-6"
                        onPress={connectWallet}
                    >
                        <Text className="text-white font-semibold">Connect Wallet</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const renderConversationItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            className="flex-row items-center px-6 py-4 border-b border-gray-50"
            onPress={() => router.push(`/chat/${item.id}`)}
            activeOpacity={0.8}
        >
            {/* Avatar with status */}
            <View className="relative mr-4">
                <View className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full items-center justify-center shadow-lg">
                    <Ionicons
                        name={
                            item.metadata?.type === 'event-room' ? 'people-outline' :
                                item.metadata?.type === 'agent' ? 'hardware-chip-outline' :
                                    'person-outline'
                        }
                        size={20}
                        color="white"
                    />
                </View>

                {/* Online/Active indicator */}
                {(item.metadata?.type === 'event-room' || item.metadata?.type === 'agent') && (
                    <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                )}
            </View>

            {/* Content */}
            <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="font-bold text-gray-900 text-lg flex-1" numberOfLines={1}>
                        {item.metadata?.title || `Conversation ${item.id.slice(0, 8)}...`}
                    </Text>
                    {item.lastMessage && (
                        <Text className="text-xs text-gray-500 ml-2">
                            2min ago
                        </Text>
                    )}
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-gray-600 text-sm flex-1" numberOfLines={1}>
                        {item.lastMessage?.content || 'No messages yet'}
                    </Text>

                    {item.unreadCount > 0 && (
                        <View className="bg-orange-500 rounded-full min-w-[24px] h-6 items-center justify-center ml-3">
                            <Text className="text-white text-xs font-bold">
                                {item.unreadCount > 99 ? '99+' : item.unreadCount}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Additional info for event rooms */}
                {item.metadata?.type === 'event-room' && (
                    <View className="flex-row items-center mt-2">
                        <View className="bg-green-100 px-2 py-1 rounded-full mr-2">
                            <Text className="text-green-700 text-xs font-medium">Live Event</Text>
                        </View>
                        <Text className="text-gray-500 text-xs">247 participants</Text>
                    </View>
                )}

                {/* Agent type indicator */}
                {item.metadata?.type === 'agent' && (
                    <View className="flex-row items-center mt-2">
                        <View className="bg-blue-100 px-2 py-1 rounded-full mr-2">
                            <Text className="text-blue-700 text-xs font-medium">AI Agent</Text>
                        </View>
                        <Text className="text-gray-500 text-xs">Online</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View className="flex-1 justify-center items-center px-6 py-12">
            <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
                <Ionicons
                    name={
                        activeTab === 'rooms' ? 'people-outline' :
                            activeTab === 'groups' ? 'chatbubbles-outline' :
                                'person-add-outline'
                    }
                    size={48}
                    color="#9CA3AF"
                />
            </View>

            <Text className="text-2xl font-bold text-gray-900 text-center mb-3">
                {activeTab === 'rooms' && 'No Event Rooms'}
                {activeTab === 'groups' && 'No Groups Yet'}
                {activeTab === 'friends' && 'No Conversations'}
            </Text>

            <Text className="text-gray-600 text-center mb-8 leading-6">
                {activeTab === 'rooms' && 'Join an event to start chatting with other attendees and make new connections'}
                {activeTab === 'groups' && 'Create or join a group to start meaningful conversations with like-minded people'}
                {activeTab === 'friends' && 'Start a conversation or chat with an AI agent to get help with various tasks'}
            </Text>

            <TouchableOpacity
                className="bg-orange-500 px-8 py-4 rounded-2xl shadow-lg"
                onPress={() => {
                    if (activeTab === 'rooms') {
                        router.push('/explore');
                    } else {
                        setShowCreateSheet(true);
                    }
                }}
                style={{
                    shadowColor: '#F97316',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8
                }}
            >
                <Text className="text-white font-bold text-lg">
                    {activeTab === 'rooms' && 'Browse Events'}
                    {activeTab === 'groups' && 'Create Group'}
                    {activeTab === 'friends' && 'Start Chatting'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            {/* Custom Header */}
            <CustomHeader
                title="Echo"
                subtitle="Your messaging hub"
                showLocation={false}
                showProfile={true}
                showNotifications={true}
                variant="gradient"
                textColor="white"
                onNotificationPress={() => {/* Handle notifications */ }}
                onProfilePress={() => {/* Handle profile */ }}
            >
                {/* Tab Navigation as header children */}
                <View className="flex-row bg-white bg-opacity-20 rounded-2xl p-1 mt-4">
                    {(['rooms', 'groups', 'friends'] as TabType[]).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 rounded-xl items-center ${activeTab === tab ? 'bg-white' : 'bg-transparent'
                                }`}
                        >
                            <View className="flex-row items-center">
                                <Text
                                    className={`font-semibold capitalize ${activeTab === tab ? 'text-orange-600' : 'text-white'
                                        }`}
                                >
                                    {tab}
                                </Text>
                                {unreadCounts[tab] > 0 && (
                                    <View className="ml-2 bg-orange-500 rounded-full min-w-[20px] h-5 items-center justify-center">
                                        <Text className="text-white text-xs font-bold">
                                            {unreadCounts[tab]}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </CustomHeader>

            {/* Content */}
            <View className="flex-1">
                {!filteredConversations || filteredConversations.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <FlatList
                        data={filteredConversations}
                        renderItem={renderConversationItem}
                        keyExtractor={(item) => item.id}
                        refreshControl={
                            <RefreshControl
                                refreshing={isConnecting}
                                onRefresh={refreshConversations}
                                tintColor="#F97316"
                                colors={['#F97316']}
                            />
                        }
                        contentContainerStyle={{ paddingTop: 8 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity
                className="absolute bottom-8 right-6 w-16 h-16 bg-orange-500 rounded-full items-center justify-center shadow-lg"
                onPress={() => setShowCreateSheet(true)}
                style={{
                    shadowColor: '#F97316',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 12
                }}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>

            {/* Create Bottom Sheet */}
            <CreateBottomSheet
                isVisible={showCreateSheet}
                onClose={() => setShowCreateSheet(false)}
            />
        </View>
    );
}