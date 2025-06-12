import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';

export const WalletConnect: React.FC = () => {
    const {
        user,
        isConnecting,
        isAuthenticated,
        error,
        shortAddress,
        connectWallet,
        disconnect,
        isOnCorrectChain,
    } = useAuth();

    if (isAuthenticated && user) {
        return (
            <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                            <Ionicons name="checkmark" size={20} color="#10B981" />
                        </View>
                        <View>
                            <Text className="font-semibold text-gray-900">Wallet Connected</Text>
                            <Text className="text-sm text-gray-600">{shortAddress}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={disconnect}
                        className="p-2"
                    >
                        <Ionicons name="exit-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <View className="space-y-2">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-sm text-gray-600">Network:</Text>
                        <View className="flex-row items-center">
                            <View
                                className={`w-2 h-2 rounded-full mr-2 ${isOnCorrectChain ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                            />
                            <Text className={`text-sm font-medium ${isOnCorrectChain ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {isOnCorrectChain ? 'Base Mainnet' : 'Wrong Network'}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-sm text-gray-600">Balance:</Text>
                        <Text className="text-sm font-medium text-gray-900">
                            {user.balance} ETH
                        </Text>
                    </View>
                </View>

                {!isOnCorrectChain && (
                    <View className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Text className="text-sm text-yellow-800">
                            Please switch to Base network to continue
                        </Text>
                    </View>
                )}
            </View>
        );
    }

    return (
        <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <View className="items-center">
                <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="wallet-outline" size={32} color="#F97316" />
                </View>

                <Text className="text-xl font-bold text-gray-900 mb-2">
                    Connect Your Wallet
                </Text>
                <Text className="text-gray-600 text-center mb-6">
                    Connect your wallet to start using XMTP messaging and interact with AI agents
                </Text>

                {error && (
                    <View className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Text className="text-sm text-red-800 text-center">{error}</Text>
                    </View>
                )}

                <TouchableOpacity
                    onPress={connectWallet}
                    disabled={isConnecting}
                    className={`w-full py-4 rounded-lg items-center ${isConnecting ? 'bg-gray-300' : 'bg-orange-500'
                        }`}
                >
                    {isConnecting ? (
                        <View className="flex-row items-center">
                            <ActivityIndicator size="small" color="#6B7280" />
                            <Text className="ml-2 text-gray-600 font-semibold">Connecting...</Text>
                        </View>
                    ) : (
                        <View className="flex-row items-center">
                            <Ionicons name="wallet" size={20} color="white" />
                            <Text className="ml-2 text-white font-semibold text-lg">
                                Connect Wallet
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                <Text className="text-xs text-gray-500 text-center mt-4">
                    For demo purposes, this will connect a mock wallet.{'\n'}
                    In production, integrate with WalletConnect or MetaMask.
                </Text>
            </View>
        </View>
    );
};