// src/styles/global.ts
import { StyleSheet } from 'react-native';
import { fonts, fontSizes, fontWeights } from './fonts';

export const globalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // Typography using our font system
  h1: {
    fontFamily: fonts.bold,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    color: '#000000',
  },
  h2: {
    fontFamily: fonts.bold,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    color: '#000000',
  },
  h3: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semiBold,
    color: '#000000',
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    color: '#333333',
  },
  bodyLarge: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    color: '#333333',
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    color: '#666666',
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    color: '#999999',
  },
  
  // Interactive elements
  button: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: '#ffffff',
  },
  link: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: '#007AFF',
  },
  
  // Utility
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  
  // Address/code display
  address: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    color: '#666666',
  },
});

export default globalStyles;
