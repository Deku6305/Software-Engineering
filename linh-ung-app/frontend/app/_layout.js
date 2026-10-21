import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LangProvider } from '../src/shared/i18n';
import { AuthProvider } from '../src/shared/auth';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LangProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </LangProvider>
    </SafeAreaProvider>
  );
}
