import AsyncStorage from '@react-native-async-storage/async-storage';

import { useMessaging } from '@/hooks';
import { useEventsStore } from './eventsStore';
import { useAgentsStore } from './agentsStore';
import { useMessagingStore } from './messagingStore';

export { useAuthStore } from './authStore';
export { useMessagingStore } from './messagingStore';
export { useEventsStore } from './eventsStore';
export { useAgentsStore } from './agentsStore';

// Store initialization helper
export const initializeStores = () => {
    console.log('🗃️ Initializing Zustand stores...');

    // Clear any error states on app start
    useMessagingStore.getState().setError(null);
    useEventsStore.getState().setError(null);
    useAgentsStore.getState().setError(null);

    console.log('✅ Stores initialized');
};