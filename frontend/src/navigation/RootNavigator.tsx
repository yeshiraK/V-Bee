import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { THEME } from '../theme/colors';
import { RootStackParamList } from './types';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { AppTabs } from './AppTabs';
import { CalculatorScreen } from '../screens/calculator/CalculatorScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandBadgeText}>VIT CHENNAI</Text>
        </View>
        <Text style={styles.splashTitle}>VTOP</Text>
        <ActivityIndicator
          size="small"
          color={THEME.colors.textPrimary}
          style={styles.splashSpinner}
        />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={AppTabs} />
          <Stack.Screen
            name="Calculator"
            component={CalculatorScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadge: {
    backgroundColor: THEME.colors.pastel.yellow.bg,
    borderColor: THEME.colors.pastel.yellow.border,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
    marginBottom: 8,
  },
  brandBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.colors.pastel.yellow.text,
    letterSpacing: 0.8,
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: THEME.colors.textPrimary,
    letterSpacing: -1,
  },
  splashSpinner: {
    marginTop: 24,
  },
});
