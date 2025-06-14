const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('otf', 'ttf', 'woff', 'woff2');
config.resolver.sourceExts.push('cjs');

config.resolver = {
  ...config.resolver,
  unstable_enableSymlinks: false,
  unstable_enablePackageExports: false,
  nodeModulesPaths: [`${__dirname}/node_modules`],
  alias: {
    ...config.resolver.alias,
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
  },
};

config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...(process.env.NODE_ENV === 'development' && {
      keep_fnames: true,
      mangle: false,
    }),
  },
};

module.exports = config;
