import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface CreateBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
}

export const CreateBottomSheet: React.FC<CreateBottomSheetProps> = ({
    isVisible,
    onClose
}) => {
    const { height: screenHeight } = Dimensions.get('window');

    const createOptions = [
        {
            id: 'event',
            title: 'Create Event',
            subtitle: 'Host your own event and invite others',
            icon: 'calendar',
            color: '#3B82F6',
            onPress: () => {
                onClose();
                router.push('/event/create');
            }
        },
        {
            id: 'room',
            title: 'Event Room',
            subtitle: 'Join an existing event and start chatting',
            icon: 'people',
            color: '#10B981',
            onPress: () => {
                onClose();
                router.push('/explore'); // Navigate to explore to find events
            }
        },
        {
            id: 'agent',
            title: 'Chat with AI Agent',
            subtitle: 'Get help from specialized AI agents',
            icon: 'robot',
            color: '#EF4444',
            onPress: () => {
                onClose();
                router.push('/agent/marketplace');
            }
        },
        {
            id: 'direct',
            title: 'Direct Message',
            subtitle: 'Start a private conversation',
            icon: 'chatbubble',
            color: '#8B5CF6',
            onPress: () => {
                onClose();
                // Could show address input modal
            }
        },
        {
            id: 'stream',
            title: 'Go Live',
            subtitle: 'Stream your event or activity',
            icon: 'videocam',
            color: '#F59E0B',
            onPress: () => {
                onClose();
                router.push('/stream/create');
            }
        },
        {
            id: 'marketplace',
            title: 'List NFT',
            subtitle: 'Sell or auction your digital collectibles',
            icon: 'images',
            color: '#EC4899',
            onPress: () => {
                onClose();
                router.push('/marketplace/create');
            }
        }
    ];

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <BlurView intensity={10} style={{ flex: 1 }}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        <TouchableOpacity activeOpacity={1}>
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    maxHeight: screenHeight * 0.8,
                                    paddingTop: 12
                                }}
                            >
                                {/* Handle bar */}
                                <View className="items-center mb-4">
                                    <View className="w-12 h-1 bg-gray-300 rounded-full" />
                                </View>

                                {/* Header */}
                                <View className="px-6 pb-4 border-b border-gray-100">
                                    <Text className="text-xl font-bold text-gray-900">Create</Text>
                                    <Text className="text-gray-600 mt-1">What would you like to create?</Text>
                                </View>

                                {/* Options */}
                                <ScrollView
                                    className="px-6"
                                    showsVerticalScrollIndicator={false}
                                    style={{ maxHeight: screenHeight * 0.6 }}
                                >
                                    <View className="py-4 space-y-3">
                                        {createOptions.map((option) => (
                                            <TouchableOpacity
                                                key={option.id}
                                                onPress={option.onPress}
                                                className="flex-row items-center p-4 bg-gray-50 rounded-xl border border-gray-100"
                                                activeOpacity={0.7}
                                            >
                                                <View
                                                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                                                    style={{ backgroundColor: `${option.color}15` }}
                                                >
                                                    <Ionicons
                                                        name={option.icon as any}
                                                        size={24}
                                                        color={option.color}
                                                    />
                                                </View>

                                                <View className="flex-1">
                                                    <Text className="font-semibold text-gray-900 text-lg">
                                                        {option.title}
                                                    </Text>
                                                    <Text className="text-gray-600 text-sm mt-1">
                                                        {option.subtitle}
                                                    </Text>
                                                </View>

                                                <Ionicons
                                                    name="chevron-forward"
                                                    size={20}
                                                    color="#9CA3AF"
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>

                                {/* Close button */}
                                <View className="px-6 py-4 border-t border-gray-100">
                                    <TouchableOpacity
                                        onPress={onClose}
                                        className="bg-gray-100 py-3 rounded-xl items-center"
                                    >
                                        <Text className="text-gray-700 font-semibold">Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </BlurView>
        </Modal>
    );
};