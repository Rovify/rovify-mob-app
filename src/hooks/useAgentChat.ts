import { useState, useEffect } from 'react';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { AgentManager } from '../services/agents/agentManager';
import { useMessaging } from './useMessaging';

export const useAgentChat = (topic: string) => {
    const [isAgentTyping, setIsAgentTyping] = useState(false);
    const { sendMessage } = useMessaging();

    const agentManager = new AgentManager();

    const sendMessageToAgent = async (message: string) => {
        const agent = agentManager.getAgentForChat(topic);
        if (!agent) return;

        try {
            // Send user message
            await sendMessage(topic, message);

            // Simulate agent thinking
            setIsAgentTyping(true);

            // Generate agent response
            setTimeout(async () => {
                const response = await agentManager.generateAgentResponse(agent.id, message);
                await sendMessage(topic, response);
                setIsAgentTyping(false);
            }, 1000 + Math.random() * 2000); // 1-3 second delay

        } catch (error) {
            console.error('Failed to send message to agent:', error);
            setIsAgentTyping(false);
        }
    };

    return {
        sendMessageToAgent,
        isAgentTyping,
        agent: agentManager.getAgentForChat(topic)
    };
};