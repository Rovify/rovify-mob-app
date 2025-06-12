#!/bin/bash

# Rovify Dependencies Installation - Clean Yarn Approach
# Let yarn handle version resolution for SDK 53

set -e

echo "Installing Rovify dependencies with yarn..."
echo "Using @latest for cutting-edge packages, letting yarn resolve compatibility"
echo ""

# ==========================================
# EXPO ROUTER & NAVIGATION
# ==========================================
echo "📱 Installing Expo Router and navigation..."

yarn add expo-router@latest
yarn add react-native-safe-area-context@latest
yarn add react-native-screens@latest
yarn add expo-linking@latest
yarn add expo-constants@latest

echo "✅ Navigation packages installed"

# ==========================================
# ANIMATION & GESTURES
# ==========================================
echo "✨ Installing animation packages..."

yarn add react-native-reanimated@latest
yarn add react-native-gesture-handler@latest

echo "✅ Animation packages installed"

# ==========================================
# MESSAGING & WEB3
# ==========================================
echo "💬 Installing XMTP and Web3 packages..."

# XMTP and crypto dependencies
yarn add @xmtp/react-native-sdk@latest
yarn add ethers@latest
yarn add @ethersproject/shims@latest
yarn add react-native-get-random-values@latest
yarn add viem@latest

echo "✅ Messaging and Web3 packages installed"

# ==========================================
# AI AGENTS
# ==========================================
echo "🤖 Installing AI packages..."

yarn add openai@latest
yarn add @coinbase/agentkit@latest
yarn add @coinbase/agentkit-langchain@latest

echo "✅ AI packages installed"

# ==========================================
# UI & STYLING
# ==========================================
echo "🎨 Installing UI packages..."

yarn add nativewind@latest
yarn add tailwindcss@latest
yarn add @expo/vector-icons@latest
yarn add expo-linear-gradient@latest
yarn add expo-image@latest
yarn add react-native-gifted-chat@latest

echo "✅ UI packages installed"

# ==========================================
# STATE MANAGEMENT
# ==========================================
echo "🏪 Installing state management..."

yarn add zustand@latest
yarn add @tanstack/react-query@latest

echo "✅ State management installed"

# ==========================================
# STORAGE & FORMS
# ==========================================
echo "💾 Installing storage and form packages..."

yarn add @react-native-async-storage/async-storage@latest
yarn add expo-secure-store@latest
yarn add react-hook-form@latest
yarn add zod@latest
yarn add @hookform/resolvers@latest

echo "✅ Storage and forms installed"

# ==========================================
# UTILITIES
# ==========================================
echo "🛠️ Installing utilities..."

yarn add clsx@latest
yarn add tailwind-merge@latest
yarn add date-fns@latest

echo "✅ Utilities installed"

# ==========================================
# DEVELOPMENT DEPENDENCIES
# ==========================================
echo "🔧 Installing development dependencies..."

yarn add --dev @babel/plugin-proposal-export-namespace-from@latest
yarn add --dev @types/react-native@latest
yarn add --dev eslint@latest
yarn add --dev eslint-config-expo@latest
yarn add --dev prettier@latest
yarn add --dev jest@latest
yarn add --dev jest-expo@latest
yarn add --dev @testing-library/react-native@latest

echo "✅ Development dependencies installed"

# ==========================================
# UPDATE PACKAGE.JSON
# ==========================================
echo "⚙️ Updating package.json..."

npm pkg set main="expo-router/entry"
npm pkg set scripts.start="expo start"
npm pkg set scripts.android="expo start --android"
npm pkg set scripts.ios="expo start --ios"
npm pkg set scripts.web="expo start --web"
npm pkg set scripts.test="jest"
npm pkg set scripts.lint="eslint . --ext .js,.jsx,.ts,.tsx"
npm pkg set scripts.type-check="tsc --noEmit"

echo "✅ Package.json updated"

# ==========================================
# CREATE CONFIG FILES
# ==========================================
echo "📝 Creating configuration files..."

# app.json
cat > app.json << 'EOF'
{
  "expo": {
    "name": "Rovify",
    "slug": "rovify",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.rovify.app",
      "deploymentTarget": "15.1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.rovify.app",
      "minSdkVersion": 24,
      "compileSdkVersion": 35
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      "expo-secure-store"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "scheme": "rovify"
  }
}
EOF

# metro.config.js
cat > metro.config.js << 'EOF'
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

let config = getDefaultConfig(__dirname);

// Add NativeWind support
config = withNativeWind(config, { input: './global.css' });

// Add Reanimated support
config = wrapWithReanimatedMetroConfig(config);

// Handle Metro ESM resolution issues
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
EOF

# babel.config.js
cat > babel.config.js << 'EOF'
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
EOF

# tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
    },
  },
  plugins: [],
}
EOF

# .eslintrc.js
cat > .eslintrc.js << 'EOF'
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
EOF

# .prettierrc.js
cat > .prettierrc.js << 'EOF'
module.exports = {
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  printWidth: 100,
};
EOF

echo "✅ Configuration files created"

# ==========================================
# FINAL STEPS
# ==========================================
echo "🔄 Final installation steps..."

# Make sure everything is installed
yarn install

echo "✅ All dependencies installed"

# ==========================================
# VERIFICATION
# ==========================================
echo "🔍 Checking installation..."

# Check if key packages exist
if [ -d "node_modules/@xmtp/react-native-sdk" ] && \
   [ -d "node_modules/@coinbase/agentkit" ] && \
   [ -d "node_modules/expo-router" ] && \
   [ -d "node_modules/react-native-reanimated" ]; then
  echo "✅ Critical packages verified"
else
  echo "⚠️  Some packages may be missing, run 'yarn install' again if needed"
fi

# ==========================================
# SUCCESS
# ==========================================
echo ""
echo "🎉 INSTALLATION COMPLETE!"
echo ""
echo "📦 Installed packages (latest versions):"
echo "  • Expo Router for navigation"
echo "  • XMTP React Native SDK for messaging" 
echo "  • Coinbase AgentKit for AI agents"
echo "  • React Native Reanimated for animations"
echo "  • NativeWind for styling"
echo "  • Zustand + TanStack Query for state"
echo "  • All development tools"
echo ""
echo "✅ Benefits of using @latest:"
echo "  • Always gets the newest compatible version"
echo "  • Yarn handles dependency resolution"
echo "  • No version conflicts from outdated pins"
echo "  • Latest bug fixes and features"
echo ""
echo "🚀 Ready to start:"
echo "  1. Copy your source files to src/"
echo "  2. Create .env with API keys"
echo "  3. Run 'yarn start'"
echo ""
echo "🏆 Let's build this buildathon winner!"

# Show package count
PACKAGE_COUNT=$(find node_modules -name package.json 2>/dev/null | wc -l || echo "unknown")
echo "📊 Total packages: $PACKAGE_COUNT"
