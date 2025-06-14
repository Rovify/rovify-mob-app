import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Sidebar } from '../../src/components/layout/Sidebar';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { getDeviceInfo, getDesignTokens } from '../../src/utils/responsive';
import { CustomHeader } from '@/components/layout/Header';

interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    price: string;
    image: string;
    category: string;
}

export default function ExploreScreen() {
    const [selectedCategory, setSelectedCategory] = useState('Popular');
    const [showSidebar, setShowSidebar] = useState(false);

    const device = getDeviceInfo();
    const tokens = getDesignTokens();

    const categories = [
        { id: 'popular', name: 'Popular', icon: 'flame' },
        { id: 'nightlife', name: 'Nightlife', icon: 'moon' },
        { id: 'music', name: 'Music', icon: 'musical-notes' },
        { id: 'culture', name: 'Culture', icon: 'library' },
        { id: 'cinema', name: 'Cinema', icon: 'film' }
    ];

    const dummyEvents: Event[] = [
        {
            id: '1',
            title: 'The Man Esclusivе 2025 | Nairobi',
            date: 'Sat, Jan 1',
            location: 'Jonah Jang Crescent',
            price: 'Free',
            image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
            category: 'popular'
        },
        {
            id: '2',
            title: 'Panydoesart x DNJ Studios Sip & Paint',
            date: 'Thur, Feb 7',
            location: 'Don & Divas Lounge',
            price: 'Starts from $25',
            image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
            category: 'culture'
        },
        {
            id: '3',
            title: 'Tidal Rave - the 8th wonder | Mombasa',
            date: 'Fri, Feb 8',
            location: 'Mombasa Beach Resort',
            price: 'From $40',
            image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
            category: 'music'
        },
        {
            id: '4',
            title: 'Crypto Meetup Nairobi',
            date: 'Wed, Feb 12',
            location: 'iHub Nairobi',
            price: 'Free',
            image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400',
            category: 'popular'
        }
    ];

    const filteredEvents = selectedCategory === 'Popular'
        ? dummyEvents
        : dummyEvents.filter(event => event.category === selectedCategory.toLowerCase());

    const renderEventCard = ({ item }: { item: Event }) => (
        <TouchableOpacity
            onPress={() => router.push(`/event/${item.id}`)}
            style={{
                marginRight: tokens.spacing.md,
                width: device.isSmallDevice ? 240 : 280,
                ...tokens.shadows.md
            }}
        >
            <View
                style={{
                    backgroundColor: 'white',
                    borderRadius: tokens.borderRadius.xl,
                    overflow: 'hidden'
                }}
            >
                <ImageBackground
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: device.isSmallDevice ? 120 : 140 }}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 60,
                            justifyContent: 'flex-end',
                            padding: tokens.spacing.sm
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: tokens.typography.sm }}>
                            {item.price}
                        </Text>
                    </LinearGradient>
                </ImageBackground>

                <View style={{ padding: tokens.spacing.md }}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: '#1F2937',
                            fontSize: tokens.typography.lg,
                            marginBottom: tokens.spacing.xs
                        }}
                        numberOfLines={2}
                    >
                        {item.title}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.xs }}>
                        <Ionicons name="calendar-outline" size={14} color="#F97316" />
                        <Text style={{
                            color: '#F97316',
                            marginLeft: tokens.spacing.xs,
                            fontWeight: '500',
                            fontSize: tokens.typography.sm
                        }}>
                            {item.date}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="location-outline" size={14} color="#6B7280" />
                        <Text style={{
                            color: '#6B7280',
                            marginLeft: tokens.spacing.xs,
                            fontSize: tokens.typography.sm,
                            flex: 1
                        }} numberOfLines={1}>
                            {item.location}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper mode="edge-to-edge" backgroundColor="#F9FAFB">
            {/* Background Gradient */}
            <LinearGradient
                colors={['#F97316', '#EA580C', '#F9FAFB']}
                locations={[0, 0.3, 1]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%' }}
            />

            <CustomHeader
                variant="transparent"
                extend={true}
                showUserAvatar={true}
                location="Nairobi, Kenya"
                showMenuButton={true}
                onMenuPress={() => setShowSidebar(true)}
                rightActions={[
                    {
                        icon: 'notifications-outline',
                        onPress: () => console.log('Notifications'),
                        badge: 3
                    }
                ]}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: tokens.spacing.xxl }}
            >
                {/* Search Bar */}
                <View style={{ paddingHorizontal: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            borderRadius: tokens.borderRadius.full,
                            paddingHorizontal: tokens.spacing.md,
                            paddingVertical: tokens.spacing.sm,
                            ...tokens.shadows.sm
                        }}
                    >
                        <Ionicons name="search" size={20} color="#6B7280" />
                        <TextInput
                            placeholder="Find your moments"
                            style={{
                                flex: 1,
                                marginLeft: tokens.spacing.sm,
                                color: '#1F2937',
                                fontSize: tokens.typography.base
                            }}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                {/* Categories */}
                <View style={{ paddingHorizontal: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', gap: tokens.spacing.md }}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    onPress={() => setSelectedCategory(category.name)}
                                    style={{ alignItems: 'center', minWidth: 70 }}
                                >
                                    <View
                                        style={{
                                            width: device.isSmallDevice ? 50 : 60,
                                            height: device.isSmallDevice ? 50 : 60,
                                            borderRadius: tokens.borderRadius.full,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: tokens.spacing.xs,
                                            backgroundColor: selectedCategory === category.name
                                                ? 'white'
                                                : 'rgba(255,255,255,0.2)',
                                            ...tokens.shadows.sm
                                        }}
                                    >
                                        <Ionicons
                                            name={category.icon as any}
                                            size={device.isSmallDevice ? 20 : 24}
                                            color={selectedCategory === category.name ? '#F97316' : 'white'}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: tokens.typography.sm,
                                            textAlign: 'center',
                                            fontWeight: '500',
                                            color: selectedCategory === category.name ? 'white' : 'rgba(255,255,255,0.8)'
                                        }}
                                    >
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Quick Filters */}
                <View style={{ paddingHorizontal: tokens.spacing.md, marginBottom: tokens.spacing.xl }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', gap: tokens.spacing.sm }}>
                            {['Nairobi', 'This Weekend', 'Any price', 'Nearby'].map((filter, index) => (
                                <TouchableOpacity
                                    key={filter}
                                    style={{
                                        paddingHorizontal: tokens.spacing.md,
                                        paddingVertical: tokens.spacing.xs,
                                        borderRadius: tokens.borderRadius.full,
                                        backgroundColor: index === 0
                                            ? 'white'
                                            : 'rgba(255,255,255,0.2)',
                                        borderWidth: index === 0 ? 0 : 1,
                                        borderColor: 'rgba(255,255,255,0.3)'
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontWeight: '500',
                                            fontSize: tokens.typography.sm,
                                            color: index === 0 ? '#1F2937' : 'white'
                                        }}
                                    >
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Content Container */}
                <View
                    style={{
                        backgroundColor: 'white',
                        borderTopLeftRadius: tokens.borderRadius.xl,
                        borderTopRightRadius: tokens.borderRadius.xl,
                        minHeight: device.height * 0.6,
                        paddingTop: tokens.spacing.lg
                    }}
                >
                    {/* Upcoming Events */}
                    <View style={{ paddingHorizontal: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: tokens.spacing.md
                        }}>
                            <Text style={{
                                fontSize: tokens.typography['2xl'],
                                fontWeight: 'bold',
                                color: '#1F2937'
                            }}>
                                Upcoming Events
                            </Text>
                            <TouchableOpacity>
                                <Text style={{ color: '#F97316', fontWeight: '500', fontSize: tokens.typography.base }}>
                                    See all
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={filteredEvents}
                            renderItem={renderEventCard}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: tokens.spacing.md }}
                        />
                    </View>

                    {/* Trending Events */}
                    <View style={{ paddingHorizontal: tokens.spacing.md }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: tokens.spacing.md
                        }}>
                            <Text style={{
                                fontSize: tokens.typography['2xl'],
                                fontWeight: 'bold',
                                color: '#1F2937'
                            }}>
                                Trending
                            </Text>
                            <TouchableOpacity>
                                <Text style={{ color: '#F97316', fontWeight: '500', fontSize: tokens.typography.base }}>
                                    See all
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ gap: tokens.spacing.sm }}>
                            {dummyEvents.slice(0, 3).map((event) => (
                                <TouchableOpacity
                                    key={`trending-${event.id}`}
                                    onPress={() => router.push(`/event/${event.id}`)}
                                    style={{
                                        flexDirection: 'row',
                                        backgroundColor: '#F9FAFB',
                                        borderRadius: tokens.borderRadius.lg,
                                        padding: tokens.spacing.sm,
                                        ...tokens.shadows.sm
                                    }}
                                >
                                    <Image
                                        source={{ uri: event.image }}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: tokens.borderRadius.md,
                                            marginRight: tokens.spacing.sm
                                        }}
                                        resizeMode="cover"
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontWeight: '600',
                                                color: '#1F2937',
                                                fontSize: tokens.typography.base,
                                                marginBottom: tokens.spacing.xs
                                            }}
                                            numberOfLines={2}
                                        >
                                            {event.title}
                                        </Text>
                                        <Text style={{
                                            color: '#F97316',
                                            fontSize: tokens.typography.sm,
                                            fontWeight: '500',
                                            marginBottom: tokens.spacing.xs
                                        }}>
                                            {event.date}
                                        </Text>
                                        <Text style={{
                                            color: '#6B7280',
                                            fontSize: tokens.typography.sm
                                        }} numberOfLines={1}>
                                            {event.location}
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={{
                                            color: '#F97316',
                                            fontWeight: 'bold',
                                            fontSize: tokens.typography.sm
                                        }}>
                                            {event.price}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Sidebar */}
            <Sidebar
                isVisible={showSidebar}
                onClose={() => setShowSidebar(false)}
            />
        </ScreenWrapper>
    );
}