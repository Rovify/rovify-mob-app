import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ethers } from 'ethers';

interface AuthState {
  isAuthenticated: boolean;
  address: string | null;
  signer: ethers.Signer | null;
  provider: ethers.BrowserProvider | null;
  balance: string | null;
  setAuthenticated: (authenticated: boolean) => void;
  setAddress: (address: string) => void;
  setSigner: (signer: ethers.Signer) => void;
  setProvider: (provider: ethers.BrowserProvider) => void;
  setBalance: (balance: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      address: null,
      signer: null,
      provider: null,
      balance: null,
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      setAddress: (address) => set({ address }),
      setSigner: (signer) => set({ signer }),
      setProvider: (provider) => set({ provider }),
      setBalance: (balance) => set({ balance }),
      clearAuth: () => set({
        isAuthenticated: false,
        address: null,
        signer: null,
        provider: null,
        balance: null
      })
    }),
    {
      name: 'auth-store',
      // Don't persist signer/provider as they contain functions
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        address: state.address,
        balance: state.balance
      })
    }
  )
);

// Global type
declare global {
  interface Window {
    ethereum?: any;
  }
}