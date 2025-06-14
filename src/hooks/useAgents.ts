import { useCallback, useEffect } from 'react';
import { useAgentsStore } from '../store/agentsStore';
import { Agent, AgentType, AgentMessage } from '../types/agents';

export const useAgents = () => {
    const {
        agents,
        conversations,
        messages,
        isLoading,
        error,
        // Actions
        setLoading,
        setError,
        addAgent,
        updateAgent,
        removeAgent,
        setAgents,
        addConversation,
        removeConversation,
        addMessage,
        setMessages,
        // Getters
        getAgent,
        getAgentByConversation,
        getAgentsByType,
        getActiveAgents,
        getConversationMessages,
    } = useAgentsStore();

    // Load agents on mount
    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Mock agents data - in real app, this would come from AgentManager
            const mockAgents: Agent[] = [
                {
                    id: 'trading-agent-001',
                    name: 'DeFi Trader',
                    description: 'AI agent specialized in DeFi trading and portfolio management',
                    type: 'trading',
                    walletAddress: '0xAgent1...',
                    capabilities: [
                        {
                            id: 'portfolio-analysis',
                            name: 'Portfolio Analysis',
                            description: 'Analyze wallet holdings',
                            category: 'trading',
                            inputSchema: {},
                            outputSchema: {},
                            isEnabled: true,
                        }
                    ],
                    isOnline: true,
                    isPublic: true,
                    creator: '0xCreator1...',
                    version: '1.0.0',
                    model: 'gpt-4',
                    parameters: {
                        temperature: 0.3,
                        maxTokens: 1000,
                        systemPrompt: 'You are a DeFi trading agent...',
                        tools: ['portfolio-analyzer', 'price-tracker'],
                    },
                    performance: {
                        totalInteractions: 156,
                        successRate: 0.94,
                        averageResponseTime: 1200,
                        userRating: 4.7,
                        lastActive: new Date(),
                    },
                    createdAt: new Date('2024-12-01'),
                    updatedAt: new Date('2024-12-01'),
                },
                // Add more mock agents...
            ];

            setAgents(mockAgents);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load agents';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setAgents]);

    const startConversation = useCallback(async (agentId: string) => {
        const agent = getAgent(agentId);
        if (!agent) {
            throw new Error('Agent not found');
        }

        const conversationId = `agent-conv-${agentId}-${Date.now()}`;

        addConversation(conversationId, agentId);

        return conversationId;
    }, [getAgent, addConversation]);

    const sendMessage = useCallback(async (
        conversationId: string,
        content: string
    ) => {
        const agent = getAgentByConversation(conversationId);
        if (!agent) {
            throw new Error('Agent not found for conversation');
        }

        const userMessage: AgentMessage = {
            id: `msg-${Date.now()}`,
            agentId: agent.id,
            conversationId,
            userMessage: content,
            agentResponse: '', // Will be filled by agent
            confidence: 0,
            processingTime: 0,
            timestamp: new Date(),
        };

        addMessage(conversationId, userMessage);

        try {
            // Simulate agent response
            await new Promise(resolve => setTimeout(resolve, 1000));

            const agentResponse = `I understand you said: "${content}". How can I help you with that?`;

            const responseMessage: AgentMessage = {
                ...userMessage,
                id: `msg-${Date.now()}-response`,
                agentResponse,
                confidence: 0.85,
                processingTime: 1000,
            };

            addMessage(conversationId, responseMessage);

        } catch (error) {
            console.error('Agent response failed:', error);
            throw error;
        }
    }, [getAgentByConversation, addMessage]);

    return {
        // State
        agents: Object.values(agents),
        isLoading,
        error,

        // Filtered data
        tradingAgents: getAgentsByType('trading'),
        gamingAgents: getAgentsByType('gaming'),
        utilityAgents: getAgentsByType('utility'),
        socialAgents: getAgentsByType('social'),
        activeAgents: getActiveAgents(),

        // Actions
        loadAgents,
        startConversation,
        sendMessage,

        // Agent management
        getAgent,
        getAgentByConversation,
        updateAgent,

        // Conversation management
        getConversationMessages,
        removeConversation,
    };
};