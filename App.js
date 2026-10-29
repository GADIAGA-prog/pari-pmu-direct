import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { LicenseProvider } from './src/context/LicenseContext';

export default function App() {
  useEffect(() => {
    // App bootstrap hook is intentionally lightweight.
  }, []);

  return (
    <SafeAreaProvider>
      <LicenseProvider>
        <StatusBar style="dark" />
        <View style={{ flex: 1 }}>
          <AppNavigator />
        </View>
      </LicenseProvider>
    </SafeAreaProvider>
  );
}
