class AgentManager {
    private isInitialized = false;

    async initialize(): Promise<void> {
        if (this.isInitialized) {
            console.log('✅ Agent Manager already initialized');
            return;
        }

        try {
            // Simulate initialization without complex logic that could cause loops
            await new Promise(resolve => setTimeout(resolve, 500));

            this.isInitialized = true;
            console.log('✅ Agent Manager initialized');

        } catch (error) {
            console.error('❌ Failed to initialize Agent Manager:', error);
            throw error;
        }
    }

    async cleanup(): Promise<void> {
        this.isInitialized = false;
        console.log('🧹 Agent Manager cleaned up');
    }
}

export const agentManager = new AgentManager();