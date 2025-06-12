import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Switch,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EventPollProps {
    sessionData: any;
    onAction: (action: string, params: any) => void;
    isLoading: boolean;
}

export const EventPollComponent: React.FC<EventPollProps> = ({
    sessionData,
    onAction,
    isLoading
}) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']);
    const [allowMultiple, setAllowMultiple] = useState(false);

    const addOption = () => {
        setOptions([...options, '']);
    };

    const updateOption = (index: number, value: string) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const createPoll = () => {
        const validOptions = options.filter(opt => opt.trim().length > 0);

        if (!question.trim() || validOptions.length < 2) {
            Alert.alert('Error', 'Please provide a question and at least 2 options');
            return;
        }

        onAction('create-poll', {
            question,
            options: validOptions,
            allowMultiple
        });
    };

    const vote = (pollId: string, selectedOptions: number[]) => {
        onAction('vote', {
            pollId,
            selectedOptions
        });
    };

    // Render existing polls
    const renderExistingPolls = () => {
        if (!sessionData?.polls) return null;

        return (
            <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-4">Active Polls</Text>
                {Object.values(sessionData.polls).map((poll: any) => (
                    <PollCard key={poll.id} poll={poll} onVote={vote} />
                ))}
            </View>
        );
    };

    return (
        <View className="space-y-6">
            {renderExistingPolls()}

            {/* Create New Poll */}
            <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <Text className="text-lg font-bold text-gray-900 mb-4">Create New Poll</Text>

                {/* Question */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Question</Text>
                    <TextInput
                        value={question}
                        onChangeText={setQuestion}
                        placeholder="What's your question?"
                        multiline
                        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 min-h-[60px]"
                    />
                </View>

                {/* Options */}
                <View className="mb-4">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-medium text-gray-700">Options</Text>
                        <TouchableOpacity onPress={addOption} className="flex-row items-center">
                            <Ionicons name="add-circle" size={20} color="#F97316" />
                            <Text className="text-orange-600 ml-1 font-medium">Add Option</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="space-y-3">
                        {options.map((option, index) => (
                            <View key={index} className="flex-row items-center space-x-3">
                                <View className="flex-1">
                                    <TextInput
                                        value={option}
                                        onChangeText={(text) => updateOption(index, text)}
                                        placeholder={`Option ${index + 1}`}
                                        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                                    />
                                </View>
                                {options.length > 2 && (
                                    <TouchableOpacity onPress={() => removeOption(index)} className="p-2">
                                        <Ionicons name="trash" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Settings */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-medium text-gray-700">Allow multiple selections</Text>
                        <Switch
                            value={allowMultiple}
                            onValueChange={setAllowMultiple}
                            trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
                            thumbColor={allowMultiple ? '#F97316' : '#9CA3AF'}
                        />
                    </View>
                </View>

                {/* Create Button */}
                <TouchableOpacity
                    onPress={createPoll}
                    disabled={isLoading}
                    className={`py-4 rounded-lg items-center ${isLoading ? 'bg-gray-300' : 'bg-orange-500'
                        }`}
                >
                    <Text className="text-white font-semibold text-lg">Create Poll</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Poll Card Component
const PollCard: React.FC<{ poll: any; onVote: (pollId: string, options: number[]) => void }> = ({
    poll,
    onVote
}) => {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

    const toggleOption = (optionIndex: number) => {
        if (poll.allowMultiple) {
            if (selectedOptions.includes(optionIndex)) {
                setSelectedOptions(selectedOptions.filter(i => i !== optionIndex));
            } else {
                setSelectedOptions([...selectedOptions, optionIndex]);
            }
        } else {
            setSelectedOptions([optionIndex]);
        }
    };

    const submitVote = () => {
        if (selectedOptions.length > 0) {
            onVote(poll.id, selectedOptions);
            setSelectedOptions([]);
        }
    };

    const totalVotes = Object.keys(poll.votes).length;

    return (
        <View className="bg-blue-50 rounded-lg p-4 mb-3">
            <Text className="font-semibold text-gray-900 mb-3">{poll.question}</Text>

            <View className="space-y-2 mb-4">
                {poll.options.map((option: string, index: number) => {
                    const votes = Object.values(poll.votes).filter((vote: any) =>
                        vote.selectedOptions.includes(index)
                    ).length;
                    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                    const isSelected = selectedOptions.includes(index);

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => toggleOption(index)}
                            className={`p-3 rounded-lg border-2 ${isSelected ? 'border-blue-500 bg-blue-100' : 'border-gray-200 bg-white'
                                }`}
                        >
                            <View className="flex-row items-center justify-between">
                                <Text className={`flex-1 ${isSelected ? 'text-blue-800 font-medium' : 'text-gray-700'}`}>
                                    {option}
                                </Text>
                                <View className="flex-row items-center">
                                    <Text className="text-sm text-gray-600 mr-2">
                                        {votes} ({percentage}%)
                                    </Text>
                                    {isSelected && <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {selectedOptions.length > 0 && (
                <TouchableOpacity
                    onPress={submitVote}
                    className="bg-blue-500 py-2 px-4 rounded-lg items-center"
                >
                    <Text className="text-white font-medium">Submit Vote</Text>
                </TouchableOpacity>
            )}

            <Text className="text-xs text-gray-500 mt-2">
                {totalVotes} vote{totalVotes !== 1 ? 's' : ''} • Created by {poll.createdBy.slice(0, 6)}...
            </Text>
        </View>
    );
};

// Placeholder components for other mini-apps
export const TradingSignalsComponent: React.FC<{ sessionData: any; onAction: any; isLoading: boolean }> = () => (
    <View className="bg-green-50 rounded-xl p-6">
        <Text className="text-lg font-bold text-green-800 mb-2">Trading Signals</Text>
        <Text className="text-green-700">Share and track trading signals with your group</Text>
    </View>
);

export const NFTShowcaseComponent: React.FC<{ sessionData: any; onAction: any; isLoading: boolean }> = () => (
    <View className="bg-purple-50 rounded-xl p-6">
        <Text className="text-lg font-bold text-purple-800 mb-2">NFT Showcase</Text>
        <Text className="text-purple-700">Display and trade NFTs within the chat</Text>
    </View>
);

export const GroupGameComponent: React.FC<{ sessionData: any; onAction: any; isLoading: boolean }> = () => (
    <View className="bg-yellow-50 rounded-xl p-6">
        <Text className="text-lg font-bold text-yellow-800 mb-2">Group Game</Text>
        <Text className="text-yellow-700">Play interactive games with your group</Text>
    </View>
);