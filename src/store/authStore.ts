import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '../types/auth';

interface AuthActions {
  // State setters
  setConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: User | null) => void;

  // Wallet actions
  connectWallet: () => Promise<void>;
  disconnect: () => void;

  // Getters
  getAddress: () => string | null;

  address: string | null;
  signer: any | null;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isConnecting: false,
      isAuthenticated: false,
      error: null,
      connection: null,

      // Computed properties (getter-like)
      get address() {
        return get().user?.address || null;
      },

      get signer() {
        const user = get().user;
        if (!user) return null;

        // Return mock signer for buildathon
        return {
          address: user.address,
          getAddress: async () => user.address,
          signMessage: async (message: string) => {
            console.log('Mock signing message:', message);
            return '0x' + Math.random().toString(16).substr(2);
          },
          getChainId: async () => user.chainId,
        };
      },

      // Actions
      setConnecting: (connecting: boolean) =>
        set({ isConnecting: connecting }),

      setError: (error: string | null) =>
        set({ error }),

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: !!user,
          connection: user ? {
            address: user.address,
            chainId: user.chainId,
            provider: null, // Mock for buildathon
            signer: null,   // Mock for buildathon
          } : null
        }),

      connectWallet: async () => {
        // This will be called by the useAuth hook
        console.log('Connect wallet called from store');
      },

      disconnect: () => {
        set({
          user: null,
          connection: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Getters
      getAddress: () => get().user?.address || null,
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);