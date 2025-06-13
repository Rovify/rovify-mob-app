import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BaseWalletService } from '../services/wallet/baseWallet';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    isAuthenticated,
    address,
    signer,
    provider,
    balance,
    setAuthenticated,
    setAddress,
    setSigner,
    setProvider,
    setBalance,
    clearAuth
  } = useAuthStore();

  const walletService = new BaseWalletService();

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const { address, signer, provider } = await walletService.connectWallet();
      const balance = await walletService.getBalance(address);

      setAddress(address);
      setSigner(signer);
      setProvider(provider);
      setBalance(balance);
      setAuthenticated(true);

      console.log('✅ Wallet connected:', { address, balance });
    } catch (err: any) {
      setError(err.message);
      console.error('❌ Wallet connection failed:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    clearAuth();
    console.log('🔌 Wallet disconnected');
  };

  const sendTransaction = async (to: string, amount: string) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      const txHash = await walletService.sendTransaction(to, amount);

      // Update balance after transaction
      const newBalance = await walletService.getBalance(address);
      setBalance(newBalance);

      return txHash;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum && !isAuthenticated) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });

          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.log('Auto-connect failed:', error);
        }
      }
    };

    autoConnect();
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    address,
    signer,
    provider,
    balance,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    sendTransaction
  };
};