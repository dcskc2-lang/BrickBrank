import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GamePlay from '../../screens/GamePlay';
import Menu from '../../screens/Menu';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="GamePlay">
        <Stack.Screen
          name="Menu"
          component={Menu}
        />
        <Stack.Screen
          name="GamePlay"
          component={GamePlay}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
}
