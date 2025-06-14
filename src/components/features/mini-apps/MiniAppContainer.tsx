import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Dimensions,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import miniAppLauncher, { MiniAppUI, MiniAppUIComponent, MiniAppResponse } from '../../../services/mini-apps/launcher';
import { PaymentSplitterComponent } from './utility/PaymentSplitter';
import { EventPollComponent } from './social/EventPoll';
import { TradingSignalsComponent } from './trading/TradingSignals';
import { NFTShowcaseComponent } from './social/NFTShowcase';
import { GroupGameComponent } from './games/GroupGame';

interface MiniAppContainerProps {
    appId: string;
    conversationId: string;
    userAddress: string;
    initialData?: any;
    onClose: () => void;
    onAction: (action: string, params: any) => void;
}

export const MiniAppContainer: React.FC<MiniAppContainerProps> = ({
    appId,
    conversationId,
    userAddress,
    initialData,
    onClose,
    onAction
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [appResponse, setAppResponse] = useState<MiniAppResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    // Initialize mini-app
    useEffect(() => {
        const initializeApp = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await miniAppLauncher.launchApp(
                    appId,
                    conversationId,
                    userAddress,
                    'open',
                    initialData || {}
                );

                setAppResponse(response);
                setIsVisible(true);

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to launch mini-app';
                setError(errorMessage);
                Alert.alert('Error', errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        initializeApp();
    }, [appId, conversationId, userAddress, initialData]);

    // Handle mini-app actions
    const handleAction = async (action: string, params: any = {}) => {
        if (!appResponse) return;

        setIsLoading(true);
        try {
            const session = miniAppLauncher.getSession(appResponse.sessionId);
            if (!session) {
                throw new Error('Session not found');
            }

            const response = await miniAppLauncher.executeAction(
                session,
                action,
                params,
                userAddress
            );

            setAppResponse(response);
            onAction(action, params);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Action failed';
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        if (appResponse) {
            miniAppLauncher.endSession(appResponse.sessionId);
        }
        onClose();
    };

    // Render specific mini-app component
    const renderMiniAppContent = () => {
        if (!appResponse) return null;

        switch (appId) {
            case 'payment-splitter':
                return (
                    <PaymentSplitterComponent
                        sessionData={appResponse.data}
                        onAction={handleAction}
                        isLoading={isLoading}
                    />
                );
            case 'event-poll':
                return (
                    <EventPollComponent
                        sessionData={appResponse.data}
                        onAction={handleAction}
                        isLoading={isLoading}
                    />
                );
            case 'trading-signals':
                return (
                    <TradingSignalsComponent
                        sessionData={appResponse.data}
                        onAction={handleAction}
                        isLoading={isLoading}
                    />
                );
            case 'nft-showcase':
                return (
                    <NFTShowcaseComponent
                        sessionData={appResponse.data}
                        onAction={handleAction}
                        isLoading={isLoading}
                    />
                );
            case 'group-game':
                return (
                    <GroupGameComponent
                        sessionData={appResponse.data}
                        onAction={handleAction}
                        isLoading={isLoading}
                    />
                );
            default:
                return <GenericMiniAppComponent ui={appResponse.ui} onAction={handleAction} />;
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <BlurView intensity={10} style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                    {/* Header */}
                    <LinearGradient
                        colors={['#F97316', '#EA580C']}
                        style={{
                            paddingTop: 50,
                            paddingBottom: 20,
                            paddingHorizontal: 20
                        }}
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-white text-xl font-bold">
                                    {getMiniAppTitle(appId)}
                                </Text>
                                <Text className="text-orange-100 text-sm mt-1">
                                    {getMiniAppDescription(appId)}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleClose}
                                className="w-10 h-10 bg-white bg-opacity-20 rounded-full items-center justify-center"
                            >
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    {/* Content */}
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ padding: 20 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {isLoading && (
                            <View className="items-center py-8">
                                <View className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                <Text className="text-gray-600 mt-4">Loading...</Text>
                            </View>
                        )}

                        {error && (
                            <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <Text className="text-red-800 font-medium">Error</Text>
                                <Text className="text-red-600 mt-1">{error}</Text>
                            </View>
                        )}

                        {!isLoading && !error && renderMiniAppContent()}
                    </ScrollView>
                </View>
            </BlurView>
        </Modal>
    );
};

// Generic mini-app component for rendering UI schema
const GenericMiniAppComponent: React.FC<{
    ui?: MiniAppUI;
    onAction: (action: string, params: any) => void;
}> = ({ ui, onAction }) => {
    if (!ui) return null;

    const renderUIComponent = (component: MiniAppUIComponent, index: number) => {
        switch (component.type) {
            case 'text':
                return (
                    <Text
                        key={index}
                        className={`${getTextStyle(component.props.style)} mb-2`}
                    >
                        {component.props.text}
                    </Text>
                );

            case 'button':
                return (
                    <TouchableOpacity
                        key={index}
                        className={`py-3 px-6 rounded-lg mb-2 ${getButtonStyle(component.props.style)}`}
                        onPress={() => onAction(component.props.action, component.props.params || {})}
                    >
                        <Text className={`text-center font-semibold ${getButtonTextStyle(component.props.style)}`}>
                            {component.props.label}
                        </Text>
                    </TouchableOpacity>
                );

            case 'list':
                return (
                    <View key={index} className="mb-4">
                        {component.props.items?.map((item: any, itemIndex: number) => (
                            <View key={itemIndex} className="flex-row items-center justify-between py-2 border-b border-gray-100">
                                <Text className="text-gray-900">{item.text || item.address || item.name}</Text>
                                <Text className="text-gray-600">{item.status || item.votes || item.amount}</Text>
                            </View>
                        ))}
                    </View>
                );

            case 'image':
                return (
                    <View key={index} className="mb-4">
                        {/* Image implementation would go here */}
                        <View className="w-full h-48 bg-gray-200 rounded-lg items-center justify-center">
                            <Ionicons name="image" size={48} color="#9CA3AF" />
                        </View>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <View className="bg-white rounded-xl p-6 shadow-lg">
            {ui.title && (
                <Text className="text-xl font-bold text-gray-900 mb-4">{ui.title}</Text>
            )}

            {ui.content?.map(renderUIComponent)}

            {ui.actions && (
                <View className="flex-row space-x-3 mt-4">
                    {ui.actions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`flex-1 py-3 px-4 rounded-lg ${getButtonStyle(action.style)}`}
                            onPress={() => onAction(action.action, {})}
                        >
                            <Text className={`text-center font-semibold ${getButtonTextStyle(action.style)}`}>
                                {action.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

// Helper functions
const getMiniAppTitle = (appId: string): string => {
    const titles: Record<string, string> = {
        'payment-splitter': 'Payment Splitter',
        'event-poll': 'Event Poll',
        'trading-signals': 'Trading Signals',
        'nft-showcase': 'NFT Showcase',
        'group-game': 'Group Game'
    };
    return titles[appId] || 'Mini App';
};

const getMiniAppDescription = (appId: string): string => {
    const descriptions: Record<string, string> = {
        'payment-splitter': 'Split payments easily with crypto',
        'event-poll': 'Create polls for group decisions',
        'trading-signals': 'Share and track trading signals',
        'nft-showcase': 'Display and trade NFTs',
        'group-game': 'Play interactive games together'
    };
    return descriptions[appId] || 'Interactive mini-app';
};

const getTextStyle = (style?: string): string => {
    switch (style) {
        case 'title': return 'text-xl font-bold text-gray-900';
        case 'subtitle': return 'text-lg font-medium text-gray-700';
        case 'success': return 'text-green-600 font-medium';
        case 'error': return 'text-red-600 font-medium';
        case 'warning': return 'text-yellow-600 font-medium';
        default: return 'text-gray-700';
    }
};

const getButtonStyle = (style?: string): string => {
    switch (style) {
        case 'primary': return 'bg-orange-500';
        case 'secondary': return 'bg-gray-200';
        case 'danger': return 'bg-red-500';
        default: return 'bg-blue-500';
    }
};

const getButtonTextStyle = (style?: string): string => {
    switch (style) {
        case 'primary': return 'text-white';
        case 'secondary': return 'text-gray-700';
        case 'danger': return 'text-white';
        default: return 'text-white';
    }
};

export default MiniAppContainer;