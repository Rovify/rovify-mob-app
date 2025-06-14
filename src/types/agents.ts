export interface Agent {
    id: string;
    name: string;
    description: string;
    type: AgentType;
    avatar?: string;
    walletAddress: string;
    capabilities: AgentCapability[];
    isOnline: boolean;
    isPublic: boolean;
    creator: string;
    version: string;
    model: AIModel;
    parameters: AgentParameters;
    performance: AgentPerformance;
    createdAt: Date;
    updatedAt: Date;
}

export type AgentType = 'trading' | 'gaming' | 'utility' | 'social' | 'custom';
export type AIModel = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-sonnet' | 'claude-3-haiku';

export interface AgentCapability {
    id: string;
    name: string;
    description: string;
    category: AgentType;
    inputSchema: Record<string, any>;
    outputSchema: Record<string, any>;
    isEnabled: boolean;
}

export interface AgentParameters {
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
    tools: string[];
    responseFormat?: 'text' | 'json' | 'structured';
}

export interface AgentPerformance {
    totalInteractions: number;
    successRate: number;
    averageResponseTime: number;
    userRating: number;
    lastActive: Date;
}

export interface AgentMessage {
    id: string;
    agentId: string;
    conversationId: string;
    userMessage: string;
    agentResponse: string;
    actionType?: AgentActionType;
    actionData?: any;
    confidence: number;
    processingTime: number;
    timestamp: Date;
}

export type AgentActionType = 'message' | 'transaction' | 'mini-app' | 'data' | 'error';

export interface AgentMessageData {
    agentId: string;
    confidence: number;
    actionType: AgentActionType;
    actionData?: any;
    processingTime: number;
}

export interface AgentsState {
    agents: Record<string, Agent>;
    conversations: Record<string, string>; // conversationId -> agentId
    messages: Record<string, AgentMessage[]>; // conversationId -> messages
    isLoading: boolean;
    error: string | null;
}