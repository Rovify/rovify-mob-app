export interface MobileWalletService {
    connect(): Promise<{ address: string; provider: any }>;
    disconnect(): void;
    isInstalled(): Promise<boolean>;
    getBalance(address: string): Promise<string>;
}

export type WalletType = 'metamask' | 'coinbase';