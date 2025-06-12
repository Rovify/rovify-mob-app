import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    isConnecting,
    isAuthenticated,
    error,
    connection,
    setConnecting,
    setError,
    setUser,
    connectWallet,
    disconnect,
  } = useAuthStore();

  /**
   * Mock wallet connection for buildathon demo
   */
  const handleConnectWallet = useCallback(async () => {
    setConnecting(true);
    setError(null);

    try {
      // For buildathon: simulate wallet connection
      // In production, this would integrate with WalletConnect, MetaMask, etc.

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate connection delay

      // Mock wallet data
      const mockUser = {
        address: '0x742d35Cc6323d37c3FC5a5E721B5D2b7B1E5E5c1', // Sample address
        chainId: 8453, // Base chain ID
        isConnected: true,
        balance: '1.25', // Mock balance
        ensName: undefined,
        avatar: undefined,
      };

      setUser(mockUser);

      console.log('✅ Mock wallet connected:', mockUser.address);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection failed:', error);

      Alert.alert(
        'Connection Failed',
        'Failed to connect wallet. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setConnecting(false);
    }
  }, [setConnecting, setError, setUser]);

  /**
   * Handle wallet disconnection
   */
  const handleDisconnect = useCallback(() => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            disconnect();
            console.log('🔌 Wallet disconnected');
          }
        },
      ]
    );
  }, [disconnect]);

  /**
   * Get shortened address for display
   */
  const getShortAddress = useCallback(() => {
    if (!user?.address) return null;
    return `${user.address.slice(0, 6)}...${user.address.slice(-4)}`;
  }, [user?.address]);

  /**
   * Mock signer for XMTP integration
   */
  const getMockSigner = useCallback(() => {
    if (!user?.address) return null;

    // For buildathon: return mock signer object
    // In production, this would be actual ethers Signer
    return {
      address: user.address,
      getAddress: async () => user.address,
      signMessage: async (message: string) => {
        console.log('Mock signing message:', message);
        return '0x' + Math.random().toString(16).substr(2); // Mock signature
      },
      getChainId: async () => user.chainId,
    };
  }, [user]);

  return {
    // State
    user,
    isConnecting,
    isAuthenticated,
    error,
    connection,

    // Computed values
    address: user?.address || null,
    shortAddress: getShortAddress(),
    signer: getMockSigner(),
    chainId: user?.chainId || null,

    // Actions
    connectWallet: handleConnectWallet,
    disconnect: handleDisconnect,
    setError,

    // Utilities
    isConnected: isAuthenticated,
    isOnCorrectChain: user?.chainId === 8453, // Base mainnet
  };
};