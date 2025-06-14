import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoadingScreenProps {
    error?: string | null;
    isInitializing?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ error, isInitializing }) => {
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;
    const progressWidth = useRef(new Animated.Value(0)).current;
    const { width } = Dimensions.get('window');

    useEffect(() => {
        // Logo breathing animation
        const breathingAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(logoScale, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(logoScale, {
                    toValue: 0.8,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );

        // Gentle rotation
        const rotationAnimation = Animated.loop(
            Animated.timing(logoRotate, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
            })
        );

        // Progress animation only if initializing
        let progressAnimation: Animated.CompositeAnimation | null = null;
        if (isInitializing && !error) {
            progressAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(progressWidth, {
                        toValue: width - 80,
                        duration: 2500,
                        useNativeDriver: false,
                    }),
                    Animated.timing(progressWidth, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: false,
                    }),
                ])
            );
        }

        // Start animations
        breathingAnimation.start();
        rotationAnimation.start();
        progressAnimation?.start();

        // Cleanup
        return () => {
            breathingAnimation.stop();
            rotationAnimation.stop();
            progressAnimation?.stop();
        };
    }, [isInitializing, error, logoScale, logoRotate, progressWidth, width]);

    const rotateInterpolate = logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const getStatusText = () => {
        if (error) return 'Something went wrong';
        if (isInitializing) return 'Setting up your experience...';
        return 'Loading...';
    };

    const getSubText = () => {
        if (error) return error;
        if (isInitializing) return 'This might take a moment';
        return 'Please wait';
    };

    return (
        <LinearGradient
            colors={['#F97316', '#EA580C', '#DC2626']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                    {/* Animated Logo */}
                    <Animated.View
                        style={{
                            width: 100,
                            height: 100,
                            backgroundColor: 'white',
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 32,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.3,
                            shadowRadius: 16,
                            elevation: 16,
                            transform: [
                                { scale: logoScale },
                                { rotate: rotateInterpolate }
                            ]
                        }}
                    >
                        <Text style={{
                            color: '#F97316',
                            fontSize: 40,
                            fontWeight: 'bold'
                        }}>
                            R
                        </Text>
                    </Animated.View>

                    <Text style={{
                        fontSize: 32,
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: 8
                    }}>
                        Rovify
                    </Text>

                    <Text style={{
                        fontSize: 18,
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: 48,
                        textAlign: 'center'
                    }}>
                        Where Events Become Experiences
                    </Text>

                    <View style={{ alignItems: 'center', minHeight: 120 }}>
                        {/* Progress Bar - only show when initializing */}
                        {isInitializing && !error && (
                            <View style={{
                                width: width - 80,
                                height: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: 2,
                                marginBottom: 16,
                                overflow: 'hidden'
                            }}>
                                <Animated.View
                                    style={{
                                        width: progressWidth,
                                        height: 4,
                                        backgroundColor: 'white',
                                        borderRadius: 2,
                                    }}
                                />
                            </View>
                        )}

                        <Text style={{
                            color: 'white',
                            fontSize: 18,
                            fontWeight: '600',
                            textAlign: 'center',
                            marginBottom: 8
                        }}>
                            {getStatusText()}
                        </Text>

                        <Text style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: 14,
                            textAlign: 'center',
                            paddingHorizontal: 32,
                            marginBottom: 24
                        }}>
                            {getSubText()}
                        </Text>

                        {/* Feature highlights - only show when initializing */}
                        {isInitializing && !error && (
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: 14,
                                    marginBottom: 4
                                }}>
                                    🔐 Secure XMTP messaging
                                </Text>
                                <Text style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: 14,
                                    marginBottom: 4
                                }}>
                                    🤖 AI-powered agents
                                </Text>
                                <Text style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: 14
                                }}>
                                    🎮 Interactive mini-apps
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};