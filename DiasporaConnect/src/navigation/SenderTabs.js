import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import HomeScreen from '../screens/sender/HomeScreen';
import CalculatorScreen from '../screens/sender/CalculatorScreen';
import HistoryScreen from '../screens/shared/HistoryScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import GlassBottomNav from '../components/ui/GlassBottomNav';
import { colors, fonts } from '../theme/theme';

const Tab = createBottomTabNavigator();

export default function SenderTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassBottomNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Accueil' }} />
      <Tab.Screen name="Calculator" component={CalculatorScreen} options={{ tabBarLabel: 'Envoyer' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: 'Historique' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}
