import { Client, Conversation, DecodedMessage } from '@xmtp/react-native-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface XMTPClientConfig {
  env: 'dev' | 'production' | 'local';
  appVersion?: string;
}

export interface EventRoomMetadata {
  eventId: string;
  eventTitle: string;
  eventPhase: 'before' | 'during' | 'after';
  eventStartTime: Date;
  eventEndTime: Date;
  maxParticipants?: number;
}

export interface AgentMetadata {
  agentId: string;
  agentName: string;
  agentType: 'trading' | 'gaming' | 'utility' | 'social';
  capabilities: string[];
}

export interface MiniAppMessage {
  appId: string;
  appName: string;
  action: string;
  payload: Record<string, any>;
}

// Mock types to match XMTP SDK structure
type ConversationTopic = string & { readonly brand: unique symbol };
type MessageId = string & { readonly brand: unique symbol };

interface MockConversation {
  topic: ConversationTopic;
  peerAddress: string;
  createdAt: Date;
  messages: (options?: any) => Promise<MockDecodedMessage[]>;
  send: (content: string) => Promise<MockDecodedMessage>;
  streamMessages: (callback: (message: MockDecodedMessage) => void) => { cancel: () => void };
}

interface MockDecodedMessage {
  id: MessageId;
  topic: ConversationTopic;
  content: string;
  senderAddress: string;
  sent: Date;
  contentType: {
    authorityId: string;
    typeId: string;
    versionMajor: number;
    versionMinor: number;
  };
}

interface MockClient {
  address: string;
  conversations: {
    list: () => Promise<MockConversation[]>;
    newConversation: (peerAddress: string) => Promise<MockConversation>;
    stream: (callback: (conversation: MockConversation) => void) => { cancel: () => void };
  };
}

class XMTPService {
  private client: MockClient | null = null;
  private conversations: Map<string, MockConversation> = new Map();
  private isInitialized = false;
  private userAddress: string | null = null;

  /**
   * Initialize XMTP client - simplified for buildathon
   */
  async initialize(signerAddress: string, config: XMTPClientConfig = { env: 'dev' }): Promise<void> {
    try {
      if (this.isInitialized && this.client) {
        console.log('XMTP client already initialized');
        return;
      }

      this.userAddress = signerAddress;

      // For buildathon: Create a mock client
      this.client = await this.createMockClient(signerAddress, config);

      this.isInitialized = true;
      console.log('✅ XMTP client initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize XMTP client:', error);
      throw new Error(`XMTP initialization failed: ${(error as Error).message}`);
    }
  }

  /**
   * Create mock client for buildathon demo
   */
  private async createMockClient(address: string, config: XMTPClientConfig): Promise<MockClient> {
    console.log(`Creating XMTP client for ${address} on ${config.env} network`);

    // Simulate client creation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      address,
      conversations: {
        list: async () => {
          return Array.from(this.conversations.values());
        },
        newConversation: async (peerAddress: string) => {
          return this.createMockConversation(peerAddress);
        },
        stream: (callback: (conversation: MockConversation) => void) => {
          console.log('Starting conversation stream...');
          return { cancel: () => console.log('Stream cancelled') };
        }
      }
    };
  }

  /**
   * Create mock conversation for demo
   */
  private createMockConversation(peerAddress: string): MockConversation {
    const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const topic = conversationId as ConversationTopic; // Type assertion for branded type

    const mockConversation: MockConversation = {
      topic,
      peerAddress,
      createdAt: new Date(),
      messages: async (options?: any) => {
        return this.getMockMessages(topic);
      },
      send: async (content: string) => {
        console.log(`Sending message: ${content}`);
        return this.createMockMessage(topic, content, this.userAddress!);
      },
      streamMessages: (callback: (message: MockDecodedMessage) => void) => {
        console.log('Starting message stream...');
        return { cancel: () => console.log('Message stream cancelled') };
      }
    };

    this.conversations.set(conversationId, mockConversation);
    return mockConversation;
  }

  /**
   * Create mock message
   */
  private createMockMessage(topic: ConversationTopic, content: string, senderAddress: string): MockDecodedMessage {
    const messageId = `msg-${Date.now()}` as MessageId;

    return {
      id: messageId,
      topic,
      content,
      senderAddress,
      sent: new Date(),
      contentType: {
        authorityId: 'xmtp.org',
        typeId: 'text',
        versionMajor: 1,
        versionMinor: 0
      }
    };
  }

  /**
   * Get mock messages for demo
   */
  private getMockMessages(topic: ConversationTopic): MockDecodedMessage[] {
    return [
      this.createMockMessage(topic, 'Welcome to XMTP!', 'system'),
      this.createMockMessage(topic, 'This is a demo conversation', this.userAddress!)
    ];
  }

  /**
   * Create or get event-based conversation room
   */
  async getOrCreateEventRoom(
    eventMetadata: EventRoomMetadata,
    participantAddresses: string[]
  ): Promise<Conversation> {
    if (!this.client) {
      throw new Error('XMTP client not initialized');
    }

    const roomTopic = `event-${eventMetadata.eventId}`;

    let conversation = this.conversations.get(roomTopic);

    if (!conversation) {
      try {
        // For buildathon: create mock event room
        conversation = this.createMockConversation('event-room');
        // Override the topic with our event room topic
        (conversation as any).topic = roomTopic as ConversationTopic;

        // Store event metadata
        await AsyncStorage.setItem(
          `event-metadata-${roomTopic}`,
          JSON.stringify(eventMetadata)
        );

        this.conversations.set(roomTopic, conversation);

        console.log(`✅ Created event room: ${eventMetadata.eventTitle}`);

      } catch (error) {
        console.error(`Failed to create event room ${roomTopic}:`, error);
        throw error;
      }
    }

    return conversation as any; // Type assertion for compatibility
  }

  /**
   * Create agent conversation
   */
  async createAgentConversation(
    agentAddress: string,
    agentMetadata: AgentMetadata
  ): Promise<Conversation> {
    if (!this.client) {
      throw new Error('XMTP client not initialized');
    }

    try {
      const conversation = this.createMockConversation(agentAddress);

      // Send initial agent introduction
      const introMessage = {
        type: 'agent-intro',
        agentId: agentMetadata.agentId,
        agentName: agentMetadata.agentName,
        agentType: agentMetadata.agentType,
        capabilities: agentMetadata.capabilities,
        timestamp: new Date().toISOString()
      };

      await conversation.send(JSON.stringify(introMessage));

      console.log(`✅ Created agent conversation with ${agentMetadata.agentName}`);

      return conversation as any; // Type assertion for compatibility

    } catch (error) {
      console.error('Failed to create agent conversation:', error);
      throw error;
    }
  }

  /**
   * Send message to conversation
   */
  async sendMessage(
    conversationId: string,
    content: string,
    messageType: 'text' | 'mini-app' | 'agent-command' = 'text',
    metadata?: Record<string, any>
  ): Promise<void> {
    const conversation = this.conversations.get(conversationId);

    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    try {
      const messagePayload = {
        type: messageType,
        content,
        metadata,
        timestamp: new Date().toISOString(),
        sender: this.userAddress
      };

      if (messageType === 'mini-app' && metadata) {
        (messagePayload as any).miniApp = metadata as MiniAppMessage;
      }

      await conversation.send(JSON.stringify(messagePayload));

      console.log(`✅ Message sent to ${conversationId}`);

    } catch (error) {
      console.error(`Failed to send message to ${conversationId}:`, error);
      throw error;
    }
  }

  /**
   * Send mini-app message with interactive payload
   */
  async sendMiniAppMessage(
    conversationId: string,
    miniAppData: MiniAppMessage
  ): Promise<void> {
    await this.sendMessage(
      conversationId,
      `Mini-app action: ${miniAppData.action}`,
      'mini-app',
      miniAppData
    );
  }

  /**
   * Get conversation messages
   */
  async getMessages(
    conversationId: string,
    limit: number = 50,
    beforeNs?: Date
  ): Promise<DecodedMessage[]> {
    const conversation = this.conversations.get(conversationId);

    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    try {
      const options: any = { limit };
      if (beforeNs) {
        options.beforeNs = beforeNs.getTime() * 1000000; // Convert to nanoseconds
      }

      const messages = await conversation.messages(options);
      return messages as any; // Type assertion for compatibility

    } catch (error) {
      console.error(`Failed to get messages for ${conversationId}:`, error);
      throw error;
    }
  }

  /**
   * List all conversations with metadata
   */
  async listConversations(): Promise<Array<{
    id: string;
    conversation: Conversation;
    lastMessage?: DecodedMessage;
    unreadCount: number;
    metadata?: any;
  }>> {
    if (!this.client) {
      throw new Error('XMTP client not initialized');
    }

    try {
      const conversations = await this.client.conversations.list();

      const conversationList = await Promise.all(
        conversations.map(async (conv) => {
          const messages = await conv.messages({ limit: 1 });
          const lastMessage = messages[0];

          return {
            id: conv.topic as string, // Convert branded type to string
            conversation: conv as any, // Type assertion for compatibility
            lastMessage: lastMessage as any,
            unreadCount: 0, // Simplified for buildathon
            metadata: await this.getConversationMetadata(conv.topic as string)
          };
        })
      );

      return conversationList;

    } catch (error) {
      console.error('Failed to list conversations:', error);
      throw error;
    }
  }

  /**
   * Get conversation metadata
   */
  private async getConversationMetadata(topic: string): Promise<any> {
    try {
      const stored = await AsyncStorage.getItem(`conversation-metadata-${topic}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get client address
   */
  getAddress(): string | null {
    return this.userAddress;
  }

  /**
   * Check if client is initialized
   */
  isClientInitialized(): boolean {
    return this.isInitialized && this.client !== null;
  }

  /**
   * Cleanup and disconnect
   */
  async disconnect(): Promise<void> {
    this.conversations.clear();
    this.client = null;
    this.isInitialized = false;
    this.userAddress = null;

    console.log('🔌 XMTP client disconnected');
  }
}

// Export singleton instance
export const xmtpService = new XMTPService();
export default xmtpService;