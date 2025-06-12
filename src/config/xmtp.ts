export const XMTP_CONFIG = {
  // Env config
  ENV: (process.env.XMTP_ENV as 'dev' | 'production' | 'local') || 'dev',

  // App version for XMTP client
  APP_VERSION: '1.0.0-buildathon',

  // Enable v3 features when available
  ENABLE_V3: true,

  // Message limits
  MESSAGE_LIMIT: 50,
  CONVERSATION_LIMIT: 100,

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,

  // Storage keys
  STORAGE_KEYS: {
    XMTP_KEYS: 'xmtp-keys',
    CONVERSATION_METADATA: 'conversation-metadata',
    MESSAGE_CACHE: 'message-cache',
    USER_PREFERENCES: 'xmtp-preferences'
  },

  // Event room configuration
  EVENT_ROOMS: {
    MAX_PARTICIPANTS: 500,
    MESSAGE_RETENTION_HOURS: 72,
    AUTO_ARCHIVE_AFTER_EVENT: true
  },

  // Agent configuration
  AGENTS: {
    SUPPORTED_TYPES: ['trading', 'gaming', 'utility', 'social'],
    MAX_AGENT_CONVERSATIONS: 10,
    AGENT_RESPONSE_TIMEOUT: 30000 // 30 seconds
  },

  // Mini-app configuration
  MINI_APPS: {
    SUPPORTED_APPS: [
      'payment-splitter',
      'trading-bot',
      'game-launcher',
      'nft-gallery',
      'event-poll'
    ],
    MAX_PAYLOAD_SIZE: 1024 * 10, // 10KB
    EXECUTION_TIMEOUT: 60000 // 1 minute
  }
} as const;