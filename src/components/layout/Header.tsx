// src/components/layout/CustomHeader.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useMessagingStore } from '../../store/messagingStore';

interface CustomHeaderProps {
    title?: string;
    subtitle?: string;
    showLocation?: boolean;
    showProfile?: boolean;
    showNotifications?: boolean;
    showSearch?: boolean;
    onProfilePress?: () => void;
    onNotificationPress?: () => void;
    onSearchPress?: () => void;
    backgroundColor?: string;
    textColor?: string;
    variant?: 'default' | 'transparent' | 'gradient' | 'glass';
    children?: React.ReactNode;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
    title,
    subtitle,
    showLocation = true,
    showProfile = true,
    showNotifications = true,
    showSearch = false,
    onProfilePress,
    onNotificationPress,
    onSearchPress,
    backgroundColor,
    textColor = '#1F2937',
    variant = 'default',
    children
}) => {
    const { address } = useAuthStore();
    // const { getTotalUnreadCount } = useMessagingStore();
    const [headerHeight] = useState(new Animated.Value(0));
    const { width } = Dimensions.get('window');

    // const unreadCount = getTotalUnreadCount();
    const unreadCount = 10;
    const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

    useEffect(() => {
        Animated.spring(headerHeight, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8
        }).start();
    }, []);

    const getProfileInitials = () => {
        if (address) {
            return address.slice(2, 4).toUpperCase();
        }
        return 'U';
    };

    const renderHeaderContent = () => (
        <View className="flex-row items-center justify-between px-6 py-4">
            {/* Left Section - Profile & Location */}
            <View className="flex-row items-center flex-1">
                {showProfile && (
                    <TouchableOpacity
                        onPress={onProfilePress}
                        className="relative mr-4"
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#F97316', '#EA580C']}
                            className="w-12 h-12 rounded-full items-center justify-center"
                            style={{
                                shadowColor: '#F97316',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8
                            }}
                        >
                            <Text className="text-white font-bold text-lg">
                                {getProfileInitials()}
                            </Text>
                        </LinearGradient>

                        {/* Online indicator */}
                        <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    </TouchableOpacity>
                )}

                <View className="flex-1">
                    {title ? (
                        <Text
                            className="text-2xl font-bold"
                            style={{ color: textColor }}
                        >
                            {title}
                        </Text>
                    ) : showLocation ? (
                        <>
                            <Text className="text-sm font-medium opacity-70" style={{ color: textColor }}>
                                Location
                            </Text>
                            <View className="flex-row items-center mt-1">
                                <Ionicons
                                    name="location"
                                    size={16}
                                    color={textColor}
                                    style={{ opacity: 0.8 }}
                                />
                                <Text
                                    className="font-bold text-lg ml-1"
                                    style={{ color: textColor }}
                                >
                                    Nairobi, Kenya
                                </Text>
                            </View>
                        </>
                    ) : null}

                    {subtitle && (
                        <Text
                            className="text-sm mt-1 opacity-70"
                            style={{ color: textColor }}
                        >
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>

            {/* Right Section - Actions */}
            <View className="flex-row items-center space-x-3">
                {showSearch && (
                    <TouchableOpacity
                        onPress={onSearchPress}
                        className="w-10 h-10 bg-white bg-opacity-20 rounded-full items-center justify-center"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 4
                        }}
                    >
                        <Ionicons name="search" size={20} color={textColor} />
                    </TouchableOpacity>
                )}

                {showNotifications && (
                    <TouchableOpacity
                        onPress={onNotificationPress}
                        className="relative"
                        activeOpacity={0.8}
                    >
                        <View
                            className="w-10 h-10 bg-white bg-opacity-20 rounded-full items-center justify-center"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 4
                            }}
                        >
                            <Ionicons name="notifications-outline" size={22} color={textColor} />
                        </View>

                        {/* Notification Badge */}
                        {unreadCount > 0 && (
                            <Animated.View
                                className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center"
                                style={{
                                    transform: [
                                        {
                                            scale: headerHeight.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, 1]
                                            })
                                        }
                                    ]
                                }}
                            >
                                <Text className="text-white text-xs font-bold">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Text>
                            </Animated.View>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderHeaderByVariant = () => {
        switch (variant) {
            case 'transparent':
                return (
                    <View style={{ backgroundColor: backgroundColor || 'transparent' }}>
                        {renderHeaderContent()}
                    </View>
                );

            case 'gradient':
                return (
                    <LinearGradient
                        colors={['#F97316', '#EA580C', '#DC2626']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        {renderHeaderContent()}
                    </LinearGradient>
                );

            case 'glass':
                return (
                    <BlurView intensity={80} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                            {renderHeaderContent()}
                        </View>
                    </BlurView>
                );

            default:
                return (
                    <View style={{ backgroundColor: backgroundColor || 'white' }}>
                        {renderHeaderContent()}
                    </View>
                );
        }
    };

    return (
        <Animated.View
            style={{
                paddingTop: statusBarHeight,
                transform: [
                    {
                        translateY: headerHeight.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-50, 0]
                        })
                    }
                ],
                opacity: headerHeight
            }}
        >
            {/* Status Bar Background */}
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: statusBarHeight,
                    backgroundColor: variant === 'gradient' ? '#F97316' : backgroundColor || 'white'
                }}
            />

            {renderHeaderByVariant()}

            {children && (
                <View className="px-6 pb-4">
                    {children}
                </View>
            )}

            {/* Subtle bottom border */}
            {variant === 'default' && (
                <View className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            )}
        </Animated.View>
    );
};

// Header presets for common use cases
export const HomeHeader: React.FC<Partial<CustomHeaderProps>> = (props) => (
    <CustomHeader
        showLocation
        showProfile
        showNotifications
        variant="default"
        {...props}
    />
);

export const ExploreHeader: React.FC<Partial<CustomHeaderProps>> = (props) => (
    <CustomHeader
        title="Discover"
        subtitle="Find your next adventure"
        showProfile
        showNotifications
        showSearch
        variant="gradient"
        textColor="white"
        {...props}
    />
);

export const ChatHeader: React.FC<Partial<CustomHeaderProps> & {
    chatTitle: string;
    isOnline?: boolean;
    participantCount?: number;
}> = ({ chatTitle, isOnline, participantCount, ...props }) => (
    <CustomHeader
        title={chatTitle}
        subtitle={
            participantCount ? `${participantCount} participants` :
                isOnline ? 'Online' : 'Last seen recently'
        }
        showProfile={false}
        showNotifications={false}
        variant="glass"
        textColor="white"
        {...props}
    />
);

export const ProfileHeader: React.FC<Partial<CustomHeaderProps>> = (props) => (
    <CustomHeader
        variant="transparent"
        showLocation={false}
        showProfile={false}
        showNotifications
        {...props}
    />
);