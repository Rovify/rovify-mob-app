import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaymentSplitterProps {
    sessionData: any;
    onAction: (action: string, params: any) => void;
    isLoading: boolean;
}

export const PaymentSplitterComponent: React.FC<PaymentSplitterProps> = ({
    sessionData,
    onAction,
    isLoading
}) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState('USDC');
    const [participants, setParticipants] = useState<string[]>(['']);

    const addParticipant = () => {
        setParticipants([...participants, '']);
    };

    const updateParticipant = (index: number, address: string) => {
        const updated = [...participants];
        updated[index] = address;
        setParticipants(updated);
    };

    const removeParticipant = (index: number) => {
        if (participants.length > 1) {
            setParticipants(participants.filter((_, i) => i !== index));
        }
    };

    const createSplit = () => {
        const validParticipants = participants.filter(p => p.trim().length > 0);

        if (!amount || !description || validParticipants.length === 0) {
            Alert.alert('Error', 'Please fill in all fields and add at least one participant');
            return;
        }

        onAction('create-split', {
            amount: parseFloat(amount),
            currency,
            description,
            participants: validParticipants
        });
    };

    const payAmount = (splitId: string, amountToPay: number) => {
        onAction('pay-split', {
            splitId,
            amount: amountToPay
        });
    };

    // Render existing splits
    const renderExistingSplits = () => {
        if (!sessionData?.splits) return null;

        return (
            <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-4">Active Splits</Text>
                {Object.values(sessionData.splits).map((split: any) => (
                    <View key={split.id} className="bg-gray-50 rounded-lg p-4 mb-3">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="font-semibold text-gray-900">{split.description}</Text>
                            <Text className="text-orange-600 font-bold">
                                {split.currency} {split.amount}
                            </Text>
                        </View>

                        <Text className="text-sm text-gray-600 mb-3">
                            {split.currency} {split.amountPerPerson.toFixed(2)} per person
                        </Text>

                        <View className="space-y-2">
                            {split.participants.map((participant: string, index: number) => {
                                const payment = split.payments[participant];
                                const isPaid = !!payment;

                                return (
                                    <View key={index} className="flex-row items-center justify-between">
                                        <Text className="text-gray-700 flex-1" numberOfLines={1}>
                                            {participant.slice(0, 6)}...{participant.slice(-4)}
                                        </Text>
                                        {isPaid ? (
                                            <View className="flex-row items-center">
                                                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                                <Text className="text-green-600 ml-1 font-medium">Paid</Text>
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                onPress={() => payAmount(split.id, split.amountPerPerson)}
                                                className="bg-orange-500 px-3 py-1 rounded-md"
                                                disabled={isLoading}
                                            >
                                                <Text className="text-white text-sm font-medium">Pay</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                );
                            })}
                        </View>

                        <View className="mt-3 pt-3 border-t border-gray-200">
                            <Text className="text-sm text-gray-600">
                                {Object.keys(split.payments).length} of {split.participants.length} paid
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View className="space-y-6">
            {renderExistingSplits()}

            {/* Create New Split */}
            <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <Text className="text-lg font-bold text-gray-900 mb-4">Create New Split</Text>

                {/* Amount and Currency */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Amount</Text>
                    <View className="flex-row space-x-3">
                        <View className="flex-1">
                            <TextInput
                                value={amount}
                                onChangeText={setAmount}
                                placeholder="0.00"
                                keyboardType="numeric"
                                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                            />
                        </View>
                        <TouchableOpacity className="border border-gray-300 rounded-lg px-4 py-3 min-w-[80px] items-center justify-center">
                            <Text className="text-gray-700 font-medium">{currency}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Description */}
                <View className="mb-4">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Dinner, concert tickets, etc."
                        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                    />
                </View>

                {/* Participants */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-medium text-gray-700">Participants</Text>
                        <TouchableOpacity
                            onPress={addParticipant}
                            className="flex-row items-center"
                        >
                            <Ionicons name="add-circle" size={20} color="#F97316" />
                            <Text className="text-orange-600 ml-1 font-medium">Add</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="space-y-3">
                        {participants.map((participant, index) => (
                            <View key={index} className="flex-row items-center space-x-3">
                                <View className="flex-1">
                                    <TextInput
                                        value={participant}
                                        onChangeText={(text) => updateParticipant(index, text)}
                                        placeholder="0x... wallet address"
                                        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                                        autoCapitalize="none"
                                    />
                                </View>
                                {participants.length > 1 && (
                                    <TouchableOpacity
                                        onPress={() => removeParticipant(index)}
                                        className="p-2"
                                    >
                                        <Ionicons name="trash" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Create Button */}
                <TouchableOpacity
                    onPress={createSplit}
                    disabled={isLoading}
                    className={`py-4 rounded-lg items-center ${isLoading ? 'bg-gray-300' : 'bg-orange-500'
                        }`}
                >
                    {isLoading ? (
                        <View className="flex-row items-center">
                            <View className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                            <Text className="text-gray-600 font-semibold">Creating...</Text>
                        </View>
                    ) : (
                        <Text className="text-white font-semibold text-lg">Create Split</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};