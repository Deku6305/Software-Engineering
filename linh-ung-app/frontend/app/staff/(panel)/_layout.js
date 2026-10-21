import React from 'react';
import { Pressable, Text } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/shared/auth';
import { C } from '../../../src/shared/theme';

const icon = (name) => ({ color, size }) => <Ionicons name={name} size={size} color={color} />;

export default function StaffPanel() {
  const { ready, session, logout } = useAuth('staff');
  if (!ready) return null;
  if (!session) return <Redirect href="/staff/login" />;
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: C.primary,
      headerRight: () => (
        <Pressable onPress={logout} style={{ marginRight: 14 }}>
          <Text style={{ color: C.danger, fontWeight: '700' }}>Đăng xuất</Text>
        </Pressable>),
    }}>
      <Tabs.Screen name="index" options={{ title: 'Quét QR', tabBarIcon: icon('qr-code') }} />
      <Tabs.Screen name="orders" options={{ title: 'Đơn / Thanh toán', tabBarIcon: icon('receipt') }} />
    </Tabs>
  );
}
