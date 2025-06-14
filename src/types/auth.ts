export interface User {
  address: string;
  chainId: number;
  isConnected: boolean;
  balance?: string;
  ensName?: string;
  avatar?: string;
}

export interface WalletConnection {
  address: string;
  chainId: number;
  provider: any; // ethers provider
  signer: any; // ethers signer
}

export interface AuthState {
  user: User | null;
  isConnecting: boolean;
  isAuthenticated: boolean;
  error: string | null;
  connection: WalletConnection | null;
}