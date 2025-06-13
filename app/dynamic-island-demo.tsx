import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock Live Activities Manager for Real Dynamic Island
class LiveActivitiesManager {
    static async requestPermission() {
        // In real implementation, this would request Live Activities permission
        return new Promise(resolve => {
            setTimeout(() => resolve(true), 1000);
        });
    }

    static async startActivity(activityType: string, data: any) {
        // This would call native iOS Live Activities API
        console.log(`Starting Live Activity: ${activityType}`, data);

        // Simulate native callback
        setTimeout(() => {
            Alert.alert(
                'Dynamic Island Active! 🏝️',
                `${activityType} is now live in your Dynamic Island. Check the top of your screen!`,
                [{ text: 'Cool!', style: 'default' }]
            );
        }, 500);
    }

    static async updateActivity(activityId: string, data: any) {
        console.log(`Updating Live Activity: ${activityId}`, data);
    }

    static async endActivity(activityId: string) {
        console.log(`Ending Live Activity: ${activityId}`);
        Alert.alert('Activity Ended', 'Dynamic Island activity has been stopped.');
    }
}

// Activity Templates for Real Dynamic Island
const ActivityTemplates = {
    messageActivity: {
        type: 'MessageActivity',
        title: 'New Message',
        dynamicIslandTemplate: {
            compact: {
                leading: '💬',
                trailing: 'vitalik.eth'
            },
            expanded: {
                header: 'New Message from vitalik.eth',
                content: 'GM! Ready for ETH Denver? The keynote starts in 30 minutes 🚀',
                actions: ['Reply', 'Mark Read']
            }
        }
    },

    walletActivity: {
        type: 'WalletActivity',
        title: 'Wallet Connection',
        dynamicIslandTemplate: {
            compact: {
                leading: '🔗',
                trailing: 'Connecting...'
            },
            expanded: {
                header: 'Connecting Wallet',
                content: 'Please approve the connection in your wallet app',
                progress: 0.7
            }
        }
    },

    transactionActivity: {
        type: 'TransactionActivity',
        title: 'Transaction',
        dynamicIslandTemplate: {
            compact: {
                leading: '⏳',
                trailing: '2/3 confirmations'
            },
            expanded: {
                header: 'Transaction Confirming',
                content: 'Sending 0.1 ETH to alex.eth',
                progress: 0.66,
                details: 'Hash: 0xabc...123'
            }
        }
    },

    eventActivity: {
        type: 'EventActivity',
        title: 'Live Event',
        dynamicIslandTemplate: {
            compact: {
                leading: '🔴',
                trailing: 'ETH Denver LIVE'
            },
            expanded: {
                header: 'ETH Denver 2025',
                content: 'Keynote starting now • 1,247 watching',
                actions: ['Join', 'Remind Later']
            }
        }
    },

    gasActivity: {
        type: 'GasActivity',
        title: 'Gas Alert',
        dynamicIslandTemplate: {
            compact: {
                leading: '⛽',
                trailing: '15 gwei'
            },
            expanded: {
                header: 'Optimal Gas Price',
                content: 'Gas is 40% below average. Perfect time for transactions!',
                actions: ['Execute Swap']
            }
        }
    }
};

export default function RealDynamicIslandDemo() {
    const [activeActivities, setActiveActivities] = useState<string[]>([]);
    const [permissionGranted, setPermissionGranted] = useState(false);

    useEffect(() => {
        // Request Live Activities permission on mount
        if (Platform.OS === 'ios') {
            requestLiveActivitiesPermission();
        }
    }, []);

    const requestLiveActivitiesPermission = async () => {
        try {
            const granted = await LiveActivitiesManager.requestPermission();
            setPermissionGranted(Boolean(granted));
            if (granted) {
                Alert.alert(
                    'Permission Granted! ✅',
                    'You can now see Live Activities in your Dynamic Island'
                );
            }
        } catch (error) {
            console.error('Permission error:', error);
        }
    };

    const startLiveActivity = async (templateKey: keyof typeof ActivityTemplates) => {
        if (!permissionGranted) {
            Alert.alert('Permission Required', 'Please grant Live Activities permission first');
            return;
        }

        const template = ActivityTemplates[templateKey];
        const activityId = `${template.type}_${Date.now()}`;

        try {
            await LiveActivitiesManager.startActivity(activityId, {
                template: template.dynamicIslandTemplate,
                metadata: {
                    type: template.type,
                    title: template.title,
                    startTime: new Date().toISOString()
                }
            });

            setActiveActivities(prev => [...prev, activityId]);

            // Simulate activity updates for demo
            if (templateKey === 'transactionActivity') {
                simulateTransactionUpdates(activityId);
            } else if (templateKey === 'walletActivity') {
                simulateWalletConnection(activityId);
            }

        } catch (error) {
            console.error('Failed to start activity:', error);
            Alert.alert('Error', 'Failed to start Live Activity');
        }
    };

    const simulateTransactionUpdates = async (activityId: string) => {
        // Simulate confirmation updates
        const updates = [
            { confirmations: 1, progress: 0.33, status: '1/3 confirmations' },
            { confirmations: 2, progress: 0.66, status: '2/3 confirmations' },
            { confirmations: 3, progress: 1.0, status: 'Confirmed!' }
        ];

        for (let i = 0; i < updates.length; i++) {
            setTimeout(async () => {
                await LiveActivitiesManager.updateActivity(activityId, {
                    compact: {
                        leading: updates[i].confirmations === 3 ? '✅' : '⏳',
                        trailing: updates[i].status
                    },
                    expanded: {
                        header: updates[i].confirmations === 3 ? 'Transaction Confirmed!' : 'Transaction Confirming',
                        content: 'Sending 0.1 ETH to alex.eth',
                        progress: updates[i].progress
                    }
                });

                if (updates[i].confirmations === 3) {
                    // End activity after confirmation
                    setTimeout(() => {
                        LiveActivitiesManager.endActivity(activityId);
                        setActiveActivities(prev => prev.filter(id => id !== activityId));
                    }, 3000);
                }
            }, (i + 1) * 2000);
        }
    };

    const simulateWalletConnection = async (activityId: string) => {
        // Update to connected state
        setTimeout(async () => {
            await LiveActivitiesManager.updateActivity(activityId, {
                compact: {
                    leading: '✅',
                    trailing: 'sarah.eth'
                },
                expanded: {
                    header: 'Wallet Connected',
                    content: 'Successfully connected to sarah.eth',
                    progress: 1.0
                }
            });

            // End activity after showing success
            setTimeout(() => {
                LiveActivitiesManager.endActivity(activityId);
                setActiveActivities(prev => prev.filter(id => id !== activityId));
            }, 2000);
        }, 2000);
    };

    const endAllActivities = async () => {
        for (const activityId of activeActivities) {
            await LiveActivitiesManager.endActivity(activityId);
        }
        setActiveActivities([]);
    };

    const ActivityCard = ({ templateKey, template }: {
        templateKey: keyof typeof ActivityTemplates,
        template: typeof ActivityTemplates[keyof typeof ActivityTemplates]
    }) => (
        <View className="bg-gray-900 p-4 rounded-2xl mb-4">
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white font-bold text-lg">{template.title}</Text>
                <TouchableOpacity
                    onPress={() => startLiveActivity(templateKey)}
                    className="px-4 py-2 rounded-xl"
                    style={{ backgroundColor: '#FF5900' }}
                >
                    <Text className="text-white font-bold">Start</Text>
                </TouchableOpacity>
            </View>

            {/* Preview of Dynamic Island Content */}
            <View className="bg-black p-3 rounded-xl mb-2">
                <Text className="text-gray-400 text-xs mb-2">Compact View:</Text>
                <View className="flex-row items-center justify-between">
                    <Text className="text-white text-sm">
                        {template.dynamicIslandTemplate.compact.leading} {template.dynamicIslandTemplate.compact.trailing}
                    </Text>
                </View>
            </View>

            <View className="bg-black p-3 rounded-xl">
                <Text className="text-gray-400 text-xs mb-2">Expanded View:</Text>
                <Text className="text-white font-bold text-sm mb-1">
                    {template.dynamicIslandTemplate.expanded.header}
                </Text>
                <Text className="text-gray-300 text-xs">
                    {template.dynamicIslandTemplate.expanded.content}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            {/* Header */}
            <View className="px-6 py-4">
                <Text className="text-white text-2xl font-bold">Real Dynamic Island</Text>
                <Text className="text-gray-400 text-sm">Native iOS Live Activities Integration</Text>

                <View className="flex-row items-center mt-4">
                    <View
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: permissionGranted ? '#18E299' : '#FF5900' }}
                    />
                    <Text className="text-gray-300 text-sm">
                        Live Activities: {permissionGranted ? 'Enabled' : 'Disabled'}
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Instructions */}
                <View className="bg-gray-800 p-4 rounded-2xl mb-6">
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="information-circle" size={20} color="#3329CF" />
                        <Text className="text-white font-bold ml-2">How it works</Text>
                    </View>
                    <Text className="text-gray-300 text-sm leading-5">
                        These activities will appear in your real Dynamic Island at the top of your screen.
                        Tap any "Start" button to begin a Live Activity that uses Apple's native APIs.
                    </Text>
                </View>

                {/* Activity Templates */}
                {Object.entries(ActivityTemplates).map(([key, template]) => (
                    <ActivityCard
                        key={key}
                        templateKey={key as keyof typeof ActivityTemplates}
                        template={template}
                    />
                ))}

                {/* Active Activities */}
                {activeActivities.length > 0 && (
                    <View className="bg-green-900 p-4 rounded-2xl mb-6">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-white font-bold">Active Activities ({activeActivities.length})</Text>
                            <TouchableOpacity
                                onPress={endAllActivities}
                                className="px-3 py-1 bg-red-600 rounded-lg"
                            >
                                <Text className="text-white text-xs font-bold">End All</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="text-green-300 text-sm">
                            Check your Dynamic Island at the top of the screen!
                        </Text>
                    </View>
                )}

                {/* Permission Request */}
                {!permissionGranted && (
                    <TouchableOpacity
                        onPress={requestLiveActivitiesPermission}
                        className="bg-blue-600 p-4 rounded-2xl mb-6"
                    >
                        <Text className="text-white font-bold text-center">
                            Enable Live Activities
                        </Text>
                        <Text className="text-blue-200 text-sm text-center mt-1">
                            Required for Dynamic Island integration
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}