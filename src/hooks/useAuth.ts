import { useAuthStore } from '../store/authStore';
import { useMobileWallet } from './useWallet';

export const useAuth = () => {
  const mobileWallet = useMobileWallet();
  const authStore = useAuthStore();

  // Sync mobile wallet state with auth store
  const connectWallet = async (walletType: 'metamask' | 'coinbase') => {
    await mobileWallet.connect(walletType);

    if (mobileWallet.isConnected) {
      authStore.setAuthenticated(true);
      if (mobileWallet.address) {
        authStore.setAddress(mobileWallet.address);
      }
      authStore.setProvider(mobileWallet.provider);
      if (mobileWallet.balance !== null) {
        authStore.setBalance(mobileWallet.balance);
      }
    }
  };

  const disconnectWallet = () => {
    mobileWallet.disconnect();
    authStore.clearAuth();
  };

  return {
    ...mobileWallet,
    isAuthenticated: mobileWallet.isConnected,
    connectWallet,
    disconnectWallet,
    // Expose individual wallet connection methods
    connectMetaMask: () => connectWallet('metamask'),
    connectCoinbase: () => connectWallet('coinbase'),
  };
};