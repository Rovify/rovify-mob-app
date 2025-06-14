import { useFonts as useExpoFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

export const useFonts = () => {
  // const [fontsLoaded, fontError] = useExpoFonts({
  //   // Load Inter fonts from Google Fonts as fallback
  //   Inter_400Regular,
  //   Inter_500Medium,
  //   Inter_600SemiBold,
  //   Inter_700Bold,

  //   // Load local fonts (primary choice)
  //   'Inter-Regular': require('../../assets/fonts/Inter-Regular.otf'),
  //   'Inter-Medium': require('../../assets/fonts/Inter-Medium.otf'),
  //   'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.otf'),
  //   'Inter-Bold': require('../../assets/fonts/Inter-Bold.otf'),
  // });

  // const [fontsLoaded, fontError] = useExpoFonts({
  //   // Only local fonts
  //   'Inter-Regular': require('../../assets/fonts/Inter-Regular.otf'),
  //   'Inter-Medium': require('../../assets/fonts/Inter-Medium.otf'),
  //   'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.otf'),
  //   'Inter-Bold': require('../../assets/fonts/Inter-Bold.otf'),
  // });

  const [fontsLoaded, fontError] = useExpoFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  return {
    fontsLoaded: fontsLoaded && !fontError,
    fontError,
  };
};

export default useFonts;
