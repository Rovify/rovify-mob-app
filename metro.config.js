const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable support for font files
config.resolver.assetExts.push('otf', 'ttf', 'woff', 'woff2');

// Add support for TypeScript paths
config.resolver.alias = {
  '@': './src',
  '@components': './src/components',
  '@hooks': './src/hooks',
  '@styles': './src/styles',
  '@services': './src/services',
  '@utils': './src/utils',
  '@types': './src/types',
};

module.exports = config;
