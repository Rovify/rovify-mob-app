import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import XMTPChatScreen from '@/components/features/messaging/XMTPChatScreen';

export default function ChatScreen() {
    const { address } = useLocalSearchParams();

    return <XMTPChatScreen address={address as string} />;
}
