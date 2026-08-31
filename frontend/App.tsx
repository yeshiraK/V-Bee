import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { SemesterProvider } from './src/context/SemesterContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <SemesterProvider>
            <StatusBar style="dark" />
            <RootNavigator />
          </SemesterProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
