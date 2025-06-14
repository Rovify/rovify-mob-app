import { useSDK } from '@metamask/sdk-react-native';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

export function useMetaMaskWallet() {
    const { sdk } = useSDK();
    const provider = sdk;

    const connect = async (): Promise<{ address: string; provider: any }> => {
        if (!sdk || !provider) {
            throw new Error('MetaMask SDK not initialized');
        }

        if (__DEV__ && Platform.OS === 'ios' && !Device.isDevice) {
            console.warn('[MetaMask] Running in iOS Simulator – returning demo address');
            return {
                address: '0xD3m0AddR35500000000000000000000000000000',
                provider: null,
            };
        }

        try {
            const isInstalled = await isMetaMaskInstalled();
            if (!isInstalled) {
                throw new Error('MetaMask app is not installed. Please install MetaMask from the App Store.');
            }

            const accounts = await sdk.connect();

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found. Please create an account in MetaMask.');
            }

            await switchToBase(provider);

            return {
                address: accounts[0],
                provider,
            };
        } catch (error: any) {
            console.error('MetaMask connection failed:', error);

            if (error.code === 4001) {
                throw new Error('Connection request was rejected. Please approve the connection in MetaMask.');
            } else if (error.code === -32002) {
                throw new Error('MetaMask connection request is already pending. Please check the MetaMask app.');
            }

            throw new Error(`MetaMask connection failed: ${error.message}`);
        }
    };

    const switchToBase = async (provider: any): Promise<void> => {
        const baseConfig = {
            chainId: '0x2105', // 8453 in hex
            chainName: 'Base',
            nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org'],
        };

        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: baseConfig.chainId }],
            });
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                await provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [baseConfig],
                });
            } else {
                throw new Error('Failed to switch to Base network');
            }
        }
    };

    const isMetaMaskInstalled = async (): Promise<boolean> => {
        // MetaMask SDK handles linking, so assume it's handled unless logic changes
        return true;
    };

    const getBalance = async (address: string): Promise<string> => {
        if (!provider) throw new Error('MetaMask not connected');

        try {
            const balance = await sdk.connectWith({
                method: 'eth_getBalance',
                params: [address, 'latest'],
            });

            const balanceInWei = parseInt(balance ?? '0', 16);
            const balanceInEth = balanceInWei / Math.pow(10, 18);
            return balanceInEth.toFixed(6);
        } catch (error) {
            console.error('Failed to get balance:', error);
            return '0.0';
        }
    };

    const disconnect = (): void => {
        if (sdk) {
            sdk.terminate();
        }
    };

    return {
        connect,
        getBalance,
        disconnect,
    };
}