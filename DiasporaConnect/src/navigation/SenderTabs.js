import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import HomeScreen from '../screens/sender/HomeScreen';
import CalculatorScreen from '../screens/sender/CalculatorScreen';
import HistoryScreen from '../screens/sender/HistoryScreen';
import ProfileScreen from '../screens/sender/ProfileScreen';
import GlassBottomNav from '../components/ui/GlassBottomNav';
import { colors, fonts } from '../theme/theme';

const Tab = createBottomTabNavigator();

export default function SenderTabs() {
  return (
    <Tab.Navigator
      // Wrap standard tab bar with our Glass component
      tabBar={(props) => (
        <GlassBottomNav>
          {/* We spread standard props but this relies on exact implementation. 
            Alternatively, styling the tab bar directly with transparent background
            and Absolute position. Let's use standard styling for the inner tab bar. */}
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
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Accueil' }} />
      <Tab.Screen name="Calculator" component={CalculatorScreen} options={{ tabBarLabel: 'Envoyer' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: 'Historique' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}
