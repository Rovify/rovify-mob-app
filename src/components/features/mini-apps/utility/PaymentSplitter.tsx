import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDesignTokens } from '@/utils/responsive';

interface PaymentSplitModalProps {
    visible: boolean;
    onClose: () => void;
    onSplit: (amount: number, description: string, participants: string[]) => void;
}

export const PaymentSplitModal: React.FC<PaymentSplitModalProps> = ({
    visible,
    onClose,
    onSplit
}) => {
    const tokens = getDesignTokens();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [participants, setParticipants] = useState<string[]>([]);
    const [newParticipant, setNewParticipant] = useState('');

    const addParticipant = () => {
        if (newParticipant.trim() && !participants.includes(newParticipant)) {
            setParticipants([...participants, newParticipant.trim()]);
            setNewParticipant('');
        }
    };

    const removeParticipant = (address: string) => {
        setParticipants(participants.filter(p => p !== address));
    };

    const handleSplit = () => {
        const amountNum = parseFloat(amount);
        if (!amountNum || amountNum <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description');
            return;
        }

        if (participants.length === 0) {
            Alert.alert('Error', 'Please add at least one participant');
            return;
        }

        onSplit(amountNum, description.trim(), participants);

        // Reset form
        setAmount('');
        setDescription('');
        setParticipants([]);
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {/* Header */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: tokens.spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB'
                }}>
                    <Text style={{ fontSize: tokens.typography.xl, fontWeight: 'bold' }}>
                        Split Payment
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ flex: 1, padding: tokens.spacing.md }}>
                    {/* Amount Input */}
                    <View style={{ marginBottom: tokens.spacing.lg }}>
                        <Text style={{ fontSize: tokens.typography.base, fontWeight: '600', marginBottom: tokens.spacing.sm }}>
                            Total Amount ($)
                        </Text>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="0.00"
                            keyboardType="numeric"
                            style={{
                                borderWidth: 1,
                                borderColor: '#D1D5DB',
                                borderRadius: tokens.borderRadius.md,
                                padding: tokens.spacing.sm,
                                fontSize: tokens.typography.base
                            }}
                        />
                    </View>

                    {/* Description Input */}
                    <View style={{ marginBottom: tokens.spacing.lg }}>
                        <Text style={{ fontSize: tokens.typography.base, fontWeight: '600', marginBottom: tokens.spacing.sm }}>
                            Description
                        </Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="e.g., Dinner at restaurant"
                            style={{
                                borderWidth: 1,
                                borderColor: '#D1D5DB',
                                borderRadius: tokens.borderRadius.md,
                                padding: tokens.spacing.sm,
                                fontSize: tokens.typography.base
                            }}
                        />
                    </View>

                    {/* Participants */}
                    <View style={{ marginBottom: tokens.spacing.lg }}>
                        <Text style={{ fontSize: tokens.typography.base, fontWeight: '600', marginBottom: tokens.spacing.sm }}>
                            Participants
                        </Text>

                        {/* Add Participant */}
                        <View style={{ flexDirection: 'row', marginBottom: tokens.spacing.sm }}>
                            <TextInput
                                value={newParticipant}
                                onChangeText={setNewParticipant}
                                placeholder="0x... wallet address"
                                style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: '#D1D5DB',
                                    borderRadius: tokens.borderRadius.md,
                                    padding: tokens.spacing.sm,
                                    fontSize: tokens.typography.sm,
                                    marginRight: tokens.spacing.sm
                                }}
                            />
                            <TouchableOpacity
                                onPress={addParticipant}
                                style={{
                                    backgroundColor: '#F97316',
                                    borderRadius: tokens.borderRadius.md,
                                    paddingHorizontal: tokens.spacing.md,
                                    justifyContent: 'center'
                                }}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Participant List */}
                        {participants.map((participant, index) => (
                            <View key={index} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#F9FAFB',
                                padding: tokens.spacing.sm,
                                borderRadius: tokens.borderRadius.md,
                                marginBottom: tokens.spacing.xs
                            }}>
                                <Text style={{ fontSize: tokens.typography.sm, flex: 1 }}>
                                    {participant}
                                </Text>
                                <TouchableOpacity onPress={() => removeParticipant(participant)}>
                                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    {/* Summary */}
                    {amount && participants.length > 0 && (
                        <View style={{
                            backgroundColor: '#F0FDF4',
                            padding: tokens.spacing.md,
                            borderRadius: tokens.borderRadius.md,
                            marginBottom: tokens.spacing.lg
                        }}>
                            <Text style={{ fontSize: tokens.typography.base, fontWeight: 'bold', color: '#10B981' }}>
                                Each person pays: ${(parseFloat(amount) / participants.length).toFixed(2)}
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* Create Button */}
                <View style={{ padding: tokens.spacing.md }}>
                    <TouchableOpacity
                        onPress={handleSplit}
                        style={{
                            backgroundColor: '#10B981',
                            borderRadius: tokens.borderRadius.md,
                            paddingVertical: tokens.spacing.md,
                            alignItems: 'center'
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: tokens.typography.base, fontWeight: 'bold' }}>
                            Create Payment Split
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};