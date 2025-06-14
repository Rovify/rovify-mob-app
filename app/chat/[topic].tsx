// app/chat/[topic].tsx - Real Chat Screen Implementation
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DecodedMessage } from '@xmtp/react-native-sdk';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { xmtpService } from '../../src/services/xmtp';
import { useAuth } from '../../src/hooks/useAuth';
import { getDeviceInfo, getDesignTokens } from '../../src/utils/responsive';
import { MiniAppMessage } from '../../src/components/features/messaging/mini-app-integration/MiniAppMessage';
import { PaymentSplitModal } from '../../src/components/features/mini-apps/utility/PaymentSplitter';
import { EventPollModal } from '../../src/components/features/mini-apps/social/EventPoll';
import { CustomHeader } from '@/components/layout/Header';

interface ChatMessage extends DecodedMessage {
  isOwnMessage: boolean;
  timestamp: Date;
  status: 'sending' | 'sent' | 'failed';
}

export default function ChatScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const { address, isXMTPReady } = useAuth();
  const device = getDeviceInfo();
  const tokens = getDesignTokens();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Mini-app modals
  const [showPaymentSplit, setShowPaymentSplit] = useState(false);
  const [showEventPoll, setShowEventPoll] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Load messages and setup real-time listener
  useEffect(() => {
    if (!isXMTPReady || !topic) return;

    loadMessages();
    setupMessageListener();

    return () => {
      xmtpService.offMessage(topic);
    };
  }, [isXMTPReady, topic]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const xmtpMessages = await xmtpService.getMessages(topic!, 100);

      const chatMessages: ChatMessage[] = xmtpMessages.map(msg => ({
        ...msg,
        isOwnMessage: msg.senderAddress === address,
        timestamp: new Date(msg.sent),
        status: 'sent' as const
      }));

      setMessages(chatMessages.reverse()); // Reverse to show latest at bottom
    } catch (error) {
      console.error('❌ Load messages failed:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const setupMessageListener = () => {
    xmtpService.onMessage(topic!, (message) => {
      const chatMessage: ChatMessage = {
        ...message,
        isOwnMessage: message.senderAddress === address,
        timestamp: new Date(message.sent),
        status: 'sent'
      };

      setMessages(prev => [...prev, chatMessage]);

      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const messageContent = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    // Optimistic UI update
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: messageContent,
      contentType: 'text/plain',
      senderAddress: address!,
      sent: Date.now(),
      isOwnMessage: true,
      timestamp: new Date(),
      status: 'sending'
    } as ChatMessage;

    setMessages(prev => [...prev, tempMessage]);

    try {
      await xmtpService.sendMessage(topic!, messageContent);

      // Update message status
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessage.id
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );
    } catch (error) {
      console.error('❌ Send message failed:', error);

      // Update message status to failed
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessage.id
            ? { ...msg, status: 'failed' as const }
            : msg
        )
      );

      Alert.alert('Error', 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const sendPaymentSplit = async (amount: number, description: string, participants: string[]) => {
    try {
      const paymentData = {
        type: 'payment-split',
        amount,
        description,
        participants,
        creator: address,
        timestamp: Date.now()
      };

      await xmtpService.sendMiniAppMessage(topic!, paymentData);
      setShowPaymentSplit(false);

      Alert.alert('Success', 'Payment split request sent!');
    } catch (error) {
      console.error('❌ Payment split failed:', error);
      Alert.alert('Error', 'Failed to send payment split');
    }
  };

  const sendEventPoll = async (question: string, options: string[]) => {
    try {
      const pollData = {
        type: 'event-poll',
        question,
        options: options.map((option, index) => ({
          id: index,
          text: option,
          votes: 0
        })),
        creator: address,
        timestamp: Date.now()
      };

      await xmtpService.sendMiniAppMessage(topic!, pollData);
      setShowEventPoll(false);

      Alert.alert('Success', 'Poll created!');
    } catch (error) {
      console.error('❌ Event poll failed:', error);
      Alert.alert('Error', 'Failed to create poll');
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwnMessage = item.isOwnMessage;

    // Handle mini-app messages
    if (item.contentType === 'application/vnd.rovify.mini-app') {
      return (
        <MiniAppMessage
          message={item}
          onInteraction={(data) => console.log('Mini-app interaction:', data)}
        />
      );
    }

    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        marginVertical: tokens.spacing.xs,
        paddingHorizontal: tokens.spacing.md
      }}>
        {/* Avatar for other users */}
        {!isOwnMessage && (
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#F3F4F6',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: tokens.spacing.xs
          }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#6B7280' }}>
              {item.senderAddress.slice(2, 4).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={{
          maxWidth: '70%',
          backgroundColor: isOwnMessage ? '#F97316' : 'white',
          borderRadius: tokens.borderRadius.lg,
          padding: tokens.spacing.sm,
          ...(!isOwnMessage && tokens.shadows.sm)
        }}>
          <Text style={{
            color: isOwnMessage ? 'white' : '#1F2937',
            fontSize: tokens.typography.base
          }}>
            {item.content}
          </Text>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: tokens.spacing.xs
          }}>
            <Text style={{
              fontSize: tokens.typography.xs,
              color: isOwnMessage ? 'rgba(255,255,255,0.7)' : '#9CA3AF'
            }}>
              {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>

            {isOwnMessage && (
              <Ionicons
                name={
                  item.status === 'sending' ? 'time-outline' :
                    item.status === 'sent' ? 'checkmark' :
                      'alert-circle'
                }
                size={12}
                color={item.status === 'failed' ? '#EF4444' : 'rgba(255,255,255,0.7)'}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderMiniAppButtons = () => (
    <View style={{
      flexDirection: 'row',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      gap: tokens.spacing.sm
    }}>
      <TouchableOpacity
        onPress={() => setShowPaymentSplit(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#10B981',
          paddingHorizontal: tokens.spacing.sm,
          paddingVertical: tokens.spacing.xs,
          borderRadius: tokens.borderRadius.lg
        }}
      >
        <Ionicons name="card" size={16} color="white" />
        <Text style={{ color: 'white', fontSize: tokens.typography.sm, marginLeft: 4 }}>
          Split Bill
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowEventPoll(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#8B5CF6',
          paddingHorizontal: tokens.spacing.sm,
          paddingVertical: tokens.spacing.xs,
          borderRadius: tokens.borderRadius.lg
        }}
      >
        <Ionicons name="bar-chart" size={16} color="white" />
        <Text style={{ color: 'white', fontSize: tokens.typography.sm, marginLeft: 4 }}>
          Create Poll
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (!isXMTPReady) {
    return (
      <ScreenWrapper mode="safe">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Connecting to XMTP...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper mode="safe" backgroundColor="white">
      <CustomHeader
        title="Event Chat"
        showBackButton
        onBackPress={() => router.back()}
        rightActions={[
          {
            icon: 'information-circle-outline',
            onPress: () => console.log('Chat info')
          }
        ]}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: tokens.spacing.sm }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Mini-app Buttons */}
        {renderMiniAppButtons()}

        {/* Message Input */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: tokens.spacing.md,
          paddingVertical: tokens.spacing.sm,
          backgroundColor: '#F9FAFB',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB'
        }}>
          <TextInput
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type a message..."
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: tokens.borderRadius.full,
              paddingHorizontal: tokens.spacing.md,
              paddingVertical: tokens.spacing.sm,
              fontSize: tokens.typography.base,
              marginRight: tokens.spacing.sm,
              ...tokens.shadows.sm
            }}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputMessage.trim() || isSending}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: inputMessage.trim() ? '#F97316' : '#D1D5DB',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isSending ? (
              <Ionicons name="time" size={20} color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Payment Split Modal */}
      <PaymentSplitModal
        visible={showPaymentSplit}
        onClose={() => setShowPaymentSplit(false)}
        onSplit={sendPaymentSplit}
      />

      {/* Event Poll Modal */}
      <EventPollModal
        visible={showEventPoll}
        onClose={() => setShowEventPoll(false)}
        onCreatePoll={sendEventPoll}
      />
    </ScreenWrapper>
  );
}