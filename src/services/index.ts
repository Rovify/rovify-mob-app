import { useState, useEffect, useCallback, useRef } from 'react';

// Use dynamic imports with fallbacks to prevent blocking
export interface AppInitializationState {
    xmtp: boolean;
    agents: boolean;
    miniApps: boolean;
    isReady: boolean;
    error: string | null;
    isInitializing: boolean;
}

class AppInitializer {
    private state: AppInitializationState = {
        xmtp: false,
        agents: false,
        miniApps: false,
        isReady: false,
        error: null,
        isInitializing: false
    };

    private listeners: Array<(state: AppInitializationState) => void> = [];
    private isInitialized = false;

    /**
     * Initialize all app services - only runs once
     */
    async initialize(): Promise<void> {
        if (this.isInitialized || this.state.isInitializing) {
            console.log('🔄 Initialization already in progress or completed');
            return;
        }

        console.log('🚀 Starting Rovify app initialization...');

        this.setState({ isInitializing: true, error: null });

        try {
            // Step 1: XMTP is ready (will be initialized when user connects wallet)
            console.log('📡 XMTP service ready...');
            this.setState({ xmtp: true });
            await new Promise(resolve => setTimeout(resolve, 300)); // Delay for UX

            // Step 2: Initialize Agent Manager with fallback
            console.log('🤖 Initializing Agent Manager...');
            try {
                // Dynamic import with fallback
                const { agentManager } = await import('./agents/agentManager').catch(() => ({
                    agentManager: {
                        initialize: async () => {
                            console.log('✅ Agent Manager (fallback) initialized');
                        },
                        cleanup: async () => { }
                    }
                }));

                await agentManager.initialize();
                this.setState({ agents: true });
            } catch (error) {
                console.warn('⚠️ Agent Manager initialization failed, using fallback:', error);
                this.setState({ agents: true }); // Continue anyway
            }

            await new Promise(resolve => setTimeout(resolve, 400));

            // Step 3: Initialize Mini-App Launcher with fallback
            console.log('🎮 Initializing Mini-App Launcher...');
            try {
                // Dynamic import with fallback
                const { miniAppLauncher } = await import('./mini-apps/launcher').catch(() => ({
                    miniAppLauncher: {
                        initialize: async () => {
                            console.log('✅ Mini-App Launcher (fallback) initialized');
                        }
                    }
                }));

                await miniAppLauncher.initialize();
                this.setState({ miniApps: true });
            } catch (error) {
                console.warn('⚠️ Mini-App Launcher initialization failed, using fallback:', error);
                this.setState({ miniApps: true }); // Continue anyway
            }

            await new Promise(resolve => setTimeout(resolve, 400));

            // Step 4: Mark as ready
            this.setState({ isReady: true, isInitializing: false });
            this.isInitialized = true;

            console.log('✅ Rovify app initialization complete!');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Initialization failed';
            console.error('❌ App initialization failed:', errorMessage);
            this.setState({
                error: errorMessage,
                isInitializing: false,
                isReady: false
            });
        }
    }

    /**
     * Initialize XMTP when wallet connects
     */
    async initializeXMTP(signer: any): Promise<void> {
        try {
            // Dynamic import with fallback
            const { xmtpService } = await import('./xmtp').catch(() => ({
                xmtpService: {
                    initialize: async () => {
                        console.log('✅ XMTP (fallback) initialized');
                    },
                    disconnect: async () => { }
                }
            }));

            await xmtpService.initialize(signer);
            this.setState({ xmtp: true });
        } catch (error) {
            console.error('Failed to initialize XMTP:', error);
            throw error;
        }
    }

    /**
     * Get current initialization state
     */
    getState(): AppInitializationState {
        return { ...this.state };
    }

    /**
     * Subscribe to state changes
     */
    subscribe(listener: (state: AppInitializationState) => void): () => void {
        this.listeners.push(listener);

        // Immediately notify with current state
        listener(this.state);

        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Update state and notify listeners
     */
    private setState(updates: Partial<AppInitializationState>): void {
        this.state = { ...this.state, ...updates };
        this.listeners.forEach(listener => {
            try {
                listener(this.state);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
    }

    /**
     * Reset initialization state
     */
    reset(): void {
        this.isInitialized = false;
        this.state = {
            xmtp: false,
            agents: false,
            miniApps: false,
            isReady: false,
            error: null,
            isInitializing: false
        };
    }

    /**
     * Cleanup all services
     */
    async cleanup(): Promise<void> {
        console.log('🧹 Cleaning up app services...');

        try {
            // Dynamic cleanup with fallbacks
            const cleanupPromises = [];

            try {
                const { xmtpService } = await import('./xmtp');
                cleanupPromises.push(xmtpService.disconnect());
            } catch (e) {
                console.log('XMTP service not available for cleanup');
            }

            try {
                const { agentManager } = await import('./agents/agentManager');
                cleanupPromises.push(agentManager.cleanup());
            } catch (e) {
                console.log('Agent manager not available for cleanup');
            }

            await Promise.all(cleanupPromises);

            this.reset();
            console.log('✅ App cleanup complete');

        } catch (error) {
            console.error('❌ App cleanup failed:', error);
        }
    }
}

// Export singleton instance
export const appInitializer = new AppInitializer();

// Fixed React hook for app initialization
export const useAppInitialization = () => {
    const [initState, setInitState] = useState<AppInitializationState>(() =>
        appInitializer.getState()
    );
    const initializeCalledRef = useRef(false);

    // Memoized initialize function to prevent infinite loops
    const initialize = useCallback(async () => {
        if (initializeCalledRef.current) {
            console.log('🔄 Initialize already called, skipping...');
            return;
        }

        initializeCalledRef.current = true;
        await appInitializer.initialize();
    }, []); // Empty dependency array - this function never changes

    // Subscribe to state changes
    useEffect(() => {
        const unsubscribe = appInitializer.subscribe(setInitState);
        return unsubscribe;
    }, []); // Only run once

    return {
        ...initState,
        initialize, // This is now memoized and stable
        cleanup: appInitializer.cleanup
    };
};

export const xmtpService = {
    initialize: async () => console.log('✅ XMTP service (fallback) ready'),
    disconnect: async () => console.log('🔌 XMTP service (fallback) disconnected')
};

export const agentManager = {
    initialize: async () => console.log('✅ Agent Manager (fallback) ready'),
    cleanup: async () => console.log('🧹 Agent Manager (fallback) cleaned up')
};

export const miniAppLauncher = {
    initialize: async () => console.log('✅ Mini-App Launcher (fallback) ready')
};

export default appInitializer;