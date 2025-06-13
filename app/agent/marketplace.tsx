import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { AgentManager, Agent } from '../../src/services/agents/agentManager';
import { useMessaging } from '../../src/hooks/useMessaging';
import { getDeviceInfo, getDesignTokens } from '../../src/utils/responsive';
import { CustomHeader } from '@/components/layout/Header';

export default function AgentMarketplace() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const device = getDeviceInfo();
    const tokens = getDesignTokens();
    const { startConversation } = useMessaging();

    const agentManager = new AgentManager();
    const allAgents = agentManager.getAllAgents();

    const categories = [
        { id: 'all', name: 'All', icon: 'apps' },
        { id: 'trading', name: 'Trading', icon: 'trending-up' },
        { id: 'events', name: 'Events', icon: 'calendar' },
        { id: 'social', name: 'Social', icon: 'people' },
        { id: 'utility', name: 'Utility', icon: 'construct' }
    ];

    const filteredAgents = allAgents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const startChatWithAgent = async (agent: Agent) => {
        try {
            const conversation = await startConversation(agent.walletAddress, {
                title: agent.name,
                type: 'agent'
            });

            // Set up agent context
            agentManager.startChatWithAgent(agent.id, conversation.topic);

            router.push(`/chat/${conversation.topic}`);
        } catch (error) {
            console.error('Failed to start chat with agent:', error);
        }
    };

    const renderAgentCard = ({ item }: { item: Agent }) => (
        <TouchableOpacity
            onPress={() => startChatWithAgent(item)}
            style={{
                backgroundColor: 'white',
                marginRight: tokens.spacing.md,
                borderRadius: tokens.borderRadius.xl,
                padding: tokens.spacing.md,
                width: device.width * 0.8,
                maxWidth: 300,
                ...tokens.shadows.md
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.sm }}>
                <View
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: tokens.borderRadius.lg,
                        backgroundColor: '#FEF3C7',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: tokens.spacing.sm
                    }}
                >
                    <Text style={{ fontSize: 24 }}>{item.avatar}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: tokens.typography.lg,
                        fontWeight: 'bold',
                        color: '#1F2937',
                        marginBottom: tokens.spacing.xs
                    }}>
                        {item.name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: tokens.spacing.sm }}>
                            <Ionicons name="star" size={14} color="#F59E0B" />
                            <Text style={{ fontSize: tokens.typography.sm, color: '#6B7280', marginLeft: 2 }}>
                                {item.rating}
                            </Text>
                        </View>
                        <Text style={{ fontSize: tokens.typography.sm, color: '#6B7280' }}>
                            {item.users} users
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{
                        fontSize: tokens.typography.sm,
                        fontWeight: 'bold',
                        color: item.price === 'Free' ? '#10B981' : '#F97316'
                    }}>
                        {item.price === 'Free' ? 'Free' : `${item.price} ETH`}
                    </Text>
                </View>
            </View>

            <Text style={{
                fontSize: tokens.typography.sm,
                color: '#6B7280',
                marginBottom: tokens.spacing.sm,
                lineHeight: 18
            }}>
                {item.description}
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.xs }}>
                {item.capabilities.slice(0, 3).map((capability) => (
                    <View
                        key={capability.id}
                        style={{
                            backgroundColor: '#F3F4F6',
                            paddingHorizontal: tokens.spacing.sm,
                            paddingVertical: tokens.spacing.xs,
                            borderRadius: tokens.borderRadius.md
                        }}
                    >
                        <Text style={{ fontSize: tokens.typography.xs, color: '#6B7280' }}>
                            {capability.name}
                        </Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );

    const renderGridAgentCard = ({ item }: { item: Agent }) => (
        <TouchableOpacity
            onPress={() => startChatWithAgent(item)}
            style={{
                backgroundColor: 'white',
                borderRadius: tokens.borderRadius.lg,
                padding: tokens.spacing.md,
                marginBottom: tokens.spacing.md,
                ...tokens.shadows.sm
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: tokens.borderRadius.lg,
                        backgroundColor: '#FEF3C7',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: tokens.spacing.sm
                    }}
                >
                    <Text style={{ fontSize: 20 }}>{item.avatar}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: tokens.typography.base,
                        fontWeight: 'bold',
                        color: '#1F2937'
                    }}>
                        {item.name}
                    </Text>
                    <Text style={{
                        fontSize: tokens.typography.sm,
                        color: '#6B7280'
                    }} numberOfLines={2}>
                        {item.description}
                    </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{
                        fontSize: tokens.typography.sm,
                        fontWeight: 'bold',
                        color: item.price === 'Free' ? '#10B981' : '#F97316'
                    }}>
                        {item.price === 'Free' ? 'Free' : `${item.price} ETH`}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text style={{ fontSize: tokens.typography.xs, color: '#6B7280', marginLeft: 2 }}>
                            {item.rating}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper mode="safe" backgroundColor="#F9FAFB">
            <CustomHeader
                title="AI Agents"
                subtitle="Discover powerful AI assistants"
                showBackButton
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={{ padding: tokens.spacing.md }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            borderRadius: tokens.borderRadius.full,
                            paddingHorizontal: tokens.spacing.md,
                            paddingVertical: tokens.spacing.sm,
                            ...tokens.shadows.sm
                        }}
                    >
                        <Ionicons name="search" size={20} color="#6B7280" />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search agents..."
                            style={{
                                flex: 1,
                                marginLeft: tokens.spacing.sm,
                                fontSize: tokens.typography.base,
                                color: '#1F2937'
                            }}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Categories */}
                <View style={{ paddingHorizontal: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', gap: tokens.spacing.sm }}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    onPress={() => setSelectedCategory(category.id)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingHorizontal: tokens.spacing.md,
                                        paddingVertical: tokens.spacing.sm,
                                        borderRadius: tokens.borderRadius.full,
                                        backgroundColor: selectedCategory === category.id ? '#1F2937' : 'white',
                                        ...tokens.shadows.sm
                                    }}
                                >
                                    <Ionicons
                                        name={category.icon as any}
                                        size={16}
                                        color={selectedCategory === category.id ? 'white' : '#6B7280'}
                                    />
                                    <Text style={{
                                        marginLeft: tokens.spacing.xs,
                                        fontSize: tokens.typography.sm,
                                        fontWeight: '500',
                                        color: selectedCategory === category.id ? 'white' : '#6B7280'
                                    }}>
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Featured Agents */}
                <View style={{ paddingHorizontal: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
                    <Text style={{
                        fontSize: tokens.typography.xl,
                        fontWeight: 'bold',
                        color: '#1F2937',
                        marginBottom: tokens.spacing.md
                    }}>
                        Featured Agents
                    </Text>

                    <FlatList
                        data={filteredAgents.slice(0, 3)}
                        renderItem={renderAgentCard}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: tokens.spacing.md }}
                    />
                </View>

                {/* All Agents */}
                <View style={{ paddingHorizontal: tokens.spacing.md }}>
                    <Text style={{
                        fontSize: tokens.typography.xl,
                        fontWeight: 'bold',
                        color: '#1F2937',
                        marginBottom: tokens.spacing.md
                    }}>
                        All Agents ({filteredAgents.length})
                    </Text>

                    <FlatList
                        data={filteredAgents}
                        renderItem={renderGridAgentCard}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                    />
                </View>

                <View style={{ height: tokens.spacing.xl }} />
            </ScrollView>
        </ScreenWrapper>
    );
}