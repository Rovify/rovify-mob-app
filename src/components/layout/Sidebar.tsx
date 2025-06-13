import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

interface SidebarProps {
    isVisible: boolean;
    onClose: () => void;
    userAddress?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isVisible,
    onClose,
    userAddress = '0x742d35...5A6B7'
}) => {
    const insets = useSafeAreaInsets();
    const { width: screenWidth } = Dimensions.get('window');

    const menuItems = [
        {
            section: 'Navigate',
            items: [
                { icon: 'search', label: 'Explore Events', route: '/explore' },
                { icon: 'chatbubbles', label: 'Messages', route: '/echo' },
                { icon: 'storefront', label: 'Marketplace', route: '/marketplace' },
                { icon: 'videocam', label: 'Streaming', route: '/stream' }
            ]
        },
        {
            section: 'AI & Tools',
            items: [
                { icon: 'robot', label: 'AI Agents', route: '/agent/marketplace' },
                { icon: 'apps', label: 'Mini Apps', route: '/mini-apps' },
                { icon: 'calculator', label: 'Payment Splitter', action: 'payment-splitter' },
                { icon: 'bar-chart', label: 'Event Polls', action: 'event-poll' }
            ]
        },
        {
            section: 'Account',
            items: [
                { icon: 'person', label: 'Profile', route: '/profile' },
                { icon: 'wallet', label: 'Wallet', route: '/wallet' },
                { icon: 'settings', label: 'Settings', route: '/settings' },
                { icon: 'help-circle', label: 'Support', route: '/support' }
            ]
        }
    ];

    const handleItemPress = (item: any) => {
        onClose();
        if (item.route) {
            router.push(item.route);
        } else if (item.action) {
            // Handle special actions
            console.log('Action:', item.action);
        }
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={{ flex: 1 }}>
                {/* Backdrop */}
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <BlurView intensity={10} style={{ flex: 1 }}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} />
                    </BlurView>
                </TouchableOpacity>

                {/* Sidebar */}
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: screenWidth * 0.8,
                        maxWidth: 320,
                        backgroundColor: 'white'
                    }}
                >
                    {/* Header */}
                    <View
                        style={{
                            paddingTop: insets.top + 20,
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            backgroundColor: '#F97316'
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <View style={{ flex: 1 }}>
                                <View
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 30,
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 12
                                    }}
                                >
                                    <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>R</Text>
                                </View>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                                    Rovify
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 }}>
                                    {userAddress}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={onClose}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Ionicons name="close" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Menu Items */}
                    <ScrollView style={{ flex: 1 }}>
                        {menuItems.map((section, sectionIndex) => (
                            <View key={sectionIndex} style={{ marginBottom: 8 }}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '600',
                                        color: '#6B7280',
                                        textTransform: 'uppercase',
                                        paddingHorizontal: 20,
                                        paddingVertical: 12,
                                        letterSpacing: 0.5
                                    }}
                                >
                                    {section.section}
                                </Text>

                                {section.items.map((item, itemIndex) => (
                                    <TouchableOpacity
                                        key={itemIndex}
                                        onPress={() => handleItemPress(item)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingHorizontal: 20,
                                            paddingVertical: 16,
                                            marginHorizontal: 12,
                                            borderRadius: 12,
                                            marginBottom: 2
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 18,
                                                backgroundColor: '#F3F4F6',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: 12
                                            }}
                                        >
                                            <Ionicons name={item.icon as any} size={20} color="#6B7280" />
                                        </View>

                                        <Text
                                            style={{
                                                flex: 1,
                                                fontSize: 16,
                                                color: '#1F2937',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {item.label}
                                        </Text>

                                        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </ScrollView>

                    {/* Footer */}
                    <View
                        style={{
                            padding: 20,
                            borderTopWidth: 1,
                            borderTopColor: '#E5E7EB',
                            paddingBottom: insets.bottom + 20
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 12
                            }}
                        >
                            <Ionicons name="log-out" size={20} color="#EF4444" />
                            <Text style={{ marginLeft: 12, color: '#EF4444', fontWeight: '500' }}>
                                Disconnect Wallet
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};