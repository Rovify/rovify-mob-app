// src/styles/fonts.ts
import { Platform } from 'react-native';

// Font family mappings for cross-platform consistency
export const fonts = {
  // Primary font family - Inter for all platforms
  regular: Platform.select({
    ios: 'Inter-Regular',
    android: 'Inter-Regular',
    default: 'Inter-Regular',
  }),
  medium: Platform.select({
    ios: 'Inter-Medium', 
    android: 'Inter-Medium',
    default: 'Inter-Medium',
  }),
  semiBold: Platform.select({
    ios: 'Inter-SemiBold',
    android: 'Inter-SemiBold', 
    default: 'Inter-SemiBold',
  }),
  bold: Platform.select({
    ios: 'Inter-Bold',
    android: 'Inter-Bold',
    default: 'Inter-Bold',
  }),
  
  // System font fallbacks (for performance-critical areas)
  system: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto',
    default: 'System',
  }),
  
  // Monospace for addresses, code, etc.
  mono: Platform.select({
    ios: 'SF Mono',
    android: 'Roboto Mono',
    default: 'monospace',
  }),
};

// Font weights
export const fontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

// Font sizes (following design system)
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  '6xl': 48,
};

// Text styles for common use cases
export const textStyles = {
  // Headers
  h1: {
    fontFamily: fonts.bold,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: 40,
  },
  h2: {
    fontFamily: fonts.bold,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: 36,
  },
  h3: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semiBold,
    lineHeight: 32,
  },
  h4: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
    lineHeight: 28,
  },
  
  // Body text
  bodyLarge: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: 26,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 20,
  },
  
  // UI elements
  button: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: 16,
  },
  
  // Special
  monospace: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
  },
};

// Export default font configuration for easy usage
export default {
  fonts,
  fontWeights,
  fontSizes,
  textStyles,
};
