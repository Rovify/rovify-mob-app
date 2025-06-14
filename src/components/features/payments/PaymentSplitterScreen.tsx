import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useBase } from '../../../hooks/useBase';
import { useMobileWallet } from '@/hooks/useWallet';
import { useXMTP } from '@/hooks/useXMTP';
import { CustomHeader } from '@/components/layout/Header';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';

interface Participant {
    address: string;
    amount: string;
    isValid: boolean;
}

export default function PaymentSplitterScreen() {
    const [totalAmount, setTotalAmount] = useState('');
    const [currency, setCurrency] = useState<'ETH' | 'USDC'>('USDC');
    const [participants, setParticipants] = useState<Participant[]>([
        { address: '', amount: '', isValid: false }
    ]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [description, setDescription] = useState('');

    const { address, isConnected } = useMobileWallet();
    const {
        isOnBase,
        baseBalance,
        usdcBalance,
        switchToBase,
        splitPaymentETH,
        splitPaymentUSDC,
        getBaseBalance,
        getUSDCBalance
    } = useBase();
    const { sendMessage } = useXMTP();

    // Load balances when component mounts
    useEffect(() => {
        if (isOnBase) {
            getBaseBalance();
            getUSDCBalance();
        }
    }, [isOnBase, getBaseBalance, getUSDCBalance]);

    // Auto-calculate split amounts
    useEffect(() => {
        if (totalAmount && participants.length > 0) {
            const amount = parseFloat(totalAmount);
            const splitAmount = (amount / participants.length).toFixed(currency === 'USDC' ? 2 : 6);

            setParticipants(prev =>
                prev.map(p => ({
                    ...p,
                    amount: splitAmount,
                    isValid: isValidAddress(p.address)
                }))
            );
        }
    }, [totalAmount, participants.length, currency]);

    const isValidAddress = (address: string) => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    const addParticipant = () => {
        setParticipants(prev => [...prev, { address: '', amount: '', isValid: false }]);
    };

    const removeParticipant = (index: number) => {
        if (participants.length > 1) {
            setParticipants(prev => prev.filter((_, i) => i !== index));
        }
    };

    const updateParticipant = (index: number, field: 'address' | 'amount', value: string) => {
        setParticipants(prev =>
            prev.map((p, i) =>
                i === index
                    ? {
                        ...p,
                        [field]: value,
                        isValid: field === 'address' ? isValidAddress(value) : p.isValid
                    }
                    : p
            )
        );
    };

    const executeSplit = async () => {
        if (!isConnected) {
            Alert.alert('Error', 'Please connect your wallet first');
            return;
        }

        if (!isOnBase) {
            const switched = await switchToBase();
            if (!switched) {
                Alert.alert('Error', 'Please switch to Base network');
                return;
            }
        }

        const validParticipants = participants.filter(p => p.isValid && p.amount);
        if (validParticipants.length === 0) {
            Alert.alert('Error', 'Please add valid participants');
            return;
        }

        const total = validParticipants.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        if (total !== parseFloat(totalAmount)) {
            Alert.alert('Error', 'Total amounts do not match');
            return;
        }

        setIsProcessing(true);

        try {
            const addresses = validParticipants.map(p => p.address);
            const amounts = validParticipants.map(p => p.amount);

            let txHashes: string[];

            if (currency === 'ETH') {
                txHashes = await splitPaymentETH(addresses, amounts);
            } else {
                txHashes = await splitPaymentUSDC(addresses, amounts);
            }

            // Send XMTP messages to participants
            const message = `💰 Payment split completed!\n\nDescription: ${description}\nAmount: ${totalAmount} ${currency}\nYour share: Check your wallet\n\nTx hashes: ${txHashes.slice(0, 2).join(', ')}${txHashes.length > 2 ? '...' : ''}`;

            for (const participant of validParticipants) {
                try {
                    await sendMessage(participant.address, message);
                } catch (err) {
                    console.log('Could not send XMTP message to:', participant.address);
                }
            }

            Alert.alert(
                'Success!',
                `Payment split completed successfully!\n${txHashes.length} transactions sent.`,
                [
                    {
                        text: 'View on BaseScan',
                        onPress: () => {
                            // Open first transaction on BaseScan
                            // Linking.openURL(`https://basescan.org/tx/${txHashes[0]}`);
                        }
                    },
                    { text: 'OK', onPress: () => router.back() }
                ]
            );

        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to execute payment split');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isConnected) {
        return (
            <ScreenWrapper mode="safe">
                <CustomHeader title="Payment Splitter" showBackButton />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ fontSize: 18, textAlign: 'center', color: '#6B7280' }}>
                        Please connect your wallet to use the payment splitter
                    </Text>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper mode="safe">
            <CustomHeader
                title="Payment Splitter"
                subtitle="Split payments on Base"
                showBackButton
            />

            <FlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20 }}
                data={[1]} // Dummy data for FlatList
                renderItem={() => (
                    <View>
                        {/* Network Status */}
                        {!isOnBase && (
                            <View style={{
                                backgroundColor: '#FEF3C7',
                                padding: 16,
                                borderRadius: 12,
                                marginBottom: 20,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Ionicons name="warning" size={24} color="#D97706" />
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={{ fontWeight: 'bold', color: '#92400E' }}>
                                        Switch to Base Network
                                    </Text>
                                    <Text style={{ color: '#92400E', fontSize: 14 }}>
                                        Payment splitter works on Base network
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={switchToBase}
                                    style={{
                                        backgroundColor: '#F59E0B',
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 8
                                    }}
                                >
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Switch</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Balance Display */}
                        <View style={{
                            backgroundColor: '#F9FAFB',
                            padding: 16,
                            borderRadius: 12,
                            marginBottom: 20
                        }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Your Balance</Text>
                            <Text>ETH: {parseFloat(baseBalance).toFixed(4)}</Text>
                            <Text>USDC: {parseFloat(usdcBalance).toFixed(2)}</Text>
                        </View>

                        {/* Description */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Description</Text>
                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Dinner, concert tickets, etc."
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 16
                                }}
                            />
                        </View>

                        {/* Currency Selection */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Currency</Text>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                {(['ETH', 'USDC'] as const).map((curr) => (
                                    <TouchableOpacity
                                        key={curr}
                                        onPress={() => setCurrency(curr)}
                                        style={{
                                            flex: 1,
                                            padding: 12,
                                            borderRadius: 8,
                                            borderWidth: 2,
                                            borderColor: currency === curr ? '#F97316' : '#E5E7EB',
                                            backgroundColor: currency === curr ? '#FED7AA' : 'white',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text style={{
                                            fontWeight: 'bold',
                                            color: currency === curr ? '#EA580C' : '#6B7280'
                                        }}>
                                            {curr}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Total Amount */}
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Total Amount</Text>
                            <TextInput
                                value={totalAmount}
                                onChangeText={setTotalAmount}
                                placeholder={`0.00 ${currency}`}
                                keyboardType="numeric"
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB',
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 16
                                }}
                            />
                        </View>

                        {/* Participants */}
                        <View style={{ marginBottom: 20 }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 12
                            }}>
                                <Text style={{ fontWeight: 'bold' }}>Participants</Text>
                                <TouchableOpacity
                                    onPress={addParticipant}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#F97316',
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 6
                                    }}
                                >
                                    <Ionicons name="add" size={16} color="white" />
                                    <Text style={{ color: 'white', marginLeft: 4, fontWeight: 'bold' }}>
                                        Add
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {participants.map((participant, index) => (
                                <View key={index} style={{ marginBottom: 12 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <View style={{ flex: 2 }}>
                                            <TextInput
                                                value={participant.address}
                                                onChangeText={(text) => updateParticipant(index, 'address', text)}
                                                placeholder="0x... wallet address"
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: participant.address && !participant.isValid ? '#EF4444' : '#E5E7EB',
                                                    borderRadius: 8,
                                                    padding: 12,
                                                    fontSize: 14
                                                }}
                                            />
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <TextInput
                                                value={participant.amount}
                                                onChangeText={(text) => updateParticipant(index, 'amount', text)}
                                                placeholder="0.00"
                                                keyboardType="numeric"
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: '#E5E7EB',
                                                    borderRadius: 8,
                                                    padding: 12,
                                                    fontSize: 14,
                                                    textAlign: 'center'
                                                }}
                                            />
                                        </View>

                                        {participants.length > 1 && (
                                            <TouchableOpacity
                                                onPress={() => removeParticipant(index)}
                                                style={{ padding: 8 }}
                                            >
                                                <Ionicons name="trash" size={20} color="#EF4444" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Execute Button */}
                        <TouchableOpacity
                            onPress={executeSplit}
                            disabled={isProcessing || !totalAmount || participants.filter(p => p.isValid).length === 0}
                            style={{
                                backgroundColor: isProcessing ? '#9CA3AF' : '#F97316',
                                padding: 16,
                                borderRadius: 12,
                                alignItems: 'center',
                                marginBottom: 20
                            }}
                        >
                            {isProcessing ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color="white" />
                                    <Text style={{ color: 'white', marginLeft: 8, fontWeight: 'bold' }}>
                                        Processing...
                                    </Text>
                                </View>
                            ) : (
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                                    Split Payment
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            />
        </ScreenWrapper>
    );
}