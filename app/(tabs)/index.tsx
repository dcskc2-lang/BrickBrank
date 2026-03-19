import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import GamePlay from '../../screens/GamePlay';
import Menu from '../../screens/Menu';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Menu"
        component={Menu}
      />

      <Stack.Screen
        name="GamePlay"
        component={GamePlay}
      />
    </Stack.Navigator>
  );
}