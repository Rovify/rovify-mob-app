// index.js - Load Polyfills First for Expo Router
console.log('🚀 Starting Expo Router app with polyfills...');

// Load polyfills FIRST
import './src/utils/polyfills';

// Verify crypto is available before proceeding
if (!global.crypto || !global.crypto.getRandomValues) {
  console.error('❌ CRITICAL: Crypto polyfills failed to load!');

  // Emergency fallback
  if (!global.crypto) global.crypto = {};
  if (!global.crypto.getRandomValues) {
    global.crypto.getRandomValues = (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    };
  }
  console.log('⚠️ Applied emergency crypto fallback');
}

console.log('✅ Crypto verified before Expo Router entry');

// Now import Expo Router entry point (this handles the app/ directory)
import 'expo-router/entry';
