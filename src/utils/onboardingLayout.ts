import { Dimensions } from 'react-native';

export const getOnboardingLayout = (deviceInfo: any, tokens: any, insets: any) => {
    const { width, height } = Dimensions.get('window');
    const isVerySmallScreen = height < 700; // iPhone SE, older Androids
    const isVeryTallScreen = height / width > 2.2; // Modern flagships

    return {
        // Adjust for very small screens
        titleFontSize: isVerySmallScreen ? 20 : deviceInfo.isSmallDevice ? 24 : 28,
        subtitleFontSize: isVerySmallScreen ? 13 : deviceInfo.isSmallDevice ? 14 : 16,
        iconSize: isVerySmallScreen ? 120 : deviceInfo.isSmallDevice ? 140 : 160,

        // Adjust spacing for very tall screens
        verticalSpacing: isVeryTallScreen ? tokens.spacing.xl : tokens.spacing.lg,

        // Content distribution
        sections: {
            header: isVerySmallScreen ? 50 : 60,
            icon: isVerySmallScreen ? 180 : 200,
            content: height * (isVerySmallScreen ? 0.35 : 0.4),
            bottom: isVerySmallScreen ? 100 : 120
        }
    };
};