import { MiniAppMessage } from '../xmtp';
import xmtpService from '../xmtp';

export interface MiniAppConfig {
    id: string;
    name: string;
    description: string;
    category: 'payment' | 'gaming' | 'trading' | 'social' | 'utility';
    version: string;
    author: string;
    icon: string;
    supportedActions: MiniAppAction[];
    requiredPermissions: MiniAppPermission[];
    isActive: boolean;
    maxParticipants?: number;
    sessionTimeout?: number;
}

export interface MiniAppAction {
    id: string;
    name: string;
    description: string;
    inputSchema: Record<string, any>;
    outputSchema: Record<string, any>;
}

export interface MiniAppPermission {
    type: 'wallet' | 'camera' | 'location' | 'contacts' | 'storage';
    reason: string;
    required: boolean;
}

export interface MiniAppSession {
    id: string;
    appId: string;
    conversationId: string;
    participants: string[];
    state: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
    isActive: boolean;
}

export interface MiniAppResponse {
    sessionId: string;
    action: string;
    data: any;
    ui?: MiniAppUI;
    nextActions?: string[];
    errors?: string[];
}

export interface MiniAppUI {
    type: 'card' | 'modal' | 'inline' | 'overlay';
    title?: string;
    content: MiniAppUIComponent[];
    actions?: MiniAppUIAction[];
}

export interface MiniAppUIComponent {
    type: 'text' | 'button' | 'input' | 'image' | 'chart' | 'list';
    props: Record<string, any>;
}

export interface MiniAppUIAction {
    id: string;
    label: string;
    action: string;
    style?: 'primary' | 'secondary' | 'danger';
}

class MiniAppLauncher {
    private apps: Map<string, MiniAppConfig> = new Map();
    private sessions: Map<string, MiniAppSession> = new Map();
    private isInitialized = false;

    /**
     * Initialize the mini-app launcher with default apps
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            await this.loadDefaultApps();
            this.startSessionCleanup();

            this.isInitialized = true;
            console.log('✅ Mini-App Launcher initialized');

        } catch (error) {
            console.error('❌ Failed to initialize Mini-App Launcher:', error);
            throw error;
        }
    }

    /**
     * Load default mini-apps for buildathon
     */
    private async loadDefaultApps(): Promise<void> {
        const defaultApps: MiniAppConfig[] = [
            {
                id: 'payment-splitter',
                name: 'Payment Splitter',
                description: 'Split payments among group members with crypto',
                category: 'payment',
                version: '1.0.0',
                author: 'Rovify Team',
                icon: 'card',
                supportedActions: [
                    {
                        id: 'create-split',
                        name: 'Create Split',
                        description: 'Create a new payment split',
                        inputSchema: {
                            amount: 'number',
                            currency: 'string',
                            participants: 'array',
                            description: 'string'
                        },
                        outputSchema: {
                            splitId: 'string',
                            amountPerPerson: 'number',
                            paymentLinks: 'array'
                        }
                    },
                    {
                        id: 'pay-split',
                        name: 'Pay Split',
                        description: 'Pay your portion of a split',
                        inputSchema: {
                            splitId: 'string',
                            amount: 'number'
                        },
                        outputSchema: {
                            txHash: 'string',
                            status: 'string'
                        }
                    }
                ],
                requiredPermissions: [
                    {
                        type: 'wallet',
                        reason: 'To process crypto payments',
                        required: true
                    }
                ],
                isActive: true,
                maxParticipants: 50,
                sessionTimeout: 3600000 // 1 hour
            },
            {
                id: 'event-poll',
                name: 'Event Poll',
                description: 'Create polls for group decision making',
                category: 'social',
                version: '1.0.0',
                author: 'Rovify Team',
                icon: 'bar-chart',
                supportedActions: [
                    {
                        id: 'create-poll',
                        name: 'Create Poll',
                        description: 'Create a new poll',
                        inputSchema: {
                            question: 'string',
                            options: 'array',
                            allowMultiple: 'boolean',
                            endTime: 'string'
                        },
                        outputSchema: {
                            pollId: 'string',
                            voteLink: 'string'
                        }
                    },
                    {
                        id: 'vote',
                        name: 'Vote',
                        description: 'Submit vote for a poll',
                        inputSchema: {
                            pollId: 'string',
                            selectedOptions: 'array'
                        },
                        outputSchema: {
                            voteId: 'string',
                            currentResults: 'object'
                        }
                    }
                ],
                requiredPermissions: [],
                isActive: true,
                maxParticipants: 1000
            },
            {
                id: 'trading-signals',
                name: 'Trading Signals',
                description: 'Share and analyze trading signals with the group',
                category: 'trading',
                version: '1.0.0',
                author: 'Rovify Team',
                icon: 'trending-up',
                supportedActions: [
                    {
                        id: 'share-signal',
                        name: 'Share Signal',
                        description: 'Share a trading signal',
                        inputSchema: {
                            token: 'string',
                            action: 'string',
                            price: 'number',
                            confidence: 'number',
                            reasoning: 'string'
                        },
                        outputSchema: {
                            signalId: 'string',
                            timestamp: 'string'
                        }
                    },
                    {
                        id: 'track-performance',
                        name: 'Track Performance',
                        description: 'Track signal performance',
                        inputSchema: {
                            signalId: 'string'
                        },
                        outputSchema: {
                            performance: 'object',
                            chart: 'string'
                        }
                    }
                ],
                requiredPermissions: [
                    {
                        type: 'wallet',
                        reason: 'To track portfolio performance',
                        required: false
                    }
                ],
                isActive: true
            },
            {
                id: 'nft-showcase',
                name: 'NFT Showcase',
                description: 'Display and trade NFTs within the chat',
                category: 'social',
                version: '1.0.0',
                author: 'Rovify Team',
                icon: 'images',
                supportedActions: [
                    {
                        id: 'show-collection',
                        name: 'Show Collection',
                        description: 'Display NFT collection',
                        inputSchema: {
                            walletAddress: 'string',
                            collectionFilter: 'string'
                        },
                        outputSchema: {
                            nfts: 'array',
                            totalValue: 'number'
                        }
                    },
                    {
                        id: 'create-listing',
                        name: 'Create Listing',
                        description: 'List NFT for sale',
                        inputSchema: {
                            tokenId: 'string',
                            price: 'number',
                            currency: 'string'
                        },
                        outputSchema: {
                            listingId: 'string',
                            listingUrl: 'string'
                        }
                    }
                ],
                requiredPermissions: [
                    {
                        type: 'wallet',
                        reason: 'To access NFT collections',
                        required: true
                    }
                ],
                isActive: true
            },
            {
                id: 'group-game',
                name: 'Group Game',
                description: 'Play interactive games with group members',
                category: 'gaming',
                version: '1.0.0',
                author: 'Rovify Team',
                icon: 'game-controller',
                supportedActions: [
                    {
                        id: 'start-trivia',
                        name: 'Start Trivia',
                        description: 'Start a trivia game',
                        inputSchema: {
                            category: 'string',
                            difficulty: 'string',
                            rounds: 'number'
                        },
                        outputSchema: {
                            gameId: 'string',
                            firstQuestion: 'object'
                        }
                    },
                    {
                        id: 'submit-answer',
                        name: 'Submit Answer',
                        description: 'Submit an answer',
                        inputSchema: {
                            gameId: 'string',
                            answer: 'string'
                        },
                        outputSchema: {
                            correct: 'boolean',
                            score: 'number',
                            leaderboard: 'array'
                        }
                    }
                ],
                requiredPermissions: [],
                isActive: true,
                maxParticipants: 20
            }
        ];

        for (const app of defaultApps) {
            this.apps.set(app.id, app);
        }
    }

    /**
     * Get all available mini-apps
     */
    getAvailableApps(): MiniAppConfig[] {
        return Array.from(this.apps.values()).filter(app => app.isActive);
    }

    /**
     * Get mini-apps by category
     */
    getAppsByCategory(category: MiniAppConfig['category']): MiniAppConfig[] {
        return this.getAvailableApps().filter(app => app.category === category);
    }

    /**
     * Launch mini-app in conversation
     */
    async launchApp(
        appId: string,
        conversationId: string,
        initiatorAddress: string,
        action: string = 'open',
        params: Record<string, any> = {}
    ): Promise<MiniAppResponse> {
        const app = this.apps.get(appId);
        if (!app) {
            throw new Error(`Mini-app ${appId} not found`);
        }

        try {
            // Create or get existing session
            let session = this.getActiveSession(appId, conversationId);
            if (!session) {
                session = await this.createSession(app, conversationId, initiatorAddress);
            }

            // Execute the action
            const response = await this.executeAction(session, action, params, initiatorAddress);

            // Send mini-app message via XMTP
            const miniAppMessage: MiniAppMessage = {
                appId: app.id,
                appName: app.name,
                action,
                payload: {
                    sessionId: session.id,
                    response: response.data,
                    ui: response.ui
                }
            };

            await xmtpService.sendMiniAppMessage(conversationId, miniAppMessage);

            return response;

        } catch (error) {
            console.error(`Failed to launch mini-app ${appId}:`, error);
            throw error;
        }
    }

    /**
     * Execute mini-app action
     */
    async executeAction(
        session: MiniAppSession,
        action: string,
        params: Record<string, any>,
        userAddress: string
    ): Promise<MiniAppResponse> {
        const app = this.apps.get(session.appId);
        if (!app) {
            throw new Error(`App ${session.appId} not found`);
        }

        // Check if action is supported
        const supportedAction = app.supportedActions.find(a => a.id === action);
        if (!supportedAction) {
            throw new Error(`Action ${action} not supported by ${app.name}`);
        }

        // Update session
        session.updatedAt = new Date();
        session.state.lastAction = action;
        session.state.lastUser = userAddress;

        // Execute action based on app type
        switch (session.appId) {
            case 'payment-splitter':
                return await this.executePaymentSplitterAction(session, action, params, userAddress);
            case 'event-poll':
                return await this.executePollAction(session, action, params, userAddress);
            case 'trading-signals':
                return await this.executeTradingAction(session, action, params, userAddress);
            case 'nft-showcase':
                return await this.executeNFTAction(session, action, params, userAddress);
            case 'group-game':
                return await this.executeGameAction(session, action, params, userAddress);
            default:
                throw new Error(`Action execution not implemented for ${session.appId}`);
        }
    }

    /**
     * Execute payment splitter actions
     */
    private async executePaymentSplitterAction(
        session: MiniAppSession,
        action: string,
        params: any,
        userAddress: string
    ): Promise<MiniAppResponse> {
        switch (action) {
            case 'create-split':
                const splitId = `split-${Date.now()}`;
                const amountPerPerson = params.amount / params.participants.length;

                session.state.splits = session.state.splits || {};
                session.state.splits[splitId] = {
                    id: splitId,
                    amount: params.amount,
                    currency: params.currency,
                    description: params.description,
                    participants: params.participants,
                    amountPerPerson,
                    payments: {},
                    createdBy: userAddress,
                    createdAt: new Date()
                };

                return {
                    sessionId: session.id,
                    action,
                    data: {
                        splitId,
                        amountPerPerson,
                        currency: params.currency,
                        participants: params.participants
                    },
                    ui: {
                        type: 'card',
                        title: 'Payment Split Created',
                        content: [
                            {
                                type: 'text',
                                props: {
                                    text: `Split ${params.description} created for ${params.currency} ${params.amount}`,
                                    style: 'title'
                                }
                            },
                            {
                                type: 'text',
                                props: {
                                    text: `Each person pays: ${params.currency} ${amountPerPerson.toFixed(2)}`,
                                    style: 'subtitle'
                                }
                            },
                            {
                                type: 'list',
                                props: {
                                    items: params.participants.map((p: string) => ({
                                        address: p,
                                        status: 'pending',
                                        amount: amountPerPerson
                                    }))
                                }
                            }
                        ],
                        actions: [
                            {
                                id: 'pay-now',
                                label: 'Pay Now',
                                action: 'pay-split',
                                style: 'primary'
                            }
                        ]
                    }
                };

            case 'pay-split':
                const split = session.state.splits[params.splitId];
                if (!split) {
                    throw new Error('Split not found');
                }

                // Simulate payment (in real implementation, would integrate with AgentKit)
                split.payments[userAddress] = {
                    amount: params.amount,
                    txHash: `0x${Math.random().toString(16).slice(2)}`,
                    timestamp: new Date(),
                    status: 'completed'
                };

                const paidCount = Object.keys(split.payments).length;
                const totalCount = split.participants.length;

                return {
                    sessionId: session.id,
                    action,
                    data: {
                        txHash: split.payments[userAddress].txHash,
                        status: 'completed',
                        progress: `${paidCount}/${totalCount} paid`
                    },
                    ui: {
                        type: 'card',
                        title: 'Payment Successful',
                        content: [
                            {
                                type: 'text',
                                props: {
                                    text: `Payment of ${split.currency} ${params.amount} completed`,
                                    style: 'success'
                                }
                            },
                            {
                                type: 'text',
                                props: {
                                    text: `Progress: ${paidCount}/${totalCount} participants paid`,
                                    style: 'subtitle'
                                }
                            }
                        ]
                    }
                };

            default:
                throw new Error(`Action ${action} not implemented for payment splitter`);
        }
    }

    /**
     * Execute poll actions
     */
    private async executePollAction(
        session: MiniAppSession,
        action: string,
        params: any,
        userAddress: string
    ): Promise<MiniAppResponse> {
        switch (action) {
            case 'create-poll':
                const pollId = `poll-${Date.now()}`;

                session.state.polls = session.state.polls || {};
                session.state.polls[pollId] = {
                    id: pollId,
                    question: params.question,
                    options: params.options,
                    allowMultiple: params.allowMultiple,
                    endTime: params.endTime ? new Date(params.endTime) : null,
                    votes: {},
                    createdBy: userAddress,
                    createdAt: new Date()
                };

                return {
                    sessionId: session.id,
                    action,
                    data: { pollId },
                    ui: {
                        type: 'card',
                        title: 'Poll Created',
                        content: [
                            {
                                type: 'text',
                                props: {
                                    text: params.question,
                                    style: 'title'
                                }
                            },
                            {
                                type: 'list',
                                props: {
                                    items: params.options.map((option: string, index: number) => ({
                                        id: index,
                                        text: option,
                                        votes: 0
                                    }))
                                }
                            }
                        ],
                        actions: params.options.map((option: string, index: number) => ({
                            id: `vote-${index}`,
                            label: option,
                            action: 'vote',
                            style: 'secondary'
                        }))
                    }
                };

            case 'vote':
                const poll = session.state.polls[params.pollId];
                if (!poll) {
                    throw new Error('Poll not found');
                }

                // Record vote
                poll.votes[userAddress] = {
                    selectedOptions: params.selectedOptions,
                    timestamp: new Date()
                };

                // Calculate results
                const results = this.calculatePollResults(poll);

                return {
                    sessionId: session.id,
                    action,
                    data: {
                        voteId: `vote-${userAddress}-${Date.now()}`,
                        currentResults: results
                    },
                    ui: {
                        type: 'card',
                        title: 'Vote Recorded',
                        content: [
                            {
                                type: 'text',
                                props: {
                                    text: 'Your vote has been recorded',
                                    style: 'success'
                                }
                            },
                            {
                                type: 'chart',
                                props: {
                                    type: 'bar',
                                    data: results
                                }
                            }
                        ]
                    }
                };

            default:
                throw new Error(`Action ${action} not implemented for polls`);
        }
    }

    /**
     * Execute other app actions (simplified for buildathon)
     */
    private async executeTradingAction(session: MiniAppSession, action: string, params: any, userAddress: string): Promise<MiniAppResponse> {
        // Simplified implementation
        return {
            sessionId: session.id,
            action,
            data: { message: 'Trading action executed' },
            ui: {
                type: 'card',
                title: 'Trading Signal',
                content: [
                    {
                        type: 'text',
                        props: { text: `Signal for ${params.token}: ${params.action}`, style: 'title' }
                    }
                ]
            }
        };
    }

    private async executeNFTAction(session: MiniAppSession, action: string, params: any, userAddress: string): Promise<MiniAppResponse> {
        // Simplified implementation
        return {
            sessionId: session.id,
            action,
            data: { message: 'NFT action executed' },
            ui: {
                type: 'card',
                title: 'NFT Showcase',
                content: [
                    {
                        type: 'text',
                        props: { text: 'NFT collection displayed', style: 'title' }
                    }
                ]
            }
        };
    }

    private async executeGameAction(session: MiniAppSession, action: string, params: any, userAddress: string): Promise<MiniAppResponse> {
        // Simplified implementation
        return {
            sessionId: session.id,
            action,
            data: { message: 'Game action executed' },
            ui: {
                type: 'card',
                title: 'Group Game',
                content: [
                    {
                        type: 'text',
                        props: { text: 'Game started', style: 'title' }
                    }
                ]
            }
        };
    }

    /**
     * Calculate poll results
     */
    private calculatePollResults(poll: any): any {
        const optionCounts: Record<number, number> = {};

        // Initialize counts
        poll.options.forEach((_: string, index: number) => {
            optionCounts[index] = 0;
        });

        // Count votes
        Object.values(poll.votes).forEach((vote: any) => {
            vote.selectedOptions.forEach((optionIndex: number) => {
                optionCounts[optionIndex]++;
            });
        });

        return {
            totalVotes: Object.keys(poll.votes).length,
            options: poll.options.map((option: string, index: number) => ({
                text: option,
                votes: optionCounts[index],
                percentage: Object.keys(poll.votes).length > 0
                    ? Math.round((optionCounts[index] / Object.keys(poll.votes).length) * 100)
                    : 0
            }))
        };
    }

    /**
     * Create new session
     */
    private async createSession(
        app: MiniAppConfig,
        conversationId: string,
        initiatorAddress: string
    ): Promise<MiniAppSession> {
        const sessionId = `${app.id}-${conversationId}-${Date.now()}`;

        const session: MiniAppSession = {
            id: sessionId,
            appId: app.id,
            conversationId,
            participants: [initiatorAddress],
            state: {},
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: app.sessionTimeout ? new Date(Date.now() + app.sessionTimeout) : undefined,
            isActive: true
        };

        this.sessions.set(sessionId, session);
        return session;
    }

    /**
     * Get active session
     */
    private getActiveSession(appId: string, conversationId: string): MiniAppSession | null {
        return Array.from(this.sessions.values()).find(session =>
            session.appId === appId &&
            session.conversationId === conversationId &&
            session.isActive &&
            (!session.expiresAt || session.expiresAt > new Date())
        ) || null;
    }

    /**
     * Cleanup expired sessions
     */
    private startSessionCleanup(): void {
        setInterval(() => {
            const now = new Date();

            for (const [sessionId, session] of this.sessions.entries()) {
                if (session.expiresAt && session.expiresAt < now) {
                    session.isActive = false;
                    this.sessions.delete(sessionId);
                }
            }
        }, 300000); // Clean up every 5 minutes
    }

    /**
     * End session
     */
    async endSession(sessionId: string): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.isActive = false;
            this.sessions.delete(sessionId);
        }
    }

    /**
     * Get session data
     */
    getSession(sessionId: string): MiniAppSession | null {
        return this.sessions.get(sessionId) || null;
    }

    /**
     * Get active sessions for conversation
     */
    getConversationSessions(conversationId: string): MiniAppSession[] {
        return Array.from(this.sessions.values()).filter(session =>
            session.conversationId === conversationId && session.isActive
        );
    }
}

export const miniAppLauncher = new MiniAppLauncher();
export default miniAppLauncher;