import { ethers } from 'ethers';
import { BASE_CONFIG, BASE_TESTNET } from '../../config/base';

export class BaseWalletService {
    private provider: ethers.BrowserProvider | null = null;
    private signer: ethers.Signer | null = null;

    async connectWallet(): Promise<{
        address: string;
        signer: ethers.Signer;
        provider: ethers.BrowserProvider;
    }> {
        if (!window.ethereum) {
            throw new Error('No Web3 wallet detected. Please install MetaMask or Coinbase Wallet.');
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found');
            }

            this.provider = new ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();

            // Switch to Base network
            await this.switchToBase();

            return {
                address: accounts[0],
                signer: this.signer,
                provider: this.provider,
            };
        } catch (error: any) {
            console.error('Wallet connection failed:', error);
            throw new Error(`Failed to connect wallet: ${error.message}`);
        }
    }

    async switchToBase(): Promise<void> {
        if (!window.ethereum) return;

        const chainId = `0x${BASE_CONFIG.CHAIN_ID.toString(16)}`;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId,
                                chainName: BASE_CONFIG.CHAIN_NAME,
                                rpcUrls: [BASE_CONFIG.RPC_URL],
                                nativeCurrency: BASE_CONFIG.NATIVE_CURRENCY,
                                blockExplorerUrls: [BASE_CONFIG.BLOCK_EXPLORER],
                            },
                        ],
                    });
                } catch (addError) {
                    throw new Error('Failed to add Base network');
                }
            } else {
                throw new Error('Failed to switch to Base network');
            }
        }
    }

    async getBalance(address: string): Promise<string> {
        if (!this.provider) throw new Error('Provider not connected');

        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
    }

    async sendTransaction(to: string, amount: string): Promise<string> {
        if (!this.signer) throw new Error('Signer not available');

        const tx = await this.signer.sendTransaction({
            to,
            value: ethers.parseEther(amount),
        });

        return tx.hash;
    }
}