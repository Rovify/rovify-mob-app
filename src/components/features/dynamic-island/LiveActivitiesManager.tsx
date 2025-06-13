import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    AppState,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Types for different Live Activity states
type ActivityType =
    | 'wallet_connection'
    | 'active_chat'
    | 'event_live'
    | 'gas_tracker'
    | 'transaction_pending'
    | 'voice_call'
    | 'group_activity';

interface LiveActivityData {
    type: ActivityType;
    title: string;
    subtitle?: string;
    data: any;
    isActive: boolean;
    priority: number; // Higher number = higher priority
}

interface LiveActivitiesManagerProps {
    onActivityTap?: (activity: LiveActivityData) => void;
}

export const LiveActivitiesManager: React.FC<LiveActivitiesManagerProps> = ({
    onActivityTap
}) => {
    const [activities, setActivities] = useState<LiveActivityData[]>([]);
    const [currentActivity, setCurrentActivity] = useState<LiveActivityData | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const pulseAnimation = useRef(new Animated.Value(1)).current;
    const slideAnimation = useRef(new Animated.Value(-100)).current;
    const expandAnimation = useRef(new Animated.Value(0)).current;

    // Mock data generators for demonstration
    const generateMockActivities = (): LiveActivityData[] => {
        return [
            {
                type: 'gas_tracker',
                title: 'Gas Tracker',
                subtitle: '23 gwei • Optimal',
                data: { gasPrice: 23, trend: 'down', recommendation: 'optimal' },
                isActive: true,
                priority: 1
            },
            {
                type: 'active_chat',
                title: 'ETH Denver 2025',
                subtitle: '3 new messages',
                data: { unreadCount: 3, lastSender: 'vitalik.eth', isThread: true },
                isActive: true,
                priority: 3
            },
            {
                type: 'event_live',
                title: 'Base Buildathon',
                subtitle: 'Starting in 2min',
                data: { timeUntilStart: 120, attendees: 1247, status: 'starting_soon' },
                isActive: true,
                priority: 4
            },
            {
                type: 'transaction_pending',
                title: 'Transaction',
                subtitle: 'Confirming...',
                data: { hash: '0xabc...123', confirmations: 2, requiredConfirmations: 3 },
                isActive: true,
                priority: 5
            }
        ];
    };

    useEffect(() => {
        // Initialize with mock activities
        const mockActivities = generateMockActivities();
        setActivities(mockActivities);

        // Set highest priority activity as current
        const highestPriority = mockActivities.reduce((prev, current) =>
            current.priority > prev.priority ? current : prev
        );
        setCurrentActivity(highestPriority);

        // Animate in
        Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Start pulse animation for active states
        const startPulse = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnimation, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnimation, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        startPulse();

        // Simulate activity updates
        const interval = setInterval(() => {
            setActivities(prev => prev.map(activity => {
                switch (activity.type) {
                    case 'gas_tracker':
                        return {
                            ...activity,
                            data: {
                                ...activity.data,
                                gasPrice: activity.data.gasPrice + Math.floor(Math.random() * 10 - 5)
                            },
                            subtitle: `${activity.data.gasPrice + Math.floor(Math.random() * 10 - 5)} gwei • Optimal`
                        };
                    case 'active_chat':
                        return {
                            ...activity,
                            data: {
                                ...activity.data,
                                unreadCount: Math.max(0, activity.data.unreadCount + Math.floor(Math.random() * 3 - 1))
                            },
                            subtitle: `${Math.max(0, activity.data.unreadCount + Math.floor(Math.random() * 3 - 1))} new messages`
                        };
                    case 'event_live':
                        const newTimeUntilStart = Math.max(0, activity.data.timeUntilStart - 30);
                        return {
                            ...activity,
                            data: { ...activity.data, timeUntilStart: newTimeUntilStart },
                            subtitle: newTimeUntilStart > 0 ? `Starting in ${Math.floor(newTimeUntilStart / 60)}min` : 'Live Now!'
                        };
                    default:
                        return activity;
                }
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Update current activity when activities change
        if (activities.length > 0) {
            const highestPriority = activities
                .filter(a => a.isActive)
                .reduce((prev, current) =>
                    current.priority > prev.priority ? current : prev
                );
            setCurrentActivity(highestPriority);
        }
    }, [activities]);

    const handleActivityTap = () => {
        if (!currentActivity) return;

        if (currentActivity.type === 'gas_tracker' || currentActivity.type === 'active_chat') {
            setIsExpanded(!isExpanded);
            Animated.timing(expandAnimation, {
                toValue: isExpanded ? 0 : 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }

        onActivityTap?.(currentActivity);
    };

    const getActivityIcon = (type: ActivityType) => {
        switch (type) {
            case 'wallet_connection': return 'wallet';
            case 'active_chat': return 'chatbubbles';
            case 'event_live': return 'radio';
            case 'gas_tracker': return 'speedometer';
            case 'transaction_pending': return 'hourglass';
            case 'voice_call': return 'call';
            case 'group_activity': return 'people';
            default: return 'notifications';
        }
    };

    const getActivityColor = (type: ActivityType) => {
        switch (type) {
            case 'wallet_connection': return '#3329CF';
            case 'active_chat': return '#C281FF';
            case 'event_live': return '#FF5900';
            case 'gas_tracker': return '#18E299';
            case 'transaction_pending': return '#F59E0B';
            case 'voice_call': return '#18E299';
            case 'group_activity': return '#C281FF';
            default: return '#6B7280';
        }
    };

    const renderCompactContent = () => {
        if (!currentActivity) return null;

        const iconColor = getActivityColor(currentActivity.type);
        const showPulse = ['transaction_pending', 'voice_call', 'event_live'].includes(currentActivity.type);

        return (
            <View className="flex-row items-center justify-between px-4">
                <View className="flex-row items-center">
                    <Animated.View
                        style={showPulse ? { transform: [{ scale: pulseAnimation }] } : {}}
                    >
                        <Ionicons
                            name={getActivityIcon(currentActivity.type) as any}
                            size={14}
                            color={iconColor}
                        />
                    </Animated.View>
                    <Text className="text-white text-xs font-bold ml-2">
                        {currentActivity.title}
                    </Text>
                </View>
                <Text className="text-white text-xs opacity-80">
                    {currentActivity.subtitle}
                </Text>
            </View>
        );
    };

    const renderExpandedContent = () => {
        if (!currentActivity) return null;

        const iconColor = getActivityColor(currentActivity.type);

        return (
            <View className="flex-1 px-4 py-2">
                <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center">
                        <Ionicons
                            name={getActivityIcon(currentActivity.type) as any}
                            size={16}
                            color={iconColor}
                        />
                        <Text className="text-white text-sm font-bold ml-2">
                            {currentActivity.title}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => setIsExpanded(false)}>
                        <Ionicons name="chevron-up" size={16} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Activity-specific expanded content */}
                {currentActivity.type === 'gas_tracker' && (
                    <View className="flex-row justify-between">
                        <View>
                            <Text className="text-white text-xs opacity-80">Current</Text>
                            <Text className="text-white text-sm font-bold">{currentActivity.data.gasPrice} gwei</Text>
                        </View>
                        <View>
                            <Text className="text-white text-xs opacity-80">Trend</Text>
                            <View className="flex-row items-center">
                                <Ionicons
                                    name={currentActivity.data.trend === 'up' ? 'trending-up' : 'trending-down'}
                                    size={12}
                                    color={currentActivity.data.trend === 'up' ? '#FF5900' : '#18E299'}
                                />
                                <Text className="text-white text-sm font-bold ml-1">
                                    {currentActivity.data.recommendation}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {currentActivity.type === 'active_chat' && (
                    <View className="flex-row justify-between">
                        <View>
                            <Text className="text-white text-xs opacity-80">Unread</Text>
                            <Text className="text-white text-sm font-bold">{currentActivity.data.unreadCount}</Text>
                        </View>
                        <View>
                            <Text className="text-white text-xs opacity-80">From</Text>
                            <Text className="text-white text-sm font-bold">{currentActivity.data.lastSender}</Text>
                        </View>
                        {currentActivity.data.isThread && (
                            <View>
                                <Text className="text-white text-xs opacity-80">Type</Text>
                                <Text className="text-white text-sm font-bold">Thread</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    if (!currentActivity || !currentActivity.isActive) return null;

    const height = expandAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [37, 84], // Dynamic Island dimensions
    });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                top: 20,
                left: '50%',
                marginLeft: -63, // Half of Dynamic Island width (126/2)
                zIndex: 1000,
                transform: [{ translateY: slideAnimation }],
            }}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleActivityTap}
            >
                <Animated.View
                    style={{
                        width: 126,
                        height,
                        backgroundColor: '#000',
                        borderRadius: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {isExpanded ? renderExpandedContent() : renderCompactContent()}
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Hook for managing Live Activities throughout the app
export const useLiveActivities = () => {
    const [activities, setActivities] = useState<LiveActivityData[]>([]);

    const startActivity = (activity: Omit<LiveActivityData, 'isActive'>) => {
        setActivities(prev => [
            ...prev.filter(a => a.type !== activity.type),
            { ...activity, isActive: true }
        ]);
    };

    const updateActivity = (type: ActivityType, updates: Partial<LiveActivityData>) => {
        setActivities(prev =>
            prev.map(activity =>
                activity.type === type
                    ? { ...activity, ...updates }
                    : activity
            )
        );
    };

    const stopActivity = (type: ActivityType) => {
        setActivities(prev =>
            prev.map(activity =>
                activity.type === type
                    ? { ...activity, isActive: false }
                    : activity
            )
        );
    };

    const stopAllActivities = () => {
        setActivities(prev =>
            prev.map(activity => ({ ...activity, isActive: false }))
        );
    };

    return {
        activities,
        startActivity,
        updateActivity,
        stopActivity,
        stopAllActivities
    };
};

// Pre-built activity starters for common use cases
export const LiveActivityPresets = {
    startWalletConnection: (onComplete: () => void) => ({
        type: 'wallet_connection' as ActivityType,
        title: 'Connecting Wallet',
        subtitle: 'Please approve in wallet app',
        data: { status: 'pending', onComplete },
        priority: 5
    }),

    startGasTracker: () => ({
        type: 'gas_tracker' as ActivityType,
        title: 'Gas Tracker',
        subtitle: 'Monitoring network fees',
        data: { gasPrice: 25, trend: 'stable', recommendation: 'optimal' },
        priority: 1
    }),

    startActiveChat: (chatTitle: string, unreadCount: number) => ({
        type: 'active_chat' as ActivityType,
        title: chatTitle,
        subtitle: `${unreadCount} new messages`,
        data: { unreadCount, lastSender: 'unknown', isThread: false },
        priority: 3
    }),

    startEventLive: (eventTitle: string, timeUntilStart: number) => ({
        type: 'event_live' as ActivityType,
        title: eventTitle,
        subtitle: timeUntilStart > 0 ? `Starting in ${Math.floor(timeUntilStart / 60)}min` : 'Live Now!',
        data: { timeUntilStart, attendees: 0, status: 'starting_soon' },
        priority: 4
    }),

    startTransaction: (txHash: string) => ({
        type: 'transaction_pending' as ActivityType,
        title: 'Transaction',
        subtitle: 'Confirming...',
        data: { hash: txHash, confirmations: 0, requiredConfirmations: 3 },
        priority: 5
    })
};

export default LiveActivitiesManager;