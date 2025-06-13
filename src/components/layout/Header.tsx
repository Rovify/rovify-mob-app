import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface CustomHeaderProps {
    // Basic props
    title?: string;
    subtitle?: string;

    // Navigation
    showBackButton?: boolean;
    onBackPress?: () => void;

    // Styling
    variant?: 'default' | 'transparent' | 'gradient' | 'blur';
    backgroundColor?: string;
    textColor?: string;

    // User info
    showUserAvatar?: boolean;
    userInitials?: string;
    location?: string;

    // Actions
    rightActions?: Array<{
        icon: string;
        onPress: () => void;
        badge?: number;
    }>;

    // Layout control
    extend?: boolean; // Whether to extend to edges
    height?: 'compact' | 'standard' | 'large';

    // Sidebar
    showMenuButton?: boolean;
    onMenuPress?: () => void;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
    title,
    subtitle,
    showBackButton = false,
    onBackPress,
    variant = 'default',
    backgroundColor = 'white',
    textColor = '#1F2937',
    showUserAvatar = false,
    userInitials = 'U',
    location,
    rightActions = [],
    extend = false,
    height = 'standard',
    showMenuButton = false,
    onMenuPress
}) => {
    const insets = useSafeAreaInsets();

    // Calculate header heights
    const getHeaderHeight = () => {
        const baseHeight = {
            compact: 44,
            standard: 56,
            large: 80
        }[height];

        return extend ? baseHeight + insets.top : baseHeight;
    };

    const headerHeight = getHeaderHeight();
    const contentTopPadding = extend ? insets.top : 0;

    // Render different variants
    const renderHeaderBackground = () => {
        const baseStyle = {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            height: headerHeight
        };

        switch (variant) {
            case 'transparent':
                return <View style={baseStyle} />;

            case 'gradient':
                return (
                    <LinearGradient
                        colors={['#F97316', '#EA580C']}
                        style={baseStyle}
                    />
                );

            case 'blur':
                return (
                    <BlurView
                        intensity={80}
                        style={baseStyle}
                    />
                );

            default:
                return (
                    <View
                        style={[baseStyle, { backgroundColor }]}
                    />
                );
        }
    };

    const getTextColor = () => {
        if (variant === 'gradient') return 'white';
        if (variant === 'transparent') return 'white';
        return textColor;
    };

    return (
        <>
            {/* Status Bar */}
            <StatusBar
                barStyle={
                    variant === 'gradient' || variant === 'transparent'
                        ? 'light-content'
                        : 'dark-content'
                }
                backgroundColor="transparent"
                translucent
            />

            {/* Header Container */}
            <View style={{ height: headerHeight, zIndex: 1000 }}>
                {renderHeaderBackground()}

                {/* Header Content */}
                <View
                    style={{
                        flex: 1,
                        paddingTop: contentTopPadding,
                        paddingHorizontal: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    {/* Left Section */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        {/* Menu Button */}
                        {showMenuButton && (
                            <TouchableOpacity
                                onPress={onMenuPress}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 8
                                }}
                            >
                                <Ionicons name="menu" size={24} color={getTextColor()} />
                            </TouchableOpacity>
                        )}

                        {/* Back Button */}
                        {showBackButton && (
                            <TouchableOpacity
                                onPress={onBackPress || (() => router.back())}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 8
                                }}
                            >
                                <Ionicons name="arrow-back" size={24} color={getTextColor()} />
                            </TouchableOpacity>
                        )}

                        {/* User Avatar + Location */}
                        {showUserAvatar && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: variant === 'gradient' ? 'rgba(255,255,255,0.2)' : '#FED7AA',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 12
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: variant === 'gradient' ? 'white' : '#F97316',
                                            fontSize: 16,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {userInitials}
                                    </Text>
                                </View>

                                {location && (
                                    <View>
                                        <Text
                                            style={{
                                                color: variant === 'gradient' ? 'rgba(255,255,255,0.8)' : '#6B7280',
                                                fontSize: 12
                                            }}
                                        >
                                            Location
                                        </Text>
                                        <Text
                                            style={{
                                                color: getTextColor(),
                                                fontSize: 16,
                                                fontWeight: '600'
                                            }}
                                        >
                                            {location}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Title Section */}
                        {title && !showUserAvatar && (
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        color: getTextColor(),
                                        fontSize: height === 'large' ? 24 : 18,
                                        fontWeight: 'bold'
                                    }}
                                    numberOfLines={1}
                                >
                                    {title}
                                </Text>
                                {subtitle && (
                                    <Text
                                        style={{
                                            color: variant === 'gradient' ? 'rgba(255,255,255,0.8)' : '#6B7280',
                                            fontSize: 14,
                                            marginTop: 2
                                        }}
                                        numberOfLines={1}
                                    >
                                        {subtitle}
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Right Actions */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {rightActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={action.onPress}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: 8,
                                    position: 'relative'
                                }}
                            >
                                <Ionicons name={action.icon as any} size={24} color={getTextColor()} />
                                {action.badge && action.badge > 0 && (
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: 6,
                                            right: 6,
                                            backgroundColor: '#EF4444',
                                            borderRadius: 10,
                                            minWidth: 20,
                                            height: 20,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                                            {action.badge > 99 ? '99+' : action.badge}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </>
    );
};