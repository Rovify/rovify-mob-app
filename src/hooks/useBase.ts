import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useMobileWallet } from './useWallet';

const BASE_CONFIG = {
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

const USDC_BASE_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const USDC_ABI = [
    'function transfer(address to, uint256 amount) returns (bool)',
    'function balanceOf(address account) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)'
];

// Simple Payment Splitter Contract ABI
const PAYMENT_SPLITTER_ABI = [
    'function split(address[] memory recipients, uint256[] memory amounts) payable',
    'function splitERC20(address token, address[] memory recipients, uint256[] memory amounts)',
    'event PaymentSplit(address indexed token, uint256 totalAmount, uint256 recipientCount)'
];

export const useBase = () => {
    const [isOnBase, setIsOnBase] = useState(false);
    const [baseBalance, setBaseBalance] = useState<string>('0');
    const [usdcBalance, setUsdcBalance] = useState<string>('0');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { provider, address, isConnected } = useMobileWallet();

    // Switch to Base network
    const switchToBase = useCallback(async () => {
        if (!provider) return false;

        try {
            setIsLoading(true);
            setError(null);

            // Try to switch to Base
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BASE_CONFIG.chainId }],
            });

            setIsOnBase(true);
            return true;
        } catch (switchError: any) {
            // If chain doesn't exist, add it
            if (switchError.code === 4902) {
                try {
                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [BASE_CONFIG],
                    });
                    setIsOnBase(true);
                    return true;
                } catch (addError: any) {
                    setError('Failed to add Base network');
                    return false;
                }
            } else {
                setError('Failed to switch to Base network');
                return false;
            }
        } finally {
            setIsLoading(false);
        }
    }, [provider]);

    // Get ETH balance on Base
    const getBaseBalance = useCallback(async () => {
        if (!provider || !address || !isOnBase) return '0';

        try {
            // Changed from Web3Provider to BrowserProvider
            const ethersProvider = new ethers.BrowserProvider(provider);
            const balance = await ethersProvider.getBalance(address);
            // Changed from ethers.utils.formatEther to ethers.formatEther
            const formatted = ethers.formatEther(balance);
            setBaseBalance(formatted);
            return formatted;
        } catch (err) {
            console.error('Failed to get Base balance:', err);
            return '0';
        }
    }, [provider, address, isOnBase]);

    // Get USDC balance on Base
    const getUSDCBalance = useCallback(async () => {
        if (!provider || !address || !isOnBase) return '0';

        try {
            // Changed from Web3Provider to BrowserProvider
            const ethersProvider = new ethers.BrowserProvider(provider);
            const usdcContract = new ethers.Contract(USDC_BASE_ADDRESS, USDC_ABI, ethersProvider);

            const balance = await usdcContract.balanceOf(address);
            const decimals = await usdcContract.decimals();
            // Changed from ethers.utils.formatUnits to ethers.formatUnits
            const formatted = ethers.formatUnits(balance, decimals);

            setUsdcBalance(formatted);
            return formatted;
        } catch (err) {
            console.error('Failed to get USDC balance:', err);
            return '0';
        }
    }, [provider, address, isOnBase]);

    // Send ETH on Base
    const sendETH = useCallback(async (to: string, amount: string) => {
        if (!provider || !address || !isOnBase) {
            throw new Error('Not connected to Base network');
        }

        try {
            // Changed from Web3Provider to BrowserProvider
            const ethersProvider = new ethers.BrowserProvider(provider);
            const signer = await ethersProvider.getSigner();

            const tx = await signer.sendTransaction({
                to,
                // Changed from ethers.utils.parseEther to ethers.parseEther
                value: ethers.parseEther(amount),
                gasLimit: 21000
            });

            console.log('✅ ETH sent on Base:', tx.hash);
            return tx.hash;
        } catch (err: any) {
            console.error('❌ Failed to send ETH:', err);
            throw new Error(err.message || 'Failed to send ETH');
        }
    }, [provider, address, isOnBase]);

    // Send USDC on Base
    const sendUSDC = useCallback(async (to: string, amount: string) => {
        if (!provider || !address || !isOnBase) {
            throw new Error('Not connected to Base network');
        }

        try {
            // Changed from Web3Provider to BrowserProvider
            const ethersProvider = new ethers.BrowserProvider(provider);
            const signer = await ethersProvider.getSigner();
            const usdcContract = new ethers.Contract(USDC_BASE_ADDRESS, USDC_ABI, signer);

            // Convert amount to proper decimals (USDC has 6 decimals)
            // Changed from ethers.utils.parseUnits to ethers.parseUnits
            const amountBN = ethers.parseUnits(amount, 6);

            const tx = await usdcContract.transfer(to, amountBN, {
                gasLimit: 100000
            });

            console.log('✅ USDC sent on Base:', tx.hash);
            return tx.hash;
        } catch (err: any) {
            console.error('❌ Failed to send USDC:', err);
            throw new Error(err.message || 'Failed to send USDC');
        }
    }, [provider, address, isOnBase]);

    // Split payment among multiple recipients (ETH)
    const splitPaymentETH = useCallback(async (recipients: string[], amounts: string[]) => {
        if (!provider || !address || !isOnBase) {
            throw new Error('Not connected to Base network');
        }

        if (recipients.length !== amounts.length) {
            throw new Error('Recipients and amounts arrays must have same length');
        }

        try {
            // Changed from Web3Provider to BrowserProvider
            const ethersProvider = new ethers.BrowserProvider(provider);
            const signer = await ethersProvider.getSigner();

            // Calculate total amount using native BigInt instead of ethers.BigNumber
            let totalAmount = 0n;
            for (const amount of amounts) {
                totalAmount += ethers.parseEther(amount);
            }

            // Send transactions sequentially (could be optimized with a splitter contract)
            const txHashes: string[] = [];

            for (let i = 0; i < recipients.length; i++) {
                const tx = await signer.sendTransaction({
                    to: recipients[i],
                    // Changed from ethers.utils.parseEther to ethers.parseEther
                    value: ethers.parseEther(amounts[i]),
                    gasLimit: 21000
                });
                txHashes.push(tx.hash);

                // Wait for confirmation before next transaction
                await tx.wait(1);
            }

            console.log('✅ Payment split completed:', txHashes);
            return txHashes;
        } catch (err: any) {
            console.error('❌ Failed to split payment:', err);
            throw new Error(err.message || 'Failed to split payment');
        }
    }, [provider, address, isOnBase]);

    // Split USDC payment
    const splitPaymentUSDC = useCallback(async (recipients: string[], amounts: string[]) => {
        if (!provider || !address || !isOnBase) {
            throw new Error('Not connected to Base network');
        }

        try {
            // Changed from Web3Provider to BrowserProvider
            const ethersProvider = new ethers.BrowserProvider(provider);
            const signer = await ethersProvider.getSigner();
            const usdcContract = new ethers.Contract(USDC_BASE_ADDRESS, USDC_ABI, signer);

            const txHashes: string[] = [];

            for (let i = 0; i < recipients.length; i++) {
                // Changed from ethers.utils.parseUnits to ethers.parseUnits
                const amountBN = ethers.parseUnits(amounts[i], 6);
                const tx = await usdcContract.transfer(recipients[i], amountBN, {
                    gasLimit: 100000
                });
                txHashes.push(tx.hash);

                // Wait for confirmation
                await tx.wait(1);
            }

            console.log('✅ USDC payment split completed:', txHashes);
            return txHashes;
        } catch (err: any) {
            console.error('❌ Failed to split USDC payment:', err);
            throw new Error(err.message || 'Failed to split USDC payment');
        }
    }, [provider, address, isOnBase]);

    // Check if on Base network
    const checkNetwork = useCallback(async () => {
        if (!provider) return false;

        try {
            const chainId = await provider.request({ method: 'eth_chainId' });
            const onBase = chainId === BASE_CONFIG.chainId;
            setIsOnBase(onBase);
            return onBase;
        } catch (err) {
            setIsOnBase(false);
            return false;
        }
    }, [provider]);

    return {
        // State
        isOnBase,
        baseBalance,
        usdcBalance,
        isLoading,
        error,

        // Network actions
        switchToBase,
        checkNetwork,

        // Balance actions
        getBaseBalance,
        getUSDCBalance,

        // Transaction actions
        sendETH,
        sendUSDC,
        splitPaymentETH,
        splitPaymentUSDC
    };
};