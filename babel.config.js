module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      // Required for XMTP
      ['react-native-reanimated/plugin', { relativeSourceLocation: true }],
      'nativewind/babel',
    ],
  };
};
