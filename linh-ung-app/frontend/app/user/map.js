import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../src/shared/api';
import { useLang } from '../../src/shared/i18n';
import { useGuide } from '../../src/user/guide';
import { Btn, Chip, Screen } from '../../src/shared/ui';
import { C } from '../../src/shared/theme';

const FALLBACK = { latitude: 16.1, longitude: 108.278 };

export default function MapScreen() {
  const { t } = useLang();
  const router = useRouter();
  const { poiId } = useLocalSearchParams();
  const { pois, tours, loc } = useGuide();
  const ref = useRef(null);
  const [route, setRoute] = useState(null);
  const [label, setLabel] = useState('');
  const [sel, setSel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const fetchRoute = async (points, lbl) => {
    setBusy(true); setErr(null);
    try {
      const q = points.map((p) => `${p.latitude},${p.longitude}`).join(';');
      const r = await api(`/api/route?points=${q}`);
      setRoute(r); setLabel(lbl);
      ref.current?.fitToCoordinates(r.coordinates, { edgePadding: { top: 80, right: 50, bottom: 260, left: 50 }, animated: true });
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  // Chỉ đường từ vị trí hiện tại (hoặc cổng chùa nếu chưa có GPS) tới POI
  const directionsTo = (p) => {
    const gate = pois[0];
    const from = loc || (gate && gate.id !== p.id ? { latitude: gate.lat, longitude: gate.lng } : null);
    if (!from) return;
    fetchRoute([from, { latitude: p.lat, longitude: p.lng }], p.title);
  };
  const showTour = (tour) => {
    const pts = tour.stops.map((s) => ({ latitude: s.lat, longitude: s.lng }));
    if (pts.length >= 2) fetchRoute(pts, tour.name);
  };

  useEffect(() => {
    if (poiId && pois.length) {
      const p = pois.find((x) => String(x.id) === String(poiId));
      if (p) { setSel(p); directionsTo(p); }
    }
  }, [poiId, pois.length]);

  const c0 = pois[0] ? { latitude: pois[0].lat, longitude: pois[0].lng } : FALLBACK;
  return (
    <Screen noTop>
      <MapView ref={ref} style={{ flex: 1 }} showsUserLocation showsMyLocationButton
        initialRegion={{ ...c0, latitudeDelta: 0.006, longitudeDelta: 0.006 }}>
        {pois.map((p) => (
          <React.Fragment key={p.id}>
            <Circle center={{ latitude: p.lat, longitude: p.lng }} radius={p.radius} strokeColor="rgba(154,52,18,0.6)" fillColor="rgba(154,52,18,0.15)" />
            <Marker coordinate={{ latitude: p.lat, longitude: p.lng }} title={p.title} onPress={() => setSel(p)} />
          </React.Fragment>
        ))}
        {route ? <Polyline coordinates={route.coordinates} strokeColor={C.primary} strokeWidth={5} /> : null}
      </MapView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 14, elevation: 8 }}>
        {sel ? (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: C.text }}>{sel.title}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Btn small style={{ flex: 1 }} title={`🧭 ${t('directions')}`} onPress={() => directionsTo(sel)} />
              <Btn small kind="ghost" style={{ flex: 1 }} title={`🎧 ${t('listen')}`} onPress={() => router.push(`/user/poi/${sel.id}`)} />
            </View>
          </View>
        ) : null}
        {busy ? <ActivityIndicator color={C.primary} /> : null}
        {err ? <Text style={{ color: C.danger }}>{err}</Text> : null}
        {route && !busy ? (
          <Text style={{ color: C.primary, fontWeight: '700', marginBottom: 6 }}>
            {label} · {Math.round(route.distance)} m · ~{Math.max(1, Math.round(route.duration / 60))} {t('min')}
          </Text>
        ) : null}
        <Text style={{ color: C.muted, fontWeight: '700', marginBottom: 6 }}>{t('tours')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tours.map((tr) => <Chip key={tr.id} label={`${tr.name} · ${tr.duration}′`} onPress={() => showTour(tr)} />)}
        </ScrollView>
      </View>
    </Screen>
  );
}
