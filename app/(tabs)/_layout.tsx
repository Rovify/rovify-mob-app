import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { CreateBottomSheet } from '../../src/components/features/create/CreateBottomSheet';
import { useAppInitialization } from '../../src/services';
import { LoadingScreen } from '../../src/components/layout/LoadingScreen';
import { View } from 'react-native';

export default function TabLayout() {
    const [showCreateSheet, setShowCreateSheet] = useState(false);
    const { isReady, error, isInitializing, initialize } = useAppInitialization();

    // Initialize services when tabs load
    useEffect(() => {
        if (!isReady && !isInitializing && !error) {
            initialize();
        }
    }, [isReady, isInitializing, error, initialize]);

    // Show loading overlay while initializing services
    if (!isReady) {
        return <LoadingScreen error={error} isInitializing={isInitializing} />;
    }

    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#F97316',
                    tabBarInactiveTintColor: '#6B7280',
                    tabBarStyle: {
                        backgroundColor: 'white',
                        borderTopWidth: 1,
                        borderTopColor: '#E5E7EB',
                        paddingBottom: 8,
                        paddingTop: 8,
                        height: 80
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '500',
                        marginTop: 4
                    }
                }}
            >
                <Tabs.Screen
                    name="explore"
                    options={{
                        title: 'Explore',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="search" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="stream"
                    options={{
                        title: 'Stream',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="videocam" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="create"
                    options={{
                        title: 'Create',
                        tabBarIcon: ({ color, size }) => (
                            <View style={{
                                backgroundColor: '#F97316',
                                borderRadius: 20,
                                width: 40,
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Ionicons name="add" size={24} color="white" />
                            </View>
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            setShowCreateSheet(true);
                        },
                    }}
                />
                <Tabs.Screen
                    name="marketplace"
                    options={{
                        title: 'Marketplace',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="storefront" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="echo"
                    options={{
                        title: 'Echo',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="chatbubbles" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>

            {/* Global Create Bottom Sheet */}
            <CreateBottomSheet
                isVisible={showCreateSheet}
                onClose={() => setShowCreateSheet(false)}
            />
        </>
    );
}