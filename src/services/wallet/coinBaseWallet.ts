import { EIP1193Provider, Wallets } from '@mobile-wallet-protocol/client';
import { MobileWalletService } from '../../types/wallet';

export class CoinbaseMobileService implements MobileWalletService {
    private provider: EIP1193Provider | null = null;

    async connect(): Promise<{ address: string; provider: any }> {
        try {
            // Verify crypto.getRandomValues is available
            if (!global.crypto || !global.crypto.getRandomValues) {
                console.error('crypto.getRandomValues not available');
                throw new Error('Crypto polyfills not loaded properly. Please restart the app.');
            }

            console.log('✅ Crypto available, proceeding with Coinbase connection');

            // Check if Coinbase Wallet is installed
            const isInstalled = await this.isInstalled();
            if (!isInstalled) {
                throw new Error('Coinbase Wallet app is not installed. Please install Coinbase Wallet from the App Store.');
            }

            // Initialize Coinbase Smart Wallet provider with proper error handling
            const metadata = {
                name: 'Rovify',
                customScheme: 'rovify://', // Your app's custom scheme
                chainIds: [1, 8453], // Ethereum mainnet and Base
                logoUrl: 'https://rovify.com/logo.png',
            };

            try {
                this.provider = new EIP1193Provider({
                    metadata,
                    wallet: Wallets.CoinbaseSmartWallet,
                });

                console.log('✅ Coinbase provider initialized');
            } catch (providerError: any) {
                console.error('❌ Failed to create Coinbase provider:', providerError);
                throw new Error(`Failed to initialize Coinbase Wallet: ${providerError.message}`);
            }

            // Request account access with timeout
            console.log('📱 Requesting account access...');

            const accountsPromise = this.provider.request({
                method: 'eth_requestAccounts'
            }) as Promise<string[]>;

            // Add timeout to prevent hanging
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Connection request timed out')), 30000);
            });

            const accounts = await Promise.race([accountsPromise, timeoutPromise]);

            if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
                throw new Error('No accounts found. Please create an account in Coinbase Wallet.');
            }

            console.log('✅ Accounts received:', accounts.length);

            return {
                address: accounts[0],
                provider: this.provider,
            };
        } catch (error: any) {
            console.error('❌ Coinbase Wallet connection failed:', error);

            // Handle specific error codes
            if (error.code === 4001) {
                throw new Error('Connection request was rejected. Please approve the connection in Coinbase Wallet.');
            }

            if (error.code === -32603) {
                throw new Error('Crypto API not available. Please restart the app and try again.');
            }

            if (error.message?.includes('crypto.getRandomValues')) {
                throw new Error('Crypto polyfills not loaded. Please restart the app.');
            }

            throw new Error(`Coinbase Wallet connection failed: ${error.message}`);
        }
    }

    async isInstalled(): Promise<boolean> {
        try {
            // For Mobile Wallet Protocol, we assume the SDK handles detection
            // It will show install prompt if wallet is not installed
            return true;
        } catch (error) {
            console.warn('Could not check if Coinbase Wallet is installed:', error);
            return true; // Assume it's installed and let the SDK handle it
        }
    }

    async getBalance(address: string): Promise<string> {
        if (!this.provider) throw new Error('Coinbase Wallet not connected');

        try {
            const balance = await this.provider.request({
                method: 'eth_getBalance',
                params: [address, 'latest'],
            });

            // Convert from hex wei to ether
            const balanceInWei = parseInt(balance as string, 16);
            const balanceInEth = balanceInWei / Math.pow(10, 18);
            return balanceInEth.toFixed(6);
        } catch (error) {
            console.error('Failed to get balance:', error);
            return '0.0';
        }
    }

    disconnect(): void {
        try {
            // Mobile Wallet Protocol handles cleanup
            this.provider = null;
            console.log('✅ Coinbase Wallet disconnected');
        } catch (error) {
            console.warn('Error during Coinbase Wallet disconnect:', error);
        }
    }
}