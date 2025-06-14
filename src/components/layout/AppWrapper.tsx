import React, { useEffect, useState } from 'react';
import {
    View,
    Dimensions,
    StatusBar,
    Platform,
    Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import useFonts from '@/hooks/useFonts';

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

interface AppWrapperProps {
    children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [fontError, setFontError] = useState<string | null>(null);

    // Make font loading more robust - use fallback if fonts fail
    const { fontsLoaded, fontError: fontLoadError } = useFonts();

    useEffect(() => {
        console.log('🎨 AppWrapper: Checking font loading status...');
        console.log('📝 Fonts loaded:', fontsLoaded);
        console.log('❌ Font error:', fontLoadError);

        if (fontLoadError) {
            console.warn('⚠️ Font loading failed, continuing with system fonts:', fontLoadError);
            setFontError(fontLoadError.message);
        }
    }, [fontsLoaded, fontLoadError]);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions(window);
        });

        return () => subscription?.remove();
    }, []);

    useEffect(() => {
        // Hide splash screen when fonts load OR after timeout (don't wait forever)
        if (fontsLoaded || fontError) {
            console.log('🚀 AppWrapper: Hiding splash screen...');
            setTimeout(() => {
                SplashScreen.hideAsync().catch(console.warn);
            }, 100);
        }
    }, [fontsLoaded, fontError]);

    // Add timeout fallback - don't wait forever for fonts
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!fontsLoaded && !fontError) {
                console.warn('⏰ AppWrapper: Font loading timeout, proceeding with system fonts');
                setFontError('Font loading timeout');
            }
        }, 5000); // 5 second timeout

        return () => clearTimeout(timeout);
    }, [fontsLoaded, fontError]);

    // Don't render anything until fonts load OR we have an error/timeout
    if (!fontsLoaded && !fontError) {
        console.log('⏳ AppWrapper: Waiting for fonts to load...');
        return null; // Keep native splash screen visible
    }

    console.log('✅ AppWrapper: Rendering app content');

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#fff',
                width: dimensions.width,
                height: dimensions.height
            }}
        >
            {/* Configure status bar */}
            <ExpoStatusBar style="light" backgroundColor="#F97316" translucent />

            {/* Safe area wrapper */}
            <SafeAreaView
                style={{ flex: 1 }}
                edges={['top', 'left', 'right']}
            >
                {children}
            </SafeAreaView>

            {/* Show font error if any (for debugging) */}
            {fontError && __DEV__ && (
                <View style={{
                    position: 'absolute',
                    bottom: 50,
                    left: 20,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 10,
                    borderRadius: 5
                }}>
                    <Text style={{ color: 'white', fontSize: 12 }}>
                        Font Warning: {fontError}
                    </Text>
                </View>
            )}
        </View>
    );
};