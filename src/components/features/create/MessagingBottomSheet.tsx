import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Dimensions,
    TextInput
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface MessagingBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    activeTab: 'rooms' | 'groups' | 'friends';
}

export const MessagingBottomSheet: React.FC<MessagingBottomSheetProps> = ({
    isVisible,
    onClose,
    activeTab
}) => {
    const { height: screenHeight } = Dimensions.get('window');
    const [showAddressInput, setShowAddressInput] = useState(false);
    const [addressInput, setAddressInput] = useState('');

    const getOptionsForTab = () => {
        switch (activeTab) {
            case 'rooms':
                return [
                    {
                        id: 'join-event',
                        title: 'Join Event Room',
                        subtitle: 'Browse and join active event rooms',
                        icon: 'people',
                        color: '#3B82F6',
                        onPress: () => {
                            onClose();
                            router.push('/explore');
                        }
                    },
                    {
                        id: 'create-event',
                        title: 'Create Event',
                        subtitle: 'Host your own event with chat room',
                        icon: 'calendar',
                        color: '#10B981',
                        onPress: () => {
                            onClose();
                            router.push('/event/create');
                        }
                    },
                    {
                        id: 'token-gate',
                        title: 'Token-Gated Room',
                        subtitle: 'Create exclusive NFT/token holder rooms',
                        icon: 'key',
                        color: '#F59E0B',
                        onPress: () => {
                            onClose();
                            router.push('/rooms/create-gated');
                        }
                    },
                    {
                        id: 'dao-space',
                        title: 'DAO Governance Room',
                        subtitle: 'Create space for DAO discussions',
                        icon: 'business',
                        color: '#8B5CF6',
                        onPress: () => {
                            onClose();
                            router.push('/dao/create-room');
                        }
                    }
                ];

            case 'groups':
                return [
                    {
                        id: 'create-group',
                        title: 'Create Group',
                        subtitle: 'Start a new group conversation',
                        icon: 'people-circle',
                        color: '#8B5CF6',
                        onPress: () => {
                            onClose();
                            router.push('/groups/create');
                        }
                    },
                    {
                        id: 'nft-group',
                        title: 'NFT Holder Group',
                        subtitle: 'Create group for specific NFT holders',
                        icon: 'diamond',
                        color: '#EC4899',
                        onPress: () => {
                            onClose();
                            router.push('/groups/create-nft');
                        }
                    },
                    {
                        id: 'token-group',
                        title: 'Token Holder Group',
                        subtitle: 'Group for specific token holders',
                        icon: 'logo-bitcoin',
                        color: '#F59E0B',
                        onPress: () => {
                            onClose();
                            router.push('/groups/create-token');
                        }
                    },
                    {
                        id: 'community-group',
                        title: 'Community Group',
                        subtitle: 'Open group for community discussions',
                        icon: 'globe',
                        color: '#10B981',
                        onPress: () => {
                            onClose();
                            router.push('/groups/create-community');
                        }
                    }
                ];

            case 'friends':
                return [
                    {
                        id: 'direct-message',
                        title: 'Direct Message',
                        subtitle: 'Send message to wallet address or ENS',
                        icon: 'chatbubble',
                        color: '#3B82F6',
                        onPress: () => {
                            setShowAddressInput(true);
                        }
                    },
                    {
                        id: 'defi-agent',
                        title: 'DeFi Assistant',
                        subtitle: 'Chat with AI for DeFi strategies',
                        icon: 'analytics',
                        color: '#10B981',
                        onPress: () => {
                            onClose();
                            router.push('/agent/defi');
                        }
                    },
                    {
                        id: 'nft-agent',
                        title: 'NFT Advisor',
                        subtitle: 'Get AI insights on NFT collections',
                        icon: 'images',
                        color: '#EC4899',
                        onPress: () => {
                            onClose();
                            router.push('/agent/nft');
                        }
                    },
                    {
                        id: 'gas-tracker',
                        title: 'Gas Tracker',
                        subtitle: 'Monitor and optimize gas prices',
                        icon: 'speedometer',
                        color: '#F59E0B',
                        onPress: () => {
                            onClose();
                            router.push('/agent/gas');
                        }
                    },
                    {
                        id: 'scan-qr',
                        title: 'Scan QR Code',
                        subtitle: 'Scan QR to add contact or join chat',
                        icon: 'qr-code',
                        color: '#6B7280',
                        onPress: () => {
                            onClose();
                            router.push('/scan');
                        }
                    }
                ];

            default:
                return [];
        }
    };

    const options = getOptionsForTab();

    const handleAddressSubmit = () => {
        if (addressInput.trim()) {
            onClose();
            setShowAddressInput(false);
            // Navigate to chat with the address
            router.push(`/chat/new?address=${addressInput.trim()}`);
            setAddressInput('');
        }
    };

    const getTabTitle = () => {
        switch (activeTab) {
            case 'rooms': return 'Event Rooms';
            case 'groups': return 'Groups';
            case 'friends': return 'Messages';
            default: return 'Create';
        }
    };

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
                                    borderTopLeftRadius: 24,
                                    borderTopRightRadius: 24,
                                    maxHeight: screenHeight * 0.85,
                                    paddingTop: 12
                                }}
                            >
                                {/* Handle bar */}
                                <View className="items-center mb-6">
                                    <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
                                </View>

                                {/* Header */}
                                <View className="px-6 pb-6">
                                    <Text className="text-2xl font-bold text-gray-900">
                                        {getTabTitle()}
                                    </Text>
                                    <Text className="text-gray-600 mt-2">
                                        {activeTab === 'rooms' && 'Join or create event spaces'}
                                        {activeTab === 'groups' && 'Create communities and groups'}
                                        {activeTab === 'friends' && 'Start conversations and chat with AI'}
                                    </Text>
                                </View>

                                {/* Address Input Modal */}
                                {showAddressInput && (
                                    <View className="px-6 mb-6">
                                        <View className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                                            <Text className="font-semibold text-blue-900 mb-3">
                                                Send Direct Message
                                            </Text>
                                            <TextInput
                                                className="bg-white p-4 rounded-xl border border-blue-200 text-gray-900"
                                                placeholder="Enter wallet address or ENS name"
                                                placeholderTextColor="#9CA3AF"
                                                value={addressInput}
                                                onChangeText={setAddressInput}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                            />
                                            <View className="flex-row mt-4 space-x-3">
                                                <TouchableOpacity
                                                    onPress={() => setShowAddressInput(false)}
                                                    className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
                                                >
                                                    <Text className="text-gray-700 font-semibold">Cancel</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={handleAddressSubmit}
                                                    className="flex-1 bg-blue-500 py-3 rounded-xl items-center"
                                                >
                                                    <Text className="text-white font-semibold">Start Chat</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {/* Options */}
                                <ScrollView
                                    className="px-6"
                                    showsVerticalScrollIndicator={false}
                                    style={{ maxHeight: screenHeight * 0.55 }}
                                >
                                    <View className="space-y-4 pb-6">
                                        {options.map((option) => (
                                            <TouchableOpacity
                                                key={option.id}
                                                onPress={option.onPress}
                                                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                                                activeOpacity={0.7}
                                                style={{
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.1,
                                                    shadowRadius: 3,
                                                    elevation: 3
                                                }}
                                            >
                                                <View className="flex-row items-center">
                                                    <View
                                                        className={`w-14 h-14 rounded-2xl items-center justify-center mr-4`}
                                                        style={{ backgroundColor: option.color }}
                                                    >
                                                        <Ionicons
                                                            name={option.icon as any}
                                                            size={28}
                                                            color="white"
                                                        />
                                                    </View>

                                                    <View className="flex-1">
                                                        <View className="flex-row items-center mb-1">
                                                            <Text className="font-bold text-gray-900 text-lg">
                                                                {option.title}
                                                            </Text>
                                                        </View>
                                                        <Text className="text-gray-600 text-sm leading-5">
                                                            {option.subtitle}
                                                        </Text>
                                                    </View>

                                                    <View className="bg-gray-100 p-2 rounded-full">
                                                        <Ionicons
                                                            name="chevron-forward"
                                                            size={18}
                                                            color="#6B7280"
                                                        />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>

                                {/* Close button */}
                                <View className="px-6 py-6 border-t border-gray-100">
                                    <TouchableOpacity
                                        onPress={onClose}
                                        className="bg-gray-100 py-4 rounded-2xl items-center"
                                    >
                                        <Text className="text-gray-700 font-bold text-lg">Close</Text>
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