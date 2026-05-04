import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReceiverHomeScreen from '../screens/receiver/HomeScreen';
import WithdrawStack from './WithdrawStack';
import HistoryScreen from '../screens/shared/HistoryScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import GlassBottomNav from '../components/ui/GlassBottomNav';

const Tab = createBottomTabNavigator();

export default function ReceiverTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassBottomNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={ReceiverHomeScreen} options={{ tabBarLabel: 'Accueil' }} />
      <Tab.Screen name="Withdraw" component={WithdrawStack} options={{ tabBarLabel: 'Retrait' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: 'Historique' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}
