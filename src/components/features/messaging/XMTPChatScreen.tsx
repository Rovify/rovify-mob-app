import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useXMTP } from '../../../hooks/useXMTP';
import { useMobileWallet } from '@/hooks/useWallet';
import { ScreenWrapper } from '../../layout/ScreenWrapper';
import { CustomHeader } from '@/components/layout/Header';

interface XMTPChatScreenProps {
    address: string;
}

export default function XMTPChatScreen({ address: peerAddress }: XMTPChatScreenProps) {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const { address: myAddress } = useMobileWallet();
    const {
        conversations,
        messages,
        isInitialized,
        sendMessage,
        createConversation,
        getConversation,
        getMessages
    } = useXMTP();

    const conversation = getConversation(peerAddress!);
    const chatMessages = conversation ? getMessages(conversation.topic) : [];

    // Create conversation if it doesn't exist
    useEffect(() => {
        if (isInitialized && peerAddress && !conversation) {
            createConversation(peerAddress);
        }
    }, [isInitialized, peerAddress, conversation, createConversation]);

    const handleSendMessage = async () => {
        if (!message.trim() || !peerAddress) return;

        const messageText = message.trim();
        setMessage('');

        try {
            await sendMessage(peerAddress, messageText);

            // Scroll to bottom
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error: any) {
            Alert.alert('Error', 'Failed to send message');
            setMessage(messageText); // Restore message on error
        }
    };

    const renderMessage = ({ item, index }: { item: any; index: number }) => {
        const isMyMessage = item.senderAddress.toLowerCase() === myAddress?.toLowerCase();
        const showAvatar = index === 0 ||
            chatMessages[index - 1]?.senderAddress !== item.senderAddress;

        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                    marginBottom: 12,
                    paddingHorizontal: 16
                }}
            >
                {!isMyMessage && showAvatar && (
                    <View
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: '#F3F4F6',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 8
                        }}
                    >
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#6B7280' }}>
                            {item.senderAddress.slice(2, 4).toUpperCase()}
                        </Text>
                    </View>
                )}

                {!isMyMessage && !showAvatar && <View style={{ width: 40 }} />}

                <View
                    style={{
                        maxWidth: '75%',
                        padding: 12,
                        borderRadius: 16,
                        backgroundColor: isMyMessage ? '#F97316' : '#F3F4F6'
                    }}
                >
                    <Text
                        style={{
                            color: isMyMessage ? 'white' : '#1F2937',
                            fontSize: 16
                        }}
                    >
                        {item.content}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: isMyMessage ? 'rgba(255,255,255,0.7)' : '#9CA3AF',
                            marginTop: 4
                        }}
                    >
                        {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
            </View>
        );
    };

    if (!isInitialized) {
        return (
            <ScreenWrapper mode="safe">
                <CustomHeader title="Loading..." showBackButton />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Initializing XMTP...</Text>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper mode="safe">
            <CustomHeader
                title={`${peerAddress?.slice(0, 6)}...${peerAddress?.slice(-4)}`}
                subtitle={conversation ? 'XMTP Secured' : 'Creating conversation...'}
                showBackButton
                rightActions={[
                    {
                        icon: 'videocam-outline',
                        onPress: () => Alert.alert('Video Call', 'Coming soon!')
                    },
                    {
                        icon: 'call-outline',
                        onPress: () => Alert.alert('Voice Call', 'Coming soon!')
                    }
                ]}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={chatMessages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                />

                {/* Message Input */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderTopWidth: 1,
                        borderTopColor: '#E5E7EB',
                        backgroundColor: 'white'
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#F3F4F6',
                            borderRadius: 24,
                            paddingHorizontal: 16,
                            paddingVertical: 8
                        }}
                    >
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type a message..."
                            multiline
                            style={{
                                flex: 1,
                                maxHeight: 100,
                                fontSize: 16,
                                color: '#1F2937'
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSendMessage}
                        disabled={!message.trim()}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: message.trim() ? '#F97316' : '#E5E7EB',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 8
                        }}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={message.trim() ? 'white' : '#9CA3AF'}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}