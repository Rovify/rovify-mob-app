import { useState, useEffect, useCallback } from 'react';
import { XMTPService, XMTPMessage } from '../services/xmtp';
import { useAuth } from './useAuth';

export interface ConversationType {
  id: string;
  topic: string;
  peerAddress: string;
  lastMessage?: XMTPMessage;
  unreadCount: number;
  metadata?: {
    title?: string;
    name?: string;
    type?: 'event-room' | 'agent' | 'direct' | 'group';
    eventId?: string;
  };
}

export const useMessaging = () => {
  const { signer, isAuthenticated, address } = useAuth();
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const xmtpService = new XMTPService();

  const initializeXMTP = useCallback(async () => {
    if (!signer || !isAuthenticated) return;

    setIsConnecting(true);
    setError(null);

    try {
      await xmtpService.initialize(signer);
      await loadConversations();
      setIsInitialized(true);
      console.log('✅ XMTP initialized');
    } catch (err: any) {
      setError(err.message);
      console.error('❌ XMTP error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [signer, isAuthenticated]);

  const loadConversations = async () => {
    try {
      const xmtpConversations = await xmtpService.getConversations();

      const formattedConversations: ConversationType[] = xmtpConversations.map(conv => ({
        id: conv.topic,
        topic: conv.topic,
        peerAddress: conv.peerAddress,
        lastMessage: conv.lastMessage,
        unreadCount: conv.topic.includes('agent') ? 1 : 0,
        metadata: {
          title: conv.topic.includes('defi') ? 'DeFi Trader' :
            conv.topic.includes('event') ? 'The Man Exclusive 2025' :
              `${conv.peerAddress.slice(0, 6)}...${conv.peerAddress.slice(-4)}`,
          type: conv.topic.includes('agent') ? 'agent' :
            conv.topic.includes('event') ? 'event-room' : 'direct',
          eventId: conv.topic.includes('event') ? '1' : undefined
        }
      }));

      setConversations(formattedConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const startConversation = async (peerAddress: string, metadata?: any) => {
    try {
      const conversation = await xmtpService.startConversation(peerAddress);

      const newConv: ConversationType = {
        id: conversation.topic,
        topic: conversation.topic,
        peerAddress,
        unreadCount: 0,
        metadata: {
          title: metadata?.title || `${peerAddress.slice(0, 6)}...${peerAddress.slice(-4)}`,
          type: metadata?.type || 'direct'
        }
      };

      setConversations(prev => [newConv, ...prev]);
      return newConv;
    } catch (error) {
      console.error('Failed to start conversation:', error);
      throw error;
    }
  };

  const sendMessage = async (topic: string, message: string) => {
    try {
      const sentMessage = await xmtpService.sendMessage(topic, message, address || 'demo-user');

      // Update conversations
      setConversations(prev =>
        prev.map(conv =>
          conv.topic === topic
            ? { ...conv, lastMessage: sentMessage }
            : conv
        )
      );

      return sentMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const getMessages = async (topic: string): Promise<XMTPMessage[]> => {
    return await xmtpService.getMessages(topic);
  };

  const streamMessages = async (topic: string, onMessage: (message: XMTPMessage) => void) => {
    return await xmtpService.streamMessages(topic, onMessage);
  };

  const createEventRoom = async (eventId: string, eventTitle: string) => {
    try {
      const roomTopic = await xmtpService.createEventRoom(eventId, eventTitle);

      const eventRoom: ConversationType = {
        id: roomTopic,
        topic: roomTopic,
        peerAddress: 'event-system',
        unreadCount: 0,
        metadata: {
          title: eventTitle,
          type: 'event-room',
          eventId
        }
      };

      setConversations(prev => [eventRoom, ...prev]);
      return eventRoom;
    } catch (error) {
      console.error('Failed to create event room:', error);
      throw error;
    }
  };

  const refreshConversations = async () => {
    setIsConnecting(true);
    await loadConversations();
    setIsConnecting(false);
  };

  useEffect(() => {
    if (isAuthenticated && signer && !isInitialized && !isConnecting) {
      initializeXMTP();
    }
  }, [isAuthenticated, signer, isInitialized, isConnecting, initializeXMTP]);

  return {
    conversations,
    isInitialized,
    isConnecting,
    error,
    initializeXMTP,
    startConversation,
    sendMessage,
    getMessages,
    streamMessages,
    createEventRoom,
    refreshConversations
  };
};