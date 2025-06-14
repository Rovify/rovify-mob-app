import { ethers } from 'ethers';

export class CoinbaseWalletSigner {
  constructor(provider, address) {
    this.provider = provider;
    this.address = address;
  }

  async getAddress() {
    return this.address;
  }

  async signMessage(message) {
    try {
      // Use Coinbase Wallet provider to sign message
      const signature = await this.provider.request({
        method: 'personal_sign',
        params: [message, this.address],
      });
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  // Required by XMTP SDK
  async signTypedData(domain, types, value) {
    try {
      const typedData = {
        domain,
        types,
        primaryType: Object.keys(types)[0],
        message: value,
      };

      const signature = await this.provider.request({
        method: 'eth_signTypedData_v4',
        params: [this.address, JSON.stringify(typedData)],
      });

      return signature;
    } catch (error) {
      console.error('Error signing typed data:', error);
      throw error;
    }
  }
}
