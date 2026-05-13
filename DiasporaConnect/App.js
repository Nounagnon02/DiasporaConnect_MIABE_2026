import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { useFonts as useNewsreader, Newsreader_400Regular, Newsreader_700Bold } from '@expo-google-fonts/newsreader';
import { useFonts as usePublicSans, PublicSans_400Regular, PublicSans_600SemiBold } from '@expo-google-fonts/public-sans';
import { useFonts as useSpaceGrotesk, SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk';

import './src/i18n';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme/theme';
import { requestNotificationPermission } from './src/services/notificationService';
import AIAssistant from './src/components/ui/AIAssistant';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  const [newsreaderLoaded, newsreaderError] = useNewsreader({ Newsreader_400Regular, Newsreader_700Bold });
  const [publicSansLoaded, publicSansError] = usePublicSans({ PublicSans_400Regular, PublicSans_600SemiBold });
  const [spaceGroteskLoaded, spaceGroteskError] = useSpaceGrotesk({ SpaceGrotesk_500Medium });

  const fontsLoaded = newsreaderLoaded && publicSansLoaded && spaceGroteskLoaded;
  const fontError = newsreaderError || publicSansError || spaceGroteskError;

  useEffect(() => {
    async function prepare() {
      try {
        await requestNotificationPermission();
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady && (fontsLoaded || fontError)) {
      await SplashScreen.hideAsync();
    }
  }, [appReady, fontsLoaded, fontError]);

  if (!appReady || (!fontsLoaded && !fontError)) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root} onLayout={onLayoutRootView}>
        <StatusBar style="dark" backgroundColor={colors.surface} />
        <RootNavigator />
        <AIAssistant />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  loading: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
