import React from 'react';
import { useTranslation } from 'react-i18next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReceiverHomeScreen from '../screens/receiver/HomeScreen';
import WithdrawStack from './WithdrawStack';
import HistoryScreen from '../screens/shared/HistoryScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import GlassBottomNav from '../components/ui/GlassBottomNav';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export default function ReceiverTabs() {
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
      <Tab.Screen name="Home" component={ReceiverHomeScreen} options={{ tabBarLabel: t('tabs.home') }} />
      <Tab.Screen name="Withdraw" component={WithdrawStack} options={{ tabBarLabel: t('tabs.withdraw') || 'Retrait' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: t('tabs.history') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('tabs.profile') }} />
    </Tab.Navigator>
  );
}
