import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
    TextInput,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useMobileWallet } from '@/hooks/useWallet';
import { useXMTP } from '@/hooks/useXMTP';
import { useBase } from '@/hooks/useBase';
import { CreateBottomSheet } from '@/components/features/create/CreateBottomSheet';
import { CustomHeader } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { getDeviceInfo, getDesignTokens } from '@/utils/responsive';

type TabType = 'rooms' | 'groups' | 'friends';

export default function EchoScreen() {
    const [activeTab, setActiveTab] = useState<TabType>('friends');
    const [showCreateSheet, setShowCreateSheet] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [newChatAddress, setNewChatAddress] = useState('');

    const device = getDeviceInfo();
    const tokens = getDesignTokens();

    const { isConnected, address, connect, walletType } = useMobileWallet();
    const {
        conversations = [],
        isInitialized,
        isConnecting,
        error,
        createConversation
    } = useXMTP();
    const { isOnBase, switchToBase } = useBase();

    // Filter conversations based on active tab
    const filteredConversations = Array.isArray(conversations)
        ? conversations.filter(conv => {
            return activeTab === 'friends';
        })
        : [];

    const handleStartNewChat = async () => {
        if (!newChatAddress.trim()) {
            Alert.alert('Error', 'Please enter a valid wallet address');
            return;
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(newChatAddress)) {
            Alert.alert('Error', 'Please enter a valid Ethereum address');
            return;
        }

        try {
            const topic = await createConversation(newChatAddress);
            setShowNewChatModal(false);
            setNewChatAddress('');
            router.push(`/chat/${newChatAddress}`);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create conversation');
        }
    };

    // Connect wallet if not connected
    if (!isConnected) {
        return (
            <ScreenWrapper mode="safe" backgroundColor="#F9FAFB">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: tokens.spacing.lg }}>
                    <View
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: tokens.borderRadius.xl,
                            backgroundColor: '#FED7AA',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: tokens.spacing.xl
                        }}
                    >
                        <Ionicons name="chatbubbles-outline" size={50} color="#F97316" />
                    </View>
                    <Text style={{
                        fontSize: tokens.typography['3xl'],
                        fontWeight: 'bold',
                        color: '#1F2937',
                        textAlign: 'center',
                        marginBottom: tokens.spacing.sm
                    }}>
                        Welcome to Echo
                    </Text>
                    <Text style={{
                        color: '#6B7280',
                        textAlign: 'center',
                        fontSize: tokens.typography.lg,
                        marginBottom: tokens.spacing.sm
                    }}>
                        Secure blockchain messaging
                    </Text>
                    <Text style={{
                        color: '#6B7280',
                        textAlign: 'center',
                        fontSize: tokens.typography.base,
                        marginBottom: tokens.spacing.xl
                    }}>
                        Connect your wallet to start messaging
                    </Text>

                    <View style={{ gap: tokens.spacing.md, width: '100%' }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#F97316',
                                paddingHorizontal: tokens.spacing.xl,
                                paddingVertical: tokens.spacing.md,
                                borderRadius: tokens.borderRadius.lg,
                                ...tokens.shadows.md,
                                alignItems: 'center'
                            }}
                            onPress={() => connect('coinbase')}
                        >
                            <Text style={{ color: 'white', fontWeight: '600', fontSize: tokens.typography.lg }}>
                                Connect Coinbase Wallet
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: 'white',
                                borderWidth: 2,
                                borderColor: '#E5E7EB',
                                paddingHorizontal: tokens.spacing.xl,
                                paddingVertical: tokens.spacing.md,
                                borderRadius: tokens.borderRadius.lg,
                                alignItems: 'center'
                            }}
                            onPress={() => connect('metamask')}
                        >
                            <Text style={{ color: '#1F2937', fontWeight: '600', fontSize: tokens.typography.lg }}>
                                Connect MetaMask
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScreenWrapper>
        );
    }

    // Show initialization
    if (!isInitialized && isConnecting) {
        return (
            <ScreenWrapper mode="safe">
                <CustomHeader
                    title="Echo"
                    subtitle="Setting up secure messaging..."
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        width: 80,
                        height: 80,
                        borderRadius: tokens.borderRadius.xl,
                        backgroundColor: '#FED7AA',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: tokens.spacing.lg
                    }}>
                        <Ionicons name="sync" size={40} color="#F97316" />
                    </View>
                    <Text style={{ fontSize: tokens.typography.xl, fontWeight: 'bold', marginBottom: tokens.spacing.sm }}>
                        Initializing secure messaging
                    </Text>
                    <Text style={{ color: '#6B7280', textAlign: 'center' }}>
                        Setting up encrypted communications...
                    </Text>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper mode="edge-to-edge" backgroundColor="white">
            {/* Header */}
            <CustomHeader
                title="Echo"
                variant="default"
                extend={true}
                showUserAvatar={true}
                location="Nairobi, Kenya"
                showMenuButton={true}
                onMenuPress={() => setShowSidebar(true)}
                rightActions={[
                    {
                        icon: 'add-circle-outline',
                        onPress: () => setShowNewChatModal(true)
                    },
                    {
                        icon: 'notifications-outline',
                        onPress: () => console.log('Notifications'),
                        badge: Math.max(0, filteredConversations?.length || 0)
                    }
                ]}
            />

            {/* Network Status */}
            {!isOnBase && (
                <View style={{
                    backgroundColor: '#FEF3C7',
                    paddingHorizontal: tokens.spacing.md,
                    paddingVertical: tokens.spacing.sm,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', color: '#92400E', fontSize: tokens.typography.sm }}>
                            Switch to Base for payments
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={switchToBase}
                        style={{
                            backgroundColor: '#F59E0B',
                            paddingHorizontal: tokens.spacing.sm,
                            paddingVertical: tokens.spacing.xs,
                            borderRadius: tokens.borderRadius.md
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: tokens.typography.sm }}>
                            Switch
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Tab Navigation */}
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.sm,
                backgroundColor: '#F9FAFB'
            }}>
                {(['rooms', 'groups', 'friends'] as TabType[]).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={{
                            flex: 1,
                            paddingVertical: tokens.spacing.sm,
                            marginHorizontal: tokens.spacing.xs,
                            borderRadius: tokens.borderRadius.lg,
                            alignItems: 'center',
                            backgroundColor: activeTab === tab ? '#1F2937' : 'transparent'
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: '500',
                                textTransform: 'capitalize',
                                fontSize: tokens.typography.base,
                                color: activeTab === tab ? 'white' : '#6B7280'
                            }}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Conversations List */}
            <View style={{ flex: 1 }}>
                {filteredConversations.length === 0 ? (
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: tokens.spacing.lg
                    }}>
                        <View
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: tokens.borderRadius.xl,
                                backgroundColor: '#F3F4F6',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: tokens.spacing.lg
                            }}
                        >
                            <Ionicons name="chatbubbles-outline" size={40} color="#9CA3AF" />
                        </View>
                        <Text style={{
                            fontSize: tokens.typography['2xl'],
                            fontWeight: 'bold',
                            color: '#1F2937',
                            textAlign: 'center',
                            marginBottom: tokens.spacing.sm
                        }}>
                            No Messages Yet
                        </Text>
                        <Text style={{
                            color: '#6B7280',
                            textAlign: 'center',
                            fontSize: tokens.typography.base,
                            marginBottom: tokens.spacing.xl
                        }}>
                            Start a secure conversation with anyone using their wallet address
                        </Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#F97316',
                                paddingHorizontal: tokens.spacing.lg,
                                paddingVertical: tokens.spacing.md,
                                borderRadius: tokens.borderRadius.lg,
                                ...tokens.shadows.md
                            }}
                            onPress={() => setShowNewChatModal(true)}
                        >
                            <Text style={{
                                color: 'white',
                                fontWeight: '600',
                                fontSize: tokens.typography.base
                            }}>
                                Start Your First Chat
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={filteredConversations}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingHorizontal: tokens.spacing.md,
                                    paddingVertical: tokens.spacing.md,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#F3F4F6'
                                }}
                                onPress={() => router.push(`/chat/${item.peerAddress}`)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={{
                                        width: device.isSmallDevice ? 48 : 52,
                                        height: device.isSmallDevice ? 48 : 52,
                                        borderRadius: tokens.borderRadius.lg,
                                        backgroundColor: '#FED7AA',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: tokens.spacing.sm
                                    }}
                                >
                                    <Text style={{
                                        color: '#EA580C',
                                        fontSize: tokens.typography.base,
                                        fontWeight: 'bold'
                                    }}>
                                        {item.peerAddress?.slice(2, 4)?.toUpperCase() || 'XX'}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        fontWeight: '600',
                                        color: '#1F2937',
                                        fontSize: tokens.typography.base,
                                        marginBottom: tokens.spacing.xs
                                    }}>
                                        {item.peerAddress
                                            ? `${item.peerAddress.slice(0, 6)}...${item.peerAddress.slice(-4)}`
                                            : 'Unknown Address'
                                        }
                                    </Text>
                                    <Text
                                        style={{
                                            color: '#6B7280',
                                            fontSize: tokens.typography.sm
                                        }}
                                        numberOfLines={1}
                                    >
                                        {item.lastMessage?.content || 'Start a conversation'}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={{
                                        color: '#9CA3AF',
                                        fontSize: tokens.typography.xs,
                                        marginBottom: tokens.spacing.xs
                                    }}>
                                        {item.lastMessage?.timestamp ?
                                            new Date(item.lastMessage.timestamp).toLocaleDateString() :
                                            'New'
                                        }
                                    </Text>
                                    <View style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: '#10B981'
                                    }} />
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => item.topic || `conversation-${index}`}
                        refreshControl={
                            <RefreshControl
                                refreshing={isConnecting}
                                onRefresh={() => {/* Refresh logic */ }}
                                tintColor="#F97316"
                            />
                        }
                        contentContainerStyle={{ paddingBottom: tokens.spacing.xl }}
                    />
                )}
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: tokens.spacing.xl,
                    right: tokens.spacing.md,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...tokens.shadows.lg
                }}
                onPress={() => setShowCreateSheet(true)}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={['#F97316', '#EA580C']}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 30,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Ionicons name="add" size={28} color="white" />
                </LinearGradient>
            </TouchableOpacity>

            {/* New Chat Modal */}
            <Modal
                visible={showNewChatModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowNewChatModal(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: tokens.spacing.lg
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: tokens.borderRadius.xl,
                        padding: tokens.spacing.lg,
                        width: '100%',
                        maxWidth: 400
                    }}>
                        <Text style={{
                            fontSize: tokens.typography.xl,
                            fontWeight: 'bold',
                            marginBottom: tokens.spacing.md,
                            textAlign: 'center'
                        }}>
                            Start New Chat
                        </Text>

                        <Text style={{
                            color: '#6B7280',
                            marginBottom: tokens.spacing.md
                        }}>
                            Enter the wallet address of who you want to message:
                        </Text>

                        <TextInput
                            value={newChatAddress}
                            onChangeText={setNewChatAddress}
                            placeholder="0x..."
                            style={{
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                                borderRadius: tokens.borderRadius.lg,
                                padding: tokens.spacing.md,
                                fontSize: tokens.typography.base,
                                marginBottom: tokens.spacing.lg
                            }}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <View style={{
                            flexDirection: 'row',
                            gap: tokens.spacing.sm
                        }}>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: tokens.spacing.md,
                                    borderRadius: tokens.borderRadius.lg,
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    alignItems: 'center'
                                }}
                                onPress={() => {
                                    setShowNewChatModal(false);
                                    setNewChatAddress('');
                                }}
                            >
                                <Text style={{ color: '#6B7280', fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    paddingVertical: tokens.spacing.md,
                                    borderRadius: tokens.borderRadius.lg,
                                    backgroundColor: '#F97316',
                                    alignItems: 'center'
                                }}
                                onPress={handleStartNewChat}
                            >
                                <Text style={{ color: 'white', fontWeight: '600' }}>Start Chat</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Create Bottom Sheet */}
            <CreateBottomSheet
                isVisible={showCreateSheet}
                onClose={() => setShowCreateSheet(false)}
            />

            {/* Sidebar */}
            <Sidebar
                isVisible={showSidebar}
                onClose={() => setShowSidebar(false)}
                userAddress={address || undefined}
            />
        </ScreenWrapper>
    );
}