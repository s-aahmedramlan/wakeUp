import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AlarmSetup } from './src/screens/AlarmSetup';
import { AlarmRing } from './src/screens/AlarmRing';
import { initializeDatabase } from './src/services/database';
import { setupNotificationListener } from './src/services/notifications';
import { useAlarmStore } from './src/store/useAlarmStore';

const Stack = createNativeStackNavigator();

export default function App() {
  const { setCurrentSession } = useAlarmStore();
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    // Initialize database
    initializeDatabase().catch(console.error);

    // Setup notification listener
    const cleanup = setupNotificationListener((notification) => {
      if (notification.request.content.data?.type === 'alarm') {
        // Navigate to alarm ring screen when alarm triggers
        console.log('Alarm triggered! Navigating to AlarmRing...');
        navigationRef.current?.navigate('AlarmRing');
      }
    });

    return cleanup;
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="AlarmSetup"
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="AlarmSetup"
          component={AlarmSetup}
          options={{ title: 'RiseRite' }}
        />
        <Stack.Screen
          name="AlarmRing"
          component={AlarmRing}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
