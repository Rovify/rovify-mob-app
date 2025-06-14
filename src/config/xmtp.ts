import type { XMTPEnvironment } from '@xmtp/react-native-sdk';

export const XMTP_CONFIG: {
  environment: XMTPEnvironment;
  appVersion: string;
  enableLogging: boolean;
  enableDbEncryption: boolean;
  allowUnsafeContent: boolean;
  requireConsent: boolean;
} = {
  environment: process.env.NODE_ENV === 'production'
    ? 'production'
    : 'dev',

  appVersion: '1.0.0',
  enableLogging: process.env.NODE_ENV !== 'production',
  enableDbEncryption: true,
  allowUnsafeContent: false,
  requireConsent: true,
};

export const getXMTPDatabasePath = (address: string) => {
  return `xmtp_${address.toLowerCase()}.db`;
};