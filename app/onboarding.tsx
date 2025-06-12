import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Image,
    StatusBar,
    Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    gradient: [string, string];
}

const onboardingData: OnboardingSlide[] = [
    {
        id: '1',
        title: 'WELCOME\nTO YOUR\nEVENT\nUNIVERSE',
        subtitle: 'Discover, attend, and own your\nfavorite events with friend-approved\nexperiences',
        image: '🎉',
        gradient: ['#F97316', '#EA580C']
    },
    {
        id: '2',
        title: 'DISCOVER\nANYWHERE',
        subtitle: 'Find events on your map, from local\nhangouts to global premieres',
        image: '🗺️',
        gradient: ['#8B5CF6', '#7C3AED']
    },
    {
        id: '3',
        title: 'EXPERIENCE\nTOGETHER',
        subtitle: 'Go places and do things with\nthe community as your compass',
        image: '👥',
        gradient: ['#3B82F6', '#2563EB']
    },
    {
        id: '4',
        title: 'OWN\nYOUR\nMEMORIES',
        subtitle: 'Collect moments, experiences,\nand memory-filled adventures\nwith every swipe, tap, and\nmemory made real',
        image: '📸',
        gradient: ['#10B981', '#059669']
    }
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            const nextIndex = currentIndex + 1;
            flatListRef.current?.scrollToIndex({ index: nextIndex });
            setCurrentIndex(nextIndex);
        } else {
            // Navigate to auth/connect
            router.replace('/auth/connect');
        }
    };

    const handleSkip = () => {
        router.replace('/auth/connect');
    };

    const onMomentumScrollEnd = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        setCurrentIndex(index);
    };

    const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
        const inputRange = [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
        ];

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
        });

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
        });

        return (
            <LinearGradient
                colors={item.gradient}
                style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 80,
                    paddingBottom: 120
                }}
            >
                {/* Skip Button */}
                <View style={{ width: '100%', alignItems: 'flex-end', paddingHorizontal: 20 }}>
                    <TouchableOpacity
                        onPress={handleSkip}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                            Skip
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Image/Icon */}
                <Animated.View style={{ opacity, transform: [{ scale }] }}>
                    <View style={{
                        width: 200,
                        height: 200,
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 40
                    }}>
                        <Text style={{ fontSize: 80 }}>{item.image}</Text>
                    </View>
                </Animated.View>

                {/* Content */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
                    <Animated.Text
                        style={{
                            fontSize: 32,
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            lineHeight: 38,
                            marginBottom: 24,
                            opacity,
                            transform: [{ scale }]
                        }}
                    >
                        {item.title}
                    </Animated.Text>

                    <Animated.Text
                        style={{
                            fontSize: 16,
                            color: 'rgba(255, 255, 255, 0.9)',
                            textAlign: 'center',
                            lineHeight: 22,
                            opacity,
                            transform: [{ scale }]
                        }}
                    >
                        {item.subtitle}
                    </Animated.Text>
                </View>

                {/* Bottom Section */}
                <View style={{ alignItems: 'center', width: '100%', paddingHorizontal: 40 }}>
                    {/* Dots Indicator */}
                    <View style={{ flexDirection: 'row', marginBottom: 40 }}>
                        {onboardingData.map((_, dotIndex) => {
                            const inputRange = [
                                (dotIndex - 1) * SCREEN_WIDTH,
                                dotIndex * SCREEN_WIDTH,
                                (dotIndex + 1) * SCREEN_WIDTH,
                            ];

                            const dotWidth = scrollX.interpolate({
                                inputRange,
                                outputRange: [8, 24, 8],
                                extrapolate: 'clamp',
                            });

                            const opacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: 'clamp',
                            });

                            return (
                                <Animated.View
                                    key={dotIndex}
                                    style={{
                                        width: dotWidth,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: 'white',
                                        marginHorizontal: 4,
                                        opacity
                                    }}
                                />
                            );
                        })}
                    </View>

                    {/* Get Started Button */}
                    <TouchableOpacity
                        onPress={handleNext}
                        style={{
                            backgroundColor: 'white',
                            paddingVertical: 16,
                            paddingHorizontal: 40,
                            borderRadius: 25,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8
                        }}
                    >
                        <Text style={{
                            color: item.gradient[0],
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginRight: 8
                        }}>
                            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                        <Ionicons
                            name={currentIndex === onboardingData.length - 1 ? 'rocket' : 'arrow-forward'}
                            size={20}
                            color={item.gradient[0]}
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F97316' }}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={renderSlide}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}