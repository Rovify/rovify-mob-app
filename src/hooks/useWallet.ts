import { useState, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { MetaMaskMobileService, CoinbaseMobileService, MobileWalletService } from '@/services/wallet/wallet';

type WalletType = 'metamask' | 'coinbase';

interface UseMobileWalletReturn {
    address: string | null;
    provider: any | null;
    isConnected: boolean;
    isConnecting: boolean;
    balance: string | null;
    error: string | null;
    walletType: WalletType | null;
    connect: (walletType: WalletType) => Promise<void>;
    disconnect: () => void;
    clearError: () => void;
}

export const useMobileWallet = (): UseMobileWalletReturn => {
    const [address, setAddress] = useState<string | null>(null);
    const [provider, setProvider] = useState<any | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [balance, setBalance] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [walletType, setWalletType] = useState<WalletType | null>(null);
    const [walletService, setWalletService] = useState<MobileWalletService | null>(null);

    const connect = useCallback(async (selectedWalletType: WalletType) => {
        setIsConnecting(true);
        setError(null);

        try {
            let service: MobileWalletService;

            switch (selectedWalletType) {
                case 'metamask':
                    service = new MetaMaskMobileService();
                    break;
                case 'coinbase':
                    service = new CoinbaseMobileService();
                    break;
                default:
                    throw new Error('Unsupported wallet type');
            }

            // Check if wallet is installed
            const isInstalled = await service.isInstalled();
            if (!isInstalled) {
                const walletName = selectedWalletType === 'metamask' ? 'MetaMask' : 'Coinbase Wallet';
                const storeUrl = selectedWalletType === 'metamask'
                    ? 'https://apps.apple.com/app/metamask/id1438144202'
                    : 'https://apps.apple.com/app/coinbase-wallet/id1278383455';

                Alert.alert(
                    `${walletName} Required`,
                    `Please install ${walletName} to continue.`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Install',
                            onPress: () => Linking.openURL(storeUrl)
                        }
                    ]
                );
                return;
            }

            const { address: walletAddress, provider: walletProvider } = await service.connect();

            setWalletService(service);
            setWalletType(selectedWalletType);
            setAddress(walletAddress);
            setProvider(walletProvider);

            // Get balance
            const walletBalance = await service.getBalance(walletAddress);
            setBalance(walletBalance);

            console.log(`✅ ${selectedWalletType} wallet connected:`, walletAddress);
        } catch (err: any) {
            const errorMessage = err.message || 'Connection failed';
            setError(errorMessage);
            console.error(`❌ ${selectedWalletType} wallet connection failed:`, err);

            // Reset state on error
            setWalletService(null);
            setWalletType(null);
            setAddress(null);
            setProvider(null);
            setBalance(null);
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const disconnect = useCallback(() => {
        if (walletService) {
            walletService.disconnect();
        }

        setWalletService(null);
        setWalletType(null);
        setAddress(null);
        setProvider(null);
        setBalance(null);
        setError(null);

        console.log('🔌 Wallet disconnected');
    }, [walletService]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        address,
        provider,
        isConnected: !!address && !!provider,
        isConnecting,
        balance,
        error,
        walletType,
        connect,
        disconnect,
        clearError,
    };
};