import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';

interface ChatHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    onCall?: () => void;
    onVideoCall?: () => void;
    onMenu?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    title,
    subtitle,
    onBack,
    onCall,
    onVideoCall,
    onMenu
}) => {
    return (
        <BlurView intensity={80} className="border-b border-gray-100">
            <View className="flex-row items-center px-4 py-3 bg-white bg-opacity-80">
                <TouchableOpacity
                    onPress={onBack || (() => router.back())}
                    className="mr-4 w-10 h-10 items-center justify-center"
                >
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>

                <View className="flex-1">
                    <Text className="font-bold text-gray-900 text-lg">{title}</Text>
                    {subtitle && (
                        <Text className="text-sm text-gray-600">{subtitle}</Text>
                    )}
                </View>

                <View className="flex-row items-center space-x-2">
                    {onCall && (
                        <TouchableOpacity
                            onPress={onCall}
                            className="w-10 h-10 items-center justify-center"
                        >
                            <Ionicons name="call" size={22} color="#6B7280" />
                        </TouchableOpacity>
                    )}

                    {onVideoCall && (
                        <TouchableOpacity
                            onPress={onVideoCall}
                            className="w-10 h-10 items-center justify-center"
                        >
                            <Ionicons name="videocam" size={22} color="#6B7280" />
                        </TouchableOpacity>
                    )}

                    {onMenu && (
                        <TouchableOpacity
                            onPress={onMenu}
                            className="w-10 h-10 items-center justify-center"
                        >
                            <Ionicons name="ellipsis-vertical" size={22} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </BlurView>
    );
};