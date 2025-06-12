#!/bin/bash

# Fix NativeWind Configuration
echo "🔧 Fixing NativeWind Tailwind configuration..."

# Update tailwind.config.js with proper NativeWind preset
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
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

echo "✅ Updated tailwind.config.js with NativeWind preset"

# Also ensure global.css exists and is properly configured
cat > global.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

echo "✅ Updated global.css"

# Make sure metro.config.js is correct too
cat > metro.config.js << 'EOF'
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

let config = getDefaultConfig(__dirname);

// Add NativeWind support
config = withNativeWind(config, { input: './global.css' });

module.exports = config;
EOF

echo "✅ Simplified metro.config.js"

echo ""
echo "🎉 NativeWind configuration fixed!"
echo ""
echo "🚀 Try running again:"
echo "   yarn start"
