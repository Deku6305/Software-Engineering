import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLang } from '../../../src/shared/i18n';
import { useGuide } from '../../../src/user/guide';
import NarrationPlayer from '../../../src/user/NarrationPlayer';
import { Btn, Card, Screen } from '../../../src/shared/ui';
import { distance } from '../../../src/shared/geo';
import { C } from '../../../src/shared/theme';

export default function PoiDetail() {
  const { id } = useLocalSearchParams();
  const { t } = useLang();
  const router = useRouter();
  const { pois, loc, simulate } = useGuide();
  const poi = pois.find((p) => String(p.id) === String(id));
  const d = poi && loc ? Math.round(distance(loc, { latitude: poi.lat, longitude: poi.lng })) : null;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Btn kind="ghost" small title="←" onPress={() => router.back()} style={{ alignSelf: 'flex-start', marginBottom: 12 }} />
        <Card>
          <NarrationPlayer poiId={Number(id)} maxHeight={320} />
        </Card>
        {d != null ? <Text style={{ color: C.muted, marginBottom: 10 }}>📍 {d} m</Text> : null}
        <Btn title={`🧭 ${t('directions')}`} onPress={() => router.push({ pathname: '/user/map', params: { poiId: String(id) } })} />
        {poi ? <Btn kind="ghost" style={{ marginTop: 10 }} title={`📍 ${t('simulate')}`} onPress={() => { router.back(); simulate(poi); }} /> : null}
      </ScrollView>
    </Screen>
  );
}
