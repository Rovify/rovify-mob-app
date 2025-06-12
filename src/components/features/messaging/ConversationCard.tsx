import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface ConversationCardProps {
    conversation: any; // XMTP Conversation type
}

export const ConversationCard: React.FC<ConversationCardProps> = ({ conversation }) => {
    const handlePress = () => {
        router.push(`/chat/${conversation.topic}`);
    };

    // Extract group info from conversation context
    const isGroupChat = conversation.context?.conversationType === 'group';
    const title = conversation.context?.title || `${conversation.peerAddress.slice(0, 6)}...`;
    const memberCount = conversation.context?.memberCount || 2;
    const lastMessage = conversation.lastMessage;
    const unreadCount = conversation.unreadCount || 0;

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now.getTime() - time.getTime();
        const minutes = Math.floor(diff / (1000 * 60));

        if (minutes < 1) return 'now';
        if (minutes < 60) return `${minutes}m ago`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
        return `${Math.floor(minutes / 1440)}d ago`;
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="flex-row items-center p-4 bg-white border-b border-gray-50"
            activeOpacity={0.8}
        >
            {/* Avatar */}
            <View className="relative mr-3">
                {isGroupChat ? (
                    <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
                        <Ionicons name="people" size={20} color="#F97316" />
                    </View>
                ) : (
                    <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center">
                        <Ionicons name="person" size={20} color="#6B7280" />
                    </View>
                )}

                {/* Online indicator */}
                <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </View>

            {/* Content */}
            <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
                        {title}
                    </Text>
                    {lastMessage && (
                        <Text className="text-xs text-gray-500">
                            {getTimeAgo(lastMessage.sent)}
                        </Text>
                    )}
                </View>

                <View className="flex-row items-center justify-between">
                    <View className="flex-1 mr-2">
                        {isGroupChat && (
                            <Text className="text-xs text-gray-500 mb-1">
                                {memberCount} members
                            </Text>
                        )}
                        <Text className="text-sm text-gray-600" numberOfLines={1}>
                            {lastMessage?.content || 'No messages yet'}
                        </Text>
                    </View>

                    {unreadCount > 0 && (
                        <View className="bg-orange-500 rounded-full min-w-5 h-5 items-center justify-center px-1">
                            <Text className="text-white text-xs font-semibold">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};