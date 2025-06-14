import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AgentsState, Agent, AgentMessage, AgentType } from '../types/agents';

interface AgentsActions {
    // Loading and error states
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Agents management
    addAgent: (agent: Agent) => void;
    updateAgent: (id: string, updates: Partial<Agent>) => void;
    removeAgent: (id: string) => void;
    setAgents: (agents: Agent[]) => void;

    // Conversations
    addConversation: (conversationId: string, agentId: string) => void;
    removeConversation: (conversationId: string) => void;

    // Messages
    addMessage: (conversationId: string, message: AgentMessage) => void;
    setMessages: (conversationId: string, messages: AgentMessage[]) => void;

    // Getters
    getAgent: (id: string) => Agent | undefined;
    getAgentByConversation: (conversationId: string) => Agent | undefined;
    getAgentsByType: (type: AgentType) => Agent[];
    getActiveAgents: () => Agent[];
    getConversationMessages: (conversationId: string) => AgentMessage[];
}

type AgentsStore = AgentsState & AgentsActions;

export const useAgentsStore = create<AgentsStore>()(
    persist(
        (set, get) => ({
            // Initial state
            agents: {},
            conversations: {},
            messages: {},
            isLoading: false,
            error: null,

            // Actions
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),

            addAgent: (agent) =>
                set((state) => ({
                    agents: { ...state.agents, [agent.id]: agent },
                })),

            updateAgent: (id, updates) =>
                set((state) => ({
                    agents: {
                        ...state.agents,
                        [id]: state.agents[id] ? {
                            ...state.agents[id],
                            ...updates,
                            updatedAt: new Date(),
                        } : state.agents[id],
                    },
                })),

            removeAgent: (id) =>
                set((state) => {
                    const { [id]: removed, ...agents } = state.agents;
                    return { agents };
                }),

            setAgents: (agents) =>
                set({
                    agents: agents.reduce((acc, agent) => {
                        acc[agent.id] = agent;
                        return acc;
                    }, {} as Record<string, Agent>),
                }),

            addConversation: (conversationId, agentId) =>
                set((state) => ({
                    conversations: { ...state.conversations, [conversationId]: agentId },
                })),

            removeConversation: (conversationId) =>
                set((state) => {
                    const { [conversationId]: removed, ...conversations } = state.conversations;
                    const { [conversationId]: removedMessages, ...messages } = state.messages;
                    return { conversations, messages };
                }),

            addMessage: (conversationId, message) =>
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [conversationId]: [
                            ...(state.messages[conversationId] || []),
                            message,
                        ],
                    },
                })),

            setMessages: (conversationId, messages) =>
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [conversationId]: messages,
                    },
                })),

            // Getters
            getAgent: (id) => get().agents[id],

            getAgentByConversation: (conversationId) => {
                const agentId = get().conversations[conversationId];
                return agentId ? get().agents[agentId] : undefined;
            },

            getAgentsByType: (type) =>
                Object.values(get().agents).filter(agent => agent.type === type),

            getActiveAgents: () =>
                Object.values(get().agents).filter(agent => agent.isOnline),

            getConversationMessages: (conversationId) =>
                get().messages[conversationId] || [],
        }),
        {
            name: 'agents-store',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                agents: state.agents,
                conversations: state.conversations,
                messages: state.messages,
            }),
        }
    )
);