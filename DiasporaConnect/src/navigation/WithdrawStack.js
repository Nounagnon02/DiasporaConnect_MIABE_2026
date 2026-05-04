import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OperatorScreen from '../screens/receiver/withdraw/OperatorScreen';
import ConfirmScreen from '../screens/receiver/withdraw/ConfirmScreen';
import SuccessScreen from '../screens/receiver/withdraw/SuccessScreen';

const Stack = createStackNavigator();

export default function WithdrawStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WithdrawOperator" component={OperatorScreen} />
      <Stack.Screen name="WithdrawConfirm" component={ConfirmScreen} />
      <Stack.Screen name="WithdrawSuccess" component={SuccessScreen} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
