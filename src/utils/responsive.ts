import { Dimensions, Platform, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

interface DeviceInfo {
    width: number;
    height: number;
    isSmallDevice: boolean;
    isTablet: boolean;
    isIPhoneX: boolean;
    isAndroid: boolean;
    isIOS: boolean;
    statusBarHeight: number;
    hasNotch: boolean;
    screenRatio: number;
}

export const getDeviceInfo = (): DeviceInfo => {
    const { width, height } = Dimensions.get('window');
    const screenData = Dimensions.get('screen');

    const isSmallDevice = width < 375 || height < 667;
    const isTablet = width >= 768;
    const screenRatio = height / width;

    // Detect iPhone X and newer (with notch)
    const isIPhoneX = Platform.OS === 'ios' && (
        (width === 375 && height === 812) || // iPhone X, XS, 11 Pro
        (width === 414 && height === 896) || // iPhone XR, XS Max, 11, 11 Pro Max
        (width === 390 && height === 844) || // iPhone 12, 12 Pro, 13, 13 Pro, 14
        (width === 428 && height === 926) || // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
        (width === 393 && height === 852) || // iPhone 14 Pro
        (width === 430 && height === 932)    // iPhone 14 Pro Max
    );

    const hasNotch = isIPhoneX || (Platform.OS === 'android' && screenRatio > 2);

    return {
        width,
        height,
        isSmallDevice,
        isTablet,
        isIPhoneX,
        isAndroid: Platform.OS === 'android',
        isIOS: Platform.OS === 'ios',
        statusBarHeight: getStatusBarHeight(),
        hasNotch,
        screenRatio
    };
};

// Responsive scaling
export const scale = (size: number): number => {
    const { width } = Dimensions.get('window');
    const baseWidth = 375; // iPhone X base width
    return (width / baseWidth) * size;
};

export const verticalScale = (size: number): number => {
    const { height } = Dimensions.get('window');
    const baseHeight = 812; // iPhone X base height
    return (height / baseHeight) * size;
};

export const moderateScale = (size: number, factor = 0.5): number => {
    return size + (scale(size) - size) * factor;
};

// Device-specific spacing
export const getSpacing = () => {
    const device = getDeviceInfo();

    return {
        xs: device.isSmallDevice ? 4 : 6,
        sm: device.isSmallDevice ? 8 : 12,
        md: device.isSmallDevice ? 12 : 16,
        lg: device.isSmallDevice ? 16 : 24,
        xl: device.isSmallDevice ? 24 : 32,
        xxl: device.isSmallDevice ? 32 : 48
    };
};

// Modern design patterns
export const getDesignTokens = () => {
    const device = getDeviceInfo();
    const spacing = getSpacing();

    return {
        spacing,
        borderRadius: {
            sm: 8,
            md: 12,
            lg: 16,
            xl: 20,
            full: 9999
        },
        typography: {
            xs: device.isSmallDevice ? 10 : 12,
            sm: device.isSmallDevice ? 12 : 14,
            base: device.isSmallDevice ? 14 : 16,
            lg: device.isSmallDevice ? 16 : 18,
            xl: device.isSmallDevice ? 18 : 20,
            '2xl': device.isSmallDevice ? 20 : 24,
            '3xl': device.isSmallDevice ? 24 : 30,
            '4xl': device.isSmallDevice ? 30 : 36
        },
        shadows: device.isIOS ? {
            sm: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            md: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            lg: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
            }
        } : {
            sm: { elevation: 2 },
            md: { elevation: 4 },
            lg: { elevation: 8 }
        }
    };
};