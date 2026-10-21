import React, { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useLang, LANGS } from '../../src/shared/i18n';
import { useGuide } from '../../src/user/guide';
import { distance } from '../../src/shared/geo';
import { Card, Chip, H, Screen } from '../../src/shared/ui';
import { C } from '../../src/shared/theme';

export default function Explore() {
  const { t, lang, setLang } = useLang();
  const { pois, loc, permission, error, loading, reload } = useGuide();
  const router = useRouter();

  const list = useMemo(() => pois.map((p) => ({ ...p, dist: loc ? distance(loc, { latitude: p.lat, longitude: p.lng }) : null })), [pois, loc]);
  const nearest = loc ? [...list].sort((a, b) => a.dist - b.dist)[0] : null;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }} refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}>
        <H>🛕 {t('welcome')}</H>
        <Text style={{ color: C.muted, marginBottom: 12 }}>{t('welcome_sub')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {LANGS.map((l) => <Chip key={l.code} label={l.label} active={lang === l.code} onPress={() => setLang(l.code)} />)}
        </ScrollView>

        <Card style={{ backgroundColor: permission === 'granted' ? C.okBg : C.warnBg }}>
          <Text style={{ color: C.text }}>{permission === 'granted' ? '📡 ' + t('gps_on') : '⚠️ ' + t('gps_off')}</Text>
          {nearest ? <Text style={{ marginTop: 6, fontWeight: '700', color: C.text }}>{t('nearest')}: {nearest.title} · {Math.round(nearest.dist)} m</Text> : null}
        </Card>

        {error ? <Card style={{ backgroundColor: C.dangerBg }}><Text style={{ color: C.danger }}>{error}</Text></Card> : null}

        {list.map((p, i) => (
          <Pressable key={p.id} onPress={() => router.push(`/user/poi/${p.id}`)}>
            <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ color: C.primary, fontWeight: '800' }}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: C.text }}>{p.title}</Text>
                <Text style={{ color: C.muted, marginTop: 2 }} numberOfLines={2}>{p.short}</Text>
                {p.dist != null ? <Text style={{ color: C.primary, marginTop: 4, fontWeight: '600' }}>{Math.round(p.dist)} m</Text> : null}
              </View>
              <Text style={{ fontSize: 22 }}>🎧</Text>
            </Card>
          </Pressable>
        ))}

        {/* Lối vào cho nhân viên / quản trị (hoặc mở trực tiếp link /staff, /admin) */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 20, marginBottom: 30 }}>
          <Pressable onPress={() => router.push('/staff')}><Text style={{ color: C.muted }}>{t('staff_login')}</Text></Pressable>
          <Pressable onPress={() => router.push('/admin')}><Text style={{ color: C.muted }}>{t('admin_login')}</Text></Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}
