import React from 'react';
import { Pressable, Text } from 'react-native';
import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../src/shared/auth';
import { C } from '../../../src/shared/theme';

const icon = (name) => ({ color, size }) => <Ionicons name={name} size={size} color={color} />;

export default function AdminPanel() {
  const { ready, session, logout } = useAuth('admin');
  if (!ready) return null;
  if (!session) return <Redirect href="/admin/login" />;
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: C.primary, headerTintColor: C.text,
      headerRight: () => (
        <Pressable onPress={logout} style={{ marginRight: 14 }}>
          <Text style={{ color: C.danger, fontWeight: '700' }}>Đăng xuất</Text>
        </Pressable>),
    }}>
      <Tabs.Screen name="index" options={{ title: 'Tổng quan', tabBarIcon: icon('speedometer') }} />
      <Tabs.Screen name="revenue" options={{ title: 'Doanh thu', tabBarIcon: icon('cash') }} />
      <Tabs.Screen name="pois" options={{ title: 'Điểm di tích', tabBarIcon: icon('location') }} />
      <Tabs.Screen name="orders" options={{ title: 'Đơn hàng', tabBarIcon: icon('receipt') }} />
    </Tabs>
  );
}
