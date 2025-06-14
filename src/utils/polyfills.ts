// CRITICAL: Polyfills for XMTP React Native SDK
console.log('🔧 Loading PRODUCTION polyfills for XMTP...');

// MUST be first - crypto polyfills
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Expo crypto polyfill
import { polyfillWebCrypto } from "expo-standard-web-crypto";
import { randomUUID } from "expo-crypto";

// Buffer polyfill
import { Buffer } from '@craftzdog/react-native-buffer';

// Text encoding
import 'text-encoding';

// Apply Buffer polyfill
global.Buffer = Buffer as unknown as BufferConstructor;

// Text encoding polyfills
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('text-encoding').TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('text-encoding').TextDecoder;
}

// Process polyfill
if (typeof global.process === 'undefined') {
  global.process = require('process');
}

// Apply expo crypto polyfill
polyfillWebCrypto();

// Enhanced crypto setup for XMTP
const setupCryptoForXMTP = () => {
  console.log('🔧 Setting up crypto for XMTP production...');

  // Ensure crypto object exists
  if (!global.crypto) {
    global.crypto = {} as any;
  }

  // XMTP needs getRandomValues
  if (!global.crypto.getRandomValues) {
    try {
      const { getRandomValues } = require('react-native-get-random-values');
      global.crypto.getRandomValues = getRandomValues;
      console.log('✅ getRandomValues set from react-native-get-random-values');
    } catch (error) {
      console.error('❌ Failed to load react-native-get-random-values:', error);
      throw new Error('XMTP requires crypto.getRandomValues');
    }
  }

  // Add randomUUID
  if (!global.crypto.randomUUID) {
    try {
      global.crypto.randomUUID = randomUUID as unknown as () => `${string}-${string}-${string}-${string}-${string}`;
      console.log('✅ randomUUID added from expo-crypto');
    } catch (error) {
      console.warn('⚠️ Could not add randomUUID:', error);
    }
  }

  // XMTP also checks window.crypto
  if (typeof window !== 'undefined') {
    if (!window.crypto) {
      window.crypto = global.crypto;
      console.log('✅ window.crypto set from global.crypto');
    }

    if (!window.crypto.getRandomValues) {
      window.crypto.getRandomValues = global.crypto.getRandomValues;
      console.log('✅ window.crypto.getRandomValues set');
    }
  }

  // Test crypto functionality
  try {
    const testArray = new Uint8Array(8);
    global.crypto.getRandomValues(testArray);
    console.log('✅ Crypto test passed for XMTP:', Array.from(testArray));
    return true;
  } catch (error) {
    console.error('❌ Crypto test failed:', error);
    throw new Error('Crypto setup failed for XMTP');
  }
};

// Apply crypto setup
setupCryptoForXMTP();

// BigInt polyfill (XMTP needs this)
if (typeof global.BigInt === 'undefined') {
  try {
    global.BigInt = require('big-integer');
    console.log('✅ BigInt polyfill applied');
  } catch (error) {
    console.warn('⚠️ BigInt polyfill failed - XMTP may not work:', error);
  }
}

console.log('🎉 PRODUCTION polyfills ready for XMTP');
console.log('✅ crypto.getRandomValues:', !!global.crypto?.getRandomValues);
console.log('✅ crypto.randomUUID:', !!global.crypto?.randomUUID);
console.log('✅ Buffer:', !!global.Buffer);
console.log('✅ BigInt:', typeof global.BigInt !== 'undefined');