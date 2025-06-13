export interface AgentCapability {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface Agent {
    id: string;
    name: string;
    description: string;
    avatar: string;
    capabilities: AgentCapability[];
    category: 'trading' | 'events' | 'defi' | 'social' | 'utility';
    price: string;
    rating: number;
    users: number;
    isActive: boolean;
    walletAddress: string;
}

export class AgentManager {
    private agents: Map<string, Agent> = new Map();
    private activeChats: Map<string, string> = new Map(); // topic -> agentId

    constructor() {
        this.initializeAgents();
    }

    private initializeAgents() {
        const defaultAgents: Agent[] = [
            {
                id: 'defi-trader',
                name: 'DeFi Trader',
                description: 'Expert in DeFi trading, yield farming, and portfolio management on Base',
                avatar: '🤖',
                capabilities: [
                    { id: 'trading', name: 'Trading Signals', description: 'Real-time trading recommendations', icon: 'trending-up' },
                    { id: 'yield', name: 'Yield Farming', description: 'Find best yield opportunities', icon: 'leaf' },
                    { id: 'portfolio', name: 'Portfolio Analysis', description: 'Analyze your holdings', icon: 'pie-chart' }
                ],
                category: 'trading',
                price: '0.01',
                rating: 4.8,
                users: 1250,
                isActive: true,
                walletAddress: '0x1234567890123456789012345678901234567890'
            },
            {
                id: 'event-coordinator',
                name: 'Event Coordinator',
                description: 'Helps plan, organize, and manage events seamlessly',
                avatar: '🎉',
                capabilities: [
                    { id: 'planning', name: 'Event Planning', description: 'Plan perfect events', icon: 'calendar' },
                    { id: 'booking', name: 'Venue Booking', description: 'Find and book venues', icon: 'location' },
                    { id: 'coordination', name: 'Team Coordination', description: 'Coordinate with teams', icon: 'people' }
                ],
                category: 'events',
                price: '0.005',
                rating: 4.9,
                users: 890,
                isActive: true,
                walletAddress: '0x2345678901234567890123456789012345678901'
            },
            {
                id: 'social-connector',
                name: 'Social Connector',
                description: 'Connect with like-minded people and build communities',
                avatar: '🤝',
                capabilities: [
                    { id: 'matching', name: 'People Matching', description: 'Find similar interests', icon: 'heart' },
                    { id: 'community', name: 'Community Building', description: 'Build engaged communities', icon: 'people-circle' },
                    { id: 'networking', name: 'Networking', description: 'Professional networking', icon: 'business' }
                ],
                category: 'social',
                price: 'Free',
                rating: 4.7,
                users: 2340,
                isActive: true,
                walletAddress: '0x3456789012345678901234567890123456789012'
            },
            {
                id: 'payment-helper',
                name: 'Payment Helper',
                description: 'Simplify crypto payments and money management',
                avatar: '💰',
                capabilities: [
                    { id: 'splitting', name: 'Bill Splitting', description: 'Split bills easily', icon: 'calculator' },
                    { id: 'tracking', name: 'Expense Tracking', description: 'Track your spending', icon: 'analytics' },
                    { id: 'reminders', name: 'Payment Reminders', description: 'Never miss payments', icon: 'alarm' }
                ],
                category: 'utility',
                price: '0.002',
                rating: 4.6,
                users: 567,
                isActive: true,
                walletAddress: '0x4567890123456789012345678901234567890123'
            }
        ];

        defaultAgents.forEach(agent => {
            this.agents.set(agent.id, agent);
        });
    }

    getAgent(id: string): Agent | undefined {
        return this.agents.get(id);
    }

    getAllAgents(): Agent[] {
        return Array.from(this.agents.values());
    }

    getAgentsByCategory(category: Agent['category']): Agent[] {
        return this.getAllAgents().filter(agent => agent.category === category);
    }

    async startChatWithAgent(agentId: string, topic: string): Promise<void> {
        this.activeChats.set(topic, agentId);
    }

    getAgentForChat(topic: string): Agent | undefined {
        const agentId = this.activeChats.get(topic);
        return agentId ? this.getAgent(agentId) : undefined;
    }

    async generateAgentResponse(agentId: string, userMessage: string, context?: any): Promise<string> {
        const agent = this.getAgent(agentId);
        if (!agent) throw new Error('Agent not found');

        // Simulate AI responses based on agent type
        return this.getAgentResponse(agent, userMessage, context);
    }

    private getAgentResponse(agent: Agent, message: string, context?: any): string {
        const lowerMessage = message.toLowerCase();

        switch (agent.id) {
            case 'defi-trader':
                if (lowerMessage.includes('trade') || lowerMessage.includes('buy') || lowerMessage.includes('sell')) {
                    return `🎯 Based on current market conditions, I recommend considering ETH/USDC pairs on Base. The 24h volume is strong and RSI suggests a good entry point. Would you like me to analyze your portfolio for specific recommendations?`;
                }
                if (lowerMessage.includes('yield') || lowerMessage.includes('farm')) {
                    return `🌱 Current top yield opportunities on Base:\n• Aave USDC lending: ~3.2% APY\n• Uniswap V3 ETH/USDC: ~8.5% APY\n• Compound ETH: ~2.8% APY\n\nWhich strategy interests you most?`;
                }
                return `📊 I'm your DeFi trading assistant! I can help with:\n• Trading signals and market analysis\n• Yield farming opportunities\n• Portfolio optimization\n\nWhat would you like to explore?`;

            case 'event-coordinator':
                if (lowerMessage.includes('plan') || lowerMessage.includes('organize')) {
                    return `🎉 Let's plan an amazing event! I'll need:\n• Event type and size\n• Budget range\n• Preferred date/time\n• Location preferences\n\nWhat kind of event are you planning?`;
                }
                if (lowerMessage.includes('venue') || lowerMessage.includes('location')) {
                    return `📍 Great! I can help find the perfect venue. In Nairobi, I recommend:\n• Trademark Hotel (corporate events)\n• Villa Rosa Kempinski (luxury)\n• The Alchemist (trendy/young crowd)\n\nWhat's your budget and expected attendance?`;
                }
                return `🎪 I'm your event planning assistant! I can help with:\n• Event planning and logistics\n• Venue recommendations\n• Vendor coordination\n• Budget management\n\nWhat event are you planning?`;

            case 'social-connector':
                if (lowerMessage.includes('meet') || lowerMessage.includes('connect')) {
                    return `🤝 I'd love to help you connect! Based on your interests, I found:\n• 3 people attending crypto meetups\n• 2 DeFi enthusiasts nearby\n• 1 event organizer in your area\n\nWould you like me to make introductions?`;
                }
                if (lowerMessage.includes('community') || lowerMessage.includes('group')) {
                    return `👥 Building communities is my specialty! I can help you:\n• Find existing communities\n• Start your own group\n• Organize meetups\n• Create engagement strategies\n\nWhat type of community interests you?`;
                }
                return `🌟 I'm your social connector! I help people:\n• Meet like-minded individuals\n• Build communities\n• Network professionally\n• Find event partners\n\nHow can I help you connect?`;

            case 'payment-helper':
                if (lowerMessage.includes('split') || lowerMessage.includes('bill')) {
                    return `💰 I can help split any payment! Just tell me:\n• Total amount\n• Number of people\n• Payment method preference\n\nI'll create a split request and send it to everyone instantly!`;
                }
                if (lowerMessage.includes('track') || lowerMessage.includes('expense')) {
                    return `📊 Expense tracking made easy! I can:\n• Categorize your spending\n• Set budget alerts\n• Generate reports\n• Find savings opportunities\n\nWant me to analyze your recent transactions?`;
                }
                return `💳 I'm your payment helper! I can assist with:\n• Bill splitting and group payments\n• Expense tracking\n• Payment reminders\n• Budget management\n\nWhat payment challenge can I solve for you?`;

            default:
                return `👋 Hello! I'm ${agent.name}. How can I help you today?`;
        }
    }
}