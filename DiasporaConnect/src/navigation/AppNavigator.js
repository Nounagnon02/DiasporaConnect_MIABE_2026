// ============================================================
// DIASPORA CONNECT — Full App Navigator
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { COLORS, TYPOGRAPHY, SPACING } from '../theme/theme';

// Screens
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';

// Sender Screens
import HomeScreen from '../screens/sender/HomeScreen';
import CalculatorScreen from '../screens/sender/CalculatorScreen';
import { SendStep1Screen, SendStep2Screen, SendStep3Screen, SendStep4Screen } from '../screens/sender/SendFlowScreens';
import HistoryScreen from '../screens/sender/HistoryScreen';
import ProfileScreen from '../screens/sender/ProfileScreen';

// Recipient Screens
import { RecipientHomeScreen, WithdrawScreen, RecipientProfileScreen } from '../screens/recipient/RecipientScreens';

// Impact
import ImpactScreen from '../screens/ImpactScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ---- Tab Icon ----
const TabIcon = ({ icon, label, focused }) => (
  <View style={[tabStyles.iconWrapper, focused && tabStyles.iconWrapperActive]}>
    <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>{icon}</Text>
    <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
  </View>
);

const tabStyles = StyleSheet.create({
  iconWrapper: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.sm },
  iconWrapperActive: {},
  icon: { fontSize: 20, marginBottom: 2 },
  iconActive: {},
  label: { fontSize: 10, fontWeight: TYPOGRAPHY.medium, color: COLORS.textMuted },
  labelActive: { color: COLORS.primary, fontWeight: TYPOGRAPHY.bold },
});

// ---- Sender Tab Navigator ----
const SenderTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: COLORS.bgCard,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
        height: 80,
        paddingBottom: 16,
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 12,
      },
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="🏠" label="Accueil" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Calculator"
      component={CalculatorScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="💸" label="Envoyer" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="History"
      component={HistoryScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="📋" label="Historique" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="👤" label="Profil" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

// ---- Sender Stack ----
const SenderStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SenderTabs" component={SenderTabNavigator} />
    <Stack.Screen name="SendStep1" component={SendStep1Screen} />
    <Stack.Screen name="SendStep2" component={SendStep2Screen} />
    <Stack.Screen name="SendStep3" component={SendStep3Screen} />
    <Stack.Screen name="SendStep4" component={SendStep4Screen} options={{ gestureEnabled: false }} />
    <Stack.Screen name="Impact" component={ImpactScreen} />
  </Stack.Navigator>
);

// ---- Recipient Tab Navigator ----
const RecipientTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: COLORS.bgCard,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
        height: 80,
        paddingBottom: 16,
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 12,
      },
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="RecipientHome"
      component={RecipientHomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="🏠" label="Accueil" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="Withdraw"
      component={WithdrawScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="📲" label="Retrait" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name="RecipientProfile"
      component={RecipientProfileScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon icon="👤" label="Profil" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

// ---- Root Navigator ----
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Onboarding"
      >
        {/* Onboarding */}
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ gestureEnabled: false }}
        />

        {/* Auth */}
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />

        {/* Sender App */}
        <Stack.Screen
          name="SenderApp"
          component={SenderStackNavigator}
          options={{ gestureEnabled: false }}
        />

        {/* Recipient App */}
        <Stack.Screen
          name="RecipientApp"
          component={RecipientTabNavigator}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
