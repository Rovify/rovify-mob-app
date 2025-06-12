// AgentKit configuration for Base buildathon
export const AGENTKIT_CONFIG = {
  // Coinbase Developer Platform API configuration
  cdpApiKeyId: process.env.EXPO_PUBLIC_CDP_API_KEY_ID,
  cdpApiKeySecret: process.env.EXPO_PUBLIC_CDP_API_KEY_SECRET,
  
  // Network configuration
  networkId: 'base-sepolia', // Use 'base-mainnet' for production
  
  // Agent capabilities for buildathon
  enabledCapabilities: [
    'wallet_create',
    'wallet_balance',
    'transfer',
    'trade',
    'deploy_token',
    'mint_nft',
    'swap_tokens',
  ],
  
  // Agent personality for different use cases
  agentPersonalities: {
    trading: {
      name: 'TradeBot',
      description: 'AI agent specialized in DeFi trading and portfolio management',
      capabilities: ['trade', 'swap_tokens', 'wallet_balance'],
    },
    utility: {
      name: 'PayBot',
      description: 'AI agent for group payments and expense splitting',
      capabilities: ['transfer', 'wallet_balance'],
    },
    gaming: {
      name: 'GameBot',
      description: 'AI agent for in-chat gaming and tournaments',
      capabilities: ['mint_nft', 'transfer'],
    },
    social: {
      name: 'SocialBot',
      description: 'AI agent for event coordination and social activities',
      capabilities: ['wallet_create', 'transfer'],
    },
  },
};
