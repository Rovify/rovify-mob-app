import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Text encoding polyfills
import 'fast-text-encoding';

// Additional crypto polyfills if needed
if (typeof global.crypto === 'undefined') {
  global.crypto = require('react-native-randombytes');
}

// BigInt polyfill for older devices
if (typeof global.BigInt === 'undefined') {
  global.BigInt = require('big-integer');
}

// TextEncoder/TextDecoder polyfill check
if (typeof global.TextEncoder === 'undefined') {
  console.warn('TextEncoder not available after polyfills');
}

console.log('✅ Polyfills loaded for XMTP compatibility');