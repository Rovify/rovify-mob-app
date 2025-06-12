import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    Animated,
    Dimensions,
    Modal,
    RefreshControl,
    ActivityIndicator,
    Vibration
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ExploreHeader } from '@/components/layout/Header';

interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    price: string;
    image: string;
    category: string;
    attendees: number;
    isLive?: boolean;
    isTrending?: boolean;
    isFeatured?: boolean;
    isNew?: boolean;
    rating: number;
    host: string;
    tags: string[];
    description: string;
    distance?: string;
}

export default function ExploreScreen() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const scrollY = useRef(new Animated.Value(0)).current;
    const headerOpacity = useRef(new Animated.Value(1)).current;
    const searchScale = useRef(new Animated.Value(1)).current;
    const { width, height } = Dimensions.get('window');

    const categories = [
        { id: 'all', name: 'All', icon: 'apps', count: 156, color: '#3B82F6' },
        { id: 'popular', name: 'Popular', icon: 'flame', count: 42, color: '#EF4444' },
        { id: 'nightlife', name: 'Nightlife', icon: 'moon', count: 28, color: '#8B5CF6' },
        { id: 'music', name: 'Music', icon: 'musical-notes', count: 34, color: '#10B981' },
        { id: 'culture', name: 'Culture', icon: 'library', count: 19, color: '#F59E0B' },
        { id: 'cinema', name: 'Cinema', icon: 'film', count: 12, color: '#EC4899' },
        { id: 'sports', name: 'Sports', icon: 'basketball', count: 15, color: '#06B6D4' },
        { id: 'food', name: 'Food', icon: 'restaurant', count: 8, color: '#84CC16' },
        { id: 'tech', name: 'Tech', icon: 'laptop', count: 25, color: '#6366F1' },
        { id: 'art', name: 'Art', icon: 'brush', count: 16, color: '#F97316' }
    ];

    const quickFilters = [
        { id: 'all', name: 'All', icon: 'apps' },
        { id: 'today', name: 'Today', icon: 'today' },
        { id: 'weekend', name: 'This Weekend', icon: 'calendar' },
        { id: 'free', name: 'Free Events', icon: 'gift' },
        { id: 'nearby', name: 'Nearby', icon: 'location' },
        { id: 'vip', name: 'VIP Events', icon: 'star' },
        { id: 'virtual', name: 'Virtual', icon: 'videocam' }
    ];

    const dummyEvents: Event[] = [
        {
            id: '1',
            title: 'The Man Esclusivе 2025 | Nairobi',
            date: 'Jan 1',
            time: '8:00 PM',
            location: 'Jonah Jang Crescent',
            price: 'Free',
            image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
            category: 'popular',
            attendees: 1247,
            isLive: true,
            isTrending: true,
            isFeatured: true,
            isNew: true,
            rating: 4.8,
            host: 'Event Masters Kenya',
            tags: ['Exclusive', 'Networking', 'Premium'],
            description: 'The most exclusive networking event of the year',
            distance: '2.1 km'
        },
        {
            id: '2',
            title: 'Base Buildathon 2025 | Crypto Conference',
            date: 'Jan 5',
            time: '9:00 AM',
            location: 'KICC Convention Center',
            price: '$50',
            image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400',
            category: 'tech',
            attendees: 856,
            isTrending: true,
            isNew: true,
            rating: 4.9,
            host: 'Blockchain Kenya',
            tags: ['Technology', 'Networking', 'Education', 'Base', 'Web3'],
            description: 'Build the future of decentralized applications on Base',
            distance: '5.3 km'
        },
        {
            id: '3',
            title: 'Tidal Rave - the 8th wonder',
            date: 'Feb 8',
            time: '10:00 PM',
            location: 'Mombasa Beach Resort',
            price: 'From $40',
            image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
            category: 'music',
            attendees: 2134,
            isFeatured: true,
            rating: 4.7,
            host: 'Tidal Events',
            tags: ['Beach Party', 'Electronic', 'All Night'],
            description: 'Epic beach rave with international DJs',
            distance: '450 km'
        },
        {
            id: '4',
            title: 'Contemporary Art Gallery Opening',
            date: 'Jan 15',
            time: '6:00 PM',
            location: 'National Gallery',
            price: '$15',
            image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
            category: 'culture',
            attendees: 324,
            rating: 4.5,
            host: 'Nairobi Arts Collective',
            tags: ['Art', 'Culture', 'Networking'],
            description: 'Discover emerging contemporary artists',
            distance: '3.7 km'
        },
        {
            id: '5',
            title: 'Jazz Night Under The Stars',
            date: 'Jan 20',
            time: '7:30 PM',
            location: 'Java House Gardens',
            price: '$25',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
            category: 'music',
            attendees: 567,
            rating: 4.6,
            host: 'Jazz Society Kenya',
            tags: ['Jazz', 'Live Music', 'Outdoor'],
            description: 'Smooth jazz in a magical garden setting',
            distance: '1.8 km'
        },
        {
            id: '6',
            title: 'Tech Startup Pitch Night',
            date: 'Jan 25',
            time: '6:00 PM',
            location: 'iHub Nairobi',
            price: 'Free',
            image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
            category: 'tech',
            attendees: 445,
            rating: 4.4,
            host: 'Startup Grind Nairobi',
            tags: ['Startup', 'Technology', 'Networking'],
            description: 'Watch innovative startups pitch their ideas',
            distance: '4.2 km'
        },
        {
            id: '7',
            title: 'Food Festival Extravaganza',
            date: 'Feb 1',
            time: '12:00 PM',
            location: 'Uhuru Park',
            price: '$20',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
            category: 'food',
            attendees: 1500,
            isFeatured: true,
            rating: 4.7,
            host: 'Nairobi Food Network',
            tags: ['Food', 'Family', 'Outdoor'],
            description: 'Taste the best cuisine from around the world',
            distance: '2.9 km'
        }
    ];

    const featuredEvents = dummyEvents.filter(event => event.isFeatured);
    const trendingEvents = dummyEvents.filter(event => event.isTrending);
    const liveEvents = dummyEvents.filter(event => event.isLive);
    const newEvents = dummyEvents.filter(event => event.isNew);

    const filteredEvents = selectedCategory === 'All'
        ? dummyEvents
        : dummyEvents.filter(event => event.category === selectedCategory.toLowerCase());

    // Animated scroll handler
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: false,
            listener: (event: any) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                const opacity = offsetY > 50 ? 0.8 : 1;
                headerOpacity.setValue(opacity);
            }
        }
    );

    // Pull to refresh
    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        Vibration.vibrate(50);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsRefreshing(false);
    }, []);

    // Search animation
    const animateSearch = () => {
        Animated.sequence([
            Animated.timing(searchScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(searchScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const renderCategoryItem = ({ item, index }: { item: typeof categories[0], index: number }) => {
        const isSelected = selectedCategory === item.name;
        const animatedValue = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(animatedValue, {
                toValue: isSelected ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }, [isSelected, animatedValue]);

        return (
            <TouchableOpacity
                key={item.id}
                onPress={() => {
                    setSelectedCategory(item.name);
                    Vibration.vibrate(30);
                }}
                className="items-center mr-6"
                style={{ marginLeft: index === 0 ? 24 : 0 }}
            >
                <Animated.View
                    className="w-16 h-16 rounded-2xl items-center justify-center mb-3 relative"
                    style={{
                        backgroundColor: isSelected ? item.color : `${item.color}20`,
                        transform: [{
                            scale: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.1]
                            })
                        }],
                        shadowColor: item.color,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.3]
                        }),
                        shadowRadius: 8,
                        elevation: isSelected ? 8 : 0
                    }}
                >
                    <Ionicons
                        name={item.icon as any}
                        size={24}
                        color={isSelected ? 'white' : item.color}
                    />

                    {/* Pulse effect for selected */}
                    {isSelected && (
                        <Animated.View
                            className="absolute inset-0 rounded-2xl"
                            style={{
                                backgroundColor: item.color,
                                opacity: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 0.2]
                                })
                            }}
                        />
                    )}

                    {/* Count badge */}
                    {item.count > 0 && (
                        <Animated.View
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center"
                            style={{
                                transform: [{
                                    scale: animatedValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 1.2]
                                    })
                                }]
                            }}
                        >
                            <Text className="text-white text-xs font-bold">{item.count}</Text>
                        </Animated.View>
                    )}
                </Animated.View>

                <Text
                    className={`text-sm font-medium text-center ${isSelected ? 'text-gray-900' : 'text-gray-600'
                        }`}
                    style={{ color: isSelected ? item.color : '#6B7280' }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderEventCard = ({ item, variant = 'default' }: { item: Event, variant?: 'featured' | 'trending' | 'default' | 'new' }) => {
        const cardWidth = variant === 'featured' ? width - 48 : variant === 'trending' ? width * 0.85 : width * 0.75;
        const cardScale = useRef(new Animated.Value(1)).current;

        const handlePressIn = () => {
            Animated.timing(cardScale, {
                toValue: 0.95,
                duration: 150,
                useNativeDriver: true,
            }).start();
        };

        const handlePressOut = () => {
            Animated.timing(cardScale, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        };

        return (
            <Animated.View
                style={{
                    width: cardWidth,
                    transform: [{ scale: cardScale }]
                }}
                className={variant === 'default' ? 'mr-4' : 'mr-6'}
            >
                <TouchableOpacity
                    onPress={() => {
                        Vibration.vibrate(40);
                        router.push(`/event/${item.id}`);
                    }}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.9}
                >
                    <View className="bg-white rounded-3xl shadow-lg overflow-hidden">
                        {/* Event Image with enhanced overlays */}
                        <View className="relative">
                            <Image
                                source={{ uri: item.image }}
                                style={{ width: cardWidth, height: variant === 'featured' ? 220 : 180 }}
                                resizeMode="cover"
                            />

                            {/* Multiple gradient overlays for depth */}
                            <LinearGradient
                                colors={['rgba(0,0,0,0.1)', 'transparent', 'rgba(0,0,0,0.8)']}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                }}
                            />

                            {/* Status badges */}
                            <View className="absolute top-3 left-3 flex-row space-x-2">
                                {item.isLive && (
                                    <Animated.View className="bg-red-500 px-3 py-1 rounded-full flex-row items-center">
                                        <Animated.View className="w-2 h-2 bg-white rounded-full mr-2" />
                                        <Text className="text-white text-xs font-bold">LIVE</Text>
                                    </Animated.View>
                                )}

                                {item.isNew && (
                                    <View className="bg-green-500 px-3 py-1 rounded-full">
                                        <Text className="text-white text-xs font-bold">NEW</Text>
                                    </View>
                                )}
                            </View>

                            {/* Trending badge with fire animation */}
                            {item.isTrending && (
                                <View className="absolute top-3 right-3 bg-orange-500 px-3 py-1 rounded-full">
                                    <Text className="text-white text-xs font-bold">🔥 TRENDING</Text>
                                </View>
                            )}

                            {/* Enhanced quick actions */}
                            <View className="absolute bottom-3 right-3 flex-row space-x-2">
                                <TouchableOpacity
                                    className="w-10 h-10 bg-white bg-opacity-95 rounded-full items-center justify-center"
                                    onPress={() => Vibration.vibrate(30)}
                                >
                                    <Ionicons name="heart-outline" size={18} color="#374151" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="w-10 h-10 bg-white bg-opacity-95 rounded-full items-center justify-center"
                                    onPress={() => Vibration.vibrate(30)}
                                >
                                    <Ionicons name="share-outline" size={18} color="#374151" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="w-10 h-10 bg-white bg-opacity-95 rounded-full items-center justify-center"
                                    onPress={() => Vibration.vibrate(30)}
                                >
                                    <Ionicons name="bookmark-outline" size={18} color="#374151" />
                                </TouchableOpacity>
                            </View>

                            {/* Price with better styling */}
                            <View className="absolute bottom-3 left-3">
                                <BlurView intensity={80} className="px-4 py-2 rounded-full">
                                    <Text className="text-orange-600 font-bold text-sm">{item.price}</Text>
                                </BlurView>
                            </View>

                            {/* Distance indicator */}
                            {item.distance && (
                                <View className="absolute top-3 right-3" style={{ marginTop: item.isTrending ? 35 : 0 }}>
                                    <BlurView intensity={60} className="px-3 py-1 rounded-full">
                                        <View className="flex-row items-center">
                                            <Ionicons name="location" size={12} color="#6B7280" />
                                            <Text className="text-gray-700 text-xs font-medium ml-1">{item.distance}</Text>
                                        </View>
                                    </BlurView>
                                </View>
                            )}
                        </View>

                        {/* Enhanced Event Details */}
                        <View className="p-5">
                            {/* Rating and attendance */}
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center">
                                    <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-full">
                                        <Ionicons name="star" size={14} color="#F59E0B" />
                                        <Text className="text-yellow-600 font-semibold text-sm ml-1">{item.rating}</Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-full">
                                    <Ionicons name="people" size={14} color="#6B7280" />
                                    <Text className="text-gray-600 text-sm font-medium ml-1">
                                        {item.attendees.toLocaleString()}
                                    </Text>
                                </View>
                            </View>

                            <Text className="font-bold text-gray-900 text-lg mb-3 leading-tight" numberOfLines={2}>
                                {item.title}
                            </Text>

                            {/* Enhanced tags */}
                            <View className="flex-row flex-wrap mb-4">
                                {item.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <View
                                        key={`${item.id}-tag-${tagIndex}`}
                                        className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2"
                                    >
                                        <Text className="text-gray-700 text-xs font-medium">{tag}</Text>
                                    </View>
                                ))}
                                {item.tags.length > 3 && (
                                    <View className="bg-orange-100 px-3 py-1 rounded-full">
                                        <Text className="text-orange-600 text-xs font-bold">
                                            +{item.tags.length - 3}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Date, time and location */}
                            <View className="space-y-2 mb-4">
                                <View className="flex-row items-center">
                                    <Ionicons name="calendar" size={16} color="#F97316" />
                                    <Text className="text-orange-600 ml-3 font-semibold text-sm">{item.date}</Text>
                                    <Text className="text-gray-500 ml-2 text-sm">{item.time}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Ionicons name="location" size={16} color="#6B7280" />
                                    <Text className="text-gray-600 ml-3 text-sm flex-1" numberOfLines={1}>
                                        {item.location}
                                    </Text>
                                </View>
                            </View>

                            {/* Host info */}
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center flex-1">
                                    <View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center mr-3">
                                        <Ionicons name="person" size={14} color="#6B7280" />
                                    </View>
                                    <Text className="text-gray-600 text-sm font-medium flex-1" numberOfLines={1}>
                                        {item.host}
                                    </Text>
                                </View>

                                {/* Join button with animation */}
                                <TouchableOpacity
                                    className="bg-orange-500 px-6 py-3 rounded-full shadow-lg"
                                    style={{
                                        shadowColor: '#F97316',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 4,
                                        elevation: 4
                                    }}
                                    onPress={() => {
                                        Vibration.vibrate(50);
                                        router.push(`/event/${item.id}`);
                                    }}
                                >
                                    <Text className="text-white font-bold text-sm">Join Event</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderSearchModal = () => (
        <Modal
            visible={showSearchModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowSearchModal(false)}
        >
            <SafeAreaView className="flex-1 bg-white">
                {/* Enhanced search header */}
                <View className="flex-row items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <TouchableOpacity
                        onPress={() => setShowSearchModal(false)}
                        className="mr-4 w-10 h-10 items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>

                    <Animated.View
                        className="flex-1 bg-white rounded-2xl px-4 py-3 shadow-sm"
                        style={{
                            transform: [{ scale: searchScale }],
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 4
                        }}
                    >
                        <TextInput
                            placeholder="Search events, venues, hosts..."
                            className="text-gray-900 text-16"
                            autoFocus
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onFocus={animateSearch}
                        />
                    </Animated.View>

                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            className="ml-3 w-10 h-10 items-center justify-center"
                            onPress={() => setSearchQuery('')}
                        >
                            <Ionicons name="close-circle" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView className="flex-1 px-6 py-4">
                    {/* Quick search suggestions */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Quick Suggestions</Text>
                        <View className="flex-row flex-wrap">
                            {['Base buildathon', 'Jazz music', 'Art gallery', 'Tech meetup', 'Food festival'].map((suggestion, suggestionIndex) => (
                                <TouchableOpacity
                                    key={`suggestion-${suggestionIndex}`}
                                    className="bg-orange-100 px-4 py-2 rounded-full mr-3 mb-3"
                                    onPress={() => setSearchQuery(suggestion)}
                                >
                                    <Text className="text-orange-600 font-medium text-sm">{suggestion}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Recent searches */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Recent Searches</Text>
                        {['Crypto events', 'Jazz night', 'Art gallery'].map((search, searchIndex) => (
                            <TouchableOpacity
                                key={`recent-${searchIndex}`}
                                className="flex-row items-center py-3 border-b border-gray-50"
                                onPress={() => setSearchQuery(search)}
                            >
                                <Ionicons name="time-outline" size={20} color="#9CA3AF" />
                                <Text className="ml-3 text-gray-700 flex-1">{search}</Text>
                                <Ionicons name="arrow-up-outline" size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Trending searches */}
                    <View>
                        <Text className="text-lg font-bold text-gray-900 mb-4">🔥 Trending Searches</Text>
                        {['Base buildathon', 'Web3 meetup', 'DeFi conference', 'Crypto trading'].map((search, trendingIndex) => (
                            <TouchableOpacity
                                key={`trending-${trendingIndex}`}
                                className="flex-row items-center py-3 border-b border-gray-50"
                                onPress={() => setSearchQuery(search)}
                            >
                                <Ionicons name="trending-up" size={20} color="#F97316" />
                                <Text className="ml-3 text-gray-700 flex-1">{search}</Text>
                                <View className="bg-orange-100 px-2 py-1 rounded-full">
                                    <Text className="text-orange-600 text-xs font-bold">Hot</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );

    return (
        <View className="flex-1 bg-white">
            <Animated.View style={{ opacity: headerOpacity }}>
                <ExploreHeader
                    onSearchPress={() => setShowSearchModal(true)}
                    onNotificationPress={() => Vibration.vibrate(30)}
                    onProfilePress={() => Vibration.vibrate(30)}
                />
            </Animated.View>

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor="#F97316"
                        colors={['#F97316']}
                        progressBackgroundColor="#FFF"
                    />
                }
            >
                {/* Enhanced Categories */}
                <View className="py-6">
                    <View className="flex-row items-center justify-between px-6 mb-4">
                        <Text className="text-xl font-bold text-gray-900">Categories</Text>
                        <TouchableOpacity onPress={() => setShowFilters(true)}>
                            <Ionicons name="options" size={24} color="#F97316" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={categories}
                        renderItem={renderCategoryItem}
                        keyExtractor={(item) => `category-${item.id}`}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 24 }}
                    />
                </View>

                {/* Enhanced Quick Filters */}
                <View className="px-6 pb-6">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row space-x-3">
                            {quickFilters.map((filter, filterIndex) => (
                                <TouchableOpacity
                                    key={`filter-${filter.id}`}
                                    onPress={() => {
                                        setSelectedFilter(filter.name);
                                        Vibration.vibrate(30);
                                    }}
                                    className={`flex-row items-center px-5 py-3 rounded-2xl ${selectedFilter === filter.name
                                        ? 'bg-black'
                                        : 'bg-gray-100'
                                        }`}
                                    style={{
                                        shadowColor: selectedFilter === filter.name ? '#000' : 'transparent',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: selectedFilter === filter.name ? 4 : 0
                                    }}
                                >
                                    <Ionicons
                                        name={filter.icon as any}
                                        size={16}
                                        color={selectedFilter === filter.name ? 'white' : '#6B7280'}
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text
                                        className={`font-semibold ${selectedFilter === filter.name ? 'text-white' : 'text-gray-700'
                                            }`}
                                    >
                                        {filter.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* New Events Section */}
                {newEvents.length > 0 && (
                    <View className="mb-8">
                        <View className="flex-row items-center justify-between px-6 mb-4">
                            <Text className="text-xl font-bold text-gray-900">✨ Just Added</Text>
                            <TouchableOpacity>
                                <Text className="text-orange-600 font-semibold">See all</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={newEvents}
                            renderItem={({ item }) => renderEventCard({ item, variant: 'new' })}
                            keyExtractor={(item) => `new-${item.id}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
                        />
                    </View>
                )}

                {/* Live Events */}
                {liveEvents.length > 0 && (
                    <View className="mb-8">
                        <View className="flex-row items-center justify-between px-6 mb-4">
                            <Text className="text-xl font-bold text-gray-900">🔴 Live Now</Text>
                            <TouchableOpacity>
                                <Text className="text-orange-600 font-semibold">See all</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={liveEvents}
                            renderItem={({ item }) => renderEventCard({ item, variant: 'trending' })}
                            keyExtractor={(item) => `live-${item.id}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
                        />
                    </View>
                )}

                {/* Featured Events */}
                {featuredEvents.length > 0 && (
                    <View className="mb-8">
                        <View className="flex-row items-center justify-between px-6 mb-4">
                            <Text className="text-xl font-bold text-gray-900">⭐ Featured</Text>
                            <TouchableOpacity>
                                <Text className="text-orange-600 font-semibold">See all</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={featuredEvents}
                            renderItem={({ item }) => renderEventCard({ item, variant: 'featured' })}
                            keyExtractor={(item) => `featured-${item.id}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
                        />
                    </View>
                )}

                {/* Trending Events */}
                <View className="mb-8">
                    <View className="flex-row items-center justify-between px-6 mb-4">
                        <Text className="text-xl font-bold text-gray-900">🔥 Trending</Text>
                        <TouchableOpacity>
                            <Text className="text-orange-600 font-semibold">See all</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={trendingEvents}
                        renderItem={({ item }) => renderEventCard({ item, variant: 'trending' })}
                        keyExtractor={(item) => `trending-${item.id}`}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 24, paddingRight: 24 }}
                    />
                </View>

                {/* All Events */}
                <View className="px-6 mb-8">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-xl font-bold text-gray-900">
                            {selectedCategory === 'All' ? 'All Events' : `${selectedCategory} Events`}
                        </Text>
                        <TouchableOpacity className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full">
                            <Text className="text-gray-700 font-medium mr-2">Sort</Text>
                            <Ionicons name="funnel" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <View className="space-y-6">
                        {filteredEvents.map((event, eventIndex) => (
                            <View key={`all-event-${event.id}`}>
                                {renderEventCard({ item: event })}
                            </View>
                        ))}
                    </View>

                    {/* Load more button */}
                    <TouchableOpacity
                        className="bg-gray-100 py-4 rounded-2xl items-center mt-8"
                        onPress={() => {
                            setIsLoading(true);
                            setTimeout(() => setIsLoading(false), 1000);
                        }}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#F97316" />
                        ) : (
                            <Text className="text-gray-700 font-semibold">Load More Events</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Bottom Spacing */}
                <View className="h-20" />
            </Animated.ScrollView>

            {/* Search Modal */}
            {renderSearchModal()}
        </View>
    );
}