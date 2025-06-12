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
