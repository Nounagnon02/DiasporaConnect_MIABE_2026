import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { RecipientHomeScreen, WithdrawScreen, RecipientProfileScreen } from '../screens/recipient/RecipientScreens';
// Note: We need a History screen for Receiver as per spec. We will create it.
import HistoryScreen from '../screens/sender/HistoryScreen'; // Temporary until we split it
import GlassBottomNav from '../components/ui/GlassBottomNav';
import { colors, fonts } from '../theme/theme';

const Tab = createBottomTabNavigator();

export default function ReceiverTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <GlassBottomNav>
        </GlassBottomNav>
      )}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        },
        tabBarActiveTintColor: colors.primary, // Gold
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontFamily: fonts.label,
          fontSize: 10,
        },
      }}
    >
      <Tab.Screen name="ReceiverHome" component={RecipientHomeScreen} options={{ tabBarLabel: 'Accueil' }} />
      <Tab.Screen name="Withdraw" component={WithdrawScreen} options={{ tabBarLabel: 'Retrait' }} />
      <Tab.Screen name="ReceiverHistory" component={HistoryScreen} options={{ tabBarLabel: 'Historique' }} />
      <Tab.Screen name="ReceiverProfile" component={RecipientProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}
