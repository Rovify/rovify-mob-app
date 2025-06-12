import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface RovifyLogoProps {
    size?: number;
    variant?: 'default' | 'white' | 'dark';
}

export const RovifyLogo: React.FC<RovifyLogoProps> = ({
    size = 60,
    variant = 'default'
}) => {
    const getColors = () => {
        switch (variant) {
            case 'white':
                return ['#FFFFFF', '#F3F4F6'];
            case 'dark':
                return ['#111827', '#374151'];
            default:
                return ['#FF6B35', '#F7931E'];
        }
    };

    const [primaryColor, secondaryColor] = getColors();

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size} viewBox="0 0 100 100">
                <Defs>
                    <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={primaryColor} />
                        <Stop offset="100%" stopColor={secondaryColor} />
                    </LinearGradient>
                </Defs>

                {/* Outer rounded square */}
                <Path
                    d="M20 10 
             L80 10 
             Q90 10 90 20 
             L90 80 
             Q90 90 80 90 
             L20 90 
             Q10 90 10 80 
             L10 20 
             Q10 10 20 10 Z"
                    fill="url(#logoGradient)"
                />

                {/* Inner triangle/arrow shape */}
                <Path
                    d="M50 25 
             L70 45 
             Q72 47 70 49 
             L52 67 
             Q50 69 48 67 
             L30 49 
             Q28 47 30 45 
             L48 27 
             Q50 25 50 25 Z"
                    fill="white"
                />
            </Svg>
        </View>
    );
};