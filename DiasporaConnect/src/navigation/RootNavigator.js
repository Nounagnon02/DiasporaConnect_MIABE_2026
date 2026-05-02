import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// We import all screen proxies/placeholders if they exist or the current ones
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
// SenderAuth & ReceiverAuth will be created
import SenderAuthScreen from '../screens/auth/SenderAuthScreen';
import ReceiverAuthScreen from '../screens/auth/ReceiverAuthScreen';

// Tab Navigators
import SenderTabs from './SenderTabs';
import ReceiverTabs from './ReceiverTabs';
import SendFlowStack from './SendFlowStack';

// Other
import ImpactScreen from '../screens/ImpactScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
        
        {/* Onboarding & Auth */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="SenderAuth" component={SenderAuthScreen} />
        <Stack.Screen name="ReceiverAuth" component={ReceiverAuthScreen} />
        
        {/* Apps */}
        <Stack.Screen name="SenderApp" component={SenderTabs} options={{ gestureEnabled: false }} />
        <Stack.Screen name="ReceiverApp" component={ReceiverTabs} options={{ gestureEnabled: false }} />
        
        {/* Sub flows */}
        <Stack.Screen name="SendFlow" component={SendFlowStack} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Impact" component={ImpactScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
