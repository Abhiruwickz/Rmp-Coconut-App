import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="index" options={{headerShown:false}} />
        <Stack.Screen name="user/open" options={{headerShown:false}} />
        <Stack.Screen name="user/signIn" options={{headerShown:false}} />
        <Stack.Screen name="user/signUp" options={{headerShown:false}} />
        <Stack.Screen name="sections/sectionA" options={{headerShown:false}} />
        <Stack.Screen name="sections/sectionB" options={{headerShown:false}} />
        <Stack.Screen name="sections/sectionC" options={{headerShown:false}} />
        <Stack.Screen name="sections/notification" options={{headerShown:false}} />
        <Stack.Screen name="sections/updateSectionA" options={{headerShown:false}} />
        <Stack.Screen name="sections/updateSectionB" options={{headerShown:false}} />
        <Stack.Screen name="sections/updateSectionC" options={{headerShown:false}} />
            </Stack>
    </ThemeProvider>
  );
}
