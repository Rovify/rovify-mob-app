import { useAuth } from '../hooks/useAuth';

export interface XMTPMessage {
  id: string;
  content: string;
  senderAddress: string;
  sentAt: Date;
  conversationTopic: string;
}

export interface XMTPConversation {
  topic: string;
  peerAddress: string;
  createdAt: Date;
  lastMessage?: XMTPMessage;
}

export class XMTPService {
  private isDemo = true; // Enable demo mode for buildathon
  private demoMessages: Map<string, XMTPMessage[]> = new Map();
  private demoConversations: Map<string, XMTPConversation> = new Map();

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Demo conversations
    const demoConvs = [
      {
        topic: 'defi-trader-agent',
        peerAddress: '0x1234567890123456789012345678901234567890',
        createdAt: new Date(),
        lastMessage: {
          id: '1',
          content: '🎯 I can help you with DeFi trading on Base! What would you like to explore?',
          senderAddress: '0x1234567890123456789012345678901234567890',
          sentAt: new Date(),
          conversationTopic: 'defi-trader-agent'
        }
      },
      {
        topic: 'event-room-1',
        peerAddress: 'event-system',
        createdAt: new Date(),
        lastMessage: {
          id: '2',
          content: 'Welcome to The Man Exclusive 2025! 🎉 Connect with other attendees.',
          senderAddress: 'event-system',
          sentAt: new Date(),
          conversationTopic: 'event-room-1'
        }
      }
    ];

    demoConvs.forEach(conv => {
      this.demoConversations.set(conv.topic, conv);
      if (conv.lastMessage) {
        this.demoMessages.set(conv.topic, [conv.lastMessage]);
      }
    });
  }

  async initialize(signer: any): Promise<void> {
    try {
      console.log('🚀 XMTP Service initialized (Demo Mode)');

      // In production, you would:
      // const { Client } = require('@xmtp/react-native-sdk');
      // this.client = await Client.create(signer);

      return Promise.resolve();
    } catch (error) {
      console.error('XMTP init error:', error);
      throw error;
    }
  }

  async getConversations(): Promise<XMTPConversation[]> {
    if (this.isDemo) {
      return Array.from(this.demoConversations.values());
    }

    // Real XMTP implementation would go here
    return [];
  }

  async startConversation(peerAddress: string): Promise<XMTPConversation> {
    const topic = `conv-${Date.now()}`;
    const conversation: XMTPConversation = {
      topic,
      peerAddress,
      createdAt: new Date()
    };

    if (this.isDemo) {
      this.demoConversations.set(topic, conversation);
      this.demoMessages.set(topic, []);
    }

    return conversation;
  }

  async sendMessage(topic: string, content: string, senderAddress: string): Promise<XMTPMessage> {
    const message: XMTPMessage = {
      id: `msg-${Date.now()}`,
      content,
      senderAddress,
      sentAt: new Date(),
      conversationTopic: topic
    };

    if (this.isDemo) {
      const messages = this.demoMessages.get(topic) || [];
      messages.push(message);
      this.demoMessages.set(topic, messages);

      // Update conversation last message
      const conv = this.demoConversations.get(topic);
      if (conv) {
        conv.lastMessage = message;
        this.demoConversations.set(topic, conv);
      }

      // Simulate agent responses
      this.simulateAgentResponse(topic, content, senderAddress);
    }

    return message;
  }

  private async simulateAgentResponse(topic: string, userMessage: string, userAddress: string) {
    // Don't respond to our own messages
    if (topic.includes('agent') && !userAddress.includes('agent')) {
      setTimeout(() => {
        const responses = this.getAgentResponse(topic, userMessage);

        responses.forEach((response, index) => {
          setTimeout(() => {
            const agentMessage: XMTPMessage = {
              id: `agent-${Date.now()}-${index}`,
              content: response,
              senderAddress: this.demoConversations.get(topic)?.peerAddress || 'agent',
              sentAt: new Date(),
              conversationTopic: topic
            };

            const messages = this.demoMessages.get(topic) || [];
            messages.push(agentMessage);
            this.demoMessages.set(topic, messages);

            // Update conversation
            const conv = this.demoConversations.get(topic);
            if (conv) {
              conv.lastMessage = agentMessage;
              this.demoConversations.set(topic, conv);
            }
          }, index * 1000);
        });
      }, 1000);
    }
  }

  private getAgentResponse(topic: string, message: string): string[] {
    const lowerMessage = message.toLowerCase();

    if (topic.includes('defi') || topic.includes('trader')) {
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return [
          '👋 Hello! I\'m your DeFi trading assistant on Base.',
          '📊 I can help you with:\n• Real-time trading signals\n• Yield farming opportunities\n• Portfolio analysis\n• Risk management',
          'What would you like to explore first?'
        ];
      }

      if (lowerMessage.includes('trade') || lowerMessage.includes('buy')) {
        return [
          '🎯 Current market analysis for Base:',
          '• ETH/USDC: Bullish momentum, RSI at 65\n• UNI/ETH: Consolidating, good entry point\n• USDC lending on Aave: 3.2% APY',
          'Which asset interests you most?'
        ];
      }

      if (lowerMessage.includes('yield') || lowerMessage.includes('farm')) {
        return [
          '🌱 Top yield opportunities on Base:',
          '1. Uniswap V3 ETH/USDC LP: ~8.5% APY\n2. Aave USDC lending: ~3.2% APY\n3. Compound ETH: ~2.8% APY',
          'Want me to calculate optimal position sizes?'
        ];
      }

      return ['📈 I can help with trading, yield farming, or portfolio analysis. What interests you?'];
    }

    if (topic.includes('event')) {
      return [
        '🎉 Welcome to the event chat!',
        'I can help you:\n• Connect with other attendees\n• Split event costs\n• Plan meetups\n• Share contact info',
        'What would you like to do?'
      ];
    }

    return ['👋 Hello! How can I help you today?'];
  }

  async getMessages(topic: string): Promise<XMTPMessage[]> {
    if (this.isDemo) {
      return this.demoMessages.get(topic) || [];
    }

    return [];
  }

  async streamMessages(topic: string, onMessage: (message: XMTPMessage) => void): Promise<() => void> {
    if (this.isDemo) {
      // Simulate real-time updates by polling
      const interval = setInterval(() => {
        const messages = this.demoMessages.get(topic) || [];
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
          onMessage(lastMessage);
        }
      }, 2000);

      return () => clearInterval(interval);
    }

    return () => { };
  }

  async createEventRoom(eventId: string, eventTitle: string): Promise<string> {
    const roomTopic = `event-room-${eventId}`;

    const eventRoom: XMTPConversation = {
      topic: roomTopic,
      peerAddress: 'event-system',
      createdAt: new Date(),
      lastMessage: {
        id: `welcome-${eventId}`,
        content: `🎉 Welcome to ${eventTitle}! Connect with other attendees here.`,
        senderAddress: 'event-system',
        sentAt: new Date(),
        conversationTopic: roomTopic
      }
    };

    if (this.isDemo) {
      this.demoConversations.set(roomTopic, eventRoom);
      this.demoMessages.set(roomTopic, [eventRoom.lastMessage!]);
    }

    return roomTopic;
  }

  get isClientReady(): boolean {
    return true; // Always ready in demo mode
  }

  get clientAddress(): string | null {
    return 'demo-address';
  }
}