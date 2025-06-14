import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DecodedMessage } from '@xmtp/react-native-sdk';
import { getDesignTokens } from '@/utils/responsive';

interface MiniAppMessageProps {
    message: DecodedMessage;
    onInteraction: (data: any) => void;
}

export const MiniAppMessage: React.FC<MiniAppMessageProps> = ({
    message,
    onInteraction
}) => {
    const tokens = getDesignTokens();

    let appData: any;
    try {
        appData = JSON.parse(typeof message.content === 'function' ? message.content() : message.content);
    } catch {
        return null;
    }

    const renderPaymentSplit = () => (
        <View style={{
            backgroundColor: '#F0FDF4',
            borderRadius: tokens.borderRadius.lg,
            padding: tokens.spacing.md,
            margin: tokens.spacing.md,
            borderLeftWidth: 4,
            borderLeftColor: '#10B981'
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.sm }}>
                <Ionicons name="card" size={20} color="#10B981" />
                <Text style={{ fontSize: tokens.typography.base, fontWeight: 'bold', marginLeft: 8 }}>
                    Payment Split Request
                </Text>
            </View>

            <Text style={{ fontSize: tokens.typography.sm, color: '#374151', marginBottom: 4 }}>
                {appData.description}
            </Text>

            <Text style={{ fontSize: tokens.typography.lg, fontWeight: 'bold', color: '#10B981', marginBottom: tokens.spacing.sm }}>
                ${appData.amount} ÷ {appData.participants.length} = ${(appData.amount / appData.participants.length).toFixed(2)} each
            </Text>

            <TouchableOpacity
                onPress={() => onInteraction({ type: 'payment-split', action: 'pay', data: appData })}
                style={{
                    backgroundColor: '#10B981',
                    borderRadius: tokens.borderRadius.md,
                    paddingVertical: tokens.spacing.sm,
                    alignItems: 'center'
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Pay Now</Text>
            </TouchableOpacity>
        </View>
    );

    const renderEventPoll = () => (
        <View style={{
            backgroundColor: '#F5F3FF',
            borderRadius: tokens.borderRadius.lg,
            padding: tokens.spacing.md,
            margin: tokens.spacing.md,
            borderLeftWidth: 4,
            borderLeftColor: '#8B5CF6'
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.sm }}>
                <Ionicons name="bar-chart" size={20} color="#8B5CF6" />
                <Text style={{ fontSize: tokens.typography.base, fontWeight: 'bold', marginLeft: 8 }}>
                    Event Poll
                </Text>
            </View>

            <Text style={{ fontSize: tokens.typography.base, fontWeight: '600', marginBottom: tokens.spacing.sm }}>
                {appData.question}
            </Text>

            {appData.options.map((option: any, index: number) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onInteraction({ type: 'poll-vote', option: index, data: appData })}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: tokens.borderRadius.md,
                        padding: tokens.spacing.sm,
                        marginBottom: tokens.spacing.xs,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ fontSize: tokens.typography.sm }}>{option.text}</Text>
                    <Text style={{ fontSize: tokens.typography.xs, color: '#8B5CF6', fontWeight: 'bold' }}>
                        {option.votes} votes
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    switch (appData.type) {
        case 'payment-split':
            return renderPaymentSplit();
        case 'event-poll':
            return renderEventPoll();
        default:
            return (
                <View style={{ padding: tokens.spacing.md }}>
                    <Text>Unknown mini-app: {appData.type}</Text>
                </View>
            );
    }
};