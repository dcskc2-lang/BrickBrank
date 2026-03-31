import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import BannerAds from '../components/BlockBlast/BannerAds';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('AdMob SDK đã khởi tạo thành công:', adapterStatuses);
      })
      .catch(err => console.error('Lỗi khởi tạo AdMob:', err));
  }, []);
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}> 
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <BannerAds />
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
