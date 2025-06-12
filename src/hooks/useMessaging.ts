import { useState, useEffect, useCallback } from 'react';
import { Conversation, DecodedMessage } from '@xmtp/react-native-sdk';
import xmtpService, { EventRoomMetadata, AgentMetadata, MiniAppMessage } from '../services/xmtp';
import { useAuthStore } from '../store/authStore';
import { useMessagingStore } from '../store/messagingStore';

export interface UseMessagingReturn {
  // Connection state
  isInitialized: boolean;
  isConnecting: boolean;
  error: string | null;

  // Core functions
  initializeXMTP: () => Promise<void>;
  disconnect: () => Promise<void>;

  // Conversations
  conversations: Array<{
    id: string;
    conversation: Conversation;
    lastMessage?: DecodedMessage;
    unreadCount: number;
    metadata?: any;
  }>;
  refreshConversations: () => Promise<void>;

  // Event rooms
  createEventRoom: (eventMetadata: EventRoomMetadata, participants: string[]) => Promise<Conversation>;

  // Agent conversations
  createAgentChat: (agentAddress: string, agentMetadata: AgentMetadata) => Promise<Conversation>;

  // Messaging
  sendMessage: (conversationId: string, content: string, type?: 'text' | 'mini-app' | 'agent-command', metadata?: any) => Promise<void>;
  sendMiniAppMessage: (conversationId: string, miniAppData: MiniAppMessage) => Promise<void>;
  getMessages: (conversationId: string, limit?: number, before?: Date) => Promise<DecodedMessage[]>;
}

export const useMessaging = (): UseMessagingReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<UseMessagingReturn['conversations']>([]);

  const {
    address,
    isAuthenticated,
    signer
  } = useAuthStore();

  const { setConnected, setError: setStoreError } = useMessagingStore();

  /**
   * Initialize XMTP
   */
  const initializeXMTP = useCallback(async () => {
    if (!address || !isAuthenticated) {
      setError('No wallet connected');
      return;
    }

    if (isInitialized) {
      console.log('XMTP already initialized');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await xmtpService.initialize(address, { env: 'dev' });

      setIsInitialized(true);
      setConnected(true);

      // Load initial conversations
      await refreshConversations();

      console.log('✅ XMTP initialized successfully');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize XMTP';
      setError(errorMessage);
      setStoreError(errorMessage);
      console.error('❌ XMTP initialization failed:', errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }, [address, isAuthenticated, isInitialized, setConnected, setStoreError]);

  /**
   * Disconnect from XMTP
   */
  const disconnect = useCallback(async () => {
    try {
      await xmtpService.disconnect();

      setIsInitialized(false);
      setConversations([]);
      setError(null);
      setConnected(false);

      console.log('🔌 XMTP disconnected');

    } catch (err) {
      console.error('Error disconnecting XMTP:', err);
    }
  }, [setConnected]);

  /**
   * Refresh conversations list
   */
  const refreshConversations = useCallback(async () => {
    if (!isInitialized) return;

    try {
      const convList = await xmtpService.listConversations();
      setConversations(convList);

    } catch (err) {
      console.error('Failed to refresh conversations:', err);
      setError('Failed to load conversations');
    }
  }, [isInitialized]);

  /**
   * Create event room
   */
  const createEventRoom = useCallback(async (
    eventMetadata: EventRoomMetadata,
    participants: string[]
  ): Promise<Conversation> => {
    if (!isInitialized) {
      throw new Error('XMTP not initialized');
    }

    try {
      const conversation = await xmtpService.getOrCreateEventRoom(eventMetadata, participants);
      await refreshConversations();
      return conversation;

    } catch (err) {
      console.error('Failed to create event room:', err);
      throw err;
    }
  }, [isInitialized, refreshConversations]);

  /**
   * Create agent conversation
   */
  const createAgentChat = useCallback(async (
    agentAddress: string,
    agentMetadata: AgentMetadata
  ): Promise<Conversation> => {
    if (!isInitialized) {
      throw new Error('XMTP not initialized');
    }

    try {
      const conversation = await xmtpService.createAgentConversation(agentAddress, agentMetadata);
      await refreshConversations();
      return conversation;

    } catch (err) {
      console.error('Failed to create agent chat:', err);
      throw err;
    }
  }, [isInitialized, refreshConversations]);

  /**
   * Send message
   */
  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    type: 'text' | 'mini-app' | 'agent-command' = 'text',
    metadata?: any
  ) => {
    if (!isInitialized) {
      throw new Error('XMTP not initialized');
    }

    try {
      await xmtpService.sendMessage(conversationId, content, type, metadata);
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  }, [isInitialized]);

  /**
   * Send mini-app message
   */
  const sendMiniAppMessage = useCallback(async (
    conversationId: string,
    miniAppData: MiniAppMessage
  ) => {
    await xmtpService.sendMiniAppMessage(conversationId, miniAppData);
  }, []);

  /**
   * Get messages for conversation
   */
  const getMessages = useCallback(async (
    conversationId: string,
    limit: number = 50,
    before?: Date
  ): Promise<DecodedMessage[]> => {
    if (!isInitialized) {
      return [];
    }

    try {
      return await xmtpService.getMessages(conversationId, limit, before);
    } catch (err) {
      console.error('Failed to get messages:', err);
      return [];
    }
  }, [isInitialized]);

  // Auto-initialize when wallet connects
  useEffect(() => {
    if (address && isAuthenticated && !isInitialized && !isConnecting) {
      initializeXMTP();
    }
  }, [address, isAuthenticated, isInitialized, isConnecting, initializeXMTP]);

  return {
    // Connection state
    isInitialized,
    isConnecting,
    error,

    // Core functions
    initializeXMTP,
    disconnect,

    // Conversations
    conversations,
    refreshConversations,

    // Event rooms
    createEventRoom,

    // Agent conversations
    createAgentChat,

    // Messaging
    sendMessage,
    sendMiniAppMessage,
    getMessages,
  };
};