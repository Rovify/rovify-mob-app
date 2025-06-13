import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
    Image,
    TextInput,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useMessaging } from '../../src/hooks/useMessaging';
import { MessagingBottomSheet } from '../../src/components/features/create/MessagingBottomSheet';

type TabType = 'rooms' | 'groups' | 'friends';
type TimeFilter = 'all' | 'before' | 'during' | 'after';

// Mock data with web3 elements
const MOCK_USER = {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Sarah',
    walletAddress: '0x742d...5A3E',
    ensName: 'sarah.eth',
    isAuthenticated: true
};

const MOCK_STORIES = [
    { id: 'add', type: 'add', name: 'Add Story', avatar: null },
    { id: '1', type: 'story', name: 'vitalik.eth', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Vitalik', hasStory: true, isVerified: true },
    { id: '2', type: 'story', name: 'alex.base', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Alex', hasStory: true, isVerified: false },
    { id: '3', type: 'story', name: 'maria.lens', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Maria', hasStory: false, isVerified: true },
    { id: '4', type: 'story', name: 'jamesDAO', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=James', hasStory: true, isVerified: false },
    { id: '5', type: 'story', name: 'emma.nft', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Emma', hasStory: true, isVerified: true },
];

const MOCK_CONVERSATIONS = [
    // Event Rooms with web3 themes and threading
    {
        id: 'room1',
        metadata: {
            type: 'event-room',
            title: 'ETH Denver 2025',
            memberCount: 1890,
            eventStatus: 'during',
            tokenGated: true,
            nftCollection: 'BUIDL Pass',
            activeThreads: 3,
            lastThreadTopic: 'Smart Contract Deployment'
        },
        lastMessage: {
            content: '🚀 Just deployed my first smart contract! Gas fees only 0.003 ETH',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            sender: 'builder.eth',
            isThreadReply: true
        },
        unreadCount: 3
    },
    {
        id: 'room2',
        metadata: {
            type: 'event-room',
            title: 'NFT Art Basel Miami',
            memberCount: 756,
            eventStatus: 'before',
            tokenGated: true,
            nftCollection: 'Art Basel Pass',
            activeThreads: 7,
            lastThreadTopic: 'Generative Art Drops'
        },
        lastMessage: {
            content: 'Preview of my latest generative art piece dropping tomorrow 🎨',
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            sender: 'artist.lens',
            isThreadReply: true
        },
        unreadCount: 12
    },
    {
        id: 'room3',
        metadata: {
            type: 'event-room',
            title: 'DeFi Summer Reunion',
            memberCount: 2340,
            eventStatus: 'before',
            tokenGated: false,
            activeThreads: 5,
            lastThreadTopic: 'Yield Farming Strategies'
        },
        lastMessage: {
            content: 'Who remembers yield farming in 2020? Those were wild times 😅',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            sender: 'defi.maximalist',
            isThreadReply: false
        },
        unreadCount: 7
    },
    {
        id: 'room4',
        metadata: {
            type: 'event-room',
            title: 'Crypto Gaming Summit',
            memberCount: 1120,
            eventStatus: 'after',
            tokenGated: true,
            nftCollection: 'Gaming DAO',
            activeThreads: 2,
            lastThreadTopic: 'P2E Game Reviews'
        },
        lastMessage: {
            content: 'Thanks for the amazing sessions! P2E gaming is the future 🎮',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            sender: 'gamer.dao',
            isThreadReply: true
        },
        unreadCount: 0
    },
    {
        id: 'room5',
        metadata: {
            type: 'event-room',
            title: 'Base Buildathon',
            memberCount: 890,
            eventStatus: 'during',
            tokenGated: false,
            activeThreads: 12,
            lastThreadTopic: 'Cross-chain Bridge Development'
        },
        lastMessage: {
            content: 'Building a cross-chain bridge in 48hrs. Anyone want to team up?',
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            sender: 'based.builder',
            isThreadReply: true
        },
        unreadCount: 5
    },

    // Groups with web3 themes
    {
        id: 'group1',
        metadata: {
            type: 'group',
            title: 'Crypto OGs',
            memberCount: 234,
            tokenGated: true,
            minTokenHolding: '100 ETH'
        },
        lastMessage: {
            content: 'BTC hitting new ATH again! Diamond hands paying off 💎🙌',
            timestamp: new Date(Date.now() - 1000 * 60 * 20),
            sender: 'hodler.eth'
        },
        unreadCount: 8
    },
    {
        id: 'group2',
        metadata: {
            type: 'group',
            title: 'NFT Collectors',
            memberCount: 567,
            tokenGated: true,
            minTokenHolding: 'BAYC Holder'
        },
        lastMessage: {
            content: 'Just swept the floor on this new collection. DYOR but looks promising',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            sender: 'collector.lens'
        },
        unreadCount: 4
    },
    {
        id: 'group3',
        metadata: {
            type: 'group',
            title: 'DAO Governance',
            memberCount: 1156,
            tokenGated: false
        },
        lastMessage: {
            content: 'Proposal #47 is up for voting. Please review the tokenomics update',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
            sender: 'dao.delegate'
        },
        unreadCount: 2
    },

    // Friends/Direct Messages with web3 context
    {
        id: 'direct1',
        metadata: {
            type: 'direct',
            title: 'alex.base',
            ensName: 'alex.base',
            address: '0x123...abc'
        },
        lastMessage: {
            content: 'Sending you 0.1 ETH for dinner tonight! 🍕',
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            isTransaction: true,
            txHash: '0xabc123...def456'
        },
        unreadCount: 1
    },
    {
        id: 'direct2',
        metadata: {
            type: 'direct',
            title: 'emma.lens',
            ensName: 'emma.lens',
            address: '0x456...def'
        },
        lastMessage: {
            content: 'Loved your latest lens post! The web3 space needs more builders like you',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
        },
        unreadCount: 0
    },
    {
        id: 'agent1',
        metadata: {
            type: 'agent',
            title: 'DeFi Assistant',
            agentType: 'financial'
        },
        lastMessage: {
            content: 'Your portfolio is up 12% this week! Want to rebalance across protocols?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6)
        },
        unreadCount: 1
    },
    {
        id: 'agent2',
        metadata: {
            type: 'agent',
            title: 'Gas Tracker',
            agentType: 'utility'
        },
        lastMessage: {
            content: 'Gas prices are low (15 gwei). Good time for that contract deployment!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12)
        },
        unreadCount: 0
    }
];

export default function EchoScreen() {
    const [activeTab, setActiveTab] = useState<TabType>('rooms');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
    const [showCreateSheet, setShowCreateSheet] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Mock hooks - replace with actual hooks
    const isAuthenticated = MOCK_USER.isAuthenticated;
    const user = MOCK_USER;
    const conversations = MOCK_CONVERSATIONS;
    const stories = MOCK_STORIES;

    // Filter conversations based on active tab, time filter, and search
    const filteredConversations = useMemo(() => {
        return conversations.filter(conv => {
            const typeMatch = (() => {
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
            })();

            if (!typeMatch) return false;

            // Apply time filter for rooms
            if (activeTab === 'rooms' && timeFilter !== 'all') {
                if (conv.metadata?.eventStatus !== timeFilter) return false;
            }

            // Apply search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const titleMatch = conv.metadata?.title?.toLowerCase().includes(query);
                const messageMatch = conv.lastMessage?.content?.toLowerCase().includes(query);
                const senderMatch = conv.lastMessage?.sender?.toLowerCase().includes(query);
                return titleMatch || messageMatch || senderMatch;
            }

            return true;
        });
    }, [conversations, activeTab, timeFilter, searchQuery]);

    function getMessagePreview(message: any): string {
        if (message?.isTransaction) {
            return `💸 Transaction: ${message.content}`;
        }
        const content = message?.content;
        if (typeof content === 'string') return content;
        if (typeof content === 'object') return '[Media message]';
        return 'No messages yet';
    }

    function getTimeAgo(timestamp: Date): string {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) {
            return `${minutes}m`;
        } else if (hours < 24) {
            return `${hours}h`;
        } else if (days === 1) {
            return 'Yesterday';
        } else {
            return `${days}d`;
        }
    }

    function getEventStatus(conversation: any): 'before' | 'during' | 'after' {
        return conversation.metadata?.eventStatus || 'before';
    }

    // Calculate unread counts for tabs
    const unreadCounts = {
        rooms: conversations.filter(c => c.metadata?.type === 'event-room').reduce((sum, c) => sum + c.unreadCount, 0),
        groups: conversations.filter(c => c.metadata?.type === 'group').reduce((sum, c) => sum + c.unreadCount, 0),
        friends: conversations.filter(c => ['direct', 'agent'].includes(c.metadata?.type || '')).reduce((sum, c) => sum + c.unreadCount, 0)
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    const connectWallet = () => {
        console.log('Connecting wallet...');
    };

    const renderStoryItem = ({ item }: any) => (
        <TouchableOpacity className="items-center mr-4">
            {item.type === 'add' ? (
                <View className="w-16 h-16 rounded-full items-center justify-center border-3 border-orange-200" style={{ backgroundColor: '#FF5900' }}>
                    <Ionicons name="add" size={24} color="white" />
                </View>
            ) : (
                <View className={`w-16 h-16 rounded-full items-center justify-center ${item.hasStory ? 'border-3 p-0.5' : ''}`} style={item.hasStory ? { borderColor: '#3329CF' } : {}}>
                    <View className="w-full h-full rounded-full bg-gray-200 items-center justify-center overflow-hidden relative">
                        {item.avatar ? (
                            <Image source={{ uri: item.avatar }} className="w-full h-full" />
                        ) : (
                            <Text className="text-gray-600 font-bold text-lg">
                                {item.name.charAt(0)}
                            </Text>
                        )}
                        {item.isVerified && (
                            <View className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full items-center justify-center border-2 border-white" style={{ backgroundColor: '#3329CF' }}>
                                <Ionicons name="checkmark" size={12} color="white" />
                            </View>
                        )}
                    </View>
                </View>
            )}
            <Text className="text-xs text-gray-600 mt-2" numberOfLines={1}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const renderConversationItem = ({ item }: any) => {
        const status = getEventStatus(item);
        const statusConfig = {
            before: { color: '#3329CF', text: 'BEFORE', textColor: 'text-blue-600' },
            during: { color: '#18E299', text: 'DURING', textColor: 'text-green-600' },
            after: { color: '#FF5900', text: 'AFTER', textColor: 'text-orange-600' },
        };

        const getConversationAvatar = (conv: any) => {
            const firstLetter = (conv.metadata?.title || 'C').charAt(0);
            if (conv.metadata?.type === 'event-room') {
                return { bg: statusConfig[status].color, icon: null, text: firstLetter };
            } else if (conv.metadata?.type === 'group') {
                return { bg: '#C281FF', icon: 'people', text: null };
            } else if (conv.metadata?.type === 'agent') {
                return { bg: '#3329CF', icon: 'flash', text: null };
            } else {
                return { bg: '#6B7280', icon: 'person', text: null };
            }
        };

        const avatar = getConversationAvatar(item);

        return (
            <TouchableOpacity
                className="bg-white mx-4 mb-3 p-4 rounded-2xl shadow-sm border border-gray-100"
                onPress={() => router.push(`/chat/${item.id}`)}
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3
                }}
            >
                <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-full items-center justify-center mr-4 relative" style={{ backgroundColor: avatar.bg }}>
                        {avatar.icon ? (
                            <Ionicons name={avatar.icon as any} size={24} color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">
                                {avatar.text}
                            </Text>
                        )}
                        {item.metadata?.tokenGated && (
                            <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center" style={{ backgroundColor: '#F59E0B' }}>
                                <Ionicons name="key" size={12} color="white" />
                            </View>
                        )}
                    </View>
                    <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                            <View className="flex-row items-center flex-1">
                                <Text className="font-bold text-gray-900 text-lg" numberOfLines={1}>
                                    {item.metadata?.title || `Conversation ${item.id.slice(0, 8)}`}
                                </Text>
                                {item.metadata?.ensName && (
                                    <View className="ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E5F3FF' }}>
                                        <Text className="text-xs font-bold" style={{ color: '#3329CF' }}>ENS</Text>
                                    </View>
                                )}
                            </View>
                            <Text className="text-gray-500 text-sm">
                                {getTimeAgo(item.lastMessage?.timestamp)}
                            </Text>
                        </View>

                        {/* Message preview with sender and thread info */}
                        <View className="mb-2">
                            {item.lastMessage?.sender && (
                                <View className="flex-row items-center">
                                    <Text className="text-xs font-medium" style={{ color: '#3329CF' }}>
                                        {item.lastMessage.sender}
                                    </Text>
                                    {item.lastMessage?.isThreadReply && item.metadata?.type === 'event-room' && (
                                        <View className="flex-row items-center ml-2">
                                            <Ionicons name="chatbubble-outline" size={12} color="#18E299" />
                                            <Text className="text-xs font-medium ml-1" style={{ color: '#18E299' }}>
                                                in thread
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                            {item.metadata?.type === 'event-room' && item.metadata?.lastThreadTopic && (
                                <Text className="text-xs font-medium mb-1" style={{ color: '#C281FF' }}>
                                    💬 {item.metadata.lastThreadTopic}
                                </Text>
                            )}
                            <Text className="text-gray-600 text-sm" numberOfLines={2}>
                                {getMessagePreview(item.lastMessage)}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                {item.metadata?.type === 'event-room' && (
                                    <>
                                        <View className="px-2 py-1 rounded-full" style={{ backgroundColor: statusConfig[status].color }}>
                                            <Text className="text-white text-xs font-bold">
                                                {statusConfig[status].text}
                                            </Text>
                                        </View>
                                        <Text className="text-gray-500 text-xs ml-2">
                                            {item.metadata?.memberCount || 0} members
                                        </Text>
                                        {item.metadata?.activeThreads && (
                                            <View className="flex-row items-center ml-2">
                                                <Ionicons name="chatbubbles" size={12} color="#C281FF" />
                                                <Text className="text-xs ml-1 font-medium" style={{ color: '#C281FF' }}>
                                                    {item.metadata.activeThreads} threads
                                                </Text>
                                            </View>
                                        )}
                                        {item.metadata?.tokenGated && (
                                            <Text className="text-xs ml-2" style={{ color: '#F59E0B' }}>
                                                🔑 Token Gated
                                            </Text>
                                        )}
                                    </>
                                )}
                                {item.metadata?.type === 'group' && (
                                    <>
                                        <Text className="text-gray-500 text-xs">
                                            {item.metadata?.memberCount || 0} members
                                        </Text>
                                        {item.metadata?.tokenGated && (
                                            <Text className="text-xs ml-2" style={{ color: '#F59E0B' }}>
                                                🔑 {item.metadata?.minTokenHolding}
                                            </Text>
                                        )}
                                    </>
                                )}
                                {(item.metadata?.type === 'direct' || item.metadata?.type === 'agent') && (
                                    <Text className="text-gray-500 text-xs">
                                        {item.metadata?.type === 'agent' ? `🤖 ${item.metadata?.agentType} AI` : '💬 Direct'}
                                    </Text>
                                )}
                            </View>
                            {item.unreadCount > 0 && (
                                <View className="rounded-full min-w-[24px] h-6 items-center justify-center" style={{ backgroundColor: '#FF5900' }}>
                                    <Text className="text-white text-xs font-bold">
                                        {item.unreadCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Show authentication required
    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1" style={{ backgroundColor: '#FFF5F0' }}>
                <View className="flex-1 justify-center items-center px-6">
                    <View className="bg-white p-8 rounded-3xl shadow-lg items-center border border-gray-100">
                        <View className="w-20 h-20 rounded-full items-center justify-center mb-6" style={{ backgroundColor: '#FF5900' }}>
                            <Ionicons name="wallet-outline" size={40} color="white" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
                            Connect Your Web3 Wallet
                        </Text>
                        <Text className="text-gray-600 mb-6 text-center leading-6">
                            Join the decentralized conversation. Connect your wallet to start messaging on XMTP
                        </Text>
                        <TouchableOpacity
                            className="px-8 py-4 rounded-2xl"
                            style={{ backgroundColor: '#FF5900' }}
                            onPress={connectWallet}
                        >
                            <Text className="text-white font-bold text-lg">Connect Wallet</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Enhanced Header with Web3 elements */}
            <View className="bg-white px-4 py-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full items-center justify-center mr-3 overflow-hidden relative">
                            {user?.avatar ? (
                                <Image source={{ uri: user.avatar }} className="w-full h-full" />
                            ) : (
                                <Text className="text-white font-bold text-lg">
                                    {user?.name?.charAt(0) || 'U'}
                                </Text>
                            )}
                            <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        </View>
                        <View>
                            <View className="flex-row items-center">
                                <Text className="font-bold text-gray-900">{user?.ensName || user?.name}</Text>
                                <View className="ml-2 bg-blue-100 px-2 py-0.5 rounded-full">
                                    <Text className="text-blue-600 text-xs font-bold">VERIFIED</Text>
                                </View>
                            </View>
                            <Text className="text-gray-500 text-sm">{user?.walletAddress}</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        <TouchableOpacity className="p-2 mr-2 relative">
                            <Ionicons name="notifications-outline" size={24} color="#374151" />
                            <View className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full items-center justify-center">
                                <Text className="text-white text-xs font-bold">7</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar */}
                <View className="mt-4">
                    <View className={`flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 ${isSearchFocused ? 'border-2' : ''}`} style={isSearchFocused ? { borderColor: '#3329CF' } : {}}>
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            className="flex-1 ml-3 text-gray-900"
                            placeholder="Search conversations, users, or messages..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {/* Enhanced Tab Navigation */}
            <View className="bg-white px-4 py-3">
                <View className="flex-row bg-gray-100 rounded-2xl p-1">
                    {(['rooms', 'groups', 'friends'] as TabType[]).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-3 rounded-xl items-center ${activeTab === tab ? 'bg-black shadow-sm' : 'bg-transparent'
                                }`}
                        >
                            <View className="flex-row items-center">
                                <Text
                                    className={`font-bold capitalize ${activeTab === tab ? 'text-white' : 'text-gray-600'
                                        }`}
                                >
                                    {tab}
                                </Text>
                                {unreadCounts[tab] > 0 && (
                                    <View className="ml-2 rounded-full min-w-[20px] h-5 items-center justify-center" style={{ backgroundColor: '#FF5900' }}>
                                        <Text className="text-white text-xs font-bold">
                                            {unreadCounts[tab]}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Stories Section */}
            <View className="bg-white pt-4 pb-2">
                <FlatList
                    data={stories}
                    renderItem={renderStoryItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                />
            </View>

            {/* Time Filter (for rooms) */}
            {activeTab === 'rooms' && (
                <View className="bg-white px-4 py-3 border-t border-gray-100">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row">
                            {(['all', 'before', 'during', 'after'] as TimeFilter[]).map((filter) => (
                                <TouchableOpacity
                                    key={filter}
                                    onPress={() => setTimeFilter(filter)}
                                    className={`px-4 py-2 rounded-full mr-3 ${timeFilter === filter ? 'bg-black' : 'bg-gray-100'
                                        }`}
                                >
                                    <Text
                                        className={`font-semibold capitalize ${timeFilter === filter ? 'text-white' : 'text-gray-600'
                                            }`}
                                    >
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            )}

            {/* Conversations List */}
            <View className="flex-1 pt-4">
                {!filteredConversations || filteredConversations.length === 0 ? (
                    <View className="flex-1 justify-center items-center px-6">
                        <View className="bg-white p-8 rounded-3xl shadow-sm items-center">
                            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                                <Ionicons
                                    name={searchQuery ? 'search-outline' : (
                                        activeTab === 'rooms' ? 'people-outline' :
                                            activeTab === 'groups' ? 'chatbubbles-outline' :
                                                'person-outline'
                                    )}
                                    size={32}
                                    color="#9CA3AF"
                                />
                            </View>
                            <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
                                {searchQuery ? 'No Results Found' : (
                                    activeTab === 'rooms' && timeFilter !== 'all'
                                        ? `No ${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} Events`
                                        : activeTab === 'rooms' && 'No Event Rooms'
                                )}
                                {!searchQuery && activeTab === 'groups' && 'No Groups'}
                                {!searchQuery && activeTab === 'friends' && 'No Conversations'}
                            </Text>
                            <Text className="text-gray-600 mb-6 text-center leading-6">
                                {searchQuery ? `No conversations found for "${searchQuery}"` : (
                                    activeTab === 'rooms' ? 'Join token-gated events or public rooms to connect with builders' :
                                        activeTab === 'groups' ? 'Create or join groups to chat with your community' :
                                            'Start a conversation or chat with DeFi AI agents'
                                )}
                            </Text>
                            {!searchQuery && (
                                <TouchableOpacity
                                    className="px-6 py-3 rounded-2xl"
                                    style={{ backgroundColor: '#FF5900' }}
                                    onPress={() => {
                                        if (activeTab === 'rooms') {
                                            router.push('/explore');
                                        } else {
                                            setShowCreateSheet(true);
                                        }
                                    }}
                                >
                                    <Text className="text-white font-bold">
                                        {activeTab === 'rooms' && 'Explore Events'}
                                        {activeTab === 'groups' && 'Create Group'}
                                        {activeTab === 'friends' && 'Start Chat'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ) : (
                    <FlatList
                        data={filteredConversations}
                        renderItem={renderConversationItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={handleRefresh}
                                tintColor="#FF5900"
                            />
                        }
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}
            </View>

            {/* Enhanced Floating Action Button */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: '#FF5900' }}
                onPress={() => setShowCreateSheet(true)}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>

            {/* Messaging-specific Bottom Sheet */}
            <MessagingBottomSheet
                isVisible={showCreateSheet}
                onClose={() => setShowCreateSheet(false)}
                activeTab={activeTab}
            />
        </SafeAreaView>
    );
}