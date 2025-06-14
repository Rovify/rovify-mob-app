#!/bin/bash

# Rovify Mobile App - Directory Structure Setup
# Creates folder structure for React Native + Expo project

set -e

echo "Setting up Rovify Mobile directory structure..."

# Create source directory
mkdir -p src

# Create main app directories (Expo Router structure)
mkdir -p src/app
mkdir -p src/app/\(tabs\)
mkdir -p src/app/event
mkdir -p src/app/auth
mkdir -p src/app/chat
mkdir -p src/app/agent

echo "Created app directories"

# Create component directories
mkdir -p src/components/ui
mkdir -p src/components/forms
mkdir -p src/components/layout
mkdir -p src/components/features/events
mkdir -p src/components/features/messaging
mkdir -p src/components/features/agents
mkdir -p src/components/features/auth
mkdir -p src/components/features/mini-apps

echo "Created component directories"

# Create hooks directory
mkdir -p src/hooks

# Create services directory
mkdir -p src/services

# Create store directory
mkdir -p src/store

# Create types directory
mkdir -p src/types

# Create utils directory
mkdir -p src/utils

# Create assets directory
mkdir -p src/assets/images
mkdir -p src/assets/icons
mkdir -p src/assets/fonts

# Create test directory
mkdir -p src/test
mkdir -p src/__tests__

echo "Created utility directories"

# Create configuration files
echo "Creating configuration files..."

# Create global.css
cat > global.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

.message-bubble {
  @apply max-w-xs px-4 py-2 rounded-lg;
}

.message-sent {
  @apply bg-primary-500 text-white ml-auto;
}

.message-received {
  @apply bg-gray-100 text-gray-900;
}

.agent-message {
  @apply bg-gradient-to-r from-blue-500 to-purple-600 text-white;
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-up {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
EOF

# Create .env.example
cat > .env.example << 'EOF'
# XMTP Configuration
EXPO_PUBLIC_XMTP_ENV=production

# Coinbase Configuration  
EXPO_PUBLIC_CDP_API_KEY=cdp_api_key
EXPO_PUBLIC_CDP_API_SECRET=cdp_api_secret

# Base Network Configuration
EXPO_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
EXPO_PUBLIC_BASE_CHAIN_ID=8453

# Rovify API Configuration
EXPO_PUBLIC_ROVIFY_API_URL=https://api.rovify.io
EXPO_PUBLIC_ROVIFY_WS_URL=wss://ws.rovify.io

# WalletConnect Configuration
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=project_id

# OpenAI Configuration
EXPO_PUBLIC_OPENAI_API_KEY=openai_api_key
EOF

# Create README.md
cat > README.md << 'EOF'
# Rovify Mobile

React Native messaging app with XMTP integration and AI agents.

## Tech Stack

- React Native + Expo SDK 53
- XMTP Protocol for messaging
- Coinbase AgentKit for AI interactions
- Base Network for transactions
- TypeScript + NativeWind

## Setup

```bash
yarn install
yarn start
```

## Scripts

```bash
yarn start      # Start development server
yarn ios        # Run on iOS simulator
yarn android    # Run on Android emulator
yarn test       # Run tests
yarn lint       # Run linter
```

## Architecture

```
src/
├── app/           # Expo Router screens
├── components/    # Reusable components
├── hooks/         # Custom hooks
├── services/      # API services
├── store/         # State management
├── types/         # TypeScript types
└── utils/         # Utility functions
```
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Expo
.expo/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# Environment variables
.env
.env.local
.env.production

# TypeScript
*.tsbuildinfo

# VS Code
.vscode/

# Temporary files
*.tmp
*.temp

# Logs
logs
*.log

# Coverage
coverage/

# iOS
ios/Podfile.lock
EOF

echo "Configuration files created"
echo ""
echo "Directory structure setup complete!"
echo ""
echo "Next steps:"
echo "1. Install dependencies with yarn/npm"
echo "2. Copy your .env file with API keys"
echo "3. Add your code files to the src/ directory"
echo ""

# Display the directory tree if available
if command -v tree &> /dev/null; then
    echo "Created directory structure:"
    tree -I "node_modules" .
else
    echo "Directory structure created successfully"
    echo "Install 'tree' command to see the structure visualization"
fi