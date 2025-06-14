import { ethers } from 'ethers';

export class EthersWalletSigner extends ethers.Signer {
  constructor(provider, address) {
    super();
    this.provider = provider;
    this.address = address;
    this._ethersProvider = new ethers.providers.Web3Provider(provider);
  }

  async getAddress() {
    return this.address;
  }

  async signMessage(message) {
    const signer = this._ethersProvider.getSigner(this.address);
    return await signer.signMessage(message);
  }

  async signTransaction(transaction) {
    const signer = this._ethersProvider.getSigner(this.address);
    return await signer.signTransaction(transaction);
  }

  async sendTransaction(transaction) {
    const signer = this._ethersProvider.getSigner(this.address);
    return await signer.sendTransaction(transaction);
  }

  connect(provider) {
    return new EthersWalletSigner(provider, this.address);
  }

  async _signTypedData(domain, types, value) {
    const signer = this._ethersProvider.getSigner(this.address);
    return await signer._signTypedData(domain, types, value);
  }
}

// Environment Configuration
// config/xmtp.js

export const XMTP_CONFIG = {
  // Use 'dev' for development, 'production' for production
  environment: __DEV__ ? 'dev' : 'production',

  // Database encryption key (generate a secure 32-byte key)
  // In production, store this securely (e.g., in device keychain)
  dbEncryptionKey: new Uint8Array([
    // 32 bytes of secure random data
    // For demo purposes only - generate your own!
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 32,
  ]),

  // Enable V3 MLS features
  enableV3: true,

  // Additional configuration options
  codecs: [
    // Add custom content types here if needed
  ],
};
