import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SendStep1Screen, SendStep2Screen, SendStep3Screen, SendStep4Screen } from '../screens/sender/SendFlowScreens';

const Stack = createStackNavigator();

export default function SendFlowStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SendStep1" component={SendStep1Screen} />
      <Stack.Screen name="SendStep2" component={SendStep2Screen} />
      <Stack.Screen name="SendStep3" component={SendStep3Screen} />
      <Stack.Screen name="SendStep4" component={SendStep4Screen} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
