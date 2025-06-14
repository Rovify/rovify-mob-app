import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions,
    Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Image } from 'react-native';
// import Logo from '../assets/rovi-logo.png';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen() {
    // Animation values
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startAnimation = () => {
            // Logo entrance
            Animated.parallel([
                Animated.timing(logoScale, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.elastic(1.2),
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start();

            // Text animations with delay
            setTimeout(() => {
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }).start();
            }, 400);

            setTimeout(() => {
                Animated.timing(taglineOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }).start();
            }, 800);

            // Navigate to onboarding after animation
            setTimeout(() => {
                router.replace('/onboarding');
            }, 3000);
        };

        startAnimation();
    }, []);

    return (
        <LinearGradient
            colors={['#F97316', '#EA580C', '#DC2626']}
            style={{ flex: 1 }}
        >
            <StatusBar style="light" />

            {/* Main Content */}
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 40
            }}>
                {/* Logo Container */}
                <Animated.View
                    style={{
                        transform: [{ scale: logoScale }],
                        opacity: logoOpacity,
                        marginBottom: 40
                    }}
                >
                    <View style={{
                        width: 120,
                        height: 120,
                        backgroundColor: 'white',
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.3,
                        shadowRadius: 20,
                        elevation: 10
                    }}>
                        <LinearGradient
                            colors={['#F97316', '#EA580C']}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 20,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {/* <Text style={{
                                fontSize: 48,
                                fontWeight: 'bold',
                                color: 'white',
                                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                                textShadowOffset: { width: 0, height: 2 },
                                textShadowRadius: 4
                            }}>
                                R
                            </Text> */}
                            <Image
                                source={require('../assets/rovi-logo.png')}
                                resizeMode="contain"
                                style={{
                                    width: 100,
                                    height: 100,
                                }}
                            />
                        </LinearGradient>
                    </View>
                </Animated.View>

                {/* App Name */}
                <Animated.Text
                    style={{
                        fontSize: 42,
                        fontWeight: 'bold',
                        color: 'white',
                        letterSpacing: 2,
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 4,
                        opacity: textOpacity,
                        marginBottom: 16
                    }}
                >
                    Rovify
                </Animated.Text>

                {/* Tagline */}
                <Animated.Text
                    style={{
                        fontSize: 18,
                        color: 'rgba(255, 255, 255, 0.9)',
                        textAlign: 'center',
                        letterSpacing: 1,
                        lineHeight: 24,
                        opacity: taglineOpacity,
                        fontWeight: '500'
                    }}
                >
                    Where Events Become{'\n'}Experiences
                </Animated.Text>

                {/* Loading Indicator */}
                <Animated.View
                    style={{
                        marginTop: 60,
                        opacity: taglineOpacity
                    }}
                >
                    <Text style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 14,
                        textAlign: 'center',
                        fontWeight: '500'
                    }}>
                        Loading your universe...
                    </Text>
                </Animated.View>
            </View>
        </LinearGradient>
    );
}