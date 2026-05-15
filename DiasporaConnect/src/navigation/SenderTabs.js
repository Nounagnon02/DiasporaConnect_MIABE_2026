import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import HomeScreen from '../screens/sender/HomeScreen';
import CalculatorScreen from '../screens/sender/CalculatorScreen';
import HistoryScreen from '../screens/shared/HistoryScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import GlassBottomNav from '../components/ui/GlassBottomNav';
import { colors, fonts } from '../theme/theme';
import { useTranslation } from 'react-i18next';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export default function SenderTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 64 + (insets.bottom || 0);
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassBottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: tabBarHeight },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('tabs.home') }} />
      <Tab.Screen name="Calculator" component={CalculatorScreen} options={{ tabBarLabel: t('tabs.send') }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: t('tabs.history') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('tabs.profile') }} />
    </Tab.Navigator>
  );
}
