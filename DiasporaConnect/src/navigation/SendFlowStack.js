import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SendStep1 from '../screens/sender/sendflow/Step1Screen';
import SendStep2 from '../screens/sender/sendflow/Step2Screen';
import SendStep3 from '../screens/sender/sendflow/Step3Screen';
import SendStep4 from '../screens/sender/sendflow/Step4Screen';

const Stack = createStackNavigator();

export default function SendFlowStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SendStep1" component={SendStep1} />
      <Stack.Screen name="SendStep2" component={SendStep2} />
      <Stack.Screen name="SendStep3" component={SendStep3} />
      <Stack.Screen name="SendStep4" component={SendStep4} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
