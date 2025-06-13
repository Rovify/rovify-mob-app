import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from '@craftzdog/react-native-buffer';
import 'text-encoding';

// @ts-ignore
global.Buffer = Buffer;

if (typeof global.process === 'undefined') {
  global.process = require('process');
}

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
  global.TextEncoder = require('text-encoding').TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('text-encoding').TextDecoder;
}

console.log('✅ Polyfills loaded for XMTP compatibility');