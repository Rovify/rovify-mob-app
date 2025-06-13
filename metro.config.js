const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': './src',
  '@components': './src/components',
  '@hooks': './src/hooks',
  '@styles': './src/styles',
  '@services': './src/services',
  '@utils': './src/utils',
  '@types': './src/types',
  crypto: 'expo-crypto',
  stream: 'readable-stream',
  buffer: '@craftzdog/react-native-buffer',
};

config.resolver.assetExts.push('otf', 'ttf', 'woff', 'woff2');

config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;
