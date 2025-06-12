import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreateAgentScreen() {
    const [agentName, setAgentName] = useState('');
    const [agentDescription, setAgentDescription] = useState('');
    const [agentType, setAgentType] = useState('assistant');
    const [isPublic, setIsPublic] = useState(false);

    const agentTypes = [
        { id: 'assistant', name: 'Personal Assistant', icon: 'person', color: '#3B82F6' },
        { id: 'trader', name: 'DeFi Trader', icon: 'trending-up', color: '#10B981' },
        { id: 'coordinator', name: 'Event Coordinator', icon: 'calendar', color: '#F59E0B' },
        { id: 'curator', name: 'Content Curator', icon: 'library', color: '#8B5CF6' }
    ];

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900 flex-1">Create AI Agent</Text>
                <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-full">
                    <Text className="text-white font-semibold">Deploy</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 py-6">
                {/* Agent Type Selection */}
                <View className="mb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Agent Type</Text>
                    <View className="space-y-3">
                        {agentTypes.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                onPress={() => setAgentType(type.id)}
                                className={`flex-row items-center p-4 rounded-xl border-2 ${agentType === type.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                                    }`}
                            >
                                <View
                                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                                    style={{ backgroundColor: `${type.color}20` }}
                                >
                                    <Ionicons name={type.icon as any} size={24} color={type.color} />
                                </View>
                                <Text className="font-semibold text-gray-900 flex-1">{type.name}</Text>
                                {agentType === type.id && (
                                    <Ionicons name="checkmark-circle" size={24} color="#F97316" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Agent Details */}
                <View className="mb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Agent Details</Text>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">Agent Name</Text>
                        <TextInput
                            value={agentName}
                            onChangeText={setAgentName}
                            placeholder="e.g., My Trading Assistant"
                            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
                        <TextInput
                            value={agentDescription}
                            onChangeText={setAgentDescription}
                            placeholder="Describe what your agent does..."
                            multiline
                            numberOfLines={4}
                            className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-medium text-gray-700">Make Public</Text>
                        <Switch
                            value={isPublic}
                            onValueChange={setIsPublic}
                            trackColor={{ false: '#E5E7EB', true: '#F97316' }}
                            thumbColor={isPublic ? 'white' : 'white'}
                        />
                    </View>
                </View>

                {/* Preview */}
                <View className="mb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Preview</Text>
                    <View className="border border-gray-200 rounded-xl p-4">
                        <View className="flex-row items-center mb-3">
                            <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-3">
                                <Ionicons name="person" size={24} color="#F97316" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-semibold text-gray-900">
                                    {agentName || 'Your Agent Name'}
                                </Text>
                                <Text className="text-sm text-gray-600">AI Agent</Text>
                            </View>
                        </View>
                        <Text className="text-gray-700">
                            {agentDescription || 'Your agent description will appear here...'}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}