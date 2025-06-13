import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
    children: ReactNode;

    // Layout modes
    mode?: 'safe' | 'edge-to-edge' | 'custom';

    // Background
    backgroundColor?: string;
    backgroundComponent?: ReactNode;

    // Safe area control
    edges?: Array<'top' | 'bottom' | 'left' | 'right'>;

    // Styling
    style?: ViewStyle;
    contentStyle?: ViewStyle;

    // Padding control
    horizontalPadding?: number;
    verticalPadding?: number;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    mode = 'safe',
    backgroundColor = 'white',
    backgroundComponent,
    edges = ['top', 'bottom', 'left', 'right'],
    style,
    contentStyle,
    horizontalPadding = 0,
    verticalPadding = 0
}) => {
    const insets = useSafeAreaInsets();

    if (mode === 'edge-to-edge') {
        return (
            <View style={[{ flex: 1, backgroundColor }, style]}>
                {backgroundComponent}
                <View
                    style={[
                        {
                            flex: 1,
                            paddingHorizontal: horizontalPadding,
                            paddingVertical: verticalPadding
                        },
                        contentStyle
                    ]}
                >
                    {children}
                </View>
            </View>
        );
    }

    if (mode === 'custom') {
        return (
            <View style={[{ flex: 1, backgroundColor }, style]}>
                {backgroundComponent}
                <View
                    style={[
                        {
                            flex: 1,
                            paddingTop: edges.includes('top') ? insets.top : 0,
                            paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
                            paddingLeft: edges.includes('left') ? insets.left : 0,
                            paddingRight: edges.includes('right') ? insets.right : 0,
                            paddingHorizontal: horizontalPadding,
                            paddingVertical: verticalPadding
                        },
                        contentStyle
                    ]}
                >
                    {children}
                </View>
            </View>
        );
    }

    // Default safe mode
    return (
        <SafeAreaView
            edges={edges}
            style={[{ flex: 1, backgroundColor }, style]}
        >
            {backgroundComponent}
            <View
                style={[
                    {
                        flex: 1,
                        paddingHorizontal: horizontalPadding,
                        paddingVertical: verticalPadding
                    },
                    contentStyle
                ]}
            >
                {children}
            </View>
        </SafeAreaView>
    );
};