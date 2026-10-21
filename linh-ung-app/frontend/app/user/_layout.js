// ===== TRANG NGƯỜI DÙNG (không cần đăng nhập) =====
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLang } from '../../src/shared/i18n';
import { GuideProvider } from '../../src/user/guide';
import NarrationModal from '../../src/user/NarrationModal';
import { C } from '../../src/shared/theme';

const icon = (name) => ({ color, size }) => <Ionicons name={name} size={size} color={color} />;

export default function UserLayout() {
  const { t } = useLang();
  return (
    <GuideProvider>
      <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: C.primary }}>
        <Tabs.Screen name="index" options={{ title: t('tab_explore'), tabBarIcon: icon('headset') }} />
        <Tabs.Screen name="map" options={{ title: t('tab_map'), tabBarIcon: icon('map') }} />
        <Tabs.Screen name="services" options={{ title: t('tab_services'), tabBarIcon: icon('ticket') }} />
        <Tabs.Screen name="chat" options={{ title: t('tab_chat'), tabBarIcon: icon('chatbubbles') }} />
        <Tabs.Screen name="poi/[id]" options={{ href: null }} />
      </Tabs>
      <NarrationModal />
    </GuideProvider>
  );
}
