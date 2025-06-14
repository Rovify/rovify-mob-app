import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Dimensions,
    StatusBar,
    Animated,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDeviceInfo, getDesignTokens } from '../src/utils/responsive';

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
        title: 'WELCOME TO YOUR\nEVENT UNIVERSE',
        subtitle: 'Discover, attend, and own your favorite events\nwith friend-approved experiences',
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
        title: 'OWN YOUR\nMEMORIES',
        subtitle: 'Collect moments, experiences, and\nmemory-filled adventures with every\nswipe, tap, and memory made real',
        image: '📸',
        gradient: ['#10B981', '#059669']
    }
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const insets = useSafeAreaInsets();
    const device = getDeviceInfo();
    const tokens = getDesignTokens();

    // Get screen dimensions including system UI
    const screenData = Dimensions.get('screen');
    const windowData = Dimensions.get('window');

    // Calculate the actual full height (important for Android)
    const fullHeight = Platform.OS === 'android' ? screenData.height : SCREEN_HEIGHT;

    const getResponsiveLayout = () => {
        return {
            topPadding: insets.top + tokens.spacing.md,
            iconSize: device.isSmallDevice ? 140 : 160,
            titleFontSize: device.isSmallDevice ? tokens.typography['2xl'] : tokens.typography['3xl'],
            subtitleFontSize: device.isSmallDevice ? tokens.typography.sm : tokens.typography.base,
            contentPaddingHorizontal: device.isSmallDevice ? tokens.spacing.lg : tokens.spacing.xl,
            bottomSpacing: device.isSmallDevice ? tokens.spacing.lg : tokens.spacing.xl,
            buttonHeight: device.isSmallDevice ? 48 : 56,
        };
    };

    const layout = getResponsiveLayout();

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            const nextIndex = currentIndex + 1;
            flatListRef.current?.scrollToIndex({ index: nextIndex });
            setCurrentIndex(nextIndex);
        } else {
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
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
        });

        const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [20, 0, 20],
            extrapolate: 'clamp',
        });

        return (
            <View style={{
                width: SCREEN_WIDTH,
                height: fullHeight, // FIXED: Use full height including system areas
                position: 'relative'
            }}>
                {/* FIXED: LinearGradient covers ENTIRE screen */}
                <LinearGradient
                    colors={item.gradient}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: SCREEN_WIDTH,
                        height: fullHeight, // CRITICAL: Full height coverage
                    }}
                />

                {/* Content Container */}
                <View style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    paddingTop: layout.topPadding,
                    paddingBottom: Math.max(insets.bottom, tokens.spacing.md)
                }}>
                    {/* Header Section - FIXED Skip Button */}
                    <View style={{
                        width: '100%',
                        alignItems: 'flex-end',
                        paddingHorizontal: tokens.spacing.lg,
                        marginBottom: tokens.spacing.lg
                    }}>
                        <TouchableOpacity
                            onPress={handleSkip}
                            style={{
                                // FIXED: Better contrast for Android
                                backgroundColor: Platform.OS === 'android'
                                    ? 'rgba(0, 0, 0, 0.3)' // Darker background on Android
                                    : 'rgba(255, 255, 255, 0.2)',
                                paddingHorizontal: tokens.spacing.md,
                                paddingVertical: tokens.spacing.xs,
                                borderRadius: tokens.borderRadius.full,
                                borderWidth: Platform.OS === 'android' ? 1 : 0,
                                borderColor: 'rgba(255, 255, 255, 0.3)'
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={{
                                color: 'white',
                                fontSize: tokens.typography.sm,
                                fontWeight: '600',
                                // FIXED: Ensure text is always visible
                                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 2
                            }}>
                                Skip
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Icon Section */}
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Animated.View style={{
                            opacity,
                            transform: [{ scale }, { translateY }]
                        }}>
                            <View style={{
                                width: layout.iconSize,
                                height: layout.iconSize,
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: layout.iconSize / 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 2,
                                borderColor: 'rgba(255, 255, 255, 0.3)'
                            }}>
                                <Text style={{
                                    fontSize: device.isSmallDevice ? 50 : 60
                                }}>
                                    {item.image}
                                </Text>
                            </View>
                        </Animated.View>
                    </View>

                    {/* Content Section */}
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: layout.contentPaddingHorizontal
                    }}>
                        <Animated.Text
                            style={{
                                fontSize: layout.titleFontSize,
                                fontWeight: '800',
                                color: 'white',
                                textAlign: 'center',
                                lineHeight: layout.titleFontSize * 1.2,
                                marginBottom: tokens.spacing.md,
                                opacity,
                                transform: [{ translateY }],
                                letterSpacing: -0.5,
                                // FIXED: Text shadow for better readability
                                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                                textShadowOffset: { width: 0, height: 2 },
                                textShadowRadius: 4
                            }}
                        >
                            {item.title}
                        </Animated.Text>

                        <Animated.Text
                            style={{
                                fontSize: layout.subtitleFontSize,
                                color: 'rgba(255, 255, 255, 0.95)',
                                textAlign: 'center',
                                lineHeight: layout.subtitleFontSize * 1.4,
                                opacity,
                                transform: [{ translateY }],
                                fontWeight: '400',
                                // FIXED: Subtle text shadow
                                textShadowColor: 'rgba(0, 0, 0, 0.2)',
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 2
                            }}
                        >
                            {item.subtitle}
                        </Animated.Text>
                    </View>

                    {/* Bottom Section - FIXED spacing */}
                    <View style={{
                        alignItems: 'center',
                        paddingHorizontal: layout.contentPaddingHorizontal,
                        paddingBottom: tokens.spacing.md
                    }}>
                        {/* Dots Indicator - FIXED positioning */}
                        <View style={{
                            flexDirection: 'row',
                            marginBottom: layout.bottomSpacing,
                            alignItems: 'center'
                        }}>
                            {onboardingData.map((_, dotIndex) => {
                                const inputRange = [
                                    (dotIndex - 1) * SCREEN_WIDTH,
                                    dotIndex * SCREEN_WIDTH,
                                    (dotIndex + 1) * SCREEN_WIDTH,
                                ];

                                const dotWidth = scrollX.interpolate({
                                    inputRange,
                                    outputRange: [6, 20, 6],
                                    extrapolate: 'clamp',
                                });

                                const opacity = scrollX.interpolate({
                                    inputRange,
                                    outputRange: [0.4, 1, 0.4],
                                    extrapolate: 'clamp',
                                });

                                return (
                                    <Animated.View
                                        key={dotIndex}
                                        style={{
                                            width: dotWidth,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: 'white',
                                            marginHorizontal: 3,
                                            opacity,
                                            // FIXED: Shadow for better visibility
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 2,
                                            elevation: 2
                                        }}
                                    />
                                );
                            })}
                        </View>

                        {/* Action Button - FIXED styling */}
                        <TouchableOpacity
                            onPress={handleNext}
                            style={{
                                backgroundColor: 'white',
                                height: layout.buttonHeight,
                                borderRadius: layout.buttonHeight / 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                paddingHorizontal: tokens.spacing.lg,
                                // FIXED: Better shadow for Android
                                ...Platform.select({
                                    ios: {
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                    },
                                    android: {
                                        elevation: 8,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                    }
                                })
                            }}
                            activeOpacity={0.9}
                        >
                            <Text style={{
                                color: item.gradient[0],
                                fontSize: tokens.typography.lg,
                                fontWeight: '700',
                                marginRight: tokens.spacing.xs
                            }}>
                                {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Continue'}
                            </Text>
                            <Ionicons
                                name={currentIndex === onboardingData.length - 1 ? 'rocket' : 'arrow-forward'}
                                size={20}
                                color={item.gradient[0]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#000', // FIXED: Black background prevents bleed through
            height: fullHeight
        }}>
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
                // FIXED: Better performance on Android
                removeClippedSubviews={false}
                initialNumToRender={1}
                maxToRenderPerBatch={1}
                windowSize={3}
                getItemLayout={(data, index) => ({
                    length: SCREEN_WIDTH,
                    offset: SCREEN_WIDTH * index,
                    index,
                })}
            />
        </View>
    );
}