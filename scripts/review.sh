#!/bin/bash

# Rovify Complete Structure Setup & Verification Script
# Creates all missing directories and essential files with placeholders

set -e

echo "🔍 Verifying and completing Rovify project structure..."
echo "Creating missing directories and essential files..."
echo ""

# ==========================================
# DIRECTORY VERIFICATION & CREATION
# ==========================================

# List of all required directories
REQUIRED_DIRS=(
    "src"
    "src/app"
    "src/app/(tabs)"
    "src/app/event"
    "src/app/auth"
    "src/app/chat"
    "src/app/agent"
    "src/components"
    "src/components/ui"
    "src/components/forms"
    "src/components/layout"
    "src/components/features"
    "src/components/features/events"
    "src/components/features/messaging"
    "src/components/features/agents"
    "src/components/features/auth"
    "src/components/features/mini-apps"
    "src/hooks"
    "src/services"
    "src/store"
    "src/types"
    "src/utils"
    "src/assets"
    "src/assets/images"
    "src/assets/icons"
    "src/assets/fonts"
    "src/test"
    "src/__tests__"
)

echo "📁 Checking directories..."

MISSING_DIRS=()
CREATED_DIRS=()

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        CREATED_DIRS+=("$dir")
        echo "  ✅ Created: $dir"
    fi
done

if [ ${#CREATED_DIRS[@]} -eq 0 ]; then
    echo "  ✅ All directories already exist"
else
    echo "  📝 Created ${#CREATED_DIRS[@]} missing directories"
fi

echo ""

# ==========================================
# ESSENTIAL FILES CREATION
# ==========================================

echo "📄 Creating essential files with placeholder content..."

# ==========================================
# APP LAYOUT FILES
# ==========================================

# Root layout
cat > src/app/_layout.tsx << 'EOF'
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="event/[id]" options={{ headerShown: true }} />
            <Stack.Screen name="auth/connect" options={{ presentation: 'modal' }} />
            <Stack.Screen name="chat/[topic]" options={{ headerShown: false }} />
            <Stack.Screen name="agent/[id]" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
EOF

# Tab layout
cat > src/app/\(tabs\)/_layout.tsx << 'EOF'
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#111827' : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
EOF

# ==========================================
# MAIN TAB SCREENS
# ==========================================

# Main chat hub screen
cat > src/app/\(tabs\)/index.tsx << 'EOF'
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ChatHubScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Ionicons name="chatbubbles-outline" size={64} color="#f97316" />
        <Text className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          Rovify Chat
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          AI-powered event coordination through secure messaging
        </Text>
        
        <TouchableOpacity 
          onPress={() => router.push('/auth/connect')}
          className="bg-primary-500 rounded-xl py-4 px-8"
        >
          <Text className="text-white font-bold text-lg">Connect Wallet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
EOF

# Events screen
cat > src/app/\(tabs\)/events.tsx << 'EOF'
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-gray-900">Events</Text>
        <Text className="text-gray-600 mt-2">Discover amazing events</Text>
      </View>
    </SafeAreaView>
  );
}
EOF

# Groups screen
cat > src/app/\(tabs\)/groups.tsx << 'EOF'
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GroupsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-gray-900">Groups</Text>
        <Text className="text-gray-600 mt-2">Your event groups</Text>
      </View>
    </SafeAreaView>
  );
}
EOF

# Profile screen
cat > src/app/\(tabs\)/profile.tsx << 'EOF'
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-gray-900">Profile</Text>
        <Text className="text-gray-600 mt-2">Your account settings</Text>
      </View>
    </SafeAreaView>
  );
}
EOF

# ==========================================
# AUTH SCREENS
# ==========================================

cat > src/app/auth/connect.tsx << 'EOF'
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function ConnectWalletScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-primary-500 to-orange-600">
      <View className="flex-1 px-6 py-8 items-center justify-center">
        <Text className="text-3xl font-bold text-white mb-4">Connect Wallet</Text>
        <Text className="text-orange-100 text-center mb-8">
          Connect your wallet to start using Rovify's AI-powered event coordination
        </Text>
        
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white rounded-xl py-4 px-8"
        >
          <Text className="text-primary-600 font-bold text-lg">Connect Wallet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
EOF

# ==========================================
# DYNAMIC SCREENS
# ==========================================

# Event details
cat > src/app/event/\[id\].tsx << 'EOF'
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-bold text-gray-900">Event Details</Text>
        <Text className="text-gray-600 mt-2">Event ID: {id}</Text>
      </View>
    </SafeAreaView>
  );
}
EOF

# Chat screen
cat > src/app/chat/\[topic\].tsx << 'EOF'
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

export default function ChatScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-bold text-gray-900">Chat</Text>
        <Text className="text-gray-600 mt-2">Topic: {topic}</Text>
      </View>
    </SafeAreaView>
  );
}
EOF

# Agent details
cat > src/app/agent/\[id\].tsx << 'EOF'
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

export default function AgentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-xl font-bold text-gray-900">Agent Details</Text>
        <Text className="text-gray-600 mt-2">Agent ID: {id}</Text>
      </View>
    </SafeAreaView>
  );
}
EOF

# ==========================================
# TYPE DEFINITIONS
# ==========================================

cat > src/types/index.ts << 'EOF'
// Main types export file
export * from './events';
export * from './messaging';
export * from './auth';
export * from './navigation';
EOF

cat > src/types/events.ts << 'EOF'
// Event-related type definitions
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  // Add more fields as needed
}

export enum EventCategory {
  POPULAR = 'popular',
  NIGHTLIFE = 'nightlife', 
  MUSIC = 'music',
  CULTURE = 'culture',
  DATING = 'dating',
}
EOF

cat > src/types/messaging.ts << 'EOF'
// Messaging and agent type definitions
export interface RovifyAgent {
  id: string;
  name: string;
  type: string;
  description: string;
  avatar: string;
  isActive: boolean;
}

export interface AgentMessage {
  id: string;
  content: string;
  agentId?: string;
  timestamp: string;
}
EOF

cat > src/types/auth.ts << 'EOF'
// Authentication type definitions
export interface User {
  id: string;
  address: string;
  basename?: string;
  displayName?: string;
  avatar?: string;
}

export interface WalletConnection {
  address: string;
  isConnected: boolean;
  chainId: number;
}
EOF

cat > src/types/navigation.ts << 'EOF'
// Navigation type definitions
export type RootStackParamList = {
  '(tabs)': undefined;
  'event/[id]': { id: string };
  'chat/[topic]': { topic: string };
  'agent/[id]': { id: string };
  'auth/connect': undefined;
};
EOF

# ==========================================
# STORE FILES
# ==========================================

cat > src/store/index.ts << 'EOF'
// Main store exports
export * from './authStore';
export * from './eventsStore';
export * from './messagingStore';
EOF

cat > src/store/authStore.ts << 'EOF'
import { create } from 'zustand';

interface AuthState {
  isConnected: boolean;
  address: string | null;
  user: any | null;
  
  setConnected: (connected: boolean) => void;
  setAddress: (address: string | null) => void;
  setUser: (user: any) => void;
  disconnect: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isConnected: false,
  address: null,
  user: null,
  
  setConnected: (isConnected) => set({ isConnected }),
  setAddress: (address) => set({ address }),
  setUser: (user) => set({ user }),
  disconnect: () => set({ isConnected: false, address: null, user: null }),
}));
EOF

cat > src/store/eventsStore.ts << 'EOF'
import { create } from 'zustand';

interface EventsState {
  events: any[];
  selectedEvent: any | null;
  isLoading: boolean;
  
  setEvents: (events: any[]) => void;
  setSelectedEvent: (event: any) => void;
  setLoading: (loading: boolean) => void;
}

export const useEventsStore = create<EventsState>((set) => ({
  events: [],
  selectedEvent: null,
  isLoading: false,
  
  setEvents: (events) => set({ events }),
  setSelectedEvent: (selectedEvent) => set({ selectedEvent }),
  setLoading: (isLoading) => set({ isLoading }),
}));
EOF

cat > src/store/messagingStore.ts << 'EOF'
import { create } from 'zustand';

interface MessagingState {
  conversations: any[];
  activeConversation: any | null;
  agents: any[];
  isXmtpConnected: boolean;
  
  setConversations: (conversations: any[]) => void;
  setActiveConversation: (conversation: any) => void;
  setAgents: (agents: any[]) => void;
  setXmtpConnected: (connected: boolean) => void;
}

export const useMessagingStore = create<MessagingState>((set) => ({
  conversations: [],
  activeConversation: null,
  agents: [],
  isXmtpConnected: false,
  
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (activeConversation) => set({ activeConversation }),
  setAgents: (agents) => set({ agents }),
  setXmtpConnected: (isXmtpConnected) => set({ isXmtpConnected }),
}));
EOF

# ==========================================
# SERVICE FILES
# ==========================================

cat > src/services/index.ts << 'EOF'
// Service exports
export * from './api';
export * from './xmtp';
export * from './agentKit';
EOF

cat > src/services/api.ts << 'EOF'
// API service configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_ROVIFY_API_URL || 'https://api.rovify.io';

export class ApiService {
  private baseURL: string;
  
  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }
  
  async get(endpoint: string) {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`);
    return response.json();
  }
  
  async post(endpoint: string, data: any) {
    const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export const apiService = new ApiService();
EOF

cat > src/services/xmtp.ts << 'EOF'
// XMTP service placeholder
export class XMTPService {
  private client: any = null;
  
  async initialize() {
    // XMTP initialization logic
    console.log('XMTP service initialized');
  }
  
  async getConversations() {
    // Get conversations logic
    return [];
  }
  
  async sendMessage(topic: string, content: string) {
    // Send message logic
    console.log('Sending message:', { topic, content });
  }
}

export const xmtpService = new XMTPService();
EOF

cat > src/services/agentKit.ts << 'EOF'
// Coinbase AgentKit service placeholder
export class AgentKitService {
  private agentkit: any = null;
  
  async initialize() {
    // AgentKit initialization logic
    console.log('AgentKit service initialized');
  }
  
  async processRequest(message: string) {
    // Process agent request logic
    return {
      message: 'Hello! I am your Rovify AI assistant.',
      actions: [],
    };
  }
}

export const agentService = new AgentKitService();
EOF

# ==========================================
# HOOK FILES
# ==========================================

cat > src/hooks/index.ts << 'EOF'
// Custom hooks exports
export * from './useAuth';
export * from './useEvents';
export * from './useMessaging';
EOF

cat > src/hooks/useAuth.ts << 'EOF'
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    isConnected,
    address,
    user,
    setConnected,
    setAddress,
    setUser,
    disconnect,
  } = useAuthStore();
  
  const connectWallet = async () => {
    // Wallet connection logic
    console.log('Connecting wallet...');
  };
  
  return {
    isConnected,
    address,
    user,
    connectWallet,
    disconnect,
  };
};
EOF

cat > src/hooks/useEvents.ts << 'EOF'
import { useEventsStore } from '../store/eventsStore';

export const useEvents = () => {
  const {
    events,
    selectedEvent,
    isLoading,
    setEvents,
    setSelectedEvent,
    setLoading,
  } = useEventsStore();
  
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch events logic
      setEvents([]);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    events,
    selectedEvent,
    isLoading,
    fetchEvents,
    setSelectedEvent,
  };
};
EOF

cat > src/hooks/useMessaging.ts << 'EOF'
import { useMessagingStore } from '../store/messagingStore';

export const useMessaging = () => {
  const {
    conversations,
    activeConversation,
    agents,
    isXmtpConnected,
    setConversations,
    setActiveConversation,
    setAgents,
    setXmtpConnected,
  } = useMessagingStore();
  
  const initializeMessaging = async () => {
    // Initialize XMTP messaging
    console.log('Initializing messaging...');
  };
  
  return {
    conversations,
    activeConversation,
    agents,
    isXmtpConnected,
    initializeMessaging,
    setActiveConversation,
  };
};
EOF

# ==========================================
# UTILITY FILES
# ==========================================

cat > src/utils/index.ts << 'EOF'
// Utility exports
export * from './constants';
export * from './formatting';
export * from './cn';
EOF

cat > src/utils/constants.ts << 'EOF'
// App constants
export const COLORS = {
  primary: {
    500: '#f97316',
    600: '#ea580c',
  },
} as const;

export const API_ENDPOINTS = {
  EVENTS: '/events',
  AUTH: '/auth',
} as const;
EOF

cat > src/utils/formatting.ts << 'EOF'
// Formatting utilities
export const formatDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return \`\${formattedHour}:\${minutes} \${period}\`;
};
EOF

cat > src/utils/cn.ts << 'EOF'
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOF

# ==========================================
# UI COMPONENT PLACEHOLDERS
# ==========================================

cat > src/components/ui/index.ts << 'EOF'
// UI component exports
export * from './Button';
export * from './Card';
export * from './Input';
EOF

cat > src/components/ui/Button.tsx << 'EOF'
import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={\`\${variant === 'primary' ? 'bg-primary-500' : 'bg-gray-200'} rounded-lg px-4 py-3 \${disabled ? 'opacity-50' : ''}\`}
      style={style}
    >
      <Text 
        className={\`\${variant === 'primary' ? 'text-white' : 'text-gray-900'} font-semibold text-center\`}
        style={textStyle}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
EOF

# ==========================================
# ENV FILE
# ==========================================

cat > .env.example << 'EOF'
# XMTP Configuration
EXPO_PUBLIC_XMTP_ENV=production

# Coinbase Configuration  
EXPO_PUBLIC_CDP_API_KEY=your_cdp_api_key_here
EXPO_PUBLIC_CDP_API_SECRET=your_cdp_api_secret_here

# Base Network Configuration
EXPO_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
EXPO_PUBLIC_BASE_CHAIN_ID=8453

# Rovify API Configuration
EXPO_PUBLIC_ROVIFY_API_URL=https://api.rovify.io

# OpenAI Configuration
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
EOF

echo "✅ Essential files created"

# ==========================================
# VERIFICATION
# ==========================================

echo ""
echo "🔍 Final structure verification..."

# Count directories
DIR_COUNT=$(find src -type d | wc -l)
FILE_COUNT=$(find src -type f -name "*.ts" -o -name "*.tsx" | wc -l)

echo "📊 Structure complete:"
echo "  • Directories: $DIR_COUNT"
echo "  • TypeScript files: $FILE_COUNT"
echo "  • All essential files created with placeholders"
echo ""

echo "🎉 PROJECT STRUCTURE READY!"
echo ""
echo "📋 What's been created:"
echo "  ✅ All required directories"
echo "  ✅ App layout and screen files" 
echo "  ✅ Type definitions"
echo "  ✅ Store files (Zustand)"
echo "  ✅ Service files (XMTP, AgentKit, API)"
echo "  ✅ Custom hooks"
echo "  ✅ Utility functions"
echo "  ✅ UI component placeholders"
echo "  ✅ Environment file template"
echo ""
echo "🚀 Ready for code content!"
echo "   Now you can paste the real implementation code into these files"
echo ""
echo "📄 Files ready for content:"
echo "   • All screen components"
echo "   • Store implementations"  
echo "   • Service integrations"
echo "   • Hook logic"
echo "   • UI components"
echo ""

# Display final tree
if command -v tree &> /dev/null; then
    echo "📁 Final project structure:"
    tree -I "node_modules|yarn.lock" .
fi

echo ""
echo "🏆 Ready to build the buildathon winner!"
