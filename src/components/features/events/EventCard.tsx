import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { formatDistanceToNow, format, isToday, isTomorrow } from 'date-fns';
import { Event } from '../../../types/events';

interface EventCardProps {
    event: Event;
    onPress: () => void;
    onLike?: () => void;
    onShare?: () => void;
    variant?: 'default' | 'featured' | 'compact';
    showActions?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - 32; // 16px margin on each side

export const EventCard: React.FC<EventCardProps> = ({
    event,
    onPress,
    onLike,
    onShare,
    variant = 'default',
    showActions = true,
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Format date intelligently
    const formatEventDate = (date: Date) => {
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return format(date, 'MMM dd');
    };

    const formatEventTime = (date: Date) => {
        return format(date, 'h:mm a');
    };

    // Get category color
    const getCategoryColor = (category: string): [string, string] => {
        const colors: Record<string, [string, string]> = {
            music: ['#F97316', '#EA580C'],
            nightlife: ['#8B5CF6', '#7C3AED'],
            culture: ['#10B981', '#059669'],
            sports: ['#3B82F6', '#2563EB'],
            business: ['#6B7280', '#4B5563'],
            technology: ['#EF4444', '#DC2626'],
            food: ['#F59E0B', '#D97706'],
            art: ['#EC4899', '#DB2777'],
        };
        return colors[category] || colors.music;
    };

    // Calculate attendance percentage
    const attendancePercentage = event.maxAttendees
        ? (event.currentAttendees / event.maxAttendees) * 100
        : 0;

    // Get status
    const getEventStatus = () => {
        const now = new Date();
        if (event.startTime > now) return 'upcoming';
        if (event.endTime > now) return 'live';
        return 'ended';
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.();
    };

    if (variant === 'compact') {
        return (
            <TouchableOpacity
                onPress={onPress}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-3 overflow-hidden"
                activeOpacity={0.9}
                style={{ width: cardWidth }}
            >
                <View className="flex-row">
                    {/* Event Image */}
                    <View className="w-24 h-24 bg-gray-200 rounded-l-2xl overflow-hidden">
                        {event.imageUrl && !imageError ? (
                            <Image
                                source={{ uri: event.imageUrl }}
                                className="w-full h-full"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <LinearGradient
                                colors={getCategoryColor(event.category)}
                                className="w-full h-full items-center justify-center"
                            >
                                <Ionicons name="calendar" size={24} color="white" />
                            </LinearGradient>
                        )}
                    </View>

                    {/* Event Info */}
                    <View className="flex-1 p-4">
                        <Text className="font-bold text-gray-900 text-base" numberOfLines={1}>
                            {event.title}
                        </Text>
                        <Text className="text-gray-600 text-sm mt-1" numberOfLines={1}>
                            {formatEventDate(event.startTime)} • {formatEventTime(event.startTime)}
                        </Text>
                        <View className="flex-row items-center justify-between mt-2">
                            <Text className="text-orange-600 font-semibold">
                                {event.price === 0 ? 'FREE' : `${event.currency} ${event.price}`}
                            </Text>
                            <Text className="text-xs text-gray-500">
                                {event.currentAttendees} attending
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    if (variant === 'featured') {
        return (
            <TouchableOpacity
                onPress={onPress}
                className="bg-white rounded-3xl shadow-lg mb-6 overflow-hidden"
                activeOpacity={0.95}
                style={{ width: cardWidth, height: 320 }}
            >
                {/* Hero Image with Gradient Overlay */}
                <View className="relative h-48">
                    {event.imageUrl && !imageError ? (
                        <ImageBackground
                            source={{ uri: event.imageUrl }}
                            className="w-full h-full"
                            onError={() => setImageError(true)}
                        >
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.7)'] as const}
                                className="absolute bottom-0 left-0 right-0 h-24"
                            />
                        </ImageBackground>
                    ) : (
                        <LinearGradient
                            colors={getCategoryColor(event.category)}
                            className="w-full h-full"
                        >
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.3)'] as const}
                                className="absolute bottom-0 left-0 right-0 h-24"
                            />
                        </LinearGradient>
                    )}

                    {/* Status Badge */}
                    <View className="absolute top-4 left-4">
                        <BlurView
                            intensity={80}
                            className="px-3 py-1 rounded-full overflow-hidden"
                        >
                            <Text className="text-white text-xs font-semibold capitalize">
                                {getEventStatus()}
                            </Text>
                        </BlurView>
                    </View>

                    {/* Actions */}
                    {showActions && (
                        <View className="absolute top-4 right-4 flex-row space-x-2">
                            <TouchableOpacity
                                onPress={handleLike}
                                className="w-10 h-10 bg-black bg-opacity-20 rounded-full items-center justify-center"
                            >
                                <Ionicons
                                    name={isLiked ? "heart" : "heart-outline"}
                                    size={20}
                                    color={isLiked ? "#EF4444" : "white"}
                                />
                            </TouchableOpacity>
                            {onShare && (
                                <TouchableOpacity
                                    onPress={onShare}
                                    className="w-10 h-10 bg-black bg-opacity-20 rounded-full items-center justify-center"
                                >
                                    <Ionicons name="share-outline" size={18} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Date Badge */}
                    <View className="absolute bottom-4 left-4">
                        <BlurView
                            intensity={80}
                            className="px-4 py-2 rounded-xl overflow-hidden"
                        >
                            <Text className="text-white text-sm font-bold">
                                {formatEventDate(event.startTime)}
                            </Text>
                            <Text className="text-white text-xs">
                                {formatEventTime(event.startTime)}
                            </Text>
                        </BlurView>
                    </View>
                </View>

                {/* Event Details */}
                <View className="p-6">
                    <View className="flex-row items-start justify-between mb-3">
                        <View className="flex-1 mr-4">
                            <Text className="font-bold text-gray-900 text-xl" numberOfLines={2}>
                                {event.title}
                            </Text>
                            <Text className="text-gray-600 text-sm mt-1" numberOfLines={2}>
                                {event.description}
                            </Text>
                        </View>
                        <LinearGradient
                            colors={getCategoryColor(event.category)}
                            className="px-3 py-1 rounded-full"
                        >
                            <Text className="text-white text-xs font-semibold capitalize">
                                {event.category}
                            </Text>
                        </LinearGradient>
                    </View>

                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Ionicons name="location" size={16} color="#F97316" />
                            <Text className="text-gray-700 text-sm ml-2 flex-1" numberOfLines={1}>
                                {event.location.address}
                            </Text>
                        </View>
                        <Text className="font-bold text-orange-600 text-lg">
                            {event.price === 0 ? 'FREE' : `${event.currency} ${event.price}`}
                        </Text>
                    </View>

                    {/* Attendance Bar */}
                    {event.maxAttendees && (
                        <View className="mt-4">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-xs text-gray-600">
                                    {event.currentAttendees} of {event.maxAttendees} attending
                                </Text>
                                <Text className="text-xs text-gray-600">
                                    {Math.round(attendancePercentage)}% full
                                </Text>
                            </View>
                            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <View
                                    className="h-full bg-orange-500 rounded-full"
                                    style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                                />
                            </View>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    }

    // Default variant
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
            activeOpacity={0.9}
            style={{ width: cardWidth }}
        >
            {/* Event Image */}
            <View className="relative h-48">
                {event.imageUrl && !imageError ? (
                    <Image
                        source={{ uri: event.imageUrl }}
                        className="w-full h-full"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <LinearGradient
                        colors={getCategoryColor(event.category)}
                        className="w-full h-full items-center justify-center"
                    >
                        <Ionicons name="calendar" size={48} color="white" className="opacity-60" />
                    </LinearGradient>
                )}

                {/* Gradient Overlay */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.4)'] as const}
                    className="absolute bottom-0 left-0 right-0 h-16"
                />

                {/* Category Badge */}
                <View className="absolute top-3 left-3">
                    <LinearGradient
                        colors={getCategoryColor(event.category)}
                        className="px-3 py-1 rounded-full"
                    >
                        <Text className="text-white text-xs font-semibold capitalize">
                            {event.category}
                        </Text>
                    </LinearGradient>
                </View>

                {/* Like Button */}
                {showActions && (
                    <TouchableOpacity
                        onPress={handleLike}
                        className="absolute top-3 right-3 w-8 h-8 bg-black bg-opacity-30 rounded-full items-center justify-center"
                    >
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={18}
                            color={isLiked ? "#EF4444" : "white"}
                        />
                    </TouchableOpacity>
                )}

                {/* Status Indicator */}
                {getEventStatus() === 'live' && (
                    <View className="absolute bottom-3 left-3 flex-row items-center bg-red-500 px-2 py-1 rounded-full">
                        <View className="w-2 h-2 bg-white rounded-full mr-1" />
                        <Text className="text-white text-xs font-semibold">LIVE</Text>
                    </View>
                )}
            </View>

            {/* Event Info */}
            <View className="p-4">
                <View className="flex-row items-start justify-between mb-2">
                    <Text className="font-bold text-gray-900 text-lg flex-1 mr-2" numberOfLines={2}>
                        {event.title}
                    </Text>
                    <Text className="font-bold text-orange-600 text-lg">
                        {event.price === 0 ? 'FREE' : `${event.currency} ${event.price}`}
                    </Text>
                </View>

                <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
                    {event.description}
                </Text>

                {/* Date and Time */}
                <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar-outline" size={16} color="#F97316" />
                    <Text className="text-gray-700 text-sm ml-2 font-medium">
                        {formatEventDate(event.startTime)} • {formatEventTime(event.startTime)}
                    </Text>
                </View>

                {/* Location */}
                <View className="flex-row items-center mb-3">
                    <Ionicons name="location-outline" size={16} color="#F97316" />
                    <Text className="text-gray-700 text-sm ml-2 flex-1" numberOfLines={1}>
                        {event.location.address}
                    </Text>
                </View>

                {/* Footer */}
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                    <View className="flex-row items-center">
                        <View className="flex-row -space-x-2 mr-2">
                            {/* Avatar placeholders */}
                            {[...Array(Math.min(3, Math.floor(event.currentAttendees / 10)))].map((_, i) => (
                                <View
                                    key={i}
                                    className="w-6 h-6 bg-orange-200 rounded-full border-2 border-white"
                                />
                            ))}
                        </View>
                        <Text className="text-xs text-gray-600">
                            {event.currentAttendees} attending
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Ionicons name="people-outline" size={14} color="#6B7280" />
                        <Text className="text-xs text-gray-500 ml-1">
                            {event.maxAttendees ? `${event.maxAttendees} max` : 'Unlimited'}
                        </Text>
                    </View>
                </View>

                {/* Attendance Progress */}
                {event.maxAttendees && attendancePercentage > 50 && (
                    <View className="mt-3">
                        <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <View
                                className={`h-full rounded-full ${attendancePercentage > 90 ? 'bg-red-500' :
                                    attendancePercentage > 75 ? 'bg-yellow-500' : 'bg-orange-500'
                                    }`}
                                style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                            />
                        </View>
                        {attendancePercentage > 90 && (
                            <Text className="text-xs text-red-600 mt-1 font-medium">
                                Almost sold out!
                            </Text>
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};